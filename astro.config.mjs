// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import nonArticleSlugList from './src/data/non-article-slugs.json' with { type: 'json' };

const nonArticleSingleSlugs = new Set(nonArticleSlugList);

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const siteUrl =
	env.SITE_URL ??
	(env.COOLIFY_FQDN ? `https://${env.COOLIFY_FQDN}` : null) ??
	env.COOLIFY_URL ??
	'https://example.com';

/** Slugs ที่ตรงกับ `noindex: true` ใน frontmatter — ไม่ใส่ sitemap */
const SITEMAP_EXCLUDED_POST_SLUGS = new Set(['รับซ่อมคอมพิวเตอร์-ยโสธ']);

export default defineConfig({
	site: siteUrl,
	trailingSlash: 'always',
	build: {
		inlineStylesheets: 'always',
	},
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [
		sitemap({
			changefreq: 'weekly',
			priority: 0.7,
			filter(url) {
				try {
					const pathname = new URL(url).pathname.replace(/\/$/, '');
					const last = decodeURIComponent(pathname.split('/').filter(Boolean).pop() ?? '');
					if (SITEMAP_EXCLUDED_POST_SLUGS.has(last)) return false;
				} catch {
					/* ignore */
				}
				return true;
			},
			serialize(item) {
				const url = item.url;
				if (
					url.endsWith('/รับซื้อโน๊ตบุ๊ค/') ||
					url.endsWith('/รับซื้อคอม/') ||
					url.endsWith('/รับซื้อไอโฟน/') ||
					url.endsWith('/รับซื้อกล้อง/') ||
					url.endsWith('/รับซื้อไอแพด/') ||
					url.endsWith('/รับซื้อแมคบุ๊ค/') ||
					url.endsWith('/รับซื้อลำโพง/') ||
					url.endsWith('/รับซื้อ/') ||
					url.endsWith('/บริการ/') ||
					url.endsWith('/เกี่ยวกับเรา/') ||
					url.endsWith('/contact/')
				) {
					item.changefreq = 'weekly';
					item.priority = 0.9;
				}
				if (url === siteUrl + '/' || url === siteUrl) {
					item.changefreq = 'daily';
					item.priority = 1.0;
				}
				if (url.includes('/blog/') && url !== siteUrl + '/blog/') {
					item.changefreq = 'monthly';
					item.priority = 0.6;
				}
				try {
					const u = new URL(url);
					let path = u.pathname;
					if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
					const segments = path.split('/').filter(Boolean);
					if (segments.length === 1) {
						const seg = decodeURIComponent(segments[0]);
						if (!nonArticleSingleSlugs.has(seg)) {
							item.changefreq = 'weekly';
							item.priority = 0.75;
						}
					}
				} catch {
					/* ignore */
				}
				return item;
			},
		}),
	],
});
