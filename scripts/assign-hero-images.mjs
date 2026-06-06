/**
 * assign-hero-images.mjs
 * เพิ่ม heroImage ให้หน้าเงินหลักที่ยังไม่มี — assign ตาม category
 * Run: node scripts/assign-hero-images.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const POSTS_DIR = join(process.cwd(), 'src', 'content', 'posts');

// Map: pattern → heroImage path
const HERO_MAP = [
  { pattern: /iphone/i, images: [
    '/media/apple-local/iphone-orange-duo.webp',
    '/media/apple-local/iphone-dark-front.webp',
    '/media/apple-local/iphone15-black-front.webp',
    '/media/apple-local/iphone-orange-back.webp',
    '/media/apple-local/iphone15-black-back.webp',
    '/media/apple-local/iphone15-black-side.webp',
  ]},
  { pattern: /macbook|imac|mac.mini|mac.studio|mac.pro/i, images: [
    '/media/notebook-showcase/macbook-air-on-box.webp',
    '/media/notebook-showcase/macbook-boot-screen.webp',
  ]},
  { pattern: /ipad/i, images: [
    '/media/apple-local/ipad-mini-silver-back.webp',
  ]},
  { pattern: /โน๊ตบุ๊ค|notebook|laptop/i, images: [
    '/media/notebook-showcase/notebook-lineup-showroom.webp',
    '/media/notebook-showcase/acer-aspire-3-silver.webp',
    '/media/notebook-showcase/asus-vivobook-reddesk.webp',
    '/media/notebook-showcase/asus-tuf-gaming-f15.webp',
    '/media/notebook-showcase/huawei-matebook-dark.webp',
  ]},
  { pattern: /gaming|rog|msi.raider|alienware|razer/i, images: [
    '/media/notebook-showcase/rog-strix-open-front.webp',
    '/media/notebook-showcase/rog-color-keyboard-front.webp',
    '/media/notebook-showcase/rog-strix-neon-open.webp',
  ]},
];

// เลือก image แบบ round-robin จาก category
const counters = new Map();

function pickHero(slug) {
  for (const entry of HERO_MAP) {
    if (entry.pattern.test(slug)) {
      const key = entry.pattern.toString();
      const idx = (counters.get(key) || 0) % entry.images.length;
      counters.set(key, idx + 1);
      return entry.images[idx];
    }
  }
  return null;
}

const files = readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
let assigned = 0;
let skipped = 0;

for (const file of files) {
  const filePath = join(POSTS_DIR, file);
  const raw = readFileSync(filePath, 'utf8');

  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) continue;

  const fm = fmMatch[1];

  // ข้ามถ้ามี heroImage อยู่แล้ว
  if (/^heroImage:/m.test(fm)) { skipped++; continue; }

  // ข้ามถ้า noindex: true
  if (/^noindex:\s*true/m.test(fm)) { skipped++; continue; }

  // ตรวจ slug
  const slugMatch = fm.match(/^slug:\s*"?([^"\n]+)"?\s*$/m);
  const slug = slugMatch ? slugMatch[1].trim() : file.replace('.md', '');

  const hero = pickHero(slug);
  if (!hero) { skipped++; continue; }

  // เพิ่ม heroImage ต่อจาก qualityFlags
  const newFm = fm.replace(
    /^(qualityFlags:.*?)$/m,
    `$1\nheroImage: "${hero}"`,
  );

  if (newFm === fm) { skipped++; continue; }

  const newContent = `---\n${newFm}\n---\n${fmMatch[2]}`;
  writeFileSync(filePath, newContent, 'utf8');
  assigned++;
}

console.log(`Done. Assigned heroImage: ${assigned}, Skipped: ${skipped}`);
