import {
	existsSync,
	readFileSync,
	writeFileSync,
} from 'node:fs';

import {
	dirname,
	join,
} from 'node:path';

import {
	fileURLToPath,
} from 'node:url';

import {
	normalizeGonePath,
} from './load-gone-paths.mjs';

const __dirname = dirname(
	fileURLToPath(import.meta.url),
);

const ROOT_DIR = join(
	__dirname,
	'..',
);

const DECISIONS_FILE = join(
	ROOT_DIR,
	'src',
	'config',
	'legacy-survivor-decisions.json',
);

const REDIRECTS_FILE = join(
	ROOT_DIR,
	'public',
	'_redirects',
);

const START_MARKER =
	'# BEGIN GENERATED SURVIVOR REDIRECTS';

const END_MARKER =
	'# END GENERATED SURVIVOR REDIRECTS';

function decodePath(value) {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}

function encodePath(value) {
	return encodeURI(
		normalizeGonePath(value),
	);
}

function parseRedirectLine(line) {
	const trimmed = line.trim();

	if (
		!trimmed ||
		trimmed.startsWith('#')
	) {
		return null;
	}

	const parts = trimmed.split(/\s+/);

	if (parts.length < 2) {
		return null;
	}

	return {
		source: normalizeGonePath(
			decodePath(parts[0]),
		),
		target: normalizeGonePath(
			decodePath(parts[1]),
		),
		status: parts[2] ?? '301',
	};
}

if (!existsSync(DECISIONS_FILE)) {
	throw new Error(
		`Decision file not found: ${DECISIONS_FILE}`,
	);
}

const decisions = JSON.parse(
	readFileSync(
		DECISIONS_FILE,
		'utf8',
	),
);

const redirectEntries =
	Object.entries(
		decisions.newRedirects ?? {},
	)
		.map(
			([source, target]) => ({
				source:
					normalizeGonePath(
						source,
					),
				target:
					normalizeGonePath(
						target,
					),
			}),
		)
		.sort(
			(a, b) =>
				a.source.localeCompare(
					b.source,
					'th',
				),
		);

if (redirectEntries.length !== 10) {
	throw new Error(
		`Expected 10 survivor redirects, found ${redirectEntries.length}`,
	);
}

let redirectsSource = existsSync(
	REDIRECTS_FILE,
)
	? readFileSync(
			REDIRECTS_FILE,
			'utf8',
		)
	: '';

/**
 * Remove previous generated block.
 *
 * This makes the command idempotent.
 */
const escapedStart =
	START_MARKER.replace(
		/[.*+?^${}()|[\]\\]/g,
		'\\$&',
	);

const escapedEnd =
	END_MARKER.replace(
		/[.*+?^${}()|[\]\\]/g,
		'\\$&',
	);

const generatedBlockRegex =
	new RegExp(
		`${escapedStart}[\\s\\S]*?${escapedEnd}\\s*`,
		'g',
	);

const baseSource =
	redirectsSource
		.replace(
			generatedBlockRegex,
			'',
		)
		.trimEnd();

const manualRedirects = new Map();

for (
	const rawLine
	of baseSource.split(/\r?\n/)
) {
	const parsed =
		parseRedirectLine(rawLine);

	if (!parsed) {
		continue;
	}

	if (
		manualRedirects.has(
			parsed.source,
		)
	) {
		const existing =
			manualRedirects.get(
				parsed.source,
			);

		if (
			existing.target !==
			parsed.target
		) {
			throw new Error(
				`Conflicting manual redirects for ${parsed.source}`,
			);
		}
	}

	manualRedirects.set(
		parsed.source,
		parsed,
	);
}

const generatedLines = [];
let alreadyCovered = 0;

for (
	const {
		source,
		target,
	}
	of redirectEntries
) {
	if (source === target) {
		throw new Error(
			`Redirect source equals target: ${source}`,
		);
	}

	const manual =
		manualRedirects.get(source);

	if (manual) {
		if (
			manual.target !== target
		) {
			throw new Error(
				[
					`Redirect conflict: ${source}`,
					`Manual target: ${manual.target}`,
					`Decision target: ${target}`,
				].join('\n'),
			);
		}

		alreadyCovered += 1;
		continue;
	}

	generatedLines.push(
		`${encodePath(source)} ${encodePath(target)} 301`,
	);
}

const generatedBlock = [
	START_MARKER,
	...generatedLines,
	END_MARKER,
].join('\n');

const output = [
	baseSource,
	'',
	generatedBlock,
	'',
]
	.filter(
		(value, index) =>
			index !== 0 ||
			Boolean(value),
	)
	.join('\n');

writeFileSync(
	REDIRECTS_FILE,
	output,
	'utf8',
);

console.log('');
console.log(
	'Survivor Redirect Sync',
);
console.log(
	'======================',
);
console.log(
	`Decision redirects: ${redirectEntries.length}`,
);
console.log(
	`Generated redirects: ${generatedLines.length}`,
);
console.log(
	`Already covered manually: ${alreadyCovered}`,
);
console.log(
	`Output: ${REDIRECTS_FILE}`,
);