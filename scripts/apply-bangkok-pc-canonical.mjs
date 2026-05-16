/**
 * Set canonical: /รับซื้อคอม/ on all Bangkok district PC blog posts.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	parseMarkdownDocument,
	readJsonFrontmatterValue,
	saveTextFile,
	serializeMarkdownDocument,
	upsertJsonFrontmatterValue,
} from './content-migration-utils.mjs';
import { BANGKOK_PC_SLUG_TO_DISTRICT } from './local-seo-content-data.mjs';

const postsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content', 'posts');
const CANONICAL = '/รับซื้อคอม/';
const BANGKOK_SLUGS = new Set(
	Object.keys(BANGKOK_PC_SLUG_TO_DISTRICT).map((key) => `รับซื้อคอม-${key}`),
);
const dryRun = process.argv.includes('--dry-run');

let updated = 0;
let cleared = 0;

function removeFrontmatterKey(frontmatter, key) {
	const lines = frontmatter.split('\n');
	const result = [];
	let skipping = false;
	for (const line of lines) {
		if (new RegExp(`^${key}:\\s*`, 'i').test(line)) {
			skipping = true;
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

for (const file of readdirSync(postsDir).filter((f) => f.endsWith('.md'))) {
	const absolutePath = join(postsDir, file);
	const raw = readFileSync(absolutePath, 'utf8');
	const doc = parseMarkdownDocument(raw);
	if (!doc) continue;

	const slug = readJsonFrontmatterValue(doc.frontmatter, 'slug');
	if (!slug?.startsWith('รับซื้อคอม-')) continue;

	let frontmatter = doc.frontmatter;
	if (BANGKOK_SLUGS.has(slug)) {
		frontmatter = upsertJsonFrontmatterValue(frontmatter, 'canonical', CANONICAL);
		updated += 1;
	} else if (/canonical:/i.test(frontmatter)) {
		frontmatter = removeFrontmatterKey(frontmatter, 'canonical');
		cleared += 1;
	} else {
		continue;
	}

	if (!dryRun) {
		saveTextFile(absolutePath, serializeMarkdownDocument(frontmatter, doc.body));
	}
}

console.log(JSON.stringify({ dryRun, updated, cleared, canonical: CANONICAL }, null, 2));
