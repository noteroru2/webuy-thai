import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const postsDir = join(process.cwd(), 'src', 'content', 'posts');

const exactCanonical = new Map([
	['รับซื้อซัมซุง-อุบล', '/รับซื้อสมาร์ทโฟน-android/'],
	['รับซื้อโทรศัพท์-samsung-s24-ultra', '/รับซื้อสมาร์ทโฟน-android/'],
	['รับซื้อโทรศัพท์-มือถือ', '/รับซื้อโทรศัพท์-อุบล/'],
	['มือถือ-มือ-สอง-อุบล', '/รับซื้อโทรศัพท์-อุบล/'],
	['รับซื้อ-iphone-จังหวัด-อุบลราช', '/รับซื้อไอโฟนอุบล/'],
	['รับซื้อมือถือภูเก็ต-ราค', '/รับซื้อสมาร์ทโฟน-android/'],
	['ร้านขายไอแพดในอุบล-ipad', '/รับซื้อไอแพด-อุบล/'],
	['รับซื้อ-apple-watch-อุบลราชธานี', '/รับซื้อ-apple-watch/'],
	['รับซื้อ-apple-watch-series-6-อุบล', '/รับซื้อ-apple-watch/'],
	['รับซื้อ-apple-watch-series-7-อุบล', '/รับซื้อ-apple-watch/'],
	['รับซื้อ-apple-watch-series-8-อุบล', '/รับซื้อ-apple-watch/'],
	['รับซื้อ-ps5-อุบล-play-station-5-อุบลราชธ', '/รับซื้อเครื่องเกม/'],
	['รับซื้อ-notebook-lenovo-รับซื้อโน๊ตบุ', '/รับซื้อโน๊ตบุ๊ค/'],
	['รับซื้อโน๊ตบุ๊ค-acer-อุบลรา', '/รับซื้อโน๊ตบุ๊ค/'],
	['รับซื้อโน๊ตบุ๊ค-asus-อุบลรา', '/รับซื้อโน๊ตบุ๊ค/'],
	['รับซื้อโน๊ตบุ๊ค-dell-อุบลรา', '/รับซื้อโน๊ตบุ๊ค/'],
	['รับซื้อโน๊ตบุ๊ค-hp-อุบลรา', '/รับซื้อโน๊ตบุ๊ค/'],
	['รับซื้อโน๊ตบุ๊ค-notebook', '/รับซื้อโน๊ตบุ๊ค/'],
	['ข้อดีที่ทำให้กล้อง-canon-eos-m50', '/รับซื้อกล้อง/'],
	['10-อันดับ-กล้อง-fujifilm-ในตลาดมือ', '/รับซื้อกล้อง/'],
	['กล้อง-fujifilm-มือสอง-ขายได้กี่บาท', '/รับซื้อกล้อง/'],
	['รับซื้อกล้อง-ได้เงินทัน', '/รับซื้อกล้อง/'],
	['รับซื้อกล้องมือสอง-บุรี', '/รับซื้อกล้อง/'],
	['รับซื้อกล้อง-canon-eos-rp', '/รับซื้อกล้อง/'],
	['รับซื้อกล้อง-panasonic', '/รับซื้อกล้อง/'],
]);

const exactNoindexOnly = new Set([
	'fixcom-ubon',
	'รับซื้อ-smart-tv-อุบล-โทรทัศน์-ท',
	'รับซื้อทีวี-อุบล-รับซื้',
	'รับซื้อ-harddisk',
	'we-buy-harddisk',
	'รับซื้อ-harddisk-ใหม่',
	'รับซื้อฮาร์ดดิส',
	'รับซื้อลำโพง-marshall',
	'รับซื้อโดรน',
	'รับซื้อโดรน-dji-drone',
]);

const macbookLocalSlugs = new Set([
	'รับซื้อกมลาไสย',
	'รับซื้อกันทรลักษ์',
	'รับซื้อกันทรวิชัย',
	'รับซื้อโกสุมพิสัย',
	'รับซื้อขุขันธ์',
	'รับซื้อคำเขื่อนแก้ว',
	'รับซื้อคำชะอี',
	'รับซื้อจัตุรัส',
	'รับซื้อชานุมาน',
	'รับซื้อชุมแพ',
	'รับซื้อเชียงคาน',
	'รับซื้อเซกา',
	'รับซื้อเดชอุดม',
	'รับซื้อท่าบ่อ',
	'รับซื้อธวัชบุรี',
	'รับซื้อธาตุพนม',
	'รับซื้อนากลาง',
	'รับซื้อนางรอง',
	'รับซื้อโนนสูง',
	'รับซื้อบ้านเขว้า',
	'รับซื้อบ้านผือ',
	'รับซื้อปทุมราชวงศา',
	'รับซื้อปราสาท',
	'รับซื้อปากช่อง',
	'รับซื้อพรเจริญ',
	'รับซื้อโพนทอง',
	'รับซื้อมหาชนะชัย',
	'รับซื้อยางตลาด',
	'รับซื้อรัตนบุรี',
	'รับซื้อเรณูนคร',
	'รับซื้อวังสะพุง',
	'รับซื้อวาริชภูมิ',
	'รับซื้อวารินชำราบ',
	'รับซื้อศรีเชียงใหม่',
	'รับซื้อศรีบุญเรือง',
	'รับซื้อหนองหาน',
]);

