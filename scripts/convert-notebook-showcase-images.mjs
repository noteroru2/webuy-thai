import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const workspaceRoot = process.cwd();
const outputDir = path.join(workspaceRoot, 'public', 'media', 'notebook-showcase');

const images = [
	{
		source: 'C:/Users/User/Pictures/62ec9b87-3c03-46ee-af9c-6e9c5b56f700.jpg',
		output: 'shop-owner-ubon-showroom.webp',
		label: 'หน้าร้านและตัวอย่างเครื่องรับประเมิน',
	},
	{
		source: 'C:/Users/User/Pictures/615183062_25657672167227888_3931568842473919498_n.jpg',
		output: 'notebook-lineup-showroom.webp',
		label: 'ตัวอย่างโน๊ตบุ๊คหลายรุ่นในโชว์รูม',
	},
	{
		source: 'C:/Users/User/Pictures/line amphon/LINE_NOTE_260113_1.jpg',
		output: 'asus-tuf-gaming-f15.webp',
		label: 'ASUS TUF Gaming เครื่องจริง',
	},
	{
		source: 'C:/Users/User/Pictures/line amphon/LINE_NOTE_260113_2.jpg',
		output: 'asus-tuf-gaming-a15.webp',
		label: 'ASUS TUF Gaming อีกรุ่นสำหรับกลุ่มเกมมิง',
	},
	{
		source: 'C:/Users/User/Pictures/line amphon/LINE_NOTE_260113_3.jpg',
		output: 'acer-aspire-3-silver.webp',
		label: 'Acer Aspire สำหรับกลุ่มเรียนและทำงาน',
	},
	{
		source: 'C:/Users/User/Downloads/78468697-4245-4d76-be30-eec84a56d237.jpg',
		output: 'bulk-gaming-notebooks-lot.webp',
		label: 'ตัวอย่างล็อตโน๊ตบุ๊คหลายเครื่อง',
	},
	{
		source: 'C:/Users/User/Downloads/S__19701816_0.jpg',
		output: 'asus-vivobook-reddesk.webp',
		label: 'ASUS VivoBook สำหรับงานทั่วไป',
	},
	{
		source: 'C:/Users/User/Downloads/S__19701818_0.jpg',
		output: 'macbook-boot-screen.webp',
		label: 'MacBook ระดับพรีเมียม',
	},
	{
		source: 'C:/Users/User/Downloads/S__18948109_0.jpg',
		output: 'rog-bottom-panel.webp',
		label: 'รายละเอียดใต้เครื่องเกมมิง',
	},
	{
		source: 'C:/Users/User/Downloads/S__18948111_0.jpg',
		output: 'rog-back-panel.webp',
		label: 'ฝาหลังเครื่องเกมมิง ROG',
	},
	{
		source: 'C:/Users/User/Downloads/S__18948108_0.jpg',
		output: 'rog-strix-open-front.webp',
		label: 'ROG Strix เครื่องจริงหน้าร้าน',
	},
	{
		source: 'C:/Users/User/Downloads/S__18948110_0.jpg',
		output: 'asus-vivobook-keyboard-closeup.webp',
		label: 'รายละเอียดคีย์บอร์ด ASUS VivoBook',
	},
	{
		source: 'C:/Users/User/Downloads/S__18948112_0.jpg',
		output: 'rog-strix-side-open.webp',
		label: 'ROG Strix มุมด้านข้าง',
	},
	{
		source: 'C:/Users/User/Downloads/S__18948104_0.jpg',
		output: 'rog-color-keyboard-front.webp',
		label: 'โน๊ตบุ๊คเกมมิงพร้อมคีย์บอร์ดสี',
	},
	{
		source: 'C:/Users/User/Downloads/S__18948099_0.jpg',
		output: 'macbook-air-on-box.webp',
		label: 'MacBook Air เครื่องจริง',
	},
	{
		source: 'C:/Users/User/Downloads/S__18948100_0.jpg',
		output: 'huawei-matebook-dark.webp',
		label: 'Huawei MateBook สำหรับงานพกพา',
	},
	{
		source: 'C:/Users/User/Downloads/S__18948101_0.jpg',
		output: 'acer-aspire-naruto.webp',
		label: 'Acer Aspire อีกรุ่นในกลุ่มใช้งานทั่วไป',
	},
	{
		source: 'C:/Users/User/Downloads/LINE_ALBUM_Asus Tuf F16 i7 RTX4050_260430_1.jpg',
		output: 'asus-tuf-f16-rtx4050.webp',
		label: 'ASUS TUF F16 สายเกมมิง',
	},
	{
		source: 'C:/Users/User/Downloads/LINE_ALBUM_ROG Strix Gaming 💻 RTX 3070Ti i9_260430_1.jpg',
		output: 'rog-strix-neon-open.webp',
		label: 'ROG Strix Gaming สเปกสูง',
	},
];

await fs.mkdir(outputDir, { recursive: true });

const manifest = [];

for (const image of images) {
	const outputPath = path.join(outputDir, image.output);
	await sharp(image.source)
		.rotate()
		.resize({ width: 1600, withoutEnlargement: true })
		.webp({ quality: 82 })
		.toFile(outputPath);

	manifest.push({
		file: `/media/notebook-showcase/${image.output}`,
		label: image.label,
	});
}

await fs.writeFile(
	path.join(outputDir, 'manifest.json'),
	`${JSON.stringify(manifest, null, 2)}\n`,
	'utf8',
);

console.log(JSON.stringify({ converted: manifest.length, outputDir }, null, 2));
