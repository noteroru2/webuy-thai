import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const KEYWORDS = [
	'SEO',
	'Local SEO',
	'AEO',
	'Answer Engine',
	'GEO',
	'Generative AI',
	'Generative AI Summary',
	'AI Overview',
	'คำแนะนำสำหรับ Answer Engine',
	'เหมาะสำหรับการค้นหา',
	'สำหรับ AI',
	'สำหรับบอท',
	'search engine',
	'entity optimization'
];

// Compile regexes for finding matches
// For English acronyms, we match word boundaries or common occurrences.
const wordPatterns = KEYWORDS.map(kw => {
	if (/^[a-zA-Z\s]+$/.test(kw)) {
		// English phrase/acronym: match word boundaries case-insensitively
		return { kw, re: new RegExp(`\\b${kw}\\b`, 'i') };
	} else {
		// Thai phrase: match substring case-insensitively
		return { kw, re: new RegExp(kw, 'i') };
	}
});

function walkDir(dir, filter = () => true) {
	const files = [];
	function walk(currentDir) {
		if (!existsSync(currentDir)) return;
		for (const entry of readdirSync(currentDir, { withFileTypes: true })) {
			const full = join(currentDir, entry.name);
			if (entry.isDirectory()) {
				if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.astro' || entry.name === '.gemini') continue;
				walk(full);
			} else if (entry.isFile() && filter(entry.name, full)) {
				files.push(full);
			}
		}
	}
	walk(dir);
	return files;
}

function stripHtml(html) {
	return html
		.replace(/<script[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style[\s\S]*?<\/style>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ');
}

function checkContent(text, filepath, isHtml = false) {
	// For HTML files, we only check visible text to avoid matching class names, scripts, or styles
	const scanText = isHtml ? stripHtml(text) : text;
	const findings = [];
	for (const { kw, re } of wordPatterns) {
		const matches = scanText.match(re);
		if (matches) {
			// Find all lines that contain this keyword
			const lines = scanText.split('\n');
			for (let i = 0; i < lines.length; i++) {
				if (re.test(lines[i])) {
					findings.push({
						keyword: kw,
						line: i + 1,
						snippet: lines[i].trim().slice(0, 100)
					});
				}
			}
		}
	}
	return findings;
}

function main() {
	console.log('Running Visible AI/SEO Copy Audit...');
	const critical = [];
	const warning = [];
	const ignored = [];

	// 1. Scan dist files (if dist folder exists)
	const distDir = join(root, 'dist');
	const distFiles = walkDir(distDir, name => name.endsWith('.html'));

	for (const file of distFiles) {
		const relativePath = relative(root, file).replace(/\\/g, '/');
		// Ignore recovery files in dist if any, but dist shouldn't have them
		if (relativePath.includes('docs/recovery') || relativePath.includes('report')) {
			continue;
		}

		try {
			const content = readFileSync(file, 'utf8');
			const matches = checkContent(content, file, true);
			for (const m of matches) {
				critical.push({
					file: relativePath,
					...m
				});
			}
		} catch (err) {
			console.error(`Error reading dist file ${file}:`, err);
		}
	}

	// 2. Scan source files: src/pages, src/components, src/content
	const sourceDirs = [
		join(root, 'src/pages'),
		join(root, 'src/components'),
		join(root, 'src/content')
	];

	for (const sDir of sourceDirs) {
		const files = walkDir(sDir, (name, path) => {
			return name.endsWith('.astro') || name.endsWith('.md') || name.endsWith('.ts');
		});

		for (const file of files) {
			const relativePath = relative(root, file).replace(/\\/g, '/');
			try {
				const content = readFileSync(file, 'utf8');
				// Check content (treating source files as raw text since code is there,
				// but let's exclude import statements or file names)
				const matches = checkContent(content, file, false);
				for (const m of matches) {
					// Check if this file gets rendered. If it's a page or component, it might get rendered.
					// But if the term is in comments or unused code, it is a warning.
					// We classify all source file matches as warnings unless they end up in dist (which would be critical).
					// To be helpful, if the file is in recovery/reports, it's ignored.
					if (relativePath.includes('docs/recovery') || relativePath.includes('report')) {
						ignored.push({
							file: relativePath,
							...m
						});
					} else {
						warning.push({
							file: relativePath,
							...m
						});
					}
				}
			} catch (err) {
				console.error(`Error reading source file ${file}:`, err);
			}
		}
	}

	// Also check docs/recovery directory to populate ignored list
	const recoveryDir = join(root, 'docs/recovery');
	if (existsSync(recoveryDir)) {
		const recFiles = walkDir(recoveryDir, name => name.endsWith('.md') || name.endsWith('.json'));
		for (const file of recFiles) {
			const relativePath = relative(root, file).replace(/\\/g, '/');
			try {
				const content = readFileSync(file, 'utf8');
				const matches = checkContent(content, file, false);
				for (const m of matches) {
					ignored.push({
						file: relativePath,
						...m
					});
				}
			} catch (err) {
				// Ignore errors in recovery scan
			}
		}
	}

	const auditResult = {
		summary: {
			criticalCount: critical.length,
			warningCount: warning.length,
			ignoredCount: ignored.length
		},
		critical,
		warning,
		ignored
	};

	// Write report JSON
	const outputDir = join(root, 'docs/recovery/batch-5-9');
	mkdirSync(outputDir, { recursive: true });
	const outputPath = join(outputDir, 'visible-ai-seo-copy-audit.json');
	writeFileSync(outputPath, JSON.stringify(auditResult, null, 2), 'utf8');

	console.log('\n=== Visible AI/SEO Copy Audit Results ===\n');
	console.table([
		{ Severity: 'Critical (dist HTML)', Count: critical.length },
		{ Severity: 'Warning (source code)', Count: warning.length },
		{ Severity: 'Ignored (recovery/docs)', Count: ignored.length }
	]);

	if (critical.length > 0) {
		console.error('\nCRITICAL: Visible AI/SEO copywriting found in public HTML pages!');
		critical.slice(0, 10).forEach(c => {
			console.error(`  - ${c.file}:${c.line} [Keyword: ${c.keyword}] -> "${c.snippet}"`);
		});
		if (critical.length > 10) console.error(`  ... and ${critical.length - 10} more`);
	} else {
		console.log('\nPass: No visible AI/SEO copywriting in public HTML pages.');
	}

	// Exit code
	process.exit(critical.length > 0 ? 1 : 0);
}

main();
