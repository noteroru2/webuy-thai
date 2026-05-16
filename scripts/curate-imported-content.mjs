/**
 * Curate imported Markdown content in place:
 * - remove remaining remote image references that could not be localized
 * - add noindex to clearly off-topic posts
 *
 * Usage:
 *   npm run curate:content
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	collapseMarkdownSpacing,
	parseMarkdownDocument,
	readBooleanFrontmatterValue,
	readJsonFrontmatterValue,
	saveTextFile,
	serializeMarkdownDocument,
	upsertBooleanFrontmatterValue,
} from './content-migration-utils.mjs';
import { shouldNoindexAsOffTopic } from './content-quality-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const postsDir = join(rootDir, 'src', 'content', 'posts');

const REMOTE_MARKDOWN_IMAGE_RE = /!\[[^\]]*]\((https?:\/\/[^)]+)\)/gi;
const REMOTE_HTML_IMAGE_RE = /<img\b[^>]*\bsrc=(['"])(https?:\/\/[^'"]+)\1[^>]*>/gi;

function removeRemoteImages(body) {
	const matches = [];
	let nextBody = body.replace(REMOTE_MARKDOWN_IMAGE_RE, (full, url) => {
		matches.push(url);
		return '';
	});

	nextBody = nextBody.replace(REMOTE_HTML_IMAGE_RE, (full, _quote, url) => {
		matches.push(url);
		return '';
	});

	nextBody = collapseMarkdownSpacing(nextBody);
	return {
		body: nextBody,
		removedUrls: matches,
	};
}

function loadPost(filename) {
	const absolutePath = join(postsDir, filename);
	const raw = readFileSync(absolutePath, 'utf8');
	const document = parseMarkdownDocument(raw);
	if (!document) return null;

	return {
		absolutePath,
		document,
	};
}

async function main() {
	const files = readdirSync(postsDir).filter((file) => file.endsWith('.md'));
	const noindexedFiles = [];
	const cleanedImageFiles = [];
	let removedImages = 0;

	for (const file of files) {
		const loaded = loadPost(file);
		if (!loaded) continue;

		let { frontmatter, body } = loaded.document;
		let changed = false;

		const title = readJsonFrontmatterValue(frontmatter, 'title');
		const slug = readJsonFrontmatterValue(frontmatter, 'slug');
		const currentNoindex = readBooleanFrontmatterValue(frontmatter, 'noindex');

		const { body: cleanedBody, removedUrls } = removeRemoteImages(body);
		if (removedUrls.length > 0) {
			body = cleanedBody;
			removedImages += removedUrls.length;
			cleanedImageFiles.push({
				file,
				removed: removedUrls.length,
			});
			changed = true;
		}

		if (shouldNoindexAsOffTopic(title, slug) && currentNoindex !== true) {
			frontmatter = upsertBooleanFrontmatterValue(frontmatter, 'noindex', true);
			noindexedFiles.push(file);
			changed = true;
		}

		if (!changed) continue;
		saveTextFile(loaded.absolutePath, serializeMarkdownDocument(frontmatter, body));
	}

	console.log(
		JSON.stringify(
			{
				filesScanned: files.length,
				filesWithRemovedRemoteImages: cleanedImageFiles.length,
				removedRemoteImages: removedImages,
				filesAutoNoindexed: noindexedFiles.length,
				noindexedFiles,
				cleanedImageFiles,
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
