import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const postsDir = join(process.cwd(), 'src', 'content', 'posts');

const aliasToCanonical = new Map([
	['รับซื้อmacbook-ขอนแก่น', '/รับซื้อแมคบุ๊ค-ขอนแก่น/'],
	['รับซื้อmacbook-อุดรธานี', '/รับซื้อแมคบุ๊ค-อุดรธานี/'],
	['รับซื้อ-macbook-อุบลราชธานี-ปัจจัยราคา-2026', '/รับซื้อแมคบุ๊ค-อุบลราชธานี/'],
	['รับซื้อไอโฟน-iphone-ร้อยเอ็ด', '/รับซื้อไอโฟน-ร้อยเอ็ด/'],
	['รับซื้อไอแพด-ขอนแก่น-ipad', '/รับซื้อไอแพด-ขอนแก่น/'],
	['รับซื้อไอแพด-ยโสธร-ipad', '/รับซื้อไอแพด-ยโสธร/'],
]);

function setOrReplace(frontmatter, key, value) {
	const lines = frontmatter.split('\n');
	const index = lines.findIndex((line) => line.startsWith(`${key}:`));
	const next = `${key}: ${value}`;

	if (index >= 0) {
		lines[index] = next;
		return lines.join('\n');
	}

	const insertAt = Math.max(lines.findIndex((line) => line.startsWith('qualityScore:')), 0);
	lines.splice(insertAt, 0, next);
	return lines.join('\n');
}

const touched = [];

for (const file of readdirSync(postsDir)) {
	if (!file.endsWith('.md')) continue;

	const filePath = join(postsDir, file);
	const source = readFileSync(filePath, 'utf8');
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	if (!match) continue;

	const frontmatter = match[1];
	const slugMatch = frontmatter.match(/(?:^|\n)slug:\s*"([^"]+)"/);
	if (!slugMatch) continue;

	const slug = slugMatch[1];
	const canonical = aliasToCanonical.get(slug);
	if (!canonical) continue;

	let nextFrontmatter = setOrReplace(frontmatter, 'noindex', 'true');
	nextFrontmatter = setOrReplace(nextFrontmatter, 'canonical', `"${canonical}"`);
	nextFrontmatter = setOrReplace(nextFrontmatter, 'qualityScore', '1');
	nextFrontmatter = setOrReplace(nextFrontmatter, 'qualityFlags', '["legacy_alias"]');

	if (nextFrontmatter === frontmatter) continue;

	const nextSource = source.replace(match[0], `---\n${nextFrontmatter}\n---\n`);
	writeFileSync(filePath, nextSource, 'utf8');
	touched.push({ file, slug, canonical });
}

console.log(JSON.stringify({ touched }, null, 2));
