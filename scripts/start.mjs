import http from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
	existsSync,
	readdirSync,
	readFileSync,
} from 'node:fs';
import sirv from 'sirv';
import { loadGonePaths } from './load-gone-paths.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const postsDir = path.join(root, 'src', 'content', 'posts');
const port = Number(process.env.PORT || '3000');

const serve = sirv(dist, {
	etag: true,
	single: true,
	setHeaders(res, filePath) {
		const normalized = filePath.split(path.sep).join('/');
		if (normalized.endsWith('.html')) {
			res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
			return;
		}
		if (normalized.includes('/_astro/')) {
			res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
			return;
		}
		if (/\.(?:css|js|mjs|map|woff2?)$/i.test(normalized)) {
			res.setHeader('Cache-Control', 'public, max-age=2592000');
			return;
		}
		if (/\.(?:svg|png|jpg|jpeg|webp|avif|gif|ico)$/i.test(normalized)) {
			res.setHeader('Cache-Control', 'public, max-age=2592000, stale-while-revalidate=86400');
			return;
		}
		res.setHeader('Cache-Control', 'public, max-age=3600');
	},
});

/** @param {string} url `req.url` */
function redirectTrailingSlashFile(url) {
	const q = url.indexOf('?');
	const pathname = q >= 0 ? url.slice(0, q) : url;
	const search = q >= 0 ? url.slice(q) : '';
	if (pathname.length <= 1 || !pathname.endsWith('/')) return null;
	const noSlash = pathname.replace(/\/+$/, '');
	// sitemap / robots must not use trailing slash (GSC "Couldn't fetch" if URL is wrong)
	if (!/\.(?:xml|txt)$/i.test(noSlash)) return null;
	return noSlash + search;
}

const gonePaths = loadGonePaths();

const redirects = new Map([
	['/โน๊ตบุ๊ค/', '/รับซื้อโน๊ตบุ๊ค/'],
	['/คอม/', '/รับซื้อคอม/'],
	['/ไอโฟน/', '/รับซื้อไอโฟน/'],
	['/ไอแพด/', '/รับซื้อไอแพด/'],
	['/แมคบุ๊ค/', '/รับซื้อแมคบุ๊ค/'],
	['/กล้อง/', '/รับซื้อกล้อง/'],
	['/ลำโพง/', '/รับซื้อลำโพง/'],
]);

const survivorDecisionPath = path.join(
	root,
	'src',
	'config',
	'legacy-survivor-decisions.json',
);

if (existsSync(survivorDecisionPath)) {
	const survivorDecisions =
		JSON.parse(
			readFileSync(
				survivorDecisionPath,
				'utf8',
			),
		);

	for (
		const [rawSource, rawTarget]
		of Object.entries(
			survivorDecisions.newRedirects ?? {},
		)
	) {
		let source = rawSource;

		if (!source.startsWith('/')) {
			source = `/${source}`;
		}

		if (
			source.length > 1 &&
			!source.endsWith('/')
		) {
			source = `${source}/`;
		}

		let target = String(rawTarget);

		if (!target.startsWith('/')) {
			target = `/${target}`;
		}

		if (
			target.length > 1 &&
			!target.endsWith('/')
		) {
			target = `${target}/`;
		}

		const existing =
			redirects.get(source);

		if (
			existing &&
			existing !== target
		) {
			throw new Error(
				`Redirect conflict for ${source}: ${existing} vs ${target}`,
			);
		}

		redirects.set(
			source,
			target,
		);
	}
}

const contentAliasRedirects = new Map(
	readdirSync(postsDir)
		.filter((file) => file.endsWith('.md'))
		.flatMap((file) => {
			const content = readFileSync(path.join(postsDir, file), 'utf8');
			const slugMatch = content.match(/^slug:\s*"?([^"\n]+)"?\s*$/m);
			const canonicalMatch = content.match(/^canonical:\s*"?([^"\n]+)"?\s*$/m);
			const isNoindex = /^noindex:\s*true\s*$/m.test(content);
			if (!slugMatch || !canonicalMatch || !isNoindex) return [];

			const slug = slugMatch[1].trim();
			let canonical = canonicalMatch[1].trim();
			if (!canonical.startsWith('/')) canonical = `/${canonical}`;
			if (!canonical.endsWith('/')) canonical = `${canonical}/`;

			const source = `/${slug}/`;
			return canonical !== source ? [[source, canonical]] : [];
		}),
);

http
	.createServer((req, res) => {
		res.setHeader('X-Content-Type-Options', 'nosniff');
		res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

		const url = req.url ?? '/';
		const parsed = new URL(url, 'http://127.0.0.1');
		const decodedPathname = decodeURI(parsed.pathname);
		const normalizedUrl = decodedPathname + parsed.search;

		if (gonePaths.has(decodedPathname)) {
			res.writeHead(410, { 'Content-Type': 'text/html; charset=utf-8' });
			res.end('<h1>410 Gone</h1><p>This content has been permanently removed.</p>');
			return;
		}

		const fileRedirect = redirectTrailingSlashFile(normalizedUrl);
		if (fileRedirect) {
			res.writeHead(301, { Location: fileRedirect });
			res.end();
			return;
		}

		const target = redirects.get(decodedPathname);
		if (target) {
			res.writeHead(301, { Location: encodeURI(target + parsed.search) });
			res.end();
			return;
		}

		const contentAliasTarget = contentAliasRedirects.get(decodedPathname);
		if (contentAliasTarget) {
			res.writeHead(301, { Location: encodeURI(contentAliasTarget + parsed.search) });
			res.end();
			return;
		}

		serve(req, res);
	})
	.listen(port, '0.0.0.0', () => {
		console.log(`[start] serving ${dist} on 0.0.0.0:${port}`);
	});
