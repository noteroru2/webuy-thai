/**
 * Schema audit for core pages — syntax + required blocks only (no structure changes).
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = resolve(root, 'dist');

const CORE_PATHS = [
	'/',
	'/รับซื้อ/',
	'/รับซื้อโน๊ตบุ๊ค/',
	'/รับซื้อคอม/',
	'/รับซื้อแมคบุ๊ค/',
	'/รับซื้อไอโฟน/',
	'/รับซื้อไอแพด/',
	'/รับซื้อกล้อง/',
	'/พื้นที่ให้บริการ/',
	'/contact/',
	'/ความน่าเชื่อถือ/',
];

function toHtmlPath(urlPath) {
	if (urlPath === '/') return join(distDir, 'index.html');
	return join(distDir, urlPath.replace(/^\/|\/$/g, ''), 'index.html');
}

function extractJsonLd(html) {
	const blocks = [];
	const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
	let m;
	while ((m = re.exec(html)) !== null) blocks.push(m[1].trim());
	return blocks;
}

const errors = [];
const warnings = [];

for (const path of CORE_PATHS) {
	const file = toHtmlPath(path);
	if (!existsSync(file)) {
		errors.push({ path, code: 'html_missing', message: 'Built HTML not found — run npm run build first' });
		continue;
	}
	const html = readFileSync(file, 'utf8');
	const blocks = extractJsonLd(html);
	if (!blocks.length) {
		errors.push({ path, code: 'jsonld_missing', message: 'No JSON-LD script blocks found' });
		continue;
	}
	for (const [i, raw] of blocks.entries()) {
		try {
			const data = JSON.parse(raw);
			const nodes = data['@graph'] ?? [data];
			for (const node of nodes) {
				if (!node['@type']) {
					warnings.push({ path, code: 'schema_type_missing', block: i });
				}
			}
		} catch (e) {
			errors.push({ path, code: 'jsonld_invalid', message: String(e), block: i });
		}
	}
}

const result = {
	generatedAt: new Date().toISOString(),
	errors: errors.length,
	warnings: warnings.length,
	details: { errors, warnings },
	passed: errors.length === 0 && warnings.length === 0,
};

console.log(`schema-audit: ${result.errors} errors, ${result.warnings} warnings`);
if (!result.passed) {
	for (const e of errors) console.log(`  [error] ${e.path} ${e.code} ${e.message ?? ''}`);
	for (const w of warnings) console.log(`  [warn] ${w.path} ${w.code}`);
	process.exitCode = 1;
}
