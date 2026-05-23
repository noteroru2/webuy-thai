import fs from 'node:fs/promises';
import path from 'node:path';

const today = '2026-05-23';

const heroAssignments = [
	{
		file: 'src/content/posts/legacy-notebook-ubon-ranking-url.md',
		heroImage: '/media/notebook-showcase/shop-owner-ubon-showroom.webp',
		heroImageAlt: 'ตัวอย่างหน้าร้านและโน๊ตบุ๊คที่รับประเมินในอุบลราชธานี',
	},
	{
		file: 'src/content/posts/รับซื้อโน๊ตบุ๊ค-ขอนแก่น.md',
		heroImage: '/media/notebook-showcase/notebook-lineup-showroom.webp',
		heroImageAlt: 'ตัวอย่างโน๊ตบุ๊คหลายรุ่นสำหรับประเมินในขอนแก่น',
	},
	{
		file: 'src/content/posts/รับซื้อโน๊ตบุ๊ค-อุดรธานี.md',
		heroImage: '/media/notebook-showcase/asus-vivobook-reddesk.webp',
		heroImageAlt: 'ตัวอย่างโน๊ตบุ๊คที่รับประเมินในอุดรธานี',
	},
	{
		file: 'src/content/posts/รับซื้อโน๊ตบุ๊ค-บุรีรัมย์.md',
		heroImage: '/media/notebook-showcase/asus-tuf-gaming-f15.webp',
		heroImageAlt: 'ตัวอย่างเกมมิงโน๊ตบุ๊คที่รับประเมินในบุรีรัมย์',
	},
	{
		file: 'src/content/posts/รับซื้อโน๊ตบุ๊ค-สุรินทร์.md',
		heroImage: '/media/notebook-showcase/asus-tuf-gaming-a15.webp',
		heroImageAlt: 'ตัวอย่างเกมมิงโน๊ตบุ๊คที่รับประเมินในสุรินทร์',
	},
	{
		file: 'src/content/posts/รับซื้อโน๊ตบุ๊ค-ศรีสะเกษ.md',
		heroImage: '/media/notebook-showcase/acer-aspire-3-silver.webp',
		heroImageAlt: 'ตัวอย่างโน๊ตบุ๊คสายเรียนและทำงานที่รับประเมินในศรีสะเกษ',
	},
	{
		file: 'src/content/posts/รับซื้อโน๊ตบุ๊ค-ยโสธร.md',
		heroImage: '/media/notebook-showcase/bulk-gaming-notebooks-lot.webp',
		heroImageAlt: 'ตัวอย่างล็อตโน๊ตบุ๊คหลายเครื่องที่รับประเมินในยโสธร',
	},
	{
		file: 'src/content/posts/รับซื้อโน๊ตบุ๊ค-ร้อยเอ็ด.md',
		heroImage: '/media/notebook-showcase/macbook-air-on-box.webp',
		heroImageAlt: 'ตัวอย่างเครื่องพรีเมียมที่รับประเมินในร้อยเอ็ด',
	},
	{
		file: 'src/content/posts/รับซื้อโน๊ตบุ๊ค-มหาสารคาม.md',
		heroImage: '/media/notebook-showcase/huawei-matebook-dark.webp',
		heroImageAlt: 'ตัวอย่างโน๊ตบุ๊คบางเบาที่รับประเมินในมหาสารคาม',
	},
	{
		file: 'src/content/posts/รับซื้อโน๊ตบุ๊ค-กาฬสินธุ์.md',
		heroImage: '/media/notebook-showcase/acer-aspire-naruto.webp',
		heroImageAlt: 'ตัวอย่างโน๊ตบุ๊คสายใช้งานทั่วไปที่รับประเมินในกาฬสินธุ์',
	},
	{
		file: 'src/content/posts/รับซื้อโน๊ตบุ๊ค-ชัยภูมิ.md',
		heroImage: '/media/notebook-showcase/asus-tuf-f16-rtx4050.webp',
		heroImageAlt: 'ตัวอย่างเกมมิงโน๊ตบุ๊คที่รับประเมินในชัยภูมิ',
	},
	{
		file: 'src/content/posts/รับซื้อโน๊ตบุ๊ค-นครพนม.md',
		heroImage: '/media/notebook-showcase/rog-strix-open-front.webp',
		heroImageAlt: 'ตัวอย่างโน๊ตบุ๊คเกมมิงที่รับประเมินในนครพนม',
	},
	{
		file: 'src/content/posts/รับซื้อโน๊ตบุ๊ค-สกลนคร.md',
		heroImage: '/media/notebook-showcase/rog-strix-side-open.webp',
		heroImageAlt: 'ตัวอย่างเกมมิงโน๊ตบุ๊คที่รับประเมินในสกลนคร',
	},
	{
		file: 'src/content/posts/รับซื้อโน๊ตบุ๊ค-หนองคาย.md',
		heroImage: '/media/notebook-showcase/rog-color-keyboard-front.webp',
		heroImageAlt: 'ตัวอย่างโน๊ตบุ๊คเกมมิงที่รับประเมินในหนองคาย',
	},
	{
		file: 'src/content/posts/รับซื้อโน๊ตบุ๊ค-หนองบัวลำภู.md',
		heroImage: '/media/notebook-showcase/rog-strix-neon-open.webp',
		heroImageAlt: 'ตัวอย่างโน๊ตบุ๊คเกมมิงสเปกสูงที่รับประเมินในหนองบัวลำภู',
	},
	{
		file: 'src/content/posts/รับซื้อโน๊ตบุ๊ค-เลย.md',
		heroImage: '/media/notebook-showcase/macbook-boot-screen.webp',
		heroImageAlt: 'ตัวอย่างโน๊ตบุ๊คระดับพรีเมียมที่รับประเมินในเลย',
	},
	{
		file: 'src/content/posts/รับซื้อโน๊ตบุ๊ค-มุกดาหาร.md',
		heroImage: '/media/notebook-showcase/notebook-lineup-showroom.webp',
		heroImageAlt: 'ตัวอย่างโน๊ตบุ๊คหลายรุ่นที่รับประเมินในมุกดาหาร',
	},
	{
		file: 'src/content/posts/รับซื้อโน๊ตบุ๊ค-อำนาจเจริญ.md',
		heroImage: '/media/notebook-showcase/asus-vivobook-reddesk.webp',
		heroImageAlt: 'ตัวอย่างโน๊ตบุ๊คสายใช้งานจริงที่รับประเมินในอำนาจเจริญ',
	},
	{
		file: 'src/content/posts/รับซื้อโน๊ตบุ๊ค-บึงกาฬ.md',
		heroImage: '/media/notebook-showcase/asus-tuf-f16-rtx4050.webp',
		heroImageAlt: 'ตัวอย่างเกมมิงโน๊ตบุ๊คที่รับประเมินในบึงกาฬ',
	},
];

