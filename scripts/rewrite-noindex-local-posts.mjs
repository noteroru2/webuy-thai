/**
 * Rewrite all noindex posts into local SEO/AEO/GEO buyback articles and enable indexing.
 *
 * Usage:
 *   node scripts/rewrite-noindex-local-posts.mjs
 *   node scripts/rewrite-noindex-local-posts.mjs --dry-run
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
	collapseMarkdownSpacing,
} from './content-migration-utils.mjs';
import {
	classifyPost,
	buildRewrittenBody,
	buildRewrittenFrontmatterFields,
} from './local-seo-rewrite-utils.mjs';
import { shouldNoindexAsOffTopic } from './content-quality-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const postsDir = join(__dirname, '..', 'src', 'content', 'posts');
const dryRun = process.argv.includes('--dry-run');
const refreshRewritten = process.argv.includes('--refresh-rewritten');

function formatFaqYaml(faqItems) {
	const lines = ['faqItems:'];
	for (const item of faqItems) {
		lines.push(`  - question: ${JSON.stringify(item.question)}`);
		lines.push(`    answer: ${JSON.stringify(item.answer)}`);
	}
	return lines.join('\n');
}

function removeFrontmatterKey(frontmatter, key) {
	const lines = frontmatter.split('\n');
	const result = [];
	let skipping = false;

	for (const line of lines) {
		if (new RegExp(`^${key}:\\s*`, 'i').test(line)) {
			skipping = true;
			if (/\]\s*$/.test(line.trim())) skipping = false;
			continue;
		}
		if (skipping) {
			if (/^\s+-\s/.test(line) || /^\s{2,}\w+:/.test(line)) continue;
			skipping = false;
		}
		result.push(line);
	}

	return result.join('\n');
}

function stripOrphanFaqLines(frontmatter) {
	return frontmatter
		.split('\n')
		.filter((line) => !/^\s+-\s+question:/.test(line) && !/^\s+answer:/.test(line))
		.join('\n');
}

function upsertFaqItems(frontmatter, faqItems) {
	let next = stripOrphanFaqLines(removeFrontmatterKey(frontmatter, 'faqItems'));
	return `${next.trim()}\n${formatFaqYaml(faqItems)}`;
}

function loadNoindexPosts() {
	return readdirSync(postsDir)
		.filter((file) => file.endsWith('.md'))
		.map((file) => {
			const absolutePath = join(postsDir, file);
			const raw = readFileSync(absolutePath, 'utf8');
			const document = parseMarkdownDocument(raw);
			if (!document) return null;
			const noindex = readBooleanFrontmatterValue(document.frontmatter, 'noindex');
			const flags = readJsonFrontmatterValue(document.frontmatter, 'qualityFlags');
			const isRewritten = Array.isArray(flags) && flags.includes('local-seo-rewritten');
			if (noindex !== true && !(refreshRewritten && isRewritten)) return null;
			return {
				file,
				absolutePath,
				title: readJsonFrontmatterValue(document.frontmatter, 'title'),
				slug: readJsonFrontmatterValue(document.frontmatter, 'slug'),
				heroImage: readJsonFrontmatterValue(document.frontmatter, 'heroImage'),
				...document,
			};
		})
		.filter(Boolean);
}

async function main() {
	const posts = loadNoindexPosts();
	const summary = {
		scanned: posts.length,
		rewritten: 0,
		skipped: [],
		byType: {},
	};

	for (const post of posts) {
		const classification = classifyPost({
			title: post.title,
			slug: post.slug,
			body: post.body,
		});

		const fields = buildRewrittenFrontmatterFields({
			title: post.title,
			slug: post.slug,
			classification,
			existing: post,
		});

		if (fields.skip) {
			if (!dryRun && fields.reason === 'repair_service') {
				let fm = post.frontmatter;
				fm = upsertBooleanFrontmatterValue(fm, 'noindex', true);
				fm = upsertJsonFrontmatterValue(fm, 'qualityFlags', ['off-topic-repair']);
				saveTextFile(post.absolutePath, serializeMarkdownDocument(fm, post.body));
			}
			summary.skipped.push({ file: post.file, reason: fields.reason });
			continue;
		}

		const body = collapseMarkdownSpacing(
			buildRewrittenBody({
				title: post.title,
				slug: post.slug,
				classification,
				heroImage: post.heroImage,
			}),
		);

		let frontmatter = post.frontmatter;
		frontmatter = upsertJsonFrontmatterValue(frontmatter, 'description', fields.description);
		frontmatter = upsertJsonFrontmatterValue(frontmatter, 'qualityScore', fields.qualityScore);
		frontmatter = upsertJsonFrontmatterValue(frontmatter, 'qualityFlags', fields.qualityFlags);
		frontmatter = upsertJsonFrontmatterValue(frontmatter, 'updatedDate', fields.updatedDate);
		frontmatter = upsertFaqItems(frontmatter, fields.faqItems);
		if (fields.canonical) {
			frontmatter = upsertJsonFrontmatterValue(frontmatter, 'canonical', fields.canonical);
		} else {
			frontmatter = removeFrontmatterKey(frontmatter, 'canonical');
		}
		frontmatter = removeFrontmatterKey(frontmatter, 'noindex');
		frontmatter = upsertBooleanFrontmatterValue(frontmatter, 'noindex', false);

		// Remove duplicate titleHtml if present (optional cleanup)
		if (shouldNoindexAsOffTopic(post.title, post.slug)) {
			summary.skipped.push({ file: post.file, reason: 'off_topic_guard' });
			continue;
		}

		summary.byType[classification.type] = (summary.byType[classification.type] ?? 0) + 1;
		summary.rewritten += 1;

		if (!dryRun) {
			saveTextFile(post.absolutePath, serializeMarkdownDocument(frontmatter, body));
		}
	}

	console.log(JSON.stringify({ dryRun, ...summary }, null, 2));
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
