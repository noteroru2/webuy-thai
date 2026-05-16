/**
 * Move low-confidence content out of the main posts collection.
 *
 * Usage:
 *   npm run quarantine:content
 */
import { mkdirSync, readFileSync, readdirSync, renameSync } from 'node:fs';
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
	shouldQuarantinePost,
} from './content-quality-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const postsDir = join(rootDir, 'src', 'content', 'posts');
const quarantineDir = join(rootDir, 'src', 'content', 'quarantine');

function loadPosts() {
	return readdirSync(postsDir)
		.filter((file) => file.endsWith('.md'))
		.map((file) => {
			const absolutePath = join(postsDir, file);
			const raw = readFileSync(absolutePath, 'utf8');
			const document = parseMarkdownDocument(raw);
			if (!document) return null;

			return {
				file,
				absolutePath,
				currentNoindex: readBooleanFrontmatterValue(document.frontmatter, 'noindex'),
				title: readJsonFrontmatterValue(document.frontmatter, 'title'),
				slug: readJsonFrontmatterValue(document.frontmatter, 'slug'),
				...document,
			};
		})
		.filter(Boolean);
}

async function main() {
	mkdirSync(quarantineDir, { recursive: true });
	const posts = loadPosts();
	const duplicatePatternMap = buildDuplicatePatternMap(posts);
	const movedFiles = [];

	for (const post of posts) {
		const analysis = analyzeContentQuality({
			title: post.title,
			slug: post.slug,
			body: post.body,
			duplicatePatternCount: getDuplicatePatternCount(post.title, duplicatePatternMap),
		});

		if (!shouldQuarantinePost(analysis, post.currentNoindex)) continue;

		let frontmatter = post.frontmatter;
		frontmatter = upsertBooleanFrontmatterValue(frontmatter, 'noindex', true);
		frontmatter = upsertJsonFrontmatterValue(frontmatter, 'qualityScore', analysis.score);
		frontmatter = upsertJsonFrontmatterValue(frontmatter, 'qualityFlags', analysis.flags);
		frontmatter = upsertJsonFrontmatterValue(
			frontmatter,
			'quarantineReason',
			analysis.isOffTopic ? 'off_topic_or_non_core' : 'low_confidence_quality',
		);

		saveTextFile(post.absolutePath, serializeMarkdownDocument(frontmatter, post.body));

		const targetPath = join(quarantineDir, post.file);
		renameSync(post.absolutePath, targetPath);
		movedFiles.push({
			file: post.file,
			score: analysis.score,
			flags: analysis.flags,
			reason: analysis.isOffTopic ? 'off_topic_or_non_core' : 'low_confidence_quality',
		});
	}

	console.log(
		JSON.stringify(
			{
				filesScanned: posts.length,
				filesMovedToQuarantine: movedFiles.length,
				movedFiles,
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
