/**
 * fix-webuy-links.mjs
 * แก้ @webuy ในเนื้อหา Markdown ที่ยังไม่ใช่ลิงก์กดได้
 * ให้เปลี่ยนเป็น [Line @webuy](https://line.me/R/ti/p/@webuy)
 *
 * Run: node scripts/fix-webuy-links.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const POSTS_DIR = join(process.cwd(), 'src', 'content', 'posts');
const LINE_URL = 'https://line.me/R/ti/p/@webuy';

// ลิงก์ที่ถูกต้องแล้ว — ไม่ต้องแก้
// รูปแบบที่ต้องหา: @webuy ที่ไม่ใช่ส่วนหนึ่งของ markdown link
// เช่น: Line @webuy, ติดต่อ @webuy, @webuy ได้เลย, "Line : @webuy"

const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));

let totalFixed = 0;

for (const file of files) {
	const filePath = join(POSTS_DIR, file);
	const raw = readFileSync(filePath, 'utf8');

	// แยก frontmatter ออกก่อน — ไม่แก้ใน YAML
	const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!fmMatch) continue;

	const frontmatter = fmMatch[1];
	let body = fmMatch[2];
	const originalBody = body;

	// หา @webuy ที่ยังไม่อยู่ใน markdown link หรือ HTML href
	// Pattern: @webuy ที่ไม่มี ]( ตามหน้า (ไม่ใช่ส่วนหนึ่งของ [...](...@webuy...))
	// และไม่มี " ตามหน้า (ไม่ใช่ href="...@webuy")
	//
	// Strategy:
	// 1. หา [@webuy](line.me...) อยู่แล้ว → ข้ามไป
	// 2. หา "Line @webuy" ที่ไม่มีลิงก์ → แทนด้วย [Line @webuy](LINE_URL)
	// 3. หา " @webuy" หรือ "@webuy " ที่ไม่มีลิงก์ → แทนด้วย [Line @webuy](LINE_URL)

	// เปลี่ยนรูปแบบ: Line @webuy (ไม่มีลิงก์)
	// ต้องระวัง: ไม่แก้ถ้าอยู่ใน [] แล้ว
	body = body.replace(
		/(?<!\[)(Line\s+@webuy|ทัก @webuy|ติดต่อ @webuy|@webuy)(?!\]|\()/gi,
		(match) => {
			// ถ้า match ขึ้นต้นด้วย @ เฉย ๆ → ใช้ "Line @webuy" เป็น label
			const label = match.startsWith('@') ? 'Line @webuy' : match;
			return `[${label}](${LINE_URL})`;
		},
	);

	if (body !== originalBody) {
		const newContent = `---\n${frontmatter}\n---\n${body}`;
		writeFileSync(filePath, newContent, 'utf8');
		console.log(`✅ fixed: ${file}`);
		totalFixed++;
	}
}

console.log(`\nDone. Fixed ${totalFixed} / ${files.length} files.`);
