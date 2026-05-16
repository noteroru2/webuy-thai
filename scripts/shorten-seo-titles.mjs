/**
 * Shorten post frontmatter titles for SEO (≤60 chars with " | WE BUY").
 * Run: node scripts/shorten-seo-titles.mjs
 * Dry run: node scripts/shorten-seo-titles.mjs --dry-run
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const postsDir = join(root, 'src', 'content', 'posts');
const dryRun = process.argv.includes('--dry-run');

const BRAND_SUFFIX = ' | WE BUY';
const MAX_TOTAL = 60;
const MAX_BASE = MAX_TOTAL - BRAND_SUFFIX.length;

function stripSuffix(title) {
	return title
		.replace(/\s*\|\s*WE BUY\s*(\|\s*เรารับซื้อ)?\s*$/i, '')
		.replace(/\s*\|\s*เรารับซื้อ\.com\s*$/i, '')
		.trim();
}

function truncateAtWord(text, maxLen) {
	if (text.length <= maxLen) return text;
	const cut = text.slice(0, maxLen + 1);
	const lastSpace = cut.lastIndexOf(' ');
	if (lastSpace > maxLen * 0.5) return cut.slice(0, lastSpace).trim();
	return text.slice(0, maxLen).trim();
}

function shortenBaseTitle(raw) {
	let t = stripSuffix(raw);

	// MacBook multi-device local posts
	const mac = t.match(/^รับซื้อ\s+MacBook,.+?iPad\s+(.+)$/i);
	if (mac) {
		t = `รับซื้อ MacBook ${mac[1].trim()}`;
	}

	// Long local notebook/computer boilerplate
	t = t.replace(/\s*notebook\s*laptop\s*/gi, ' ');
	t = t.replace(/\s*คอมพิวเตอร์\s*PC\s*คอมประกอบ\s*/gi, ' ');
	// Keep province/city keywords in local titles (do not strip จังหวัด/ชื่อจังหวัด)
	t = t.replace(/\s*รับถึงที่\s*มีคนพร้อมไปรับถึงบ้าน/gi, '');
	t = t.replace(/\s*มีคนพร้อมไปรับถึงบ้าน/gi, '');
	t = t.replace(/\s*ไปรับถึงที่\s*จ่ายเงินทันที/gi, '');
	t = t.replace(/\s*รับถึงที่/gi, '');
	t = t.replace(/\s*รับซื้อ\s*iphone\s*/gi, ' ');
	t = t.replace(/\s+/g, ' ').trim();

	// Bangkok district PC: keep "รับซื้อคอม {district}"
	const bkk = t.match(/^(รับซื้อคอม\s+\S+)/);
	if (bkk && t.startsWith('รับซื้อคอม ')) {
		const district = t.match(/^รับซื้อคอม\s+(\S+)/);
		if (district) t = `รับซื้อคอม ${district[1]}`;
	}

	// Colon subtitles — keep shorter lead
	if (t.includes(':')) {
		const [lead] = t.split(':');
		t = lead.trim();
	}

	// Em dash subtitles
	if (t.includes(' – ')) {
		const [lead] = t.split(' – ');
		t = lead.trim();
	}
	if (t.includes(' — ')) {
		const [lead] = t.split(' — ');
		t = lead.trim();
	}

	// Drop trailing marketing clauses after first sentence chunk
	const marketingTail =
		/(\s+(ให้ราคา|ราคา|บริการ|ติดต่อ|ไม่มี|นัดรับ|ประเมิน|จ่าย|รับซื้อทั้ง|สะดวก|คุยง่าย|ตีราคา).+)$/i;
	if (marketingTail.test(t) && !t.startsWith('รับซื้อคอม ')) {
		const m = t.match(/^(.+?\s(?:อุบลราชธานี|อำนาจเจริญ|ศรีสะเกษ|อุบล|กรุงเทพ|ชลบุรี|\S+))/);
		if (m) t = m[1].trim();
	}

	if (t.length > MAX_BASE) {
		t = truncateAtWord(t, MAX_BASE);
	}

	return t;
}

function fullTitle(base) {
	return `${base}${BRAND_SUFFIX}`;
}

let changed = 0;
let skipped = 0;

for (const file of readdirSync(postsDir).filter((f) => f.endsWith('.md'))) {
	const path = join(postsDir, file);
	const raw = readFileSync(path, 'utf8');
	const match = raw.match(/^(title:\s*)(?:"([^"]*)"|'([^']*)'|([^\n]+))\s*$/m);
	if (!match) continue;

	const prefix = match[1];
	const current = (match[2] ?? match[3] ?? match[4] ?? '').trim();
	const shortened = shortenBaseTitle(current);
	const currentFull = stripSuffix(current).length + BRAND_SUFFIX.length <= MAX_TOTAL
		? fullTitle(stripSuffix(current))
		: fullTitle(current);
	const newFull = fullTitle(shortened);

	if (fullTitle(stripSuffix(current)).length <= MAX_TOTAL && current === shortened) {
		skipped++;
		continue;
	}
	if (newFull.length > MAX_TOTAL) {
		console.warn(`WARN still long (${newFull.length}): ${file} -> ${newFull}`);
		continue;
	}
	if (shortened === stripSuffix(current)) {
		skipped++;
		continue;
	}

	const escaped = shortened.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
	const updated = raw.replace(match[0], `${prefix}"${escaped}"`);
	if (!dryRun) writeFileSync(path, updated, 'utf8');
	changed++;
	console.log(`${file}: ${currentFull.length} -> ${newFull.length}\n  ${current}\n  -> ${shortened}`);
}

console.log(`\n${dryRun ? 'Would change' : 'Changed'}: ${changed}, skipped: ${skipped}`);
