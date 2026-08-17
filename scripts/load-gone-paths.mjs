import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const GONE_PATHS_SOURCE = join(
	ROOT_DIR,
	'src',
	'config',
	'gone-paths.ts',
);

export function normalizeGonePath(input) {
	let value = String(input ?? '').trim();

	if (!value) {
		return '/';
	}

	if (!value.startsWith('/')) {
		value = `/${value}`;
	}

	value = value.replace(/\/+/g, '/');

	if (value.length > 1 && !value.endsWith('/')) {
		value = `${value}/`;
	}

	return value;
}

export function loadGonePaths() {
	const source = readFileSync(GONE_PATHS_SOURCE, 'utf8');

	const setMatch = source.match(
		/new Set<string>\(\s*\[([\s\S]*?)\]\s*\)/,
	);

	if (!setMatch) {
		throw new Error(
			`Unable to parse GONE_PATHS from ${GONE_PATHS_SOURCE}`,
		);
	}

	const body = setMatch[1];

	const rawPaths = [
		...body.matchAll(/["']([^"']+)["']/g),
	].map((match) => normalizeGonePath(match[1]));

	if (rawPaths.length === 0) {
		throw new Error(
			`GONE_PATHS is empty in ${GONE_PATHS_SOURCE}`,
		);
	}

	const unique = new Set(rawPaths);

	if (unique.size !== rawPaths.length) {
		const seen = new Set();
		const duplicates = [];

		for (const path of rawPaths) {
			if (seen.has(path)) {
				duplicates.push(path);
			}

			seen.add(path);
		}

		throw new Error(
			`Duplicate GONE_PATHS detected:\n${[
				...new Set(duplicates),
			].join('\n')}`,
		);
	}

	return unique;
}

export function getGonePathsSourcePath() {
	return GONE_PATHS_SOURCE;
}