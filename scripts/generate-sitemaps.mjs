import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
loadEnv({ path: join(root, '.env') });

const distDir = join(root, 'dist');

function getSiteOrigin() {
	const url =
		process.env.SITE_URL ??
		(process.env.COOLIFY_FQDN ? `https://${process.env.COOLIFY_FQDN}` : null) ??
		process.env.COOLIFY_URL ??
		'https://xn--c3c3a0aa6cvaf8b9dze.com';
	return url.replace(/\/+$/, '');
}

function walkIndexHtml(dir, fileList = []) {
	if (!statSync(dir).isDirectory()) return fileList;
	const entries = readdirSync(dir, { withFileTypes: true });
	for (const entry of entries) {
		if (entry.name.startsWith('.') || entry.name === '_astro') continue;
		const full = join(dir, entry.name);
		if (entry.isDirectory()) walkIndexHtml(full, fileList);
		else if (entry.name === 'index.html' || entry.name.endsWith('.html')) fileList.push(full);
	}
	return fileList;
}

function normalizePathname(p) {
	if (!p) return '/';
	if (p.startsWith('http')) {
		try { p = new URL(p).pathname; } catch { return '/'; }
	}
	if (!p.startsWith('/')) p = `/${p}`;
	p = p.replace(/\/+/g, '/');
	const lastSeg = p.split('/').pop() || '';
	const isFile = /\.[a-z0-9]+$/i.test(lastSeg);
	if (isFile && p.endsWith('/')) p = p.slice(0, -1);
	if (!isFile && p.length > 1 && !p.endsWith('/')) p = `${p}/`;
	return decodeURIComponent(p);
}

function formatDate(date) {
	return date.toISOString().split('T')[0];
}

function determineCategory(path) {
	if (path === '/') return 'pages';
	if (path.startsWith('/blog/')) return 'blog';
	
	const localKeywords = ['อุบล', 'กรุงเทพ', 'ขอนแก่น', 'โคราช', 'อุดร'];
	const isLocal = localKeywords.some(kw => path.includes(decodeURIComponent(kw)));
	
	const serviceKeywords = ['รับซื้อ', 'บริการ', 'ซ่อม'];
	const isService = serviceKeywords.some(kw => path.includes(decodeURIComponent(kw)));

	if (isLocal) return 'local';
	if (isService) return 'services';
	
	return 'pages';
}

function getPriority(path) {
	if (path === '/') return 1.0;
	if (path.startsWith('/รับซื้อ') && path.split('/').length === 3) return 0.9;
	if (path.startsWith('/บริการ/')) return 0.8;
	if (path.startsWith('/blog/')) return 0.6;
	return 0.7;
}

function getChangeFreq(path) {
	if (path === '/') return 'daily';
	if (path.startsWith('/blog/')) return 'monthly';
	return 'weekly';
}

function main() {
	const siteOrigin = getSiteOrigin();
	console.log(`Generating sitemaps for origin: ${siteOrigin}`);

	const htmlFiles = walkIndexHtml(distDir);
	const categorizedUrls = {
		pages: [],
		services: [],
		blog: [],
		local: []
	};

	const today = formatDate(new Date());

	for (const file of htmlFiles) {
		const html = readFileSync(file, 'utf8');
		const isNoindex = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html);
		if (isNoindex) continue;

		const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
		if (!canonicalMatch) continue;

		let canonicalUrl = canonicalMatch[1];
		let canonicalPath = normalizePathname(canonicalUrl);

		let relPath = relative(distDir, file).replace(/\\/g, '/');
		if (relPath.endsWith('index.html')) {
			relPath = relPath.replace('index.html', '');
		} else if (relPath.endsWith('.html')) {
			relPath = relPath.replace('.html', '');
		}
		const expectedPath = normalizePathname(`/${relPath}`);

		// Only index if canonical matches the expected path
		if (canonicalPath !== expectedPath) continue;

		const category = determineCategory(expectedPath);
		const fullUrl = `${siteOrigin}${expectedPath === '/' ? '' : expectedPath}`;

		categorizedUrls[category].push({
			url: fullUrl,
			lastmod: today,
			changefreq: getChangeFreq(expectedPath),
			priority: getPriority(expectedPath)
		});
	}

	const sitemapFiles = [];

	for (const [category, urls] of Object.entries(categorizedUrls)) {
		if (urls.length === 0) continue;
		const filename = `sitemap-${category}.xml`;
		sitemapFiles.push(filename);

		const xmlItems = urls.map(u => `  <url>
    <loc>${u.url}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(1)}</priority>
  </url>`).join('\n');

		const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`;

		writeFileSync(join(distDir, filename), xml, 'utf8');
		console.log(`Generated ${filename} with ${urls.length} URLs`);
	}

	const indexItems = sitemapFiles.map(file => `  <sitemap>
    <loc>${siteOrigin}/${file}</loc>
  </sitemap>`).join('\n');

	const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexItems}
</sitemapindex>`;

	writeFileSync(join(distDir, 'sitemap-index.xml'), indexXml, 'utf8');
	console.log(`Generated sitemap-index.xml linking to ${sitemapFiles.length} sitemaps`);
}

main();
