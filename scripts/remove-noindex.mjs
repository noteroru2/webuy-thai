import fs from 'node:fs';
import path from 'node:path';

const postsDir = path.join(process.cwd(), 'src/content/posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

let modifiedCount = 0;

for (const file of files) {
  const filePath = path.join(postsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const fmMatch = content.match(/---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) continue;
  
  let fm = fmMatch[1];
  
  if (fm.includes('noindex: true')) {
    fm = fm.replace(/^noindex:\s*true\r?\n/m, '');
    fm = fm.replace(/^quarantineReason:.*?\r?\n/m, '');
    
    content = content.replace(fmMatch[1], fm);
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedCount++;
  }
}

console.log(`Removed noindex from ${modifiedCount} files.`);
