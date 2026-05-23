import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const workspaceRoot = process.cwd();
const outputDir = path.join(workspaceRoot, 'public', 'media', 'apple-local');

const images = [
	{
		source: 'C:/Users/User/Downloads/LINE_ALBUM_Xiaomi Pad 7 8128_260516_1.jpg',
		output: 'xiaomi-pad-front.webp',
		label: 'Xiaomi Pad ด้านหน้า',
		category: 'tablet',
	},
	{
		source: 'C:/Users/User/Downloads/LINE_ALBUM_Xiaomi Pad 7 8128_260516_2.jpg',
		output: 'xiaomi-pad-back.webp',
		label: 'Xiaomi Pad ด้านหลัง',
		category: 'tablet',
	},
	{
		source: 'C:/Users/User/Downloads/LINE_ALBUM_iPhone 15 128gb_260516_1.jpg',
		output: 'iphone15-black-front.webp',
		label: 'iPhone 15 สีดำ ด้านหน้า',
		category: 'iphone',
	},
	{
		source: 'C:/Users/User/Downloads/LINE_ALBUM_iPhone 15 128gb_260516_2.jpg',
		output: 'iphone15-black-back.webp',
		label: 'iPhone 15 สีดำ ด้านหลัง',
		category: 'iphone',
	},
	{
		source: 'C:/Users/User/Downloads/LINE_ALBUM_iPhone 15 128gb_260516_3.jpg',
		output: 'iphone15-black-side.webp',
		label: 'iPhone 15 สีดำ มุมข้าง',
		category: 'iphone',
	},
	{
		source: 'C:/Users/User/Downloads/S__19701817_0.jpg',
		output: 'ipad-mini-silver-back.webp',
		label: 'iPad mini สีเงิน ด้านหลัง',
		category: 'ipad',
	},
	{
		source: 'C:/Users/User/Downloads/S__19701820_0.jpg',
		output: 'iphone-orange-back.webp',
		label: 'iPhone สีส้ม ด้านหลัง',
		category: 'iphone',
	},
	{
		source: 'C:/Users/User/Downloads/S__19701822_0.jpg',
		output: 'iphone-orange-duo.webp',
		label: 'iPhone สีส้ม คู่กล่อง',
		category: 'iphone',
	},
	{
		source: 'C:/Users/User/Downloads/S__19701823_0.jpg',
		output: 'iphone-dark-front.webp',
		label: 'iPhone หน้าจอมืด มุมใช้งาน',
		category: 'iphone',
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
		file: `/media/apple-local/${image.output}`,
		label: image.label,
		category: image.category,
	});
}

await fs.writeFile(
	path.join(outputDir, 'manifest.json'),
	`${JSON.stringify(manifest, null, 2)}\n`,
	'utf8',
);

console.log(JSON.stringify({ converted: manifest.length, outputDir }, null, 2));
