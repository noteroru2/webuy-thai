import {
	existsSync,
	readFileSync,
} from 'node:fs';

import {
	dirname,
	join,
} from 'node:path';

import {
	fileURLToPath,
} from 'node:url';

import {
	loadGonePaths,
	normalizeGonePath,
} from './load-gone-paths.mjs';

const __dirname = dirname(
	fileURLToPath(import.meta.url),
);

const ROOT_DIR = join(
	__dirname,
	'..',
);

const SURVIVORS_FILE = join(
	ROOT_DIR,
	'reports',
	'seo',
	'historical-survivors.json',
);

const DECISIONS_FILE = join(
	ROOT_DIR,
	'src',
	'config',
	'legacy-survivor-decisions.json',
);

function loadJson(path) {
	if (!existsSync(path)) {
		throw new Error(
			`Required file not found: ${path}`,
		);
	}

	return JSON.parse(
		readFileSync(path, 'utf8'),
	);
}

const survivors = loadJson(
	SURVIVORS_FILE,
);

const decisions = loadJson(
	DECISIONS_FILE,
);

const gonePaths = loadGonePaths();

const rebuildIndex = new Set(
	(decisions.rebuildIndex ?? []).map(
		normalizeGonePath,
	),
);

const newRedirects = new Map(
	Object.entries(
		decisions.newRedirects ?? {},
	).map(([source, target]) => [
		normalizeGonePath(source),
		normalizeGonePath(target),
	]),
);

const survivorMap = new Map(
	survivors.map((item) => [
		normalizeGonePath(item.path),
		item,
	]),
);

const errors = [];

/* =========================================================
 * Validate rebuild candidates
 * ======================================================= */

for (const path of rebuildIndex) {
	const survivor = survivorMap.get(path);

	if (!survivor) {
		errors.push(
			`REBUILD_INDEX is not a survivor: ${path}`,
		);

		continue;
	}

	if (
		survivor.currentState !==
		'BUILT_ROUTE'
	) {
		errors.push(
			`REBUILD_INDEX must currently be BUILT_ROUTE: ${path}`,
		);
	}

	if (gonePaths.has(path)) {
		errors.push(
			`REBUILD_INDEX is also GONE: ${path}`,
		);
	}
}

/* =========================================================
 * Validate new redirects
 * ======================================================= */

for (
	const [source, target]
	of newRedirects
) {
	const survivor = survivorMap.get(
		source,
	);

	if (!survivor) {
		errors.push(
			`New redirect source is not a survivor: ${source}`,
		);

		continue;
	}

	if (
	survivor.currentState !== 'BUILT_ROUTE' &&
	survivor.currentState !== 'REDIRECT'
) {
	errors.push(
		`New redirect source must be BUILT_ROUTE or REDIRECT: ${source}`,
	);
}

if (
	survivor.currentState === 'REDIRECT'
) {
	const currentTarget = survivor.redirectTarget
		? normalizeGonePath(survivor.redirectTarget)
		: '';

	if (
		currentTarget &&
		currentTarget !== target
	) {
		errors.push(
			`New redirect target mismatch: ${source} -> ${currentTarget}; expected ${target}`,
		);
	}
}

	if (source === target) {
		errors.push(
			`Redirect source equals target: ${source}`,
		);
	}

	if (gonePaths.has(source)) {
		errors.push(
			`Redirect source is also GONE: ${source}`,
		);
	}

	if (gonePaths.has(target)) {
		errors.push(
			`Redirect target is GONE: ${source} -> ${target}`,
		);
	}

	if (rebuildIndex.has(source)) {
		errors.push(
			`URL cannot be both REBUILD_INDEX and REDIRECT: ${source}`,
		);
	}
}

/* =========================================================
 * Classify all survivors
 * ======================================================= */

const classified = survivors.map(
	(item) => {
		const path =
			normalizeGonePath(
				item.path,
			);

		if (
			rebuildIndex.has(path)
		) {
			return {
				path,
				decision:
					'REBUILD_INDEX',
			};
		}

		if (
			newRedirects.has(path)
		) {
			return {
				path,
				decision:
					'NEW_REDIRECT',
			};
		}

		if (
			item.currentState ===
			'REDIRECT'
		) {
			return {
				path,
				decision:
					'EXISTING_REDIRECT',
			};
		}

		return {
			path,
			decision:
				'HOLD_NOINDEX',
		};
	},
);

const counts = classified.reduce(
	(result, item) => {
		result[item.decision] =
			(result[item.decision] ?? 0)
			+ 1;

		return result;
	},
	{},
);

console.log('');
console.log(
	'Legacy Survivor Decision Audit',
);
console.log(
	'==============================',
);

console.log(
	`Total survivors: ${classified.length}`,
);

console.log(
	`REBUILD_INDEX: ${counts.REBUILD_INDEX ?? 0}`,
);

console.log(
	`NEW_REDIRECT: ${counts.NEW_REDIRECT ?? 0}`,
);

console.log(
	`EXISTING_REDIRECT: ${counts.EXISTING_REDIRECT ?? 0}`,
);

console.log(
	`HOLD_NOINDEX: ${counts.HOLD_NOINDEX ?? 0}`,
);

if (
	classified.length !== 63
) {
	errors.push(
		`Expected 63 survivors, found ${classified.length}`,
	);
}

if (
	(counts.REBUILD_INDEX ?? 0) !==
	13
) {
	errors.push(
		`Expected 13 REBUILD_INDEX, found ${counts.REBUILD_INDEX ?? 0}`,
	);
}

if (
	(counts.NEW_REDIRECT ?? 0) !==
	10
) {
	errors.push(
		`Expected 10 NEW_REDIRECT, found ${counts.NEW_REDIRECT ?? 0}`,
	);
}

if (
	(counts.EXISTING_REDIRECT ?? 0) !==
	11
) {
	errors.push(
		`Expected 11 EXISTING_REDIRECT, found ${counts.EXISTING_REDIRECT ?? 0}`,
	);
}

if (
	(counts.HOLD_NOINDEX ?? 0) !==
	29
) {
	errors.push(
		`Expected 29 HOLD_NOINDEX, found ${counts.HOLD_NOINDEX ?? 0}`,
	);
}

if (errors.length > 0) {
	console.error('');
	console.error('FAIL');

	for (const error of errors) {
		console.error(
			`- ${error}`,
		);
	}

	process.exitCode = 1;
} else {
	console.log('');
	console.log(
		'PASS: all 63 historical survivors have a safe decision.',
	);
}