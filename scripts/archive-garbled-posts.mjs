import { mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = join(scriptDir, '..');
const postsDir = join(rootDir, 'src', 'content', 'posts');
const archiveDir = join(rootDir, 'archive', 'garbled-posts');
const reportPath = join(rootDir, 'docs', 'garbled-posts-report.json');

mkdirSync(archiveDir, { recursive: true });
mkdirSync(dirname(reportPath), { recursive: true });

const archived = [];

for (const fileName of readdirSync(postsDir)) {
	const sourcePath = join(postsDir, fileName);
	const text = readFileSync(sourcePath, 'utf8');
	if (!text.includes('\uFFFD') && !/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(text)) continue;

	const targetPath = join(archiveDir, fileName);
	renameSync(sourcePath, targetPath);
	archived.push(fileName);
}

writeFileSync(reportPath, `${JSON.stringify({ archivedCount: archived.length, archived }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ archivedCount: archived.length }));
