// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const siteUrl =
	env.SITE_URL ??
	(env.COOLIFY_FQDN ? `https://${env.COOLIFY_FQDN}` : null) ??
	env.COOLIFY_URL ??
	'https://example.com';

export default defineConfig({
	site: siteUrl,
	trailingSlash: 'always',
	build: {
		inlineStylesheets: 'always',
	},
	integrations: [
		sitemap({
			changefreq: 'weekly',
			priority: 0.7,
			serialize(item) {
				const url = item.url;
				if (
					url.endsWith('/โน๊ตบุ๊ค/') ||
					url.endsWith('/คอม/') ||
					url.endsWith('/ไอโฟน/') ||
					url.endsWith('/กล้อง/') ||
					url.endsWith('/ไอแพด/') ||
					url.endsWith('/แมคบุ๊ค/') ||
					url.endsWith('/ลำโพง/') ||
					url.endsWith('/รับซื้อ/') ||
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
				return item;
			},
		}),
	],
});
