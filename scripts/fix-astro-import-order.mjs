import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const pagesDir = path.join(root, 'src', 'pages');

const files = fs
	.readdirSync(pagesDir)
	.filter((name) => name.endsWith('.astro'))
	.map((name) => path.join(pagesDir, name));

for (const file of files) {
	const src = fs.readFileSync(file, 'utf8');
	const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) continue;

	const fm = match[1];
	const lateImportMatch = fm.match(/\nimport RecentTradesSlider[\s\S]*$/);
	if (!lateImportMatch) continue;

	const lateLines = lateImportMatch[0]
		.trim()
		.split(/\r?\n/)
		.filter(Boolean);
	const newFm = fm.replace(/\nimport RecentTradesSlider[\s\S]*$/, '').trimEnd();
	const existingImports = new Set(newFm.split(/\r?\n/).filter((line) => line.startsWith('import ')));
	const toAdd = lateLines.filter((line) => !existingImports.has(line));
	if (toAdd.length === 0) continue;

	const lines = newFm.split(/\r?\n/);
	const firstNonImport = lines.findIndex((line) => line.trim() && !line.startsWith('import '));
	lines.splice(firstNonImport, 0, ...toAdd);
	const updated = src.replace(/^---\r?\n[\s\S]*?\r?\n---/, `---\n${lines.join('\n')}\n---`);
	fs.writeFileSync(file, updated, 'utf8');
	console.log(`fixed ${path.basename(file)} (+${toAdd.length} imports)`);
}
