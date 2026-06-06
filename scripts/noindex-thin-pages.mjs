/**
 * noindex-thin-pages.mjs
 * เพิ่ม noindex: true ให้หน้าที่มี qualityScore <= 3
 * (ส่วนใหญ่เป็น legacy WordPress numeric posts)
 * Run: node scripts/noindex-thin-pages.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const POSTS_DIR = join(process.cwd(), 'src', 'content', 'posts');

// slugs ที่สำคัญ ห้าม noindex แม้ qualityScore ต่ำ
const PROTECTED_SLUG_PATTERNS = [
  /^รับซื้อ/, /^รับประมูล/, /^รับเหมา/,
  /iphone|macbook|notebook|ipad|server|cctv|ups/i,
];

function isProtected(slug) {
  return PROTECTED_SLUG_PATTERNS.some(p => p.test(slug));
}

const files = readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
let noindexed = 0;
let skipped = 0;
let alreadyNoindex = 0;

for (const file of files) {
  const filePath = join(POSTS_DIR, file);
  const raw = readFileSync(filePath, 'utf8');

  // normalize line endings
  const normalized = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const fmMatch = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) continue;

  const fm = fmMatch[1];
  const body = fmMatch[2];

  // ตรวจ qualityScore
  const qsMatch = fm.match(/^qualityScore:\s*(\d+)/m);
  if (!qsMatch) continue;

  const qs = parseInt(qsMatch[1], 10);
  if (qs > 3) continue;

  // ตรวจ slug
  const slugMatch = fm.match(/^slug:\s*"?([^"\n]+)"?\s*$/m);
  const slug = slugMatch ? slugMatch[1].trim() : '';

  if (isProtected(slug)) {
    skipped++;
    continue;
  }

  // ตรวจ noindex อยู่แล้วไหม
  if (/^noindex:\s*true/m.test(fm)) {
    alreadyNoindex++;
    continue;
  }

  // เพิ่ม noindex: true หลัง qualityScore
  const newFm = fm.replace(
    /^(qualityScore:\s*\d+.*?)$/m,
    '$1\nnoindex: true',
  );

  const newContent = `---\n${newFm}\n---\n${body}`;
  writeFileSync(filePath, newContent, 'utf8');
  noindexed++;
}

console.log(`Done.`);
console.log(`  noindexed:      ${noindexed}`);
console.log(`  already noindex: ${alreadyNoindex}`);
console.log(`  protected skip:  ${skipped}`);
