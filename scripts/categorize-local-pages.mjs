import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	parseMarkdownDocument,
	readBooleanFrontmatterValue,
	readJsonFrontmatterValue,
	saveTextFile,
	serializeMarkdownDocument,
	upsertBooleanFrontmatterValue,
} from './content-migration-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const postsDir = join(__dirname, '..', 'src', 'content', 'posts');
const reportsDir = join(__dirname, '..', 'reports');

const THIN_CONTENT_THRESHOLD = 300;

function getWordCount(text) {
	if (!text) return 0;
	return text.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
}

async function main() {
	const files = readdirSync(postsDir).filter((file) => file.endsWith('.md'));
	const indexable = [];
	const noindexCandidates = [];
	const csvRows = ['File,Slug,WordCount,NoindexStatus,Category'];

	mkdirSync(reportsDir, { recursive: true });

	for (const file of files) {
		const absolutePath = join(postsDir, file);
		const raw = readFileSync(absolutePath, 'utf8');
		const document = parseMarkdownDocument(raw);
		if (!document) continue;

		const wordCount = getWordCount(document.body);
		const slug = readJsonFrontmatterValue(document.frontmatter, 'slug') || file.replace('.md', '');
		
		let category = 'B (Indexed Local)';
		let shouldNoindex = false;

		if (wordCount < THIN_CONTENT_THRESHOLD) {
			category = 'C (Thin Content)';
			shouldNoindex = true;
		}

		let frontmatter = document.frontmatter;
		
		// Remove existing noindex so we can upsert cleanly
		frontmatter = frontmatter.split('\n').filter(line => !/^noindex:\s*(true|false)\s*$/i.test(line)).join('\n');
		frontmatter = upsertBooleanFrontmatterValue(frontmatter, 'noindex', shouldNoindex);

		saveTextFile(absolutePath, serializeMarkdownDocument(frontmatter, document.body));

		const urlPath = `/${slug}/`;

		csvRows.push(`"${file}","${slug}",${wordCount},${shouldNoindex},"${category}"`);

		if (shouldNoindex) {
			noindexCandidates.push(urlPath);
		} else {
			indexable.push(urlPath);
		}
	}

	writeFileSync(join(reportsDir, 'sitemap-url-report.csv'), csvRows.join('\n'), 'utf8');
	writeFileSync(join(reportsDir, 'indexable-url-list.txt'), indexable.join('\n'), 'utf8');
	writeFileSync(join(reportsDir, 'noindex-candidate-list.txt'), noindexCandidates.join('\n'), 'utf8');

	console.log(`Processed ${files.length} posts.`);
	console.log(`Indexable (Group B): ${indexable.length}`);
	console.log(`Noindex (Group C): ${noindexCandidates.length}`);
}

main().catch(console.error);
