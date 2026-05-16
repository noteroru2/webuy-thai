import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseMarkdownDocument, readJsonFrontmatterValue } from './content-migration-utils.mjs';
import { classifyPost } from './local-seo-rewrite-utils.mjs';

const postsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content', 'posts');

for (const file of readdirSync(postsDir).filter((f) => f.endsWith('.md')).sort()) {
	const raw = readFileSync(join(postsDir, file), 'utf8');
	const doc = parseMarkdownDocument(raw);
	if (!doc) continue;
	const flags = readJsonFrontmatterValue(doc.frontmatter, 'qualityFlags');
	if (!Array.isArray(flags) || !flags.includes('local-seo-rewritten')) continue;
	const title = readJsonFrontmatterValue(doc.frontmatter, 'title');
	const slug = readJsonFrontmatterValue(doc.frontmatter, 'slug');
	const c = classifyPost({ title, slug, body: doc.body });
	console.log(`${c.type}\t${c.district ?? '-'}\t${c.province ?? '-'}\t${slug}`);
}
