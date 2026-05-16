/**
 * Run a quality pass over imported Markdown content:
 * - score thin, templated, spammy, or broken-slug posts
 * - add noindex to weak on-theme posts
 * - persist quality metadata for later quarantine/audit steps
 *
 * Usage:
 *   npm run quality:content
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	parseMarkdownDocument,
	readBooleanFrontmatterValue,
	readJsonFrontmatterValue,
	saveTextFile,
	serializeMarkdownDocument,
	upsertBooleanFrontmatterValue,
	upsertJsonFrontmatterValue,
} from './content-migration-utils.mjs';
import {
	analyzeContentQuality,
	buildDuplicatePatternMap,
	getDuplicatePatternCount,
	shouldAutoNoindexForQuality,
} from './content-quality-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const postsDir = join(rootDir, 'src', 'content', 'posts');

function loadPosts() {
	return readdirSync(postsDir)
		.filter((file) => file.endsWith('.md'))
		.map((file) => {
			const absolutePath = join(postsDir, file);
			const raw = readFileSync(absolutePath, 'utf8');
			const document = parseMarkdownDocument(raw);
			if (!document) return null;

			const title = readJsonFrontmatterValue(document.frontmatter, 'title');
			const slug = readJsonFrontmatterValue(document.frontmatter, 'slug');
			const currentNoindex = readBooleanFrontmatterValue(document.frontmatter, 'noindex');

			return {
				file,
				absolutePath,
				title,
				slug,
				currentNoindex,
				...document,
			};
		})
		.filter(Boolean);
}

async function main() {
	const posts = loadPosts();
	const duplicatePatternMap = buildDuplicatePatternMap(posts);
	const autoNoindexedFiles = [];
	const flaggedFiles = [];

	for (const post of posts) {
		const analysis = analyzeContentQuality({
			title: post.title,
			slug: post.slug,
			body: post.body,
			duplicatePatternCount: getDuplicatePatternCount(post.title, duplicatePatternMap),
		});

		let frontmatter = post.frontmatter;
		let changed = false;

		frontmatter = upsertJsonFrontmatterValue(frontmatter, 'qualityScore', analysis.score);
		frontmatter = upsertJsonFrontmatterValue(frontmatter, 'qualityFlags', analysis.flags);
		changed = true;

		if (shouldAutoNoindexForQuality(analysis, post.currentNoindex)) {
			frontmatter = upsertBooleanFrontmatterValue(frontmatter, 'noindex', true);
			autoNoindexedFiles.push({
				file: post.file,
				score: analysis.score,
				flags: analysis.flags,
			});
			changed = true;
		}

		if (analysis.score >= 4 || analysis.flags.length > 0) {
			flaggedFiles.push({
				file: post.file,
				score: analysis.score,
				flags: analysis.flags,
			});
		}

		if (!changed) continue;
		saveTextFile(post.absolutePath, serializeMarkdownDocument(frontmatter, post.body));
	}

	console.log(
		JSON.stringify(
			{
				filesScanned: posts.length,
				filesFlagged: flaggedFiles.length,
				filesAutoNoindexed: autoNoindexedFiles.length,
				autoNoindexedFiles,
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
