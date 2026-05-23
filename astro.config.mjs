// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import nonArticleSlugList from './src/data/non-article-slugs.json' with { type: 'json' };
import { isPlaceholderSiteUrl, resolveSiteUrl } from './scripts/resolve-site-url.mjs';

import cloudflare from '@astrojs/cloudflare';

const nonArticleSingleSlugs = new Set(nonArticleSlugList);
const postsDir = join(process.cwd(), 'src', 'content', 'posts');

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const siteUrl = resolveSiteUrl(env);

if (isPlaceholderSiteUrl(siteUrl)) {
    throw new Error('Refusing to build sitemap with placeholder site URL https://example.com');
}

const NOINDEX_POST_SLUGS = new Set(
    readdirSync(postsDir)
        .filter((file) => file.endsWith('.md'))
        .map((file) => readFileSync(join(postsDir, file), 'utf8'))
        .flatMap((content) => {
            const slugMatch = content.match(/^slug:\s*"([^"\n]+)"\s*$/m);
            const noindexMatch = /^noindex:\s*true\s*$/m.test(content);
            return slugMatch && noindexMatch ? [slugMatch[1]] : [];
        }),
);

/** Slugs ที่ตรงกับ `noindex: true` ใน frontmatter — ไม่ใส่ sitemap */
const SITEMAP_EXCLUDED_POST_SLUGS = new Set(['รับซ่อมคอมพิวเตอร์-ยโสธ']);

const LEGACY_REDIRECT_SLUGS = new Set(
    nonArticleSlugList.filter((slug) => slug === 'rab-sue' || slug.startsWith('rab-sue-')),
);

const CANONICAL_ALIAS_POST_SLUGS = new Set(
    readdirSync(postsDir)
        .filter((file) => file.endsWith('.md'))
        .map((file) => readFileSync(join(postsDir, file), 'utf8'))
        .flatMap((content) => {
            const slugMatch = content.match(/^slug:\s*"?([^"\n]+)"?\s*$/m);
            const canonicalMatch = content.match(/^canonical:\s*"?([^"\n]+)"?\s*$/m);
            if (!slugMatch || !canonicalMatch) return [];
            const slug = slugMatch[1].trim();
            let canonical = canonicalMatch[1].trim();
            if (!canonical.startsWith('/')) canonical = `/${canonical}`;
            if (!canonical.endsWith('/')) canonical = `${canonical}/`;
            const selfPath = `/${slug}/`;
            return canonical !== selfPath ? [slug] : [];
        }),
);

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
                  if (NOINDEX_POST_SLUGS.has(last)) return false;
                  if (LEGACY_REDIRECT_SLUGS.has(last)) return false;
                  if (CANONICAL_ALIAS_POST_SLUGS.has(last)) return false;
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

  adapter: cloudflare()
});