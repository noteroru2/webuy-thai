/**
 * Rewrite existing Markdown posts so that:
 * - remote images are downloaded into public/media/imported
 * - internal links from legacy hosts point to the current site structure
 * - HTML entities are decoded in key frontmatter fields and body content
 *
 * Usage:
 *   npm run localize:content
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import {
	createMigrationContext,
	decodeHtmlEntities,
	parseMarkdownDocument,
	readJsonFrontmatterValue,
	replaceJsonFrontmatterValue,
	saveTextFile,
	serializeMarkdownDocument,
} from './content-migration-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
config({ path: join(rootDir, '.env') });

const postsDir = join(rootDir, 'src', 'content', 'posts');
const timeoutMs = Math.max(
	8000,
	Number(process.env.EXPORT_WP_TIMEOUT_MS ?? process.env.PUBLIC_WORDPRESS_TIMEOUT_MS ?? 60000),
);
const mediaPublicBase = process.env.EXPORT_WP_MEDIA_PUBLIC_BASE ?? '/media/imported';
const downloadRemoteAssets = process.env.EXPORT_WP_DOWNLOAD_MEDIA !== 'false';
const wordPressOrigin = process.env.PUBLIC_WORDPRESS_URL?.replace(/\/+$/, '');
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
	legacyHosts: [wordPressOrigin, ...legacyHosts].filter(Boolean),
	logger: console,
	mediaPublicBase,
	rootDir,
	timeoutMs,
});

async function localizeFile(filename) {
	const absolutePath = join(postsDir, filename);
	const raw = readFileSync(absolutePath, 'utf8');
	const document = parseMarkdownDocument(raw);
	if (!document) {
		console.warn(`skip ${filename}: frontmatter not found`);
		return false;
	}

	let frontmatter = document.frontmatter;
	let changed = false;

	for (const key of ['title', 'titleHtml', 'description', 'heroImageAlt']) {
		const currentValue = readJsonFrontmatterValue(frontmatter, key);
		if (typeof currentValue !== 'string') continue;
		const cleanedValue = decodeHtmlEntities(currentValue);
		if (cleanedValue !== currentValue) {
			frontmatter = replaceJsonFrontmatterValue(frontmatter, key, cleanedValue);
			changed = true;
		}
	}

	const heroImage = readJsonFrontmatterValue(frontmatter, 'heroImage');
	if (typeof heroImage === 'string' && /^https?:\/\//i.test(heroImage)) {
		const localizedHero = await migration.downloadAsset(heroImage, `hero-${filename}`);
		if (localizedHero !== heroImage) {
			frontmatter = replaceJsonFrontmatterValue(frontmatter, 'heroImage', localizedHero);
			changed = true;
		}
	}

	const cleanedBody = await migration.rewriteTextContent(document.body);
	if (cleanedBody !== document.body) {
		changed = true;
	}

	if (!changed) return false;

	saveTextFile(absolutePath, serializeMarkdownDocument(frontmatter, cleanedBody));
	return true;
}

async function main() {
	const files = readdirSync(postsDir).filter((file) => file.endsWith('.md'));
	let changedFiles = 0;

	for (const file of files) {
		if (await localizeFile(file)) {
			changedFiles += 1;
		}
	}

	console.log(
		JSON.stringify(
			{
				changedFiles,
				filesScanned: files.length,
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
