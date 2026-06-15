import fs from 'fs';
import path from 'path';

const postsDir = path.join(process.cwd(), 'src/content/posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

let updatedCount = 0;

for (const file of files) {
	const filePath = path.join(postsDir, file);
	let content = fs.readFileSync(filePath, 'utf8');

	// Skip if it already has heroImage
	if (content.includes('heroImage:')) {
		continue;
	}

	const lowerName = file.toLowerCase();
	let imagePath = '/media/category/generic_desktop_pc_1781509169636.png'; // default

	if (lowerName.includes('ไอแพด') || lowerName.includes('ipad')) {
		imagePath = '/media/apple-local/ipad-mini-silver-back.webp';
	} else if (lowerName.includes('ไอโฟน') || lowerName.includes('iphone')) {
		imagePath = '/media/apple-local/iphone15-black-back.webp';
	} else if (lowerName.includes('แมคบุ๊ค') || lowerName.includes('macbook') || lowerName.includes('imac')) {
		imagePath = '/media/notebook-showcase/macbook-boot-screen.webp';
	} else if (lowerName.includes('โน๊ตบุ๊ค') || lowerName.includes('notebook')) {
		imagePath = '/media/notebook-showcase/asus-tuf-gaming-f15.webp';
	} else if (lowerName.includes('กล้อง') || lowerName.includes('camera')) {
		imagePath = '/media/category/generic_camera_1781509181019.png';
	} else if (lowerName.includes('ลำโพง') || lowerName.includes('speaker')) {
		imagePath = '/media/category/generic_speaker_1781509193481.png';
	} else if (lowerName.includes('เกม') || lowerName.includes('game')) {
		imagePath = '/media/category/generic_game_console_1781509207514.png';
	} else if (lowerName.includes('server') || lowerName.includes('ups')) {
		imagePath = '/media/category/generic_server_1781509220904.png';
	} else if (lowerName.includes('คอม') || lowerName.includes('pc')) {
		imagePath = '/media/category/generic_desktop_pc_1781509169636.png';
	}

	// We need to inject heroImage into the frontmatter.
	// Best place is right after `updatedDate:` or `slug:`.
	// We'll replace the first `slug: "..."` with `slug: "..."\nheroImage: "..."`
	
	const slugMatch = content.match(/^slug:\s*".*?"/m);
	if (slugMatch) {
		content = content.replace(slugMatch[0], `${slugMatch[0]}\nheroImage: "${imagePath}"`);
		fs.writeFileSync(filePath, content, 'utf8');
		updatedCount++;
	} else {
		// Fallback: put it after title
		const titleMatch = content.match(/^title:\s*".*?"/m);
		if (titleMatch) {
			content = content.replace(titleMatch[0], `${titleMatch[0]}\nheroImage: "${imagePath}"`);
			fs.writeFileSync(filePath, content, 'utf8');
			updatedCount++;
		}
	}
}

console.log(`Successfully injected heroImage to ${updatedCount} files.`);
