// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import { join } from 'node:path';
import { isPlaceholderSiteUrl, resolveSiteUrl } from './scripts/resolve-site-url.mjs';

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const siteUrl = resolveSiteUrl(env);

if (isPlaceholderSiteUrl(siteUrl)) {
	throw new Error('Refusing to build sitemap with placeholder site URL https://example.com');
}

export default defineConfig({
	site: siteUrl,
	trailingSlash: 'always',
	build: {
		inlineStylesheets: 'always',
	},
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [],
});
