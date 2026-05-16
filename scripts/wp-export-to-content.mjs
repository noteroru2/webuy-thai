/**
 * Export published posts from WordPress into src/content/posts
 * and localize remote media into public/media/imported.
 *
 * Usage:
 *   PUBLIC_WORDPRESS_URL=https://wp.example.com npm run export:wp
 */
import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import TurndownService from 'turndown';
import { config } from 'dotenv';
import {
	createMigrationContext,
	decodeHtmlEntities,
	frontmatterLine,
	normalizeWpSlug,
	saveTextFile,
	stripHtml,
} from './content-migration-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
config({ path: join(rootDir, '.env') });

const wordPressOrigin = process.env.PUBLIC_WORDPRESS_URL?.replace(/\/+$/, '');
if (!wordPressOrigin) {
	console.error('Missing PUBLIC_WORDPRESS_URL in .env');
	process.exit(1);
}

const postsDir = join(rootDir, 'src', 'content', 'posts');
const timeoutMs = Math.max(
	8000,
	Number(process.env.EXPORT_WP_TIMEOUT_MS ?? process.env.PUBLIC_WORDPRESS_TIMEOUT_MS ?? 60000),
);
const maxPages = Math.max(0, Number(process.env.EXPORT_WP_MAX_PAGES ?? 0) || 0);
const mediaPublicBase = process.env.EXPORT_WP_MEDIA_PUBLIC_BASE ?? '/media/imported';
const downloadRemoteAssets = process.env.EXPORT_WP_DOWNLOAD_MEDIA !== 'false';
const legacyHosts = (process.env.EXPORT_WP_REWRITE_HOSTS ?? '')
	.split(',')
	.map((item) => item.trim())
	.filter(Boolean);

const siteOriginRaw =
	process.env.SITE_URL ||
	(process.env.COOLIFY_FQDN ? `https://${process.env.COOLIFY_FQDN}` : '') ||
	process.env.COOLIFY_URL ||
	'https://example.com';

const migration = createMigrationContext({
	currentSiteOrigin: siteOriginRaw,
	downloadRemoteAssets,
	legacyHosts: [wordPressOrigin, ...legacyHosts],
	logger: console,
	mediaPublicBase,
	resetMediaDir: true,
	rootDir,
	timeoutMs,
});

function buildTurndown() {
	const td = new TurndownService({
		codeBlockStyle: 'fenced',
		headingStyle: 'atx',
	});
	td.keep(['figure', 'iframe', 'script']);
	return td;
}

async function fetchAllPosts() {
	const allPosts = [];
	let page = 1;
	let totalPages = 1;

	while (page <= totalPages) {
		if (maxPages > 0 && page > maxPages) break;

		const url = new URL(`${wordPressOrigin}/wp-json/wp/v2/posts`);
		url.searchParams.set('_embed', '1');
		url.searchParams.set('page', String(page));
		url.searchParams.set('per_page', '100');
		url.searchParams.set('status', 'publish');

		const res = await fetch(url, {
			headers: { Accept: 'application/json' },
			signal: AbortSignal.timeout(timeoutMs),
		});
		if (!res.ok) {
			throw new Error(`posts page ${page}: ${res.status} ${res.statusText}`);
		}

		if (page === 1) {
			const totalPagesHeader = res.headers.get('X-WP-TotalPages');
			if (totalPagesHeader) {
				totalPages = Number.parseInt(totalPagesHeader, 10) || 1;
			}
		}

		const posts = await res.json();
		allPosts.push(
			...posts.map((post) => ({
				...post,
				slug: normalizeWpSlug(post.slug),
			})),
		);
		page += 1;
	}

	return allPosts;
}

function featuredMediaUrl(post) {
	return post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
}

function featuredMediaAlt(post) {
	const media = post._embedded?.['wp:featuredmedia']?.[0];
	return decodeHtmlEntities(media?.alt_text?.trim() || stripHtml(post.title?.rendered));
}

async function exportPost(post, td) {
	const plainTitle = stripHtml(post.title?.rendered);
	const description = stripHtml(post.excerpt?.rendered ?? '') || plainTitle;
	const titleHtml = decodeHtmlEntities(String(post.title?.rendered ?? plainTitle).trim());
	const publishedDate = String(post.date ?? '').slice(0, 10);
	const updatedDate = post.modified ? String(post.modified).slice(0, 10) : undefined;
	const heroImageSource = featuredMediaUrl(post);
	const heroImage = heroImageSource
		? await migration.downloadAsset(heroImageSource, `post-${post.id}-hero`)
		: undefined;
	const heroImageAlt = heroImageSource ? featuredMediaAlt(post) : undefined;

	const markdownBody = td.turndown(post.content?.rendered ?? '').trim();
	const cleanedBody = await migration.rewriteTextContent(markdownBody);

	const frontmatter = [
		'---',
		`title: ${frontmatterLine(plainTitle)}`,
		`titleHtml: ${frontmatterLine(titleHtml || plainTitle)}`,
		`description: ${frontmatterLine(description)}`,
		`pubDate: ${frontmatterLine(publishedDate)}`,
		...(updatedDate && updatedDate !== publishedDate ? [`updatedDate: ${frontmatterLine(updatedDate)}`] : []),
		`slug: ${frontmatterLine(post.slug)}`,
		`wpPostId: ${Number(post.id)}`,
		...(heroImage ? [`heroImage: ${frontmatterLine(heroImage)}`] : []),
		...(heroImageAlt ? [`heroImageAlt: ${frontmatterLine(heroImageAlt)}`] : []),
		'---',
		'',
		cleanedBody,
		'',
	];

	saveTextFile(join(postsDir, `${post.id}.md`), frontmatter.join('\n'));
}

async function main() {
	console.log(`Exporting posts from ${wordPressOrigin}`);
	mkdirSync(postsDir, { recursive: true });

	for (const name of readdirSync(postsDir).filter((file) => file.endsWith('.md'))) {
		rmSync(join(postsDir, name), { force: true });
	}

	const posts = await fetchAllPosts();
	const td = buildTurndown();

	for (const post of posts) {
		await exportPost(post, td);
	}

	console.log(`Exported ${posts.length} posts`);
	console.log(
		JSON.stringify(
			{
				posts: posts.length,
				...migration.stats,
			},
			null,
			2,
		),
	);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