function resolveCanonical(slug) {
	if (exactCanonical.has(slug)) return exactCanonical.get(slug);
	if (slug.startsWith('buy-camera-')) return '/รับซื้อกล้อง/';
	if (slug.startsWith('รับซื้อคอม-')) return '/รับซื้อคอม/';
	if (slug.startsWith('รับซื้อจอคอม-')) return '/รับซื้อคอม/';
	if (
		[
			'รับซื้อ-คอมพิวเตอร์-ขอนแ',
			'รับซื้อคอมพิวเตอร์-ชลบุ',
			'รับซื้อคอมพิวเตอร์บริษ',
			'รับซื้อคอมพิวเตอร์ภูเก',
			'รับซื้อคอมพิวเตอร์-ภูเก',
			'รับซื้อคอมพิวเตอร์มือส',
			'รับซื้อ-คอมพิวเตอร์-อุดร',
		].includes(slug)
	) {
		return '/รับซื้อคอม/';
	}
	if (macbookLocalSlugs.has(slug)) return '/รับซื้อแมคบุ๊ค/';
	return null;
}

function shouldNoindex(slug) {
	return (
		exactCanonical.has(slug) ||
		exactNoindexOnly.has(slug) ||
		slug.startsWith('buy-camera-') ||
		slug.startsWith('รับซื้อคอม-') ||
		slug.startsWith('รับซื้อจอคอม-') ||
		macbookLocalSlugs.has(slug) ||
		[
			'รับซื้อ-คอมพิวเตอร์-ขอนแ',
			'รับซื้อคอมพิวเตอร์-ชลบุ',
			'รับซื้อคอมพิวเตอร์บริษ',
			'รับซื้อคอมพิวเตอร์ภูเก',
			'รับซื้อคอมพิวเตอร์-ภูเก',
			'รับซื้อคอมพิวเตอร์มือส',
			'รับซื้อ-คอมพิวเตอร์-อุดร',
		].includes(slug)
	);
}

function setFrontmatterValue(frontmatter, key, rawValue) {
	const lines = frontmatter.split('\n');
	const existingIndex = lines.findIndex((line) => line.startsWith(`${key}:`));
	if (existingIndex >= 0) {
		lines[existingIndex] = `${key}: ${rawValue}`;
		return lines.join('\n');
	}

	const insertBeforeKeys = ['qualityScore:', 'qualityFlags:'];
	let insertIndex = lines.length;
	for (const marker of insertBeforeKeys) {
		const idx = lines.findIndex((line) => line.startsWith(marker));
		if (idx >= 0) {
			insertIndex = idx;
			break;
		}
	}
	lines.splice(insertIndex, 0, `${key}: ${rawValue}`);
	return lines.join('\n');
}

let changed = 0;
const updated = [];

for (const file of readdirSync(postsDir)) {
	if (!file.endsWith('.md')) continue;

	const fullPath = join(postsDir, file);
	const source = readFileSync(fullPath, 'utf8');
	const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
	if (!match) continue;

	const frontmatter = match[1];
	const slugMatch = frontmatter.match(/(?:^|\n)slug:\s*"([^"]+)"/);
	if (!slugMatch) continue;

	const slug = slugMatch[1];
	if (!shouldNoindex(slug)) continue;

	let nextFrontmatter = setFrontmatterValue(frontmatter, 'noindex', 'true');
	const canonical = resolveCanonical(slug);
	if (canonical) {
		nextFrontmatter = setFrontmatterValue(nextFrontmatter, 'canonical', `"${canonical}"`);
	}

	if (nextFrontmatter === frontmatter) continue;

	const nextSource = source.replace(match[0], `---\n${nextFrontmatter}\n---\n`);
	writeFileSync(fullPath, nextSource, 'utf8');
	changed += 1;
	updated.push({ file, slug, canonical: canonical ?? null });
}

console.log(
	JSON.stringify(
		{
			changed,
			updated,
		},
		null,
		2,
	),
);
