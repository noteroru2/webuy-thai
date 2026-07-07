/**
 * Mobile UX audit for core pages — viewport, sticky CTA, tap targets.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
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

const errors = [];
const warnings = [];

for (const path of CORE_PATHS) {
	const file = toHtmlPath(path);
	if (!existsSync(file)) {
		errors.push({ path, code: 'html_missing', message: 'Built HTML not found' });
		continue;
	}
	const html = readFileSync(file, 'utf8');
	if (!/<meta[^>]+name=["']viewport["'][^>]*>/i.test(html)) {
		errors.push({ path, code: 'viewport_missing', message: 'Missing viewport meta tag' });
	}
	if (!/mobile-contact-bar/i.test(html)) {
		warnings.push({ path, code: 'mobile_cta_missing', message: 'No mobile contact bar detected' });
	}
	if (/<table[^>]*>/.test(html) && !/overflow-x-auto|overflow-x:\s*auto/i.test(html)) {
		warnings.push({ path, code: 'table_scroll', message: 'Table without horizontal scroll wrapper' });
	}
}

const result = {
	generatedAt: new Date().toISOString(),
	errors: errors.length,
	warnings: warnings.length,
	details: { errors, warnings },
	passed: errors.length === 0 && warnings.length === 0,
};

console.log(`mobile-ux-audit: ${result.errors} errors, ${result.warnings} warnings`);
if (!result.passed) {
	for (const e of errors) console.log(`  [error] ${e.path} ${e.code}`);
	for (const w of warnings) console.log(`  [warn] ${w.path} ${w.code}`);
	process.exitCode = 1;
}
