import http from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sirv from 'sirv';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
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

const redirects = new Map([
	['/โน๊ตบุ๊ค/', '/รับซื้อโน๊ตบุ๊ค/'],
	['/คอม/', '/รับซื้อคอม/'],
	['/ไอโฟน/', '/รับซื้อไอโฟน/'],
	['/ไอแพด/', '/รับซื้อไอแพด/'],
	['/แมคบุ๊ค/', '/รับซื้อแมคบุ๊ค/'],
	['/กล้อง/', '/รับซื้อกล้อง/'],
	['/ลำโพง/', '/รับซื้อลำโพง/'],
]);

http
	.createServer((req, res) => {
		res.setHeader('X-Content-Type-Options', 'nosniff');
		res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

		const url = req.url ?? '/';

		const fileRedirect = redirectTrailingSlashFile(url);
		if (fileRedirect) {
			res.writeHead(301, { Location: fileRedirect });
			res.end();
			return;
		}

		const target = redirects.get(url);
		if (target) {
			res.writeHead(301, { Location: target });
			res.end();
			return;
		}

		serve(req, res);
	})
	.listen(port, '0.0.0.0', () => {
		console.log(`[start] serving ${dist} on 0.0.0.0:${port}`);
	});
