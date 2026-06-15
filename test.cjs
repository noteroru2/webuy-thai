const fs=require('fs');
const content=fs.readFileSync('src/content/posts/รับซื้อโน๊ตบุ๊ค-ขอนแก่น.md', 'utf8');
const match=content.match(/^description:\s*(['"])(.*?)\1\s*$/m);
if (match) console.log(match[2].length);
else console.log('no match');
