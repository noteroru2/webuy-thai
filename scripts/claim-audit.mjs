/**
 * Claim audit for Batch 5.7 — core pages + shared components + built HTML.
 *
 * Usage:
 *   node scripts/claim-audit.mjs
 *   node scripts/claim-audit.mjs --dist=dist
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const distArg = process.argv.find((a) => a.startsWith('--dist='))?.split('=')[1];
const distDir = resolve(root, distArg ?? 'dist');

const CORE_PAGES = [
	{ path: '/', file: 'src/pages/index.astro' },
	{ path: '/รับซื้อ/', file: 'src/pages/รับซื้อ.astro' },
	{ path: '/รับซื้อโน๊ตบุ๊ค/', file: 'src/pages/รับซื้อโน๊ตบุ๊ค.astro' },
	{ path: '/รับซื้อคอม/', file: 'src/pages/รับซื้อคอม.astro' },
	{ path: '/รับซื้อแมคบุ๊ค/', file: 'src/pages/รับซื้อแมคบุ๊ค.astro' },
	{ path: '/รับซื้อไอโฟน/', file: 'src/pages/รับซื้อไอโฟน.astro' },
	{ path: '/รับซื้อไอแพด/', file: 'src/pages/รับซื้อไอแพด.astro' },
	{ path: '/รับซื้อกล้อง/', file: 'src/pages/รับซื้อกล้อง.astro' },
	{ path: '/พื้นที่ให้บริการ/', file: 'src/pages/พื้นที่ให้บริการ.astro' },
	{ path: '/contact/', file: 'src/pages/contact.astro' },
	{ path: '/ความน่าเชื่อถือ/', file: 'src/pages/ความน่าเชื่อถือ.astro' },
];

const SHARED_COMPONENTS = [
	'src/components/money-pages/TrustBadges.astro',
	'src/components/money-pages/StepCards.astro',
	'src/components/money-pages/ComparisonTable.astro',
	'src/components/money-pages/DataPrivacyBlock.astro',
	'src/components/money-pages/ProvincialGrid.astro',
	'src/components/money-pages/RecentTradesSlider.astro',
	'src/components/home/SeoProseSection.astro',
	'src/components/longform/NaturalSeoSections.astro',
];

const CLAIM_PATTERNS = [
	{ id: 'ราคาสูงที่สุด', re: /ราคาสูงที่สุด|ให้ราคาสูงที่สุด/g },
	{ id: 'สู้ทุกราคา', re: /สู้ทุกราคา/g },
	{ id: 'ไม่กดราคาแน่นอน', re: /ไม่กดราคาแน่นอน/g },
	{ id: 'จ่ายสดทันที', re: /จ่ายสดทันที|จ่ายเงินสดทันที/g },
	{ id: 'รับเงินสดทันที', re: /รับเงินสดทันที/g },
	{ id: 'ตีราคาให้ทันที', re: /ตีราคาให้ทันที|ตีราคาได้ทันที/g },
	{ id: 'ประเมิน 15 นาที', re: /ประเมิน 15 นาที|10-15 นาที|15-30 นาที/g },
	{ id: '100%', re: /(?:ปลอดภัย|จ่ายเงินสด|จ่ายสด|เงินสด|ไม่กดราคา|ได้เงิน|การันตี)[^\n]{0,24}100%/g },
	{ id: '1,000,000%', re: /1,?000,?000%/g },
	{ id: 'อันดับ 1', re: /อันดับ\s*1|อันดับหนึ่ง/g },
	{ id: 'รับทุกสภาพ', re: /รับทุกสภาพ|ทุกสภาพ ประเมิน/g },
	{ id: 'ทั่วประเทศรับถึงที่', re: /รับถึงที่ทั่วประเทศ|ทั่วประเทศแบบรับถึงที่ทุกจังหวัด|วิ่งรับซื้อทั่วประเทศ/g },
];

const ALLOWLIST_SNIPPETS = [
	'ไม่กล่าวอ้างราคาสูงสุด',
	'รับซื้อราคาสูงอย่างเดียว',
	'ใช้คำว่าให้บริการทั่วประเทศโดยไม่อธิบาย',
	'ความจุสูงสุด',
	'Maximum Capacity',
	'linear-gradient',
	'width: 100%',
	'width="100%"',
	'max-width: 100%',
	'ไม่ใช่การันตีราคา',
	'claim-filter.ts',
	'CLAIM_TITLE_MARKERS',
	'hasClaimHeavyCopy',
];

function isAllowlisted(text, matchIndex, matchLen) {
	const start = Math.max(0, matchIndex - 80);
	const end = Math.min(text.length, matchIndex + matchLen + 80);
	const window = text.slice(start, end);
	return ALLOWLIST_SNIPPETS.some((snippet) => window.includes(snippet));
}

function stripStyleBlocks(text) {
	return text.replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/style\s*=\s*(['"])[\s\S]*?\1/gi, ' ');
}

function findClaims(text, file, severity) {
	const scanText = file.endsWith('.astro') ? stripStyleBlocks(text) : text;
	const hits = [];
	for (const pattern of CLAIM_PATTERNS) {
		const re = new RegExp(pattern.re.source, pattern.re.flags);
		let m;
		while ((m = re.exec(scanText)) !== null) {
			if (isAllowlisted(scanText, m.index, m[0].length)) continue;
			const line = scanText.slice(0, m.index).split('\n').length;
			hits.push({
				severity,
				file,
				line,
				claim: pattern.id,
				snippet: scanText.slice(Math.max(0, m.index - 40), m.index + m[0].length + 40).replace(/\s+/g, ' ').trim(),
			});
		}
	}
	return hits;
}

function extractFrontmatterMeta(text) {
	const fm = text.match(/^---\n([\s\S]*?)\n---/);
	if (!fm) return '';
	return fm[1];
}

function extractJsonLdStrings(text) {
	const chunks = [];
	const re = /(description|headline|name|serviceType|text)\s*:\s*(['"`])([\s\S]*?)\2/g;
	let m;
	while ((m = re.exec(text)) !== null) chunks.push(m[3]);
	return chunks.join('\n');
}

function pathToDistHtml(urlPath) {
	if (urlPath === '/') return join(distDir, 'index.html');
	const trimmed = urlPath.replace(/^\/|\/$/g, '');
	return join(distDir, trimmed, 'index.html');
}

function stripHtml(html) {
	return html
		.replace(/<script[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style[\s\S]*?<\/style>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ');
}

function walkAstroFiles(dir, out = []) {
	if (!existsSync(dir)) return out;
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) walkAstroFiles(full, out);
		else if (entry.name.endsWith('.astro')) out.push(full);
	}
	return out;
}

const critical = [];
const warning = [];

for (const page of CORE_PAGES) {
	const abs = join(root, page.file);
	if (!existsSync(abs)) continue;
	const text = readFileSync(abs, 'utf8');
	critical.push(...findClaims(text, relative(root, abs), 'critical'));
	critical.push(
		...findClaims(extractFrontmatterMeta(text), `${page.file} (frontmatter)`, 'critical'),
	);
	critical.push(
		...findClaims(extractJsonLdStrings(text), `${page.file} (jsonLd-text)`, 'critical'),
	);

	const built = pathToDistHtml(page.path);
	if (existsSync(built)) {
		const html = stripHtml(readFileSync(built, 'utf8'));
		critical.push(...findClaims(html, relative(root, built), 'critical'));
	}
}

for (const rel of SHARED_COMPONENTS) {
	const abs = join(root, rel);
	if (!existsSync(abs)) continue;
	const text = readFileSync(abs, 'utf8');
	critical.push(...findClaims(text, rel, 'critical'));
}

const legacyDir = join(root, 'src/pages');
for (const abs of walkAstroFiles(legacyDir)) {
	const rel = relative(root, abs);
	if (CORE_PAGES.some((p) => p.file === rel.replace(/\\/g, '/'))) continue;
	if (rel.includes('รับซื้อ-server')) continue;
	const text = readFileSync(abs, 'utf8');
	warning.push(...findClaims(text, rel, 'warning'));
}

const ignored = [];
const docsDir = join(root, 'docs/recovery');
if (existsSync(docsDir)) {
	for (const abs of walkAstroFiles(docsDir)) {
		ignored.push({ file: relative(root, abs), note: 'docs/recovery artifact' });
	}
}

const report = {
	generatedAt: new Date().toISOString(),
	summary: {
		critical: critical.length,
		warning: warning.length,
		ignored: ignored.length,
		passed: critical.length === 0,
	},
	corePages: CORE_PAGES.map((p) => p.path),
	claims: { critical, warning, ignored },
};

const outDir = join(root, 'docs/recovery/batch-5-7');
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, 'claim-audit.json');
writeFileSync(outFile, JSON.stringify(report, null, 2), 'utf8');

console.log(`claim-audit: critical=${critical.length} warning=${warning.length}`);
console.log(`report: ${relative(root, outFile)}`);
if (critical.length) {
	for (const hit of critical.slice(0, 20)) {
		console.log(`  [critical] ${hit.file}:${hit.line} ${hit.claim} — ${hit.snippet}`);
	}
	process.exitCode = 1;
}
