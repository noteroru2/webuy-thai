import fs from 'node:fs';
import path from 'node:path';

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath, fileList);
    } else if (filePath.endsWith('.md')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const postsDir = path.join(process.cwd(), 'src/content/posts');
const files = walkDir(postsDir);
let modifiedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const frontmatterMatch = content.match(/---\r?\n([\s\S]*?)\r?\n---/);
  
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    
    // Look for description field
    const descRegex = /^description:\s*(['"])(.*?)\1\s*$/m;
    const descMatch = frontmatter.match(descRegex);
    
    if (descMatch) {
      const quote = descMatch[1] || '';
      let desc = descMatch[2];
      // console.log(`Length: ${desc.length}`);
      if (desc.length > 155) {
        let truncated = desc.substring(0, 150);
        // Ensure we don't cut in the middle of a word if possible, though with Thai it's tricky.
        // We will just append ...
        truncated = truncated.trim() + '...';
        
        // Escape quotes if needed
        if (quote === "'" && truncated.includes("'")) {
          truncated = truncated.replace(/'/g, "\\'");
        } else if (quote === '"' && truncated.includes('"')) {
          truncated = truncated.replace(/"/g, '\\"');
        }
        
        // If no quote was used, but it contains special chars, wrap it in quotes
        let newDescLine = `description: ${quote}${truncated}${quote}`;
        if (!quote) {
            newDescLine = `description: "${truncated}"`;
        }
        
        const newFrontmatter = frontmatter.replace(descRegex, newDescLine);
        content = content.replace(frontmatterMatch[1], newFrontmatter);
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
      }
    }
  }
}

console.log(`Truncated descriptions in ${modifiedCount} files.`);
