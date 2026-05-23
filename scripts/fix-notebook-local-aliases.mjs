import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const postsDir = join(process.cwd(), 'src', 'content', 'posts');

const aliasToCanonical = new Map([
	['รับซื้อโน๊ตบุ๊ค-อุดรธาน', '/รับซื้อโน๊ตบุ๊ค-อุดรธานี/'],
	['รับซื้อโน๊ตบุ๊ค-บุรีรัม', '/รับซื้อโน๊ตบุ๊ค-บุรีรัมย์/'],
	['รับซื้อโน๊ตบุ๊ค-สุรินทร', '/รับซื้อโน๊ตบุ๊ค-สุรินทร์/'],
	['รับซื้อโน๊ตบุ๊ค-หนองบัว', '/รับซื้อโน๊ตบุ๊ค-หนองบัวลำภู/'],
	['รับซื้อโน๊ตบุ๊ค-นครราชส', '/รับซื้อโน๊ตบุ๊ค-โคราช/'],
	['รับซื้อโน๊ตบุ๊ค-กาฬสินธ', '/รับซื้อโน๊ตบุ๊ค-กาฬสินธุ์/'],
	['รับซื้อโน๊ตบุ๊ค-ศรีสะเก', '/รับซื้อโน๊ตบุ๊ค-ศรีสะเกษ/'],
	['รับซื้อโน๊ตบุ๊ค-ศรีสะเ-2', '/รับซื้อโน๊ตบุ๊ค-ศรีสะเกษ/'],
	['รับซื้อโน๊ตบุ๊ค-ร้อยเอ็', '/รับซื้อโน๊ตบุ๊ค-ร้อยเอ็ด/'],
	['รับซื้อโน๊ตบุ๊ค-มหาสารค', '/รับซื้อโน๊ตบุ๊ค-มหาสารคาม/'],
	['รับซื้อโน๊ตบุ๊ค-อำนาจเจ', '/รับซื้อโน๊ตบุ๊ค-อำนาจเจริญ/'],
	['รับซื้อโน๊ตบุ๊ค-notebook-ยโสธร', '/รับซื้อโน๊ตบุ๊ค-ยโสธร/'],
	['รับซื้อโน๊ตบุ๊ค-อุบล', '/รับซื้อโน๊ตบุ๊คอุบล-notebook-laptop-จ/'],
]);

function setOrReplace(frontmatter, key, value) {
	const lines = frontmatter.split('\n');
	const index = lines.findIndex((line) => line.startsWith(`${key}:`));
	const next = `${key}: ${value}`;

	if (index >= 0) {
		lines[index] = next;
		return lines.join('\n');
	}

	const insertAt = Math.max(
		lines.findIndex((line) => line.startsWith('qualityScore:')),
		0,
	);
	lines.splice(insertAt, 0, next);
	return lines.join('\n');
}

const touched = [];

for (const file of readdirSync(postsDir)) {
	if (!file.endsWith('.md')) continue;

	const filePath = join(postsDir, file);
	const source = readFileSync(filePath, 'utf8');
	const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
	if (!match) continue;

	const frontmatter = match[1];
	const slugMatch = frontmatter.match(/(?:^|\n)slug:\s*"([^"]+)"/);
	if (!slugMatch) continue;

	const slug = slugMatch[1];
	const canonical = aliasToCanonical.get(slug);
	if (!canonical) continue;

	let nextFrontmatter = setOrReplace(frontmatter, 'noindex', 'true');
	nextFrontmatter = setOrReplace(nextFrontmatter, 'canonical', `"${canonical}"`);

	if (nextFrontmatter === frontmatter) continue;

	const nextSource = source.replace(match[0], `---\n${nextFrontmatter}\n---\n`);
	writeFileSync(filePath, nextSource, 'utf8');
	touched.push({ file, slug, canonical });
}

console.log(JSON.stringify({ touched }, null, 2));
