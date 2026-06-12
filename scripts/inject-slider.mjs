import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = path.join(__dirname, '../src/pages');

const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.astro') && (f.startsWith('รับซื้อ') || f.startsWith('rab-sue')));

for (const file of files) {
    const filePath = path.join(PAGES_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already injected
    if (content.includes('RecentTradesSlider')) {
        continue;
    }

    // Only inject if the page has TrustBadges (which means it's a money page)
    if (!content.includes('TrustBadges')) {
        continue;
    }

    // 1. Inject import statement
    const importStatement = `import RecentTradesSlider from '../components/money-pages/RecentTradesSlider.astro';\n`;
    content = content.replace(/import TrustBadges from '\.\.\/components\/money-pages\/TrustBadges\.astro';/, `${importStatement}import TrustBadges from '../components/money-pages/TrustBadges.astro';`);

    // 2. Inject component after TrustBadges
    content = content.replace(/<TrustBadges([^>]*)>/, `<TrustBadges$1>\n\t\t\t<RecentTradesSlider />`);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[INJECTED SLIDER] ${file}`);
}

console.log('Slider injected successfully into all money pages!');
