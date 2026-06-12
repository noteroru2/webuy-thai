import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = path.join(__dirname, '../src/pages');

// Map of money page files to their keywords and slug prefixes
const moneyPages = {
  'รับซื้อโน๊ตบุ๊ค.astro': { kw: 'รับซื้อโน๊ตบุ๊ค', prefix: 'รับซื้อโน๊ตบุ๊ค' },
  'รับซื้อคอม.astro': { kw: 'รับซื้อคอมพิวเตอร์', prefix: 'รับซื้อคอม' },
  'รับซื้อแมคบุ๊ค.astro': { kw: 'รับซื้อ MacBook', prefix: 'รับซื้อ-macbook' },
  'รับซื้อไอแพด.astro': { kw: 'รับซื้อ iPad', prefix: 'รับซื้อไอแพด' },
  'รับซื้อไอโฟน.astro': { kw: 'รับซื้อ iPhone', prefix: 'รับซื้อไอโฟน' },
  'รับซื้อสมาร์ทโฟน-android.astro': { kw: 'รับซื้อมือถือ', prefix: 'รับซื้อมือถือ' },
  'รับซื้อกล้อง.astro': { kw: 'รับซื้อกล้อง', prefix: 'รับซื้อกล้อง' },
  'รับซื้อ-apple-watch.astro': { kw: 'รับซื้อ Apple Watch', prefix: 'รับซื้อ-apple-watch' },
  'รับซื้อเครื่องเกม.astro': { kw: 'รับซื้อเครื่องเกม', prefix: 'รับซื้อ-ps5' },
  'รับซื้อคอมประกอบ.astro': { kw: 'รับซื้อคอมประกอบ', prefix: 'รับซื้อคอม' },
  'รับซื้อลำโพง.astro': { kw: 'รับซื้อลำโพง', prefix: 'รับซื้อลำโพง' },
  'รับซื้อ.astro': { kw: 'รับซื้อสินค้าไอที', prefix: 'รับซื้อคอม' },
};

for (const [file, config] of Object.entries(moneyPages)) {
  const filePath = path.join(PAGES_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} - not found`);
    continue;
  }

  const baseFileName = file.replace('.astro', '');
  const targetFileName = `${baseFileName}-ใกล้ฉัน.astro`;
  const targetFilePath = path.join(PAGES_DIR, targetFileName);

  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Update const pageUrl
  content = content.replace(/const pageUrl = `\${site}\/([^`]+)\/`;/, `const pageUrl = \`\${site}/${baseFileName}-ใกล้ฉัน/\`;`);

  // 2. Update title block inside JSON-LD
  // Replace: name: 'รับซื้อ...มือสอง ทุกยี่ห้อ ประเมินราคาฟรี'
  content = content.replace(/name: '([^']+)',/g, (match, p1) => {
    if (p1.includes('รับซื้อ')) {
      return `name: '${p1} ใกล้ฉัน บริการรับถึงที่',`;
    }
    return match;
  });
  
  // Replace headline
  content = content.replace(/headline: '([^']+)',/g, (match, p1) => {
    return `headline: '${p1} ใกล้ฉัน ให้ราคาสูง จ่ายเงินสดทันที',`;
  });

  // 3. Update BaseLayout props
  // title={formatPageTitle('รับซื้อโน๊ตบุ๊ค มือสอง ทุกยี่ห้อ')}
  content = content.replace(/title=\{formatPageTitle\('([^']+)'\)\}/, `title={formatPageTitle('หาร้าน$1 ใกล้ฉัน ประเมินฟรี รับถึงที่')}`);
  
  // description="WE BUY รับซื้อ..."
  content = content.replace(/description="([^"]+)"/, `description="หาร้าน$1 ใกล้ฉัน? WE BUY บริการรับซื้อถึงบ้าน จ่ายเงินสดทันที ตีราคาไวใน 15 นาที"`);
  
  // pathname="/รับซื้อโน๊ตบุ๊ค/"
  content = content.replace(/pathname="\/([^"]+)\/"/, `pathname="/${baseFileName}-ใกล้ฉัน/"`);

  // 4. Update H1
  // <h1>รับซื้อโน๊ตบุ๊คมือสอง ประเมินราคาฟรี จ่ายเงินสดทันที</h1>
  content = content.replace(/<h1>([^<]+)<\/h1>/, `<h1>หาร้าน$1 ใกล้ฉัน? เรารับซื้อถึงที่ จ่ายเงินสดทันที</h1>`);

  // 5. Update Keywords in JSON-LD
  content = content.replace(/keywords:\s*'([^']+)',/g, (match, p1) => {
    return `keywords: '${p1}, ${config.kw}ใกล้ฉัน, ร้าน${config.kw}ใกล้บ้าน, รับซื้อถึงที่',`;
  });

  fs.writeFileSync(targetFilePath, content, 'utf8');
  console.log(`[CREATED] ${targetFileName}`);
}

console.log('All Near Me pages generated successfully!');
