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
  'รับซื้อเครื่องเกม.astro': { kw: 'รับซื้อเครื่องเกม', prefix: 'รับซื้อ-ps5' }, // Mapping to most popular
  'รับซื้อคอมประกอบ.astro': { kw: 'รับซื้อคอมประกอบ', prefix: 'รับซื้อคอม' },
  'รับซื้อลำโพง.astro': { kw: 'รับซื้อลำโพง', prefix: 'รับซื้อลำโพง' },
  'รับซื้อ.astro': { kw: 'รับซื้อสินค้าไอที', prefix: 'รับซื้อคอม' }, // generic hub
};

for (const [file, config] of Object.entries(moneyPages)) {
  const filePath = path.join(PAGES_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} - not found`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Check if already upgraded
  if (content.includes('TrustBadges')) {
    console.log(`[ALREADY UPGRADED] ${file}`);
    continue;
  }

  // 1. Inject imports at the top (right before --- block ends)
  const importStatement = `
import TrustBadges from '../components/money-pages/TrustBadges.astro';
import StepCards from '../components/money-pages/StepCards.astro';
import ComparisonTable from '../components/money-pages/ComparisonTable.astro';
import DataPrivacyBlock from '../components/money-pages/DataPrivacyBlock.astro';
import ProvincialGrid from '../components/money-pages/ProvincialGrid.astro';
---`;
  content = content.replace(/---\s*<BaseLayout/m, `${importStatement}\n\n<BaseLayout`);
  // If the above replace didn't work (maybe empty lines), try replacing the last `---`
  if (!content.includes('TrustBadges')) {
      const parts = content.split('---');
      if (parts.length >= 3) {
          parts[2] = `\nimport TrustBadges from '../components/money-pages/TrustBadges.astro';\nimport StepCards from '../components/money-pages/StepCards.astro';\nimport ComparisonTable from '../components/money-pages/ComparisonTable.astro';\nimport DataPrivacyBlock from '../components/money-pages/DataPrivacyBlock.astro';\nimport ProvincialGrid from '../components/money-pages/ProvincialGrid.astro';\n---` + parts.slice(2).join('---');
          content = parts[0] + '---' + parts[1] + parts[2];
      }
  }

  // 2. Inject components into body by finding H2 tags
  // The first H2 usually gets TrustBadges before it
  let h2Count = 0;
  content = content.replace(/<h2([^>]*)>(.*?)<\/h2>/g, (match, attrs, text) => {
    h2Count++;
    if (h2Count === 1) {
      return `\n\t\t\t<TrustBadges className="mb-12 mt-8" />\n\t\t\t${match}`;
    }
    if (h2Count === 3) { // Usually around the "easy steps" or "middle" section
      return `\n\t\t\t<ComparisonTable />\n\t\t\t<StepCards />\n\t\t\t${match}`;
    }
    if (h2Count === 4) { // Usually towards the end
        return `\n\t\t\t<DataPrivacyBlock />\n\t\t\t${match}`;
    }
    return match;
  });

  // 3. Inject ProvincialGrid right before </section>
  const gridComponent = `\n\t\t\t<ProvincialGrid keyword="${config.kw}" slugPrefix="${config.prefix}" />\n\t\t</section>`;
  content = content.replace(/<\/section>/, gridComponent);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[UPGRADED] ${file}`);
}

console.log('All money pages upgraded successfully!');
