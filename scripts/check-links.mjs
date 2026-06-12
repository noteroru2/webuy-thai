import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.join(__dirname, '../src/content/posts');
const PAGES_DIR = path.join(__dirname, '../src/pages');

// Get all generated slugs
const allMdFiles = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
const validSlugs = new Set();
const allContent = new Map();

for (const file of allMdFiles) {
  const filePath = path.join(POSTS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract slug from frontmatter
  const slugMatch = content.match(/^slug:\s*"([^"]+)"/m);
  if (slugMatch) {
    validSlugs.add(slugMatch[1]);
  } else {
    // If no slug frontmatter, Astro uses filename without extension
    validSlugs.add(file.replace('.md', ''));
  }
  
  allContent.set(file, content);
}

let brokenLinksCount = 0;
let emptyFilesCount = 0;

console.log(`Checking ${allMdFiles.length} files...`);

for (const [file, content] of allContent) {
  // Check for empty content (less than 100 chars means essentially blank)
  if (content.trim().length < 100) {
    console.log(`[BLANK PAGE] ${file} is basically empty (length: ${content.trim().length})`);
    emptyFilesCount++;
  }

  // Extract all markdown links [text](/url)
  // Our internal links look like [text](/posts/slug)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[2];
    
    // We only care about internal /posts/ links for this check
    if (url.startsWith('/posts/')) {
      const targetSlug = url.replace('/posts/', '');
      if (!validSlugs.has(targetSlug)) {
        console.log(`[BROKEN LINK 404] In ${file} -> Link points to non-existent slug: ${targetSlug}`);
        brokenLinksCount++;
      }
    }
  }
}

console.log('\n--- Report ---');
console.log(`Total Files Checked: ${allMdFiles.length}`);
console.log(`Blank Pages Found: ${emptyFilesCount}`);
console.log(`Broken Links (404) Found: ${brokenLinksCount}`);

if (emptyFilesCount === 0 && brokenLinksCount === 0) {
  console.log('✅ ALL CLEAR: No blank pages or broken 404 links found in the content directory.');
}