function upsertLine(lines, key, value, insertAfterKey = 'slug') {
	const next = `${key}: "${value}"`;
	const currentIndex = lines.findIndex((line) => line.startsWith(`${key}:`));
	if (currentIndex >= 0) {
		lines[currentIndex] = next;
		return lines;
	}

	const anchorIndex = lines.findIndex((line) => line.startsWith(`${insertAfterKey}:`));
	if (anchorIndex >= 0) {
		lines.splice(anchorIndex + 1, 0, next);
		return lines;
	}

	lines.push(next);
	return lines;
}

for (const item of heroAssignments) {
	const fullPath = path.join(process.cwd(), item.file);
	const raw = await fs.readFile(fullPath, 'utf8');
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
	if (!match) {
		throw new Error(`Frontmatter not found in ${item.file}`);
	}

	const [, frontmatter, body] = match;
	const lines = frontmatter.split('\n');
	upsertLine(lines, 'updatedDate', today, 'pubDate');
	upsertLine(lines, 'heroImage', item.heroImage);
	upsertLine(lines, 'heroImageAlt', item.heroImageAlt, 'heroImage');

	const next = `---\n${lines.join('\n')}\n---\n${body}`;
	await fs.writeFile(fullPath, next, 'utf8');
}

console.log(JSON.stringify({ updated: heroAssignments.length }, null, 2));
