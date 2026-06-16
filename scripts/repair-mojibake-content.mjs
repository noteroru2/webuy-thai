import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const postsDir = join(scriptDir, '..', 'src', 'content', 'posts');

const markerPatterns = ['\u00e0\u00b8', '\u00c3', '\u00c2', '\u00e2\u20ac'];
const cp1252Reverse = new Map([
	[0x20ac, 0x80],
	[0x201a, 0x82],
	[0x0192, 0x83],
	[0x201e, 0x84],
	[0x2026, 0x85],
	[0x2020, 0x86],
	[0x2021, 0x87],
	[0x02c6, 0x88],
	[0x2030, 0x89],
	[0x0160, 0x8a],
	[0x2039, 0x8b],
	[0x0152, 0x8c],
	[0x017d, 0x8e],
	[0x2018, 0x91],
	[0x2019, 0x92],
	[0x201c, 0x93],
	[0x201d, 0x94],
	[0x2022, 0x95],
	[0x2013, 0x96],
	[0x2014, 0x97],
	[0x02dc, 0x98],
	[0x2122, 0x99],
	[0x0161, 0x9a],
	[0x203a, 0x9b],
	[0x0153, 0x9c],
	[0x017e, 0x9e],
	[0x0178, 0x9f],
]);

function hasMojibake(text) {
	return markerPatterns.some((pattern) => text.includes(pattern));
}

function repairLine(line) {
	let current = line;
	for (let pass = 0; pass < 3; pass += 1) {
		if (!hasMojibake(current)) break;
		const bytes = [];
		let canDecode = true;
		for (const char of current) {
			const codePoint = char.codePointAt(0) ?? 0;
			if (codePoint <= 0xff) {
				bytes.push(codePoint);
				continue;
			}
			if (cp1252Reverse.has(codePoint)) {
				bytes.push(cp1252Reverse.get(codePoint));
				continue;
			}
			canDecode = false;
			break;
		}
		if (!canDecode) break;
		const next = Buffer.from(bytes).toString('utf8');
		if (next === current) break;
		current = next;
	}
	return current;
}

let changedFiles = 0;
let changedLines = 0;

for (const fileName of readdirSync(postsDir)) {
	const filePath = join(postsDir, fileName);
	const source = readFileSync(filePath, 'utf8');
	if (!hasMojibake(source)) continue;

	const lines = source.split(/\r?\n/);
	let fileChanged = false;

	const repairedLines = lines.map((line) => {
		if (!hasMojibake(line)) return line;
		const repaired = repairLine(line);
		if (repaired !== line) {
			fileChanged = true;
			changedLines += 1;
		}
		return repaired;
	});

	if (!fileChanged) continue;

	writeFileSync(filePath, repairedLines.join('\n'), 'utf8');
	changedFiles += 1;
}

console.log(
	JSON.stringify({
		changedFiles,
		changedLines,
	}),
);
