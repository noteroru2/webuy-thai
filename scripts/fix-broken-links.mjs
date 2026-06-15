import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');

function walk(dir) {
	let results = [];
	const list = fs.readdirSync(dir);
	for (const file of list) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);
		if (stat && stat.isDirectory()) {
			results = results.concat(walk(filePath));
		} else if (filePath.endsWith('.md') || filePath.endsWith('.astro') || filePath.endsWith('.ts')) {
			results.push(filePath);
		}
	}
	return results;
}

const files = walk(srcDir);
let updatedFilesCount = 0;

const replacements = [
	{ from: /\/รับซื้อโน๊ตบุ๊ค-อุบลราชธานี\//g, to: '/รับซื้อโน๊ตบุ๊คอุบล-notebook-laptop-จ/' },
	{ from: /\/รับซื้อไอโฟนอุบล\//g, to: '/รับซื้อไอโฟน-อุบลราชธานี/' },
	{ from: /\/รับซื้อไอแพด-อุบล\//g, to: '/รับซื้อไอแพด-อุบลราชธานี/' },
	{ from: /\/รับซื้อ-harddisk\//g, to: '/รับซื้อคอม/' },
	{ from: /\/uploads\/hero-placeholder\.jpg/g, to: '/media/category/generic_desktop_pc_1781509169636.png' }
];

for (const filePath of files) {
	let originalContent = fs.readFileSync(filePath, 'utf8');
	let content = originalContent;

	for (const { from, to } of replacements) {
		content = content.replace(from, to);
	}

	if (content !== originalContent) {
		fs.writeFileSync(filePath, content, 'utf8');
		updatedFilesCount++;
	}
}

console.log(`Successfully fixed broken links in ${updatedFilesCount} files.`);
