import { readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const archiveDir = join(scriptDir, '..', 'archive', 'garbled-posts');

const REPLACEMENT = '\uFFFD';
const CONTROL_RE = /[\x00-\x08\x0B\x0C\x0E-\x1F]/;
const MOJIBAKE_MARKERS = [
	String.fromCharCode(0x00e0, 0x00b8),
	String.fromCharCode(0x00e0, 0x00b9),
	String.fromCharCode(0x00c3),
	String.fromCharCode(0x00c2),
	String.fromCharCode(0x00e2, 0x20ac),
	String.fromCharCode(0x00f0, 0x0178),
];
const CP1252_REVERSE = new Map([
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
	return MOJIBAKE_MARKERS.some((marker) => text.includes(marker));
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
			if (CP1252_REVERSE.has(codePoint)) {
				bytes.push(CP1252_REVERSE.get(codePoint));
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

function escapeDoubleQuotes(text) {
	return text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function normalizeWhitespace(text) {
	return text.replace(/\s+/g, ' ').trim();
}

function stripMarkdown(text) {
	return normalizeWhitespace(
		text
			.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
			.replace(/^#+\s*/gm, '')
			.replace(/\*\*/g, '')
			.replace(/`/g, '')
			.replace(/^\-\s*/gm, ''),
	);
}

function smartTruncate(text, maxLength = 150) {
	if (text.length <= maxLength) return text;
	const cut = text.slice(0, maxLength + 1);
	const lastSpace = cut.lastIndexOf(' ');
	const shortened =
		lastSpace > Math.floor(maxLength * 0.55) ? cut.slice(0, lastSpace) : text.slice(0, maxLength);
	return `${shortened.trim()}...`;
}

function extractFrontmatter(text) {
	const normalized = text.replace(/^\uFEFF/, '');
	if (!normalized.startsWith('---')) return null;
	const end = normalized.indexOf('\n---', 3);
	if (end === -1) return null;

	return {
		raw: normalized.slice(4, end),
		body: normalized.slice(end + 4).replace(/^\r?\n+/, ''),
	};
}

function extractScalar(frontmatter, key) {
	const quoted = frontmatter.match(new RegExp(`^${key}:\\s*"([^"]*)"`, 'm'));
	if (quoted) return quoted[1];
	const plain = frontmatter.match(new RegExp(`^${key}:\\s*([^\\r\\n]+)`, 'm'));
	return plain ? plain[1].trim() : '';
}

function titleFromFileName(fileName) {
	return basename(fileName, '.md').replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
}

function firstMeaningfulParagraph(body) {
	const paragraphs = body
		.split(/\r?\n\r?\n/)
		.map((chunk) => stripMarkdown(chunk))
		.filter(Boolean);

	return paragraphs[0] ?? '';
}

function buildDescription(title, body) {
	const paragraph = firstMeaningfulParagraph(body)
		.replaceAll(REPLACEMENT, '')
		.replaceAll('...', '')
		.trim();

	if (paragraph.length >= 60) {
		return smartTruncate(paragraph, 155);
	}

	return smartTruncate(
		`${title} - Archived copy moved out of the live content set and kept for internal reference only`,
		155,
	);
}

function buildFallbackArchiveFile(fileName, frontmatter) {
	const title = titleFromFileName(fileName);
	const slug = basename(fileName, '.md');
	const pubDate = extractScalar(frontmatter, 'pubDate') || '2026-05-16';
	const updatedDate = '2026-06-16';
	const heroImage = extractScalar(frontmatter, 'heroImage');
	const heroImageAlt = title;

	const lines = [
		'---',
		`title: "${escapeDoubleQuotes(title)}"`,
		`description: "${escapeDoubleQuotes(`${title} - Archived copy moved out of the live content set because the original file had encoding issues`)}"`,
		`pubDate: "${pubDate}"`,
		`updatedDate: "${updatedDate}"`,
		`slug: "${escapeDoubleQuotes(slug)}"`,
	];

	if (heroImage) lines.push(`heroImage: "${escapeDoubleQuotes(heroImage)}"`);
	lines.push(`heroImageAlt: "${escapeDoubleQuotes(heroImageAlt)}"`);
	lines.push('qualityScore: 0');
	lines.push('qualityFlags: []');
	lines.push(
		'',
		'---',
		'',
		`# ${title}`,
		'',
		'This file is an archived copy that was removed from the live content set because the original text had encoding problems.',
		'',
		'It is kept in the repository for internal reference only and is not part of the current public website.',
		'',
	);

	return `${lines.join('\n')}\n`;
}

function replaceFileContents(filePath, nextContent) {
	const tempPath = `${filePath}.tmp`;
	const backupPath = `${filePath}.bak`;
	rmSync(tempPath, { force: true });
	rmSync(backupPath, { force: true });
	writeFileSync(tempPath, nextContent, 'utf8');
	renameSync(filePath, backupPath);
	renameSync(tempPath, filePath);
	rmSync(backupPath, { force: true });
}

let updatedDescriptions = 0;
let rebuiltArchives = 0;
let repairedMojibakeFiles = 0;

for (const fileName of readdirSync(archiveDir)) {
	const filePath = join(archiveDir, fileName);
	const source = readFileSync(filePath, 'utf8');
	let nextSource = source.replace(/^\uFEFF/, '');
	let changed = false;

	if (hasMojibake(nextSource)) {
		const repaired = nextSource
			.split(/\r?\n/)
			.map((line) => (hasMojibake(line) ? repairLine(line) : line))
			.join('\n');
		if (repaired !== nextSource) {
			nextSource = repaired;
			changed = true;
			repairedMojibakeFiles += 1;
		}
	}

	if (!nextSource.includes(REPLACEMENT) && !CONTROL_RE.test(nextSource)) {
		if (changed) replaceFileContents(filePath, `${nextSource.replace(/\r?\n?$/, '\n')}`);
		continue;
	}

	const parsed = extractFrontmatter(nextSource);
	if (!parsed) {
		if (changed) replaceFileContents(filePath, `${nextSource.replace(/\r?\n?$/, '\n')}`);
		continue;
	}

	const title = extractScalar(parsed.raw, 'title');
	const hasControl = CONTROL_RE.test(nextSource);
	const replacementHits = [...nextSource].filter((char) => char === REPLACEMENT).length;
	const frontmatterLines = parsed.raw.split(/\r?\n/);
	const descriptionIndex = frontmatterLines.findIndex((line) => line.startsWith('description:'));

	if (
		!hasControl &&
		replacementHits === 1 &&
		descriptionIndex !== -1 &&
		frontmatterLines[descriptionIndex].includes(REPLACEMENT)
	) {
		const nextDescription = buildDescription(title || titleFromFileName(fileName), parsed.body);
		frontmatterLines[descriptionIndex] = `description: "${escapeDoubleQuotes(nextDescription)}"`;
		const nextFrontmatter = frontmatterLines.join('\n');
		const rebuiltSource = `---\n${nextFrontmatter}\n---\n\n${parsed.body.replace(/^\uFEFF/, '')}`.replace(
			/\r?\n?$/,
			'\n',
		);
		replaceFileContents(filePath, rebuiltSource);
		updatedDescriptions += 1;
		continue;
	}

	replaceFileContents(filePath, buildFallbackArchiveFile(fileName, parsed.raw));
	rebuiltArchives += 1;
}

console.log(JSON.stringify({ repairedMojibakeFiles, updatedDescriptions, rebuiltArchives }));
