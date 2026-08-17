import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
	loadGonePaths,
	normalizeGonePath,
} from './load-gone-paths.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

function decodePath(value) {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}

function loadRedirectSources() {
	const redirectsPath = join(
		ROOT_DIR,
		'public',
		'_redirects',
	);

	if (!existsSync(redirectsPath)) {
		return new Map();
	}

	const result = new Map();
	const text = readFileSync(redirectsPath, 'utf8');

	for (const rawLine of text.split(/\r?\n/)) {
		const line = rawLine.trim();

		if (!line || line.startsWith('#')) {
			continue;
		}

		const parts = line.split(/\s+/);

		if (parts.length < 2) {
			continue;
		}

		const source = normalizeGonePath(
			decodePath(parts[0]),
		);

		const target = normalizeGonePath(
			decodePath(parts[1]),
		);

		const status = parts[2] ?? '301';

		result.set(source, {
			target,
			status,
		});
	}

	return result;
}

function loadHistoricalMovedPaths() {
	const historicalPath = join(
		ROOT_DIR,
		'docs',
		'recovery',
		'batch-1',
		'moved-files.json',
	);

	if (!existsSync(historicalPath)) {
		return new Set();
	}

	const items = JSON.parse(
		readFileSync(historicalPath, 'utf8'),
	);

	return new Set(
		items.map((item) =>
			normalizeGonePath(item.slug),
		),
	);
}

function assertNoHistoricalGoneConsumers() {
	const files = [
		'scripts/start.mjs',
		'scripts/generate-sitemaps.mjs',
		'scripts/schema-audit.mjs',
	];

	const violations = [];

	for (const relativePath of files) {
		const fullPath = join(ROOT_DIR, relativePath);

		const source = readFileSync(fullPath, 'utf8');

		if (source.includes('moved-files.json')) {
			violations.push(relativePath);
		}
	}

	if (violations.length > 0) {
		throw new Error(
			[
				'Runtime/audit files still consume moved-files.json:',
				...violations.map((file) => `- ${file}`),
			].join('\n'),
		);
	}
}

const gonePaths = loadGonePaths();
const redirects = loadRedirectSources();
const historicalMoved = loadHistoricalMovedPaths();

const redirectSources = new Set(redirects.keys());

const goneRedirectOverlap = [...gonePaths].filter(
	(path) => redirectSources.has(path),
);

const historicalOnly = [...historicalMoved].filter(
	(path) => !gonePaths.has(path),
);

const historicalRedirectOverlap = [...historicalMoved].filter(
	(path) => redirectSources.has(path),
);

console.log('');
console.log('SEO Migration Audit');
console.log('===================');
console.log(`GONE paths: ${gonePaths.size}`);
console.log(`Redirect sources: ${redirectSources.size}`);
console.log(
	`GONE ↔ redirect overlap: ${goneRedirectOverlap.length}`,
);
console.log(
	`Historical moved paths: ${historicalMoved.size}`,
);
console.log(
	`Historical moved but NOT GONE: ${historicalOnly.length}`,
);
console.log(
	`Historical moved ↔ redirect overlap: ${historicalRedirectOverlap.length}`,
);

if (goneRedirectOverlap.length > 0) {
	console.error('');
	console.error(
		'ERROR: URLs cannot be both GONE and REDIRECT:',
	);

	for (const path of goneRedirectOverlap) {
		console.error(`- ${path}`);
	}

	process.exitCode = 1;
} else {
	assertNoHistoricalGoneConsumers();

	console.log('');
	console.log('PASS: migration sources do not conflict.');
}

if (historicalRedirectOverlap.length > 0) {
	console.log('');
	console.log(
		'Historical moved-file entries that are now redirects:',
	);

	for (const path of historicalRedirectOverlap) {
		const redirect = redirects.get(path);

		console.log(
			`- ${path} -> ${redirect?.target ?? '?'}`,
		);
	}
}