import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = join(scriptDir, '..');

const changedFiles = execFileSync(
	'git',
	['diff', '--name-only', '--diff-filter=M', '-z', '--', 'src/content/posts'],
	{
		cwd: rootDir,
		encoding: 'buffer',
	},
)
	.toString('utf8')
	.split('\0')
	.filter(Boolean);

for (const file of changedFiles) {
	try {
		const headContent = execFileSync('git', ['show', `HEAD:${file.replace(/\\/g, '/')}`], {
			cwd: rootDir,
			encoding: 'utf8',
		});
		writeFileSync(join(rootDir, file), headContent, 'utf8');
	} catch (error) {
		if (String(error?.stderr ?? '').includes("exists on disk, but not in 'HEAD'")) {
			continue;
		}
		throw error;
	}
}

console.log(JSON.stringify({ restoredFiles: changedFiles.length }));
