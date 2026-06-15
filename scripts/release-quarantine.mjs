import fs from 'node:fs';
import path from 'node:path';

const quarantineDir = path.join(process.cwd(), 'src/content/quarantine');
const postsDir = path.join(process.cwd(), 'src/content/posts');

// Read available images
const images = fs.readdirSync(path.join(process.cwd(), 'public/media/notebook-showcase'))
    .filter(f => f.endsWith('.webp'))
    .map(f => `/media/notebook-showcase/${f}`);

const files = fs.readdirSync(quarantineDir).filter(f => f.endsWith('.md'));

let successCount = 0;

for (const file of files) {
  const filePath = path.join(quarantineDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const fmMatch = content.match(/---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) continue;
  
  let fm = fmMatch[1];
  
  // Extract title to generate slug
  const titleMatch = fm.match(/^title:\s*(['"]?)(.*?)\1\s*$/m);
  if (!titleMatch) continue;
  
  const rawTitle = titleMatch[2];
  
  // Clean title for slug
  let slug = rawTitle
      .replace(/["'!?]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase()
      .substring(0, 80); // Truncate slug if too long
      
  // Ensure uniqueish slug by appending the file number
  const fileNum = file.replace('.md', '');
  slug = `${slug}-${fileNum}`;
  
  // Add slug if missing
  if (!fm.includes('slug:')) {
    fm += `\nslug: "${slug}"`;
  }
  
  // Add heroImage if missing
  if (!fm.includes('heroImage:')) {
    const randomImage = images[Math.floor(Math.random() * images.length)];
    fm += `\nheroImage: "${randomImage}"`;
  }
  
  // Add quality fields
  if (!fm.includes('qualityScore:')) fm += `\nqualityScore: 5`;
  if (!fm.includes('qualityFlags:')) fm += `\nqualityFlags: ["spun", "local-seo"]`;
  
  content = content.replace(fmMatch[1], fm);
  
  // Move to posts directory
  const destPath = path.join(postsDir, file);
  fs.writeFileSync(destPath, content, 'utf8');
  
  // Optionally delete original
  fs.unlinkSync(filePath);
  
  successCount++;
}

console.log(`Processed and moved ${successCount} files from quarantine to posts.`);
