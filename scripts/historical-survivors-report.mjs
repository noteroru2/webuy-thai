import {
	existsSync,
	mkdirSync,
	readFileSync,
	writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
	loadGonePaths,
	normalizeGonePath,
} from './load-gone-paths.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

const MOVED_FILE = join(
	ROOT_DIR,
	'docs',
	'recovery',
	'batch-1',
	'moved-files.json',
);

const REDIRECTS_FILE = join(
	ROOT_DIR,
	'public',
	'_redirects',
);

const DIST_DIR = join(ROOT_DIR, 'dist');

const REPORT_DIR = join(
	ROOT_DIR,
	'reports',
	'seo',
);

const CSV_FILE = join(
	REPORT_DIR,
	'historical-survivors.csv',
);

const JSON_FILE = join(
	REPORT_DIR,
	'historical-survivors.json',
);

function decodePath(value) {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}

function loadHistoricalMovedPaths() {
	if (!existsSync(MOVED_FILE)) {
		throw new Error(
			`Historical moved file not found: ${MOVED_FILE}`,
		);
	}

	const data = JSON.parse(
		readFileSync(MOVED_FILE, 'utf8'),
	);

	return [...new Set(
		data
			.map((item) => item?.slug)
			.filter(Boolean)
			.map(normalizeGonePath),
	)];
}

function loadRedirects() {
	const redirects = new Map();

	if (!existsSync(REDIRECTS_FILE)) {
		return redirects;
	}

	const source = readFileSync(
		REDIRECTS_FILE,
		'utf8',
	);

	for (const rawLine of source.split(/\r?\n/)) {
		const line = rawLine.trim();

		if (!line || line.startsWith('#')) {
			continue;
		}

		const parts = line.split(/\s+/);

		if (parts.length < 2) {
			continue;
		}

		const sourcePath = normalizeGonePath(
			decodePath(parts[0]),
		);

		const targetPath = normalizeGonePath(
			decodePath(parts[1]),
		);

		redirects.set(sourcePath, {
			target: targetPath,
			status: parts[2] ?? '301',
		});
	}

	return redirects;
}

function getDistHtmlPath(route) {
	if (route === '/') {
		return join(DIST_DIR, 'index.html');
	}

	const relative = decodePath(route)
		.replace(/^\/+/, '')
		.replace(/\/+$/, '');

	return join(
		DIST_DIR,
		relative,
		'index.html',
	);
}

function csvEscape(value) {
	const stringValue = String(
		value ?? '',
	);

	if (
		stringValue.includes(',') ||
		stringValue.includes('"') ||
		stringValue.includes('\n')
	) {
		return `"${stringValue.replace(/"/g, '""')}"`;
	}

	return stringValue;
}

const gonePaths = loadGonePaths();
const movedPaths = loadHistoricalMovedPaths();
const redirects = loadRedirects();

const survivors = movedPaths
	.filter((path) => !gonePaths.has(path))
	.map((path) => {
		const redirect = redirects.get(path);

		const builtHtml = existsSync(
			getDistHtmlPath(path),
		);

		let currentState = 'REVIEW';

		if (redirect) {
			currentState = 'REDIRECT';
		} else if (builtHtml) {
			currentState = 'BUILT_ROUTE';
		} else {
			currentState = 'MISSING_ROUTE';
		}

		return {
			path,
			currentState,
			builtHtml,
			hasRedirect: Boolean(redirect),
			redirectTarget:
				redirect?.target ?? '',
			redirectStatus:
				redirect?.status ?? '',
			inGoneRegistry:
				gonePaths.has(path),
		};
	})
	.sort((a, b) =>
		a.path.localeCompare(
			b.path,
			'th',
		),
	);

mkdirSync(REPORT_DIR, {
	recursive: true,
});

writeFileSync(
	JSON_FILE,
	JSON.stringify(
		survivors,
		null,
		2,
	),
	'utf8',
);

const csvHeader = [
	'path',
	'currentState',
	'builtHtml',
	'hasRedirect',
	'redirectTarget',
	'redirectStatus',
	'inGoneRegistry',
];

const csvRows = survivors.map(
	(row) =>
		csvHeader
			.map((key) =>
				csvEscape(row[key]),
			)
			.join(','),
);

writeFileSync(
	CSV_FILE,
	[
		csvHeader.join(','),
		...csvRows,
	].join('\n'),
	'utf8',
);

const counts = survivors.reduce(
	(result, row) => {
		result[row.currentState] =
			(result[row.currentState] ?? 0) + 1;

		return result;
	},
	{},
);

console.log('');
console.log(
	'Historical Survivor Report',
);
console.log(
	'==========================',
);
console.log(
	`Historical moved: ${movedPaths.length}`,
);
console.log(
	`Current GONE: ${gonePaths.size}`,
);
console.log(
	`Survivors requiring review: ${survivors.length}`,
);

for (const [
	state,
	count,
] of Object.entries(counts)) {
	console.log(`${state}: ${count}`);
}

console.log('');
console.log(`CSV: ${CSV_FILE}`);
console.log(`JSON: ${JSON_FILE}`);

if (survivors.length !== 63) {
	console.warn('');
	console.warn(
		`WARNING: Expected 63 survivors from current baseline, found ${survivors.length}.`,
	);
}