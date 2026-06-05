/**
 * generate-phase2-pages.mjs
 * สร้าง local/money/hub pages รอบ 2 ที่ยังขาด
 * node scripts/generate-phase2-pages.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.join(__dirname, '../src/content/posts');

const TODAY = '2026-06-05';

function md(slug, title, description, body, faqs = [], heroImage = '') {
  const faqYaml = faqs.map(f =>
    `  - question: "${f.q.replace(/"/g, "'")}"\n    answer: "${f.a.replace(/"/g, "'")}"`
  ).join('\n');
  const hero = heroImage ? `\nheroImage: "${heroImage}"` : '';
  return `---
title: "${title}"
description: "${description}"
pubDate: "${TODAY}"
updatedDate: "${TODAY}"
slug: "${slug}"
qualityScore: 8
qualityFlags: []${hero}
faqItems:
${faqYaml}
---

${body}
`;
}

const pages = [];

// ════════════════════════════════════════════════
// SECTION A — LOCAL PAGES ภาคเหนือ
// ════════════════════════════════════════════════

const northProvinces = [
  { th: 'เชียงใหม่', en: 'chiang-mai', desc: 'จังหวัดหลักภาคเหนือ ศูนย์กลางธุรกิจและมหาวิทยาลัยชั้นนำ', area: 'ภาคเหนือ', region: 'เชียงใหม่และจังหวัดใกล้เคียง' },
  { th: 'เชียงราย', en: 'chiang-rai', desc: 'จังหวัดเหนือสุดของไทย มีนักศึกษาและชาวต่างชาติอาศัยอยู่มาก', area: 'ภาคเหนือ', region: 'เชียงรายและจังหวัดใกล้เคียง' },
  { th: 'พิษณุโลก', en: 'phitsanulok', desc: 'ศูนย์กลางภาคเหนือตอนล่าง มีมหาวิทยาลัยนเรศวรและแหล่งธุรกิจขนาดใหญ่', area: 'ภาคเหนือ', region: 'พิษณุโลกและจังหวัดใกล้เคียง' },
  { th: 'ลำปาง', en: 'lampang', desc: 'จังหวัดภาคเหนือ มีประชากรที่ใช้อุปกรณ์ Apple สูงขึ้นต่อเนื่อง', area: 'ภาคเหนือ', region: 'ลำปางและจังหวัดใกล้เคียง' },
];

for (const p of northProvinces) {
  // iPhone
  pages.push(md(
    `รับซื้อ-iphone-${p.th}`,
    `รับซื้อ iPhone ${p.th} มือสอง — ประเมินราคาตามสุขภาพแบต จ่ายทันที`,
    `WE BUY รับซื้อ iPhone มือสองใน${p.th} ทุกรุ่นตั้งแต่ iPhone 11 ถึงรุ่นล่าสุด ประเมินราคาตามสุขภาพแบตและสภาพจริง จ่ายเงินสดทันที บริการตลอด 24 ชม.`,
    `**รับซื้อ iPhone ${p.th}** — หากคุณอยู่ใน${p.th}และ${p.region}กำลังมองหาที่รับซื้อ iPhone มือสองที่จ่ายราคาดีและโปร่งใส WE BUY คือคำตอบ เราประเมินราคาตามสุขภาพแบตเตอรี่จริง จ่ายเงินทันทีเมื่อตกลงราคา

## ทำไม iPhone ใน${p.th}ขายกับเราดีกว่า

- **ราคาตามสุขภาพแบตจริง** ไม่หักแบบมั่วหรือเอาเปรียบ
- **ประเมินผ่าน Line @webuy** ก่อนนัดรับ ประหยัดเวลาเดินทาง
- **จ่ายเงินสดหรือโอนทันที** เมื่อตกลงราคาและตรวจสภาพ
- **รับทุกรุ่นและทุกสภาพ** ทั้งจอแตก แบตเสื่อม หรืออุปกรณ์ไม่ครบ

## iPhone รุ่นไหนขายได้บ้างใน${p.th}

รับซื้อ iPhone ทุกรุ่นที่ยังมีตลาดรองรับ ตั้งแต่ iPhone 11 Series ขึ้นไปถึงรุ่น 16 Series รวมถึง iPhone SE รุ่นต่าง ๆ โดยราคาขึ้นอยู่กับรุ่น ความจุ สีและสภาพจอ ความสวยของบอดี้ และสุขภาพแบตเตอรี่

## ขั้นตอนขาย iPhone ใน${p.th}

1. ถ่ายรูปหน้าจอ About → Battery → Battery Health
2. ส่งรูปพร้อมรุ่นและความจุมาทาง Line @webuy
3. รับราคาประเมินเบื้องต้นภายใน 15-30 นาที
4. ตกลงราคา นัดรับในพื้นที่${p.th}หรือส่งพัสดุ
5. รับเงินทันทีหลังตรวจสภาพ

## ราคารับซื้อ iPhone อ้างอิง (${p.th})

| รุ่น | ช่วงราคา |
|------|---------|
| iPhone 16 Pro Max | 25,000–38,000 บาท |
| iPhone 16 / 16 Plus | 18,000–28,000 บาท |
| iPhone 15 Pro Max | 20,000–30,000 บาท |
| iPhone 15 / 15 Plus | 14,000–22,000 บาท |
| iPhone 14 Series | 10,000–18,000 บาท |
| iPhone 13 Series | 7,000–14,000 บาท |
| iPhone 12 Series | 4,500–9,000 บาท |
| iPhone 11 Series | 3,000–6,000 บาท |

*ราคาจริงขึ้นอยู่กับสุขภาพแบต ความจุ และสภาพจริงของเครื่อง*

ติดต่อประเมินราคาฟรีผ่าน [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
    [
      { q: `รับซื้อ iPhone ใน${p.th}ทุกรุ่นไหม?`, a: `รับซื้อครับ ตั้งแต่ iPhone 11 จนถึงรุ่นล่าสุด iPhone 16 Series รวมถึง iPhone SE ทุกรุ่น สามารถส่งรูปมาประเมินราคาผ่าน Line @webuy ได้เลยโดยไม่ต้องเดินทาง` },
      { q: 'iPhone จอแตกหรือแบตเสื่อมรับไหม?', a: 'รับครับ เพียงแต่ราคาจะปรับตามสภาพจริง แนะนำแจ้งปัญหาตั้งแต่ต้นเพื่อให้ประเมินราคาได้แม่นยำและไม่มีการปรับราคาหน้างาน' },
      { q: `อยู่${p.th}ส่งพัสดุขายได้ไหม?`, a: 'ได้ครับ ประเมินราคาผ่าน Line ก่อน ตกลงราคาแล้วส่งพัสดุมา เมื่อรับเครื่องและตรวจสภาพเสร็จจะโอนเงินให้ทันที พร้อมแนะนำวิธีแพ็กเครื่องให้ปลอดภัย' },
      { q: 'ต้องปลด Apple ID ก่อนขายไหม?', a: 'ต้องครับ เพราะหากยังติด Activation Lock เจ้าของใหม่จะใช้งานไม่ได้ ทีมงานจะช่วยแนะนำขั้นตอนการปลดให้ฟรี' },
    ]
  ));

  // MacBook
  pages.push(md(
    `รับซื้อ-macbook-${p.th}`,
    `รับซื้อ MacBook ${p.th} มือสอง — ทุกรุ่น Intel และ M Series ราคาดี`,
    `WE BUY รับซื้อ MacBook มือสองใน${p.th} ทั้ง MacBook Air และ Pro ทุกรุ่น ชิป Intel และ M1-M4 ประเมินราคาตามรอบชาร์จและสเปก จ่ายเงินทันที บริการตลอด 24 ชม.`,
    `**รับซื้อ MacBook ${p.th}** — WE BUY รับซื้อ MacBook มือสองครอบคลุม${p.th}และ${p.region} ทั้ง MacBook Air และ MacBook Pro ทุกรุ่นและทุกสภาพ ประเมินราคาโปร่งใสตามสเปกจริงและรอบชาร์จ

## ราคารับซื้อ MacBook อ้างอิง (${p.th})

| รุ่น | ช่วงราคา |
|------|---------|
| MacBook Pro M3/M4 (14"/16") | 35,000–75,000 บาท |
| MacBook Pro M1/M2 Pro/Max | 22,000–50,000 บาท |
| MacBook Air M2/M3 | 15,000–32,000 บาท |
| MacBook Air M1 | 10,000–16,000 บาท |
| MacBook Pro/Air Intel (2017-2020) | 4,000–11,000 บาท |

## เหตุผลที่ควรขาย MacBook กับเราใน${p.th}

- **ประเมินราคาตามรอบชาร์จจริง** ไม่มีค่าใช้จ่ายซ่อนเร้น
- **รับทุกสภาพ** แม้จอลอก แบตเสื่อม คีย์บอร์ดมีปัญหา
- **ไม่ต้องเดินทางไกล** ประเมินผ่าน Line และส่งพัสดุได้
- **จ่ายเงินสดหรือโอนทันที** ภายในวันเดียวกัน

## วิธีเตรียม MacBook ก่อนขายใน${p.th}

1. เช็กรอบชาร์จ: Apple Menu → About This Mac → More Info → System Report → Power
2. ออกจาก Apple ID และปิด Find My Mac
3. สำรองข้อมูลสำคัญก่อน
4. ส่งรูป About This Mac และสภาพเครื่องมาทาง Line @webuy

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
    [
      { q: `รับซื้อ MacBook ใน${p.th}ทุกรุ่นไหม?`, a: `รับครับ ทั้ง MacBook Air และ MacBook Pro ทุกรุ่น ตั้งแต่ชิป Intel ไปจนถึง Apple Silicon M1–M4 สามารถส่งรูป About This Mac มาประเมินราคาได้ทาง Line @webuy ได้เลย` },
      { q: 'รอบชาร์จเยอะมีผลต่อราคาแค่ไหน?', a: 'มีผลครับ โดยทั่วไปเกิน 500 รอบจะเริ่มปรับราคา แต่เราอธิบายเหตุผลทุกขั้นตอนอย่างโปร่งใส ไม่มีค่าหักแบบมั่ว' },
      { q: `อยู่${p.th}ส่งพัสดุขายได้ไหม?`, a: 'ได้ครับ ประเมินราคาผ่าน Line ก่อน เมื่อตกลงราคาส่งพัสดุมาได้เลย ทีมงานจะตรวจสภาพและโอนเงินให้ทันที' },
    ]
  ));

  // Notebook (only for เชียงใหม่, เชียงราย, พิษณุโลก)
  if (['เชียงใหม่', 'เชียงราย', 'พิษณุโลก'].includes(p.th)) {
    pages.push(md(
      `รับซื้อโน๊ตบุ๊ค-${p.th}`,
      `รับซื้อโน๊ตบุ๊ค ${p.th} มือสอง — ทุกยี่ห้อ ทุกสภาพ จ่ายเงินทันที`,
      `WE BUY รับซื้อโน๊ตบุ๊คมือสองใน${p.th} ทุกยี่ห้อ ASUS, Lenovo, Dell, HP, Acer รับทั้งสภาพดีและมีปัญหา ประเมินราคาฟรีผ่าน Line @webuy`,
      `**รับซื้อโน๊ตบุ๊ค ${p.th}** — ขายโน๊ตบุ๊คมือสองใน${p.th}ได้สะดวก WE BUY รับซื้อทุกยี่ห้อและทุกสภาพ

## โน๊ตบุ๊คที่รับซื้อใน${p.th}

- **Gaming Notebook** ASUS ROG, MSI, Lenovo Legion, ACER Nitro
- **Business Notebook** Dell Latitude, HP EliteBook, Lenovo ThinkPad
- **Consumer Notebook** ASUS VivoBook, Lenovo IdeaPad, HP Pavilion, Acer Aspire
- **Ultrabook / MacBook** ทุกรุ่น ทุกยี่ห้อ

## ราคารับซื้อโน๊ตบุ๊คอ้างอิง (${p.th})

| สเปก | ช่วงราคา |
|------|---------|
| Gaming i7/Ryzen 7 + RTX | 8,000–25,000 บาท |
| Ultrabook Core i5/i7 Gen 10+ | 4,000–12,000 บาท |
| Business Notebook | 3,000–10,000 บาท |
| Notebook ทั่วไป | 1,500–6,000 บาท |

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
      [
        { q: `รับซื้อโน๊ตบุ๊คใน${p.th}ทุกยี่ห้อไหม?`, a: `รับครับ ทุกยี่ห้อ ทั้ง ASUS Lenovo Dell HP Acer และยี่ห้ออื่น ๆ รวมถึง MacBook รับทั้งสภาพดีและมีปัญหา ส่งรูปมาประเมินราคาผ่าน Line @webuy ได้เลย` },
        { q: 'โน๊ตบุ๊คจอแตกรับไหม?', a: 'รับครับ แต่ราคาจะปรับลงตามค่าซ่อมจอ แนะนำแจ้งอาการตั้งแต่ต้นเพื่อให้ประเมินได้แม่นยำ' },
      ]
    ));
  }

  // iPad (เชียงใหม่ only)
  if (p.th === 'เชียงใหม่') {
    pages.push(md(
      `รับซื้อ-ipad-เชียงใหม่`,
      `รับซื้อ iPad เชียงใหม่ มือสอง — iPad Pro/Air/mini ทุกรุ่น จ่ายทันที`,
      `WE BUY รับซื้อ iPad มือสองในเชียงใหม่ ทั้ง iPad Pro, Air, mini และ iPad Gen ทุกรุ่น ทั้ง Wi-Fi และใส่ซิม ประเมินราคาฟรีผ่าน Line @webuy บริการตลอด 24 ชม.`,
      `**รับซื้อ iPad เชียงใหม่** — WE BUY รับซื้อ iPad มือสองในเชียงใหม่และจังหวัดใกล้เคียง ครอบคลุมทุกรุ่นและทุกสภาพ

## iPad รุ่นที่รับซื้อในเชียงใหม่

- **iPad Pro** 11" และ 12.9" ทุกรุ่น ทุกชิป
- **iPad Air** M1, M2 และรุ่นก่อนหน้า
- **iPad mini** ทุกรุ่นรวมถึง mini 6/7
- **iPad Gen** (iPad ทั่วไป) Gen 9, 10 และรุ่นเก่า

## ราคารับซื้อ iPad อ้างอิง (เชียงใหม่)

| รุ่น | ช่วงราคา |
|------|---------|
| iPad Pro M4 / M2 | 15,000–45,000 บาท |
| iPad Air M2 / M1 | 10,000–22,000 บาท |
| iPad mini 6/7 | 8,000–15,000 บาท |
| iPad Gen 10 | 6,000–12,000 บาท |
| iPad รุ่นเก่า | 2,000–8,000 บาท |

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
      [
        { q: 'รับซื้อ iPad เชียงใหม่ทุกรุ่นไหม?', a: 'รับครับ ทั้ง iPad Pro, Air, mini และ iPad Gen ทุกรุ่น ทั้งแบบ Wi-Fi Only และใส่ซิม ส่งรูปมาประเมินราคาผ่าน Line @webuy ได้เลย' },
        { q: 'iPad ติด iCloud รับไหม?', a: 'ต้องปลด iCloud ก่อนครับ เพราะหากยังติด Activation Lock จะส่งผลต่อราคาอย่างมาก ทีมงานช่วยแนะนำขั้นตอนการปลดได้' },
      ]
    ));

    // คอม เชียงใหม่
    pages.push(md(
      `รับซื้อคอม-เชียงใหม่`,
      `รับซื้อคอมพิวเตอร์เชียงใหม่ มือสอง — PC, All-in-One, Workstation จ่ายทันที`,
      `WE BUY รับซื้อคอมพิวเตอร์มือสองในเชียงใหม่ PC ประกอบ All-in-One Workstation รับทุกสเปก ทุกสภาพ ประเมินราคาฟรีผ่าน Line @webuy บริการตลอด 24 ชม.`,
      `**รับซื้อคอมพิวเตอร์เชียงใหม่** — WE BUY รับซื้อคอมพิวเตอร์มือสองในเชียงใหม่ครอบคลุมทุกประเภท

## คอมพิวเตอร์ที่รับซื้อในเชียงใหม่

- **PC ประกอบ** ทุกสเปก ตั้งแต่สำนักงานถึง Gaming PC
- **All-in-One** Dell, HP, ASUS, Lenovo
- **Workstation** สเปกสูง RAM มาก CPU แรง
- **คอมสำนักงาน** แบรนด์เนม OEM ทุกยี่ห้อ

## ราคารับซื้อคอมอ้างอิง (เชียงใหม่)

| สเปก | ช่วงราคา |
|------|---------|
| Gaming PC RTX 3080+ | 15,000–35,000 บาท |
| Workstation Xeon/Threadripper | 8,000–25,000 บาท |
| PC ประกอบทั่วไป | 2,000–12,000 บาท |
| All-in-One | 3,000–15,000 บาท |

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
      [
        { q: 'รับซื้อคอมเชียงใหม่ทุกสเปกไหม?', a: 'รับครับ ทุกสเปกและทุกประเภท ทั้ง PC ประกอบ, All-in-One, Workstation และคอมสำนักงาน รับทั้งทำงานได้ปกติและเสีย ส่งรูปมาประเมินราคาผ่าน Line @webuy ได้เลย' },
        { q: 'คอมเก่ามากรับไหม?', a: 'รับครับ แม้แต่คอมเก่าที่เปิดไม่ติดหรือชิ้นส่วนไม่ครบ เราประเมินตามสภาพจริงและแจ้งราคาอย่างโปร่งใส' },
      ]
    ));
  }
}

// ════════════════════════════════════════════════
// SECTION B — LOCAL PAGES ภาคใต้
// ════════════════════════════════════════════════

const southData = [
  { th: 'หาดใหญ่', en: 'hat-yai', province: 'สงขลา', extra: ['ipad', 'notebook'] },
  { th: 'สงขลา', en: 'songkhla', province: 'สงขลา', extra: [] },
  { th: 'ภูเก็ต', en: 'phuket', province: 'ภูเก็ต', extra: ['notebook'] },
  { th: 'สุราษฎร์ธานี', en: 'surat-thani', province: 'สุราษฎร์ธานี', extra: [] },
  { th: 'นครศรีธรรมราช', en: 'nakhon-si-thammarat', province: 'นครศรีธรรมราช', extra: [] },
];

for (const p of southData) {
  const region = p.th === 'หาดใหญ่' ? 'หาดใหญ่และอำเภอต่าง ๆ ในสงขลา' : `${p.th}และจังหวัดใกล้เคียงในภาคใต้`;

  // iPhone
  pages.push(md(
    `รับซื้อ-iphone-${p.th}`,
    `รับซื้อ iPhone ${p.th} มือสอง — ทุกรุ่น จ่ายเงินสดทันที บริการตลอด 24 ชม.`,
    `WE BUY รับซื้อ iPhone มือสองใน${p.th} ทุกรุ่นตั้งแต่ iPhone 11 ถึงรุ่นล่าสุด ประเมินราคาตามสุขภาพแบตจริง จ่ายเงินทันที ส่งพัสดุได้จากทุกที่ในภาคใต้`,
    `**รับซื้อ iPhone ${p.th}** — WE BUY รับซื้อ iPhone มือสองใน${p.th}และ${region} ราคาดีสุดในตลาด

## บริการรับซื้อ iPhone ใน${p.th}

WE BUY ให้บริการรับซื้อ iPhone มือสองครอบคลุมพื้นที่${p.th}และ${region} สามารถประเมินราคาผ่าน Line @webuy ก่อนได้ เมื่อตกลงราคาแล้วส่งพัสดุมา หรือนัดรับในพื้นที่

## ราคารับซื้อ iPhone อ้างอิง (${p.th})

| รุ่น | ช่วงราคา |
|------|---------|
| iPhone 16 Pro Max | 25,000–38,000 บาท |
| iPhone 16 / 16 Plus | 18,000–28,000 บาท |
| iPhone 15 Pro Max | 20,000–30,000 บาท |
| iPhone 15 / 15 Plus | 14,000–22,000 บาท |
| iPhone 14 Series | 10,000–18,000 บาท |
| iPhone 13 Series | 7,000–14,000 บาท |
| iPhone 12 Series | 4,500–9,000 บาท |

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
    [
      { q: `รับซื้อ iPhone ใน${p.th}ทุกรุ่นไหม?`, a: `รับครับ ตั้งแต่ iPhone 11 จนถึงรุ่นล่าสุด iPhone 16 Series ส่งรูปมาประเมินราคาผ่าน Line @webuy ได้เลย` },
      { q: `อยู่${p.th}ส่งพัสดุขายได้ไหม?`, a: 'ได้ครับ ประเมินราคาก่อนผ่าน Line แล้วส่งพัสดุมาได้เลย โอนเงินให้ทันทีเมื่อตรวจสภาพเสร็จ' },
    ]
  ));

  // MacBook
  pages.push(md(
    `รับซื้อ-macbook-${p.th}`,
    `รับซื้อ MacBook ${p.th} มือสอง — Air/Pro ทุกรุ่น ราคาดี จ่ายทันที`,
    `WE BUY รับซื้อ MacBook มือสองใน${p.th} ทั้ง MacBook Air และ Pro ชิป Intel และ M1-M4 ประเมินราคาตามรอบชาร์จและสเปก จ่ายเงินทันที บริการตลอด 24 ชม.`,
    `**รับซื้อ MacBook ${p.th}** — WE BUY รับซื้อ MacBook มือสองใน${p.th}และ${region}

## MacBook ที่รับซื้อใน${p.th}

รับซื้อ MacBook ทุกรุ่น:
- **MacBook Air** M1, M2, M3 และรุ่นชิป Intel
- **MacBook Pro** 13", 14", 16" ทุกชิป M1–M4 และ Intel
- **รับทุกสภาพ** แม้แบตเสื่อม จอมีรอย หรืออุปกรณ์ไม่ครบ

## ราคารับซื้อ MacBook อ้างอิง (${p.th})

| รุ่น | ช่วงราคา |
|------|---------|
| MacBook Pro M3/M4 | 35,000–75,000 บาท |
| MacBook Air M2/M3 | 15,000–32,000 บาท |
| MacBook Air M1 | 10,000–16,000 บาท |
| MacBook Intel (2017-2020) | 4,000–11,000 บาท |

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
    [
      { q: `รับซื้อ MacBook ใน${p.th}ไหม?`, a: `รับครับ ทั้ง MacBook Air และ MacBook Pro ทุกรุ่น ส่งรูป About This Mac มาประเมินราคาผ่าน Line @webuy ได้เลย` },
      { q: `ส่งพัสดุจาก${p.th}ได้ไหม?`, a: 'ได้ครับ ประเมินราคาก่อนผ่าน Line แล้วส่งพัสดุมาได้เลย โอนเงินให้ทันทีเมื่อตรวจสภาพเสร็จ' },
    ]
  ));

  // Extra pages
  if (p.extra.includes('notebook')) {
    pages.push(md(
      `รับซื้อโน๊ตบุ๊ค-${p.th}`,
      `รับซื้อโน๊ตบุ๊ค ${p.th} มือสอง — ทุกยี่ห้อ ราคาดี จ่ายทันที`,
      `WE BUY รับซื้อโน๊ตบุ๊คมือสองใน${p.th} ทุกยี่ห้อ ASUS Lenovo Dell HP Acer และ MacBook รับทุกสภาพ ประเมินราคาฟรีผ่าน Line @webuy`,
      `**รับซื้อโน๊ตบุ๊ค ${p.th}** — WE BUY รับซื้อโน๊ตบุ๊คมือสองใน${p.th}ทุกยี่ห้อ ทั้ง Gaming Notebook, Ultrabook และ Business Notebook

## โน๊ตบุ๊คที่รับซื้อใน${p.th}

รับซื้อทุกยี่ห้อ: ASUS, Lenovo, Dell, HP, Acer, MSI, Razer, Samsung และยี่ห้ออื่น ๆ รวมถึง MacBook ทุกรุ่น

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
      [{ q: `รับซื้อโน๊ตบุ๊คใน${p.th}ทุกยี่ห้อไหม?`, a: `รับครับ ทุกยี่ห้อและทุกสภาพ ส่งรูปมาประเมินราคาผ่าน Line @webuy ได้เลย` }]
    ));
  }

  if (p.extra.includes('ipad')) {
    pages.push(md(
      `รับซื้อ-ipad-${p.th}`,
      `รับซื้อ iPad ${p.th} มือสอง — Pro/Air/mini ทุกรุ่น ราคาดี จ่ายทันที`,
      `WE BUY รับซื้อ iPad มือสองใน${p.th} ทั้ง iPad Pro Air mini และ iPad Gen ทุกรุ่น ทั้ง Wi-Fi และใส่ซิม ประเมินราคาฟรีผ่าน Line @webuy`,
      `**รับซื้อ iPad ${p.th}** — WE BUY รับซื้อ iPad มือสองใน${p.th}ครอบคลุมทุกรุ่น

รับซื้อ iPad Pro, iPad Air, iPad mini และ iPad Gen ทุกรุ่น ทั้งแบบ Wi-Fi Only และ Cellular ที่ใส่ซิมได้

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
      [{ q: `รับซื้อ iPad ใน${p.th}ทุกรุ่นไหม?`, a: `รับครับ ทั้ง iPad Pro Air mini และ iPad Gen ทุกรุ่น ส่งรูปมาประเมินราคาผ่าน Line @webuy ได้เลย` }]
    ));
  }
}

// ════════════════════════════════════════════════
// SECTION C — LOCAL PAGES ภาคกลาง
// ════════════════════════════════════════════════

// กรุงเทพ districts — iPhone & MacBook
const bkkDistricts = [
  { th: 'ลาดพร้าว', note: 'แหล่งชุมชนหนาแน่นและตลาดไอทีใกล้รังสิต' },
  { th: 'จตุจักร', note: 'พื้นที่ธุรกิจและนักศึกษา ใกล้เขต Vibhavadi' },
  { th: 'ห้วยขวาง', note: 'ย่านธุรกิจกลางกรุงเทพฯ ติดรัชดาและMRT' },
  { th: 'พระโขนง', note: 'แหล่งชุมชนและออฟฟิศฝั่งสุขุมวิทตอนปลาย' },
  { th: 'วังทองหลาง', note: 'เขตที่อยู่อาศัยชั้นกลาง ใกล้รามคำแหง' },
];

for (const d of bkkDistricts) {
  // iPhone ต่อเขต
  pages.push(md(
    `รับซื้อ-iphone-${d.th}`,
    `รับซื้อ iPhone ${d.th} กรุงเทพฯ มือสอง — ประเมินราคาไว จ่ายทันที`,
    `WE BUY รับซื้อ iPhone มือสองในเขต${d.th} กรุงเทพฯ ทุกรุ่น ประเมินราคาตามสุขภาพแบตจริง จ่ายเงินสดทันที นัดรับในพื้นที่หรือส่งพัสดุ บริการตลอด 24 ชม.`,
    `**รับซื้อ iPhone ${d.th}** — WE BUY รับซื้อ iPhone มือสองในเขต${d.th} กรุงเทพฯ — ${d.note}

## ทำไมต้องขาย iPhone ในเขต${d.th}กับ WE BUY

- **ประเมินราคาไว** ส่งรูปมาทาง Line @webuy รู้ราคาใน 15-30 นาที
- **นัดรับในเขต${d.th}ได้เลย** หรือส่งพัสดุก็ได้
- **จ่ายเงินสดหรือโอนทันที** เมื่อตรวจสภาพเสร็จ
- **รับทุกรุ่น ทุกสภาพ** ทั้ง iPhone ปกติและมีปัญหา

## ราคารับซื้อ iPhone อ้างอิง (${d.th})

| รุ่น | ช่วงราคา |
|------|---------|
| iPhone 16 Pro Max | 25,000–38,000 บาท |
| iPhone 16 Series | 18,000–28,000 บาท |
| iPhone 15 Pro Max | 20,000–30,000 บาท |
| iPhone 15 Series | 14,000–22,000 บาท |
| iPhone 14 Series | 10,000–18,000 บาท |
| iPhone 13 Series | 7,000–14,000 บาท |

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
    [
      { q: `รับซื้อ iPhone เขต${d.th}ไหม?`, a: `รับครับ ทุกรุ่น ทุกสภาพ นัดรับในเขต${d.th}ได้เลย หรือส่งรูปมาประเมินราคาผ่าน Line @webuy ก่อนก็ได้` },
      { q: `นัดรับ iPhone เขต${d.th}ได้ไหม?`, a: `ได้ครับ สามารถนัดรับในพื้นที่เขต${d.th}และเขตใกล้เคียงได้ ทักแจ้งพิกัดมาทาง Line @webuy` },
    ]
  ));

  // MacBook ต่อเขต
  pages.push(md(
    `รับซื้อ-macbook-${d.th}`,
    `รับซื้อ MacBook ${d.th} กรุงเทพฯ มือสอง — ทุกรุ่น ราคาดี นัดรับได้เลย`,
    `WE BUY รับซื้อ MacBook มือสองในเขต${d.th} กรุงเทพฯ ทั้ง MacBook Air และ Pro ทุกรุ่น ประเมินราคาตามรอบชาร์จและสเปก นัดรับในพื้นที่ได้ จ่ายเงินทันที`,
    `**รับซื้อ MacBook ${d.th}** — WE BUY รับซื้อ MacBook มือสองในเขต${d.th} กรุงเทพฯ — ${d.note}

## MacBook ที่รับซื้อในเขต${d.th}

รับซื้อ MacBook ทุกรุ่น:
- MacBook Air M1, M2, M3 และชิป Intel
- MacBook Pro 13", 14", 16" ทุกชิป
- รับทุกสภาพ แม้แบตเสื่อมหรือจอมีรอย

## ราคารับซื้อ MacBook อ้างอิง (${d.th})

| รุ่น | ช่วงราคา |
|------|---------|
| MacBook Pro M3/M4 | 35,000–75,000 บาท |
| MacBook Air M2/M3 | 15,000–32,000 บาท |
| MacBook Air M1 | 10,000–16,000 บาท |
| MacBook Intel | 4,000–11,000 บาท |

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
    [
      { q: `รับซื้อ MacBook เขต${d.th}ไหม?`, a: `รับครับ ทุกรุ่น ทุกสภาพ นัดรับในเขต${d.th}ได้เลย หรือส่งรูปมาประเมินราคาผ่าน Line @webuy ก่อนได้` },
    ]
  ));
}

// จังหวัดภาคกลาง/ตะวันออก
const centralProvinces = [
  { th: 'นนทบุรี', en: 'nonthaburi', extra: ['notebook'] },
  { th: 'ปทุมธานี', en: 'pathum-thani', extra: [] },
  { th: 'ชลบุรี', en: 'chonburi', extra: [] },
  { th: 'ระยอง', en: 'rayong', extra: ['notebook'] },
  { th: 'พระนครศรีอยุธยา', en: 'ayutthaya', extra: [] },
  { th: 'นครปฐม', en: 'nakhon-pathom', extra: [] },
];

for (const p of centralProvinces) {
  const region = `${p.th}และจังหวัดใกล้เคียงในภาคกลาง`;

  pages.push(md(
    `รับซื้อ-iphone-${p.th}`,
    `รับซื้อ iPhone ${p.th} มือสอง — ทุกรุ่น ราคาดี จ่ายเงินสดทันที`,
    `WE BUY รับซื้อ iPhone มือสองใน${p.th} ทุกรุ่นตั้งแต่ iPhone 11 ถึงรุ่นล่าสุด ประเมินราคาตามสุขภาพแบตจริง จ่ายเงินทันที ส่งพัสดุได้ทั่วประเทศ`,
    `**รับซื้อ iPhone ${p.th}** — WE BUY รับซื้อ iPhone มือสองใน${p.th}และ${region}

## ราคารับซื้อ iPhone อ้างอิง (${p.th})

| รุ่น | ช่วงราคา |
|------|---------|
| iPhone 16 Pro Max | 25,000–38,000 บาท |
| iPhone 16 Series | 18,000–28,000 บาท |
| iPhone 15 Pro Max | 20,000–30,000 บาท |
| iPhone 15 Series | 14,000–22,000 บาท |
| iPhone 14 Series | 10,000–18,000 บาท |
| iPhone 13 Series | 7,000–14,000 บาท |

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
    [{ q: `รับซื้อ iPhone ใน${p.th}ไหม?`, a: `รับครับ ทุกรุ่น ทุกสภาพ ส่งรูปมาประเมินราคาผ่าน Line @webuy ได้เลย` }]
  ));

  pages.push(md(
    `รับซื้อ-macbook-${p.th}`,
    `รับซื้อ MacBook ${p.th} มือสอง — Air/Pro ทุกรุ่น ชิป Intel และ M Series`,
    `WE BUY รับซื้อ MacBook มือสองใน${p.th} ทั้ง MacBook Air และ Pro ชิป Intel และ M1-M4 ประเมินราคาตามรอบชาร์จและสเปก จ่ายเงินทันที บริการตลอด 24 ชม.`,
    `**รับซื้อ MacBook ${p.th}** — WE BUY รับซื้อ MacBook มือสองใน${p.th}และ${region}

## ราคารับซื้อ MacBook อ้างอิง (${p.th})

| รุ่น | ช่วงราคา |
|------|---------|
| MacBook Pro M3/M4 | 35,000–75,000 บาท |
| MacBook Air M2/M3 | 15,000–32,000 บาท |
| MacBook Air M1 | 10,000–16,000 บาท |
| MacBook Intel | 4,000–11,000 บาท |

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
    [{ q: `รับซื้อ MacBook ใน${p.th}ไหม?`, a: `รับครับ ทุกรุ่น ทุกสภาพ ส่งรูป About This Mac มาประเมินราคาผ่าน Line @webuy ได้เลย` }]
  ));

  if (p.extra.includes('notebook')) {
    pages.push(md(
      `รับซื้อโน๊ตบุ๊ค-${p.th}`,
      `รับซื้อโน๊ตบุ๊ค ${p.th} มือสอง — ทุกยี่ห้อ Gaming Ultrabook ราคาดี`,
      `WE BUY รับซื้อโน๊ตบุ๊คมือสองใน${p.th} ทุกยี่ห้อ ASUS Lenovo Dell HP Acer รับทั้ง Gaming Notebook และ Ultrabook ประเมินราคาฟรีผ่าน Line @webuy`,
      `**รับซื้อโน๊ตบุ๊ค ${p.th}** — WE BUY รับซื้อโน๊ตบุ๊คมือสองใน${p.th}ทุกยี่ห้อ ทุกสภาพ

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
      [{ q: `รับซื้อโน๊ตบุ๊คใน${p.th}ทุกยี่ห้อไหม?`, a: 'รับครับ ทุกยี่ห้อ ทุกสภาพ ส่งรูปมาประเมินราคาผ่าน Line @webuy ได้เลย' }]
    ));
  }
}

// ════════════════════════════════════════════════
// SECTION D — LOCAL PAGES Server/UPS
// ════════════════════════════════════════════════

const b2bCities = [
  { th: 'เชียงใหม่', en: 'chiang-mai', region: 'ภาคเหนือ' },
  { th: 'ขอนแก่น', en: 'khon-kaen', region: 'ภาคอีสาน' },
  { th: 'อุบลราชธานี', en: 'ubon', region: 'ภาคอีสาน' },
  { th: 'นครราชสีมา', en: 'nakhon-ratchasima', region: 'ภาคอีสาน' },
  { th: 'กรุงเทพมหานคร', en: 'bangkok', region: 'กรุงเทพและปริมณฑล' },
];

for (const c of b2bCities) {
  // Server local
  pages.push(md(
    `รับซื้อ-server-${c.th}`,
    `รับซื้อ Server ${c.th} มือสอง — Dell HP Lenovo Supermicro รับทุกสภาพ จ่ายทันที`,
    `WE BUY รับซื้อ Server มือสองใน${c.th} ทั้ง Tower, Rack-mount และ Blade Server ทุกยี่ห้อ Dell HP Lenovo IBM Supermicro ประเมินราคาฟรี จ่ายเงินทันที บริการตลอด 24 ชม.`,
    `**รับซื้อ Server ${c.th}** — WE BUY รับซื้อ Server มือสองใน${c.th}และ${c.region} ครอบคลุมทุกประเภทและทุกยี่ห้อ

## Server ที่รับซื้อใน${c.th}

- **Rack Server** 1U, 2U, 4U ทุกขนาดและทุกรุ่น
- **Tower Server** สำหรับ SME และสำนักงาน
- **Blade Server** ระบบ Blade Chassis ทุกยี่ห้อ
- **รับทุกสภาพ** ทั้งใช้งานได้ปกติและมีปัญหา

## ยี่ห้อที่รับซื้อใน${c.th}

Dell PowerEdge, HP ProLiant, Lenovo ThinkSystem, IBM Power, Supermicro, Fujitsu, Huawei FusionServer รับทุกรุ่น

## ราคารับซื้อ Server อ้างอิง (${c.th})

| ประเภท | ช่วงราคา |
|--------|---------|
| Rack Server 2U High-End (Xeon 2P/4P) | 10,000–80,000 บาท |
| Rack Server 1U Mid-Range | 5,000–30,000 บาท |
| Tower Server สำนักงาน | 3,000–15,000 บาท |
| Server เสีย/ซาก | 500–5,000 บาท |

## บริการรับซื้อ Server ยกชุดในองค์กรใน${c.th}

หากองค์กรในพื้นที่${c.th}มีการปลดระวาง Server หลายเครื่อง หรืออุปกรณ์ Rack ทั้งชุด WE BUY รับประเมินรวมเป็นล็อต พร้อมออกเอกสารรับซื้ออย่างเป็นทางการ

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
    [
      { q: `รับซื้อ Server ใน${c.th}ทุกยี่ห้อไหม?`, a: `รับครับ ทุกยี่ห้อ ทั้ง Dell HP Lenovo IBM Supermicro Huawei และยี่ห้ออื่น ๆ รับทั้งใช้งานได้ปกติและมีปัญหา ส่งรูปมาประเมินราคาผ่าน Line @webuy ได้เลย` },
      { q: `ปลดระวาง Server ยกชุดใน${c.th}ทำอย่างไร?`, a: 'ทักมาทาง Line @webuy แจ้งจำนวนและยี่ห้อรุ่น ทีมงานจะนัดเข้าไปประเมินราคารวมเป็นล็อตและจ่ายเงินสดในวันเดียวกัน' },
      { q: 'Server ที่เสียหรือเปิดไม่ติดรับไหม?', a: 'รับครับ ประเมินราคาตามสภาพจริงของชิ้นส่วนที่ยังมีมูลค่า เช่น CPU RAM HDD/SSD และ Chassis' },
    ]
  ));

  // UPS local (ยกเว้น กรุงเทพ เพราะ search volume ต่างกัน)
  pages.push(md(
    `รับซื้อ-ups-${c.th}`,
    `รับซื้อ UPS ${c.th} มือสอง — APC Eaton CyberPower Syndome รับทุกขนาด จ่ายทันที`,
    `WE BUY รับซื้อ UPS มือสองใน${c.th} ทุกยี่ห้อ APC, Eaton, CyberPower, Syndome, True Online รับทั้ง 1 kVA ถึงระดับ 10 kVA ขึ้นไป ประเมินราคาฟรี จ่ายเงินทันที`,
    `**รับซื้อ UPS ${c.th}** — WE BUY รับซื้อ UPS (เครื่องสำรองไฟ) มือสองใน${c.th}และ${c.region}

## UPS ที่รับซื้อใน${c.th}

- **UPS ทั่วไป** 600VA - 3 kVA สำหรับสำนักงานและร้านค้า
- **UPS ระดับ SME** 3-10 kVA สำหรับองค์กรขนาดกลาง
- **UPS Industrial** 10 kVA ขึ้นไป สำหรับ Data Center
- **แบตเตอรี่ UPS** แยกชิ้น ทั้งยี่ห้อ APC, Eaton, CSB, Yuasa

## ยี่ห้อที่รับซื้อใน${c.th}

APC, Eaton (MGE/Powerware), CyberPower, Syndome, True Online (Socomec), Cleanline, Delta และยี่ห้ออื่น ๆ

## ราคารับซื้อ UPS อ้างอิง (${c.th})

| ขนาด/ยี่ห้อ | ช่วงราคา |
|------------|---------|
| APC 1500VA Smart UPS | 2,000–5,000 บาท |
| APC/Eaton 3 kVA | 3,000–10,000 บาท |
| UPS 6-10 kVA | 8,000–30,000 บาท |
| UPS Industrial 20 kVA+ | 20,000–100,000+ บาท |

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
    [
      { q: `รับซื้อ UPS ใน${c.th}ทุกยี่ห้อไหม?`, a: `รับครับ ทุกยี่ห้อ ทั้ง APC Eaton CyberPower Syndome True Online Cleanline และยี่ห้ออื่น ๆ รับทุกขนาดตั้งแต่ 600VA จนถึงระดับ 100 kVA ส่งรูปและสเปกมาประเมินราคาผ่าน Line @webuy ได้เลย` },
      { q: 'UPS ที่แบตเสื่อมแล้วรับไหม?', a: 'รับครับ ประเมินราคาตามสภาพของ Inverter และ Body รวมถึง Circuit ภายใน แม้แบตเตอรี่จะหมดสภาพแล้วก็ตาม' },
    ]
  ));
}

// รับเหมา IT local
const rhabmaaCities = [
  { th: 'กรุงเทพมหานคร', region: 'กรุงเทพและปริมณฑล' },
  { th: 'เชียงใหม่', region: 'ภาคเหนือ' },
  { th: 'ขอนแก่น', region: 'ภาคอีสาน' },
];

for (const c of rhabmaaCities) {
  pages.push(md(
    `รับเหมาอุปกรณ์ไอที-${c.th}`,
    `รับเหมาอุปกรณ์ไอที ${c.th} — รับซื้อยกล็อต Server คอม UPS อุปกรณ์เน็ตเวิร์ก`,
    `WE BUY รับเหมาอุปกรณ์ไอทีทุกประเภทใน${c.th} ทั้ง Server คอมพิวเตอร์ UPS Network Switch NAS ประเมินรวมเป็นล็อต ออกเอกสาร จ่ายเงินสดในวันเดียว บริการตลอด 24 ชม.`,
    `**รับเหมาอุปกรณ์ไอที ${c.th}** — WE BUY รับเหมาอุปกรณ์ไอทีทุกประเภทในพื้นที่${c.th}และ${c.region}

## บริการรับเหมา IT ใน${c.th}

เหมาะสำหรับองค์กร บริษัท และหน่วยงานที่ต้องการ:
- **ปลดระวางอุปกรณ์ IT** ครบล็อตในคราวเดียว
- **ล้างสต็อก Server, Network, UPS** หมดล็อต
- **ขายทรัพย์สินไอทีบริษัท** ที่ไม่ได้ใช้แล้ว

## อุปกรณ์ที่รับเหมาใน${c.th}

- Server และ Rack Equipment
- คอมพิวเตอร์และโน๊ตบุ๊คสำนักงาน
- UPS และเครื่องสำรองไฟ
- Network Switch, Router, Firewall, Access Point
- NAS, Storage Array, Tape Library
- จอมอนิเตอร์และอุปกรณ์ปลายทาง

## ขั้นตอนรับเหมา IT ใน${c.th}

1. ทักมาทาง Line @webuy แจ้งประเภทและจำนวนอุปกรณ์คร่าว ๆ
2. ทีมงานนัดเข้าสำรวจและประเมินราคารวมทั้งล็อต
3. ตกลงราคา ออกเอกสารรับซื้ออย่างเป็นทางการ
4. รับมอบอุปกรณ์และจ่ายเงินสดในวันเดียวกัน

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
    [
      { q: `รับเหมาอุปกรณ์ไอทีใน${c.th}ทุกประเภทไหม?`, a: `รับครับ ทั้ง Server คอมพิวเตอร์ UPS Network Equipment NAS และอุปกรณ์สำนักงาน รับประเมินรวมเป็นล็อต ทักมาทาง Line @webuy แจ้งรายการอุปกรณ์ได้เลย` },
      { q: 'มีเอกสารรับซื้ออย่างเป็นทางการไหม?', a: 'มีครับ WE BUY ออกเอกสารรับซื้ออย่างเป็นทางการให้ทุกรายการ เพื่อความโปร่งใสและบันทึกทางบัญชีขององค์กร' },
    ]
  ));
}

// ════════════════════════════════════════════════
// SECTION E — MONEY PAGES ใหม่
// ════════════════════════════════════════════════

// AirPods Hub
pages.push(md(
  'รับซื้อ-airpods',
  'รับซื้อ AirPods มือสอง — AirPods Pro Max ทุกรุ่น ราคาดี จ่ายทันที',
  'WE BUY รับซื้อ AirPods มือสองทุกรุ่น AirPods 2, 3, AirPods Pro Gen 1/2/3 และ AirPods Max ประเมินราคาตามสภาพแบตจริง จ่ายเงินทันที บริการตลอด 24 ชม.',
  `**รับซื้อ AirPods มือสอง** — WE BUY รับซื้อ AirPods ทุกรุ่นที่ยังมีตลาดรองรับ ปิด Apple ecosystem ของคุณให้ครบ ไม่ว่าจะเป็น AirPods รุ่นธรรมดา, AirPods Pro หรือ AirPods Max ราคาสูงสุด

## AirPods รุ่นที่รับซื้อ

| รุ่น | ช่วงราคา |
|------|---------|
| AirPods Pro Gen 2 / Gen 3 | 2,500–4,500 บาท |
| AirPods Pro Gen 1 | 1,500–3,000 บาท |
| AirPods 3 | 1,200–2,500 บาท |
| AirPods 2 | 800–1,800 บาท |
| AirPods Max | 5,000–12,000 บาท |

## ปัจจัยที่มีผลต่อราคา AirPods มือสอง

- **สุขภาพแบตเตอรี่** ทั้งตัวหูฟังและ Charging Case
- **สภาพภายนอก** รอยขีดข่วน ตุ้มหูหาย
- **ความครบของอุปกรณ์** Case, สาย Lightning/USB-C, กล่อง
- **ยกเลิกการเชื่อมต่อ iCloud** แล้วหรือยัง

## วิธีตรวจสุขภาพแบตก่อนขาย AirPods

เชื่อมต่อกับ iPhone แล้วไปที่ Settings → Bluetooth → ชื่อ AirPods → กด (i) → ดู Battery Health ของแต่ละข้างและ Case

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
  [
    { q: 'รับซื้อ AirPods ทุกรุ่นไหม?', a: 'รับครับ ทั้ง AirPods Gen 2, 3, AirPods Pro Gen 1/2/3 และ AirPods Max รับทั้งที่แบตยังดีและแบตเสื่อม ส่งรูปมาประเมินราคาผ่าน Line @webuy ได้เลย' },
    { q: 'AirPods แบตเสื่อมรับไหม?', a: 'รับครับ แต่ราคาจะปรับตามสุขภาพแบตจริง แนะนำเช็กและแจ้งเปอร์เซ็นต์แบตตั้งแต่ต้น' },
    { q: 'AirPods ไม่มีกล่องรับไหม?', a: 'รับครับ แต่มีกล่องและอุปกรณ์ครบจะได้ราคาดีกว่า แจ้งรายการอุปกรณ์ที่มีมาตั้งแต่ต้น' },
  ]
));

// AirPods Pro
pages.push(md(
  'รับซื้อ-airpods-pro',
  'รับซื้อ AirPods Pro มือสอง — Gen 1/2/3 ตรวจสุขภาพแบต ราคาดี',
  'WE BUY รับซื้อ AirPods Pro มือสอง Gen 1, Gen 2 และ Gen 3 ประเมินราคาตามสุขภาพแบตจริง รับทุกสภาพ จ่ายเงินทันที บริการตลอด 24 ชม.',
  `**รับซื้อ AirPods Pro มือสอง** — AirPods Pro คือ True Wireless ที่มีมูลค่าในตลาดมือสองสูงที่สุดในกลุ่ม AirPods เนื่องจากระบบตัดเสียง ANC และ Transparency Mode

## ราคารับซื้อ AirPods Pro อ้างอิง

| รุ่น | สภาพ | ช่วงราคา |
|------|------|---------|
| AirPods Pro Gen 3 | แบต 90%+ ครบกล่อง | 3,500–4,500 บาท |
| AirPods Pro Gen 2 | แบต 85%+ ครบกล่อง | 2,800–3,800 บาท |
| AirPods Pro Gen 1 | แบต 80%+ ครบกล่อง | 1,500–2,500 บาท |

## สิ่งที่ควรส่งเพื่อประเมินราคา AirPods Pro

1. รูปเปอร์เซ็นต์แบตเตอรี่ของหูฟังทั้งสองข้างและ Case
2. รูปสภาพภายนอก (มีรอยหรือเปล่า)
3. บอกว่ามีกล่องเดิมและสายชาร์จหรือไม่

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
  [{ q: 'รับซื้อ AirPods Pro ทุก Gen ไหม?', a: 'รับครับ ทั้ง Gen 1, Gen 2 และ Gen 3 ส่งรูปแบตเตอรี่และสภาพมาประเมินราคาผ่าน Line @webuy ได้เลย' }]
));

// AirPods Max
pages.push(md(
  'รับซื้อ-airpods-max',
  'รับซื้อ AirPods Max มือสอง — Over-ear หูฟัง Apple รับทุกสี ราคาดี',
  'WE BUY รับซื้อ AirPods Max มือสอง ทุกสี ทุกรุ่น ประเมินราคาตามสภาพและสุขภาพแบต จ่ายเงินทันที รับทั้งแบบมีกล่องและไม่มีกล่อง',
  `**รับซื้อ AirPods Max มือสอง** — AirPods Max เป็น Over-ear Headphone ระดับ Premium ของ Apple ที่ยังคงมูลค่าในตลาดมือสองสูงมาก

## ราคารับซื้อ AirPods Max อ้างอิง

| สภาพ | ช่วงราคา |
|------|---------|
| AirPods Max (USB-C รุ่นใหม่) สภาพดี | 8,000–12,000 บาท |
| AirPods Max (Lightning รุ่นแรก) สภาพดี | 6,000–9,000 บาท |
| มีรอยหรือแบตเสื่อม | 4,000–7,000 บาท |

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
  [{ q: 'รับซื้อ AirPods Max ทุกสีไหม?', a: 'รับครับ ทุกสี ทั้ง Space Gray, Silver, Sky Blue, Pink, Green, Midnight, Starlight และสีอื่น ๆ ที่ Apple วางจำหน่าย ส่งรูปมาประเมินราคาผ่าน Line @webuy' }]
));

// iPhone รุ่นเฉพาะ
const iphoneModels = [
  { slug: 'รับซื้อ-iphone-15', title: 'รับซื้อ iPhone 15 มือสอง', desc: 'WE BUY รับซื้อ iPhone 15 ทั้ง 4 รุ่น Standard, Plus, Pro, Pro Max ประเมินราคาตามสุขภาพแบตและความจุ จ่ายเงินทันที', priceTable: [['iPhone 15 Pro Max 256GB', '18,000–24,000 บาท'], ['iPhone 15 Pro 128GB', '15,000–20,000 บาท'], ['iPhone 15 Plus', '12,000–18,000 บาท'], ['iPhone 15 Standard', '10,000–15,000 บาท']] },
  { slug: 'รับซื้อ-iphone-15-pro-max', title: 'รับซื้อ iPhone 15 Pro Max มือสอง', desc: 'WE BUY รับซื้อ iPhone 15 Pro Max มือสอง ทุกความจุ 256GB 512GB 1TB ประเมินราคาตามสุขภาพแบตและสภาพจริง จ่ายเงินทันที', priceTable: [['iPhone 15 Pro Max 1TB', '22,000–28,000 บาท'], ['iPhone 15 Pro Max 512GB', '20,000–25,000 บาท'], ['iPhone 15 Pro Max 256GB', '18,000–23,000 บาท']] },
  { slug: 'รับซื้อ-iphone-16', title: 'รับซื้อ iPhone 16 มือสอง', desc: 'WE BUY รับซื้อ iPhone 16 ทั้ง 4 รุ่น Standard, Plus, Pro, Pro Max ชิป A18 ประเมินราคาตามสุขภาพแบตและความจุ จ่ายเงินทันที', priceTable: [['iPhone 16 Pro Max 256GB', '25,000–32,000 บาท'], ['iPhone 16 Pro 128GB', '22,000–28,000 บาท'], ['iPhone 16 Plus', '18,000–25,000 บาท'], ['iPhone 16 Standard', '15,000–22,000 บาท']] },
  { slug: 'รับซื้อ-iphone-16-pro-max', title: 'รับซื้อ iPhone 16 Pro Max มือสอง', desc: 'WE BUY รับซื้อ iPhone 16 Pro Max มือสอง ทุกความจุ 256GB 512GB 1TB ชิป A18 Pro ประเมินราคาตามสุขภาพแบตจริง จ่ายเงินทันที', priceTable: [['iPhone 16 Pro Max 1TB', '30,000–38,000 บาท'], ['iPhone 16 Pro Max 512GB', '27,000–35,000 บาท'], ['iPhone 16 Pro Max 256GB', '24,000–31,000 บาท']] },
];

for (const m of iphoneModels) {
  const tableRows = m.priceTable.map(r => `| ${r[0]} | ${r[1]} |`).join('\n');
  pages.push(md(
    m.slug,
    m.title,
    m.desc,
    `**${m.title}** — WE BUY ประเมินราคา iPhone มือสองด้วยสเปกและสุขภาพแบตที่แม่นยำ

## ราคารับซื้ออ้างอิง

| รุ่น/ความจุ | ช่วงราคา |
|------------|---------|
${tableRows}

*ราคาขึ้นอยู่กับสุขภาพแบต สภาพบอดี้และจอ และความครบของอุปกรณ์*

## ปัจจัยที่มีผลต่อราคา

- **สุขภาพแบตเตอรี่** ต่ำกว่า 85% ราคาจะปรับลง
- **สภาพจอและบอดี้** รอยขีดข่วน บุบ หรือจอแตกมีผลชัดเจน
- **Apple ID** ต้องปลดออกก่อนส่งมอบ
- **ความจุ** ยิ่งมากยิ่งราคาดี

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
    [
      { q: `${m.title.replace('รับซื้อ ', '')} ทุกความจุไหม?`, a: 'รับครับ ทุกความจุ ทุกสี และทุกสภาพ แจ้งเปอร์เซ็นต์สุขภาพแบตมาด้วยจะได้ราคาที่แม่นยำขึ้น ส่งรูปมาประเมินผ่าน Line @webuy ได้เลย' },
    ]
  ));
}

// MacBook รุ่นเฉพาะ
const macbookModels = [
  { slug: 'รับซื้อ-macbook-pro-m3', title: 'รับซื้อ MacBook Pro M3 มือสอง', desc: 'WE BUY รับซื้อ MacBook Pro M3 มือสอง ทั้ง 14" และ 16" ชิป M3, M3 Pro, M3 Max ประเมินราคาตามสเปกและรอบชาร์จ จ่ายเงินทันที', chip: 'M3/M3 Pro/M3 Max', prices: [['MacBook Pro M3 Max 16" 36GB+1TB', '55,000–75,000 บาท'], ['MacBook Pro M3 Pro 16" 18GB+512GB', '35,000–50,000 บาท'], ['MacBook Pro M3 14" 8GB+512GB', '28,000–40,000 บาท']] },
  { slug: 'รับซื้อ-macbook-air-m3', title: 'รับซื้อ MacBook Air M3 มือสอง', desc: 'WE BUY รับซื้อ MacBook Air M3 มือสอง ทั้ง 13" และ 15" ประเมินราคาตามรอบชาร์จและสเปก RAM/SSD จ่ายเงินทันที', chip: 'M3', prices: [['MacBook Air M3 15" 16GB+512GB', '25,000–35,000 บาท'], ['MacBook Air M3 13" 16GB+512GB', '22,000–30,000 บาท'], ['MacBook Air M3 13" 8GB+256GB', '18,000–24,000 บาท']] },
  { slug: 'รับซื้อ-macbook-pro-m4', title: 'รับซื้อ MacBook Pro M4 มือสอง', desc: 'WE BUY รับซื้อ MacBook Pro M4 มือสอง ทั้ง 14" และ 16" ชิป M4, M4 Pro, M4 Max ประเมินราคาตามสเปกและรอบชาร์จ จ่ายเงินทันที', chip: 'M4/M4 Pro/M4 Max', prices: [['MacBook Pro M4 Max 16" 48GB+1TB', '65,000–90,000 บาท'], ['MacBook Pro M4 Pro 16" 24GB+512GB', '45,000–65,000 บาท'], ['MacBook Pro M4 14" 16GB+512GB', '35,000–50,000 บาท']] },
];

for (const m of macbookModels) {
  const tableRows = m.prices.map(r => `| ${r[0]} | ${r[1]} |`).join('\n');
  pages.push(md(
    m.slug,
    m.title,
    m.desc,
    `**${m.title}** — WE BUY รับซื้อ MacBook รุ่นนี้ด้วยราคาที่ตรงกับตลาดมือสองจริง ประเมินตามชิป ${m.chip} RAM SSD และรอบชาร์จ

## ราคารับซื้อ ${m.title.replace('รับซื้อ ', '').replace(' มือสอง', '')} อ้างอิง

| สเปก | ช่วงราคา |
|------|---------|
${tableRows}

## ปัจจัยราคาที่สำคัญ

- **RAM** (Unified Memory): ยิ่งมากยิ่งราคาดี 16GB vs 8GB ต่างกันมาก
- **SSD**: 512GB ขึ้นไปราคาดีกว่า 256GB
- **รอบชาร์จ**: ต่ำกว่า 300 รอบได้ราคาสูงสุด
- **สภาพจอ**: จอ Liquid Retina XDR ที่สมบูรณ์มีผลต่อราคา

## วิธีเช็กสเปก MacBook ก่อนส่งประเมินราคา

Apple Menu → About This Mac → More Info แล้วถ่ายรูปส่งมาได้เลย

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
    [
      { q: `${m.title.replace('รับซื้อ ', '')} รับทุกสเปกไหม?`, a: 'รับครับ ทุกสเปก ทั้ง base model จนถึง Max configuration ส่งรูป About This Mac มาประเมินราคาผ่าน Line @webuy ได้เลย รู้ราคาภายใน 15-30 นาที' },
    ]
  ));
}

// CCTV / กล้องวงจรปิด
pages.push(md(
  'รับซื้อ-cctv',
  'รับซื้อ CCTV กล้องวงจรปิด มือสอง — IP Camera, NVR, DVR รับทุกยี่ห้อ',
  'WE BUY รับซื้อ CCTV กล้องวงจรปิดมือสอง ทั้ง IP Camera, NVR, DVR, NAS CCTV ทุกยี่ห้อ Hikvision, Dahua, Uniview รับทั้งชุดและแยกชิ้น จ่ายเงินทันที',
  `**รับซื้อ CCTV กล้องวงจรปิดมือสอง** — WE BUY รับซื้อระบบกล้องวงจรปิดมือสองทุกประเภท เหมาะสำหรับองค์กรที่อัปเกรดระบบหรือปลดระวางอุปกรณ์เก่า

## CCTV ที่รับซื้อ

- **IP Camera** ทุกความละเอียด 2MP, 4MP, 8MP (4K) ทุกยี่ห้อ
- **NVR (Network Video Recorder)** สำหรับระบบ IP Camera
- **DVR (Digital Video Recorder)** สำหรับระบบ Analog/HD-TVI/AHD
- **PoE Switch สำหรับ CCTV** ทุกรุ่น
- **Hard Disk สำหรับ NVR/DVR** เฉพาะ Surveillance HDD

## ยี่ห้อที่รับซื้อ

Hikvision, Dahua, Uniview (UNV), Axis, Bosch, Hanwha, Reolink, TP-Link Tapo และยี่ห้ออื่น ๆ

## ราคารับซื้อ CCTV อ้างอิง

| ประเภท | ช่วงราคา |
|--------|---------|
| NVR 16CH + HDD 4TB | 3,000–8,000 บาท |
| IP Camera 4K ชุด 4 ตัว | 2,000–5,000 บาท |
| DVR 8CH AHD | 1,000–3,000 บาท |
| IP Camera แยกตัว | 300–1,500 บาท |

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
  [
    { q: 'รับซื้อ CCTV กล้องวงจรปิดทุกยี่ห้อไหม?', a: 'รับครับ ทุกยี่ห้อ ทั้ง Hikvision, Dahua, Uniview, Axis และยี่ห้ออื่น ๆ รับทั้งแยกชิ้นและชุดครบระบบ ส่งรูปและสเปกมาประเมินราคาผ่าน Line @webuy ได้เลย' },
    { q: 'CCTV ที่ไม่ทำงานแล้วรับไหม?', a: 'รับครับ ประเมินราคาตามสภาพจริงของชิ้นส่วนที่ยังมีมูลค่า แนะนำแจ้งอาการปัญหามาตั้งแต่ต้น' },
  ]
));

// IP Camera
pages.push(md(
  'รับซื้อ-ip-camera',
  'รับซื้อ IP Camera มือสอง — Hikvision Dahua Axis รับทุกความละเอียด จ่ายทันที',
  'WE BUY รับซื้อ IP Camera มือสอง ทุกยี่ห้อ Hikvision Dahua Axis Uniview รับทั้ง Dome, Bullet, PTZ Camera ทุกความละเอียด ประเมินราคาฟรี จ่ายเงินทันที',
  `**รับซื้อ IP Camera มือสอง** — WE BUY รับซื้อ IP Camera ทุกประเภทและทุกยี่ห้อ รับทั้งแยกชิ้นและยกชุดพร้อม NVR

## ประเภท IP Camera ที่รับซื้อ

- **Dome Camera** ติดเพดาน ใช้ภายในอาคาร
- **Bullet Camera** ใช้ภายนอกอาคาร กันน้ำ IP66/IP67
- **PTZ Camera** หมุนได้ 360° ระดับ Professional
- **Fisheye Camera** ถ่ายมุมกว้าง 360°
- **Turret Camera** ดีไซน์ทันสมัย

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
  [{ q: 'รับซื้อ IP Camera ทุกยี่ห้อไหม?', a: 'รับครับ ทุกยี่ห้อและทุกประเภท ส่งรูปและระบุยี่ห้อรุ่นมาประเมินราคาผ่าน Line @webuy ได้เลย' }]
));

// Projector
pages.push(md(
  'รับซื้อ-projector',
  'รับซื้อ Projector โปรเจกเตอร์ มือสอง — Epson Benq Sony รับทุกรุ่น จ่ายทันที',
  'WE BUY รับซื้อ Projector โปรเจกเตอร์มือสอง ทุกยี่ห้อ Epson, BenQ, Sony, Optoma รับทั้ง Business Projector และ Home Cinema จ่ายเงินทันที บริการตลอด 24 ชม.',
  `**รับซื้อ Projector โปรเจกเตอร์มือสอง** — WE BUY รับซื้อ Projector มือสองทุกประเภทที่ยังมีตลาดรองรับ เหมาะสำหรับองค์กรที่อัปเกรดระบบนำเสนอหรือห้องประชุม

## Projector ที่รับซื้อ

- **Business / Education Projector** สำหรับห้องประชุมและห้องเรียน
- **Home Cinema Projector** ความละเอียด Full HD และ 4K
- **Short Throw / Ultra Short Throw** สำหรับห้องแคบ
- **Laser Projector** อายุการใช้งานยาวนาน

## ยี่ห้อที่รับซื้อ

Epson, BenQ, Sony, Optoma, NEC, Panasonic, ViewSonic, Barco, Christie

## ราคารับซื้อ Projector อ้างอิง

| ประเภท | ช่วงราคา |
|--------|---------|
| 4K Laser Projector | 15,000–50,000 บาท |
| Full HD Business Projector | 3,000–12,000 บาท |
| Education Projector SVGA/XGA | 1,000–5,000 บาท |

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
  [
    { q: 'รับซื้อ Projector ทุกยี่ห้อไหม?', a: 'รับครับ ทุกยี่ห้อ ทั้ง Epson, BenQ, Sony, Optoma, NEC และยี่ห้ออื่น ๆ แนะนำระบุจำนวนชั่วโมงการใช้งาน (Lamp Hours) มาด้วยเพื่อประเมินราคาได้แม่นยำขึ้น' },
    { q: 'Projector ที่หลอดไฟหมดอายุรับไหม?', a: 'รับครับ แต่ราคาจะปรับตามต้นทุนหลอดไฟ โปรเจกเตอร์ Laser ที่ไม่มีหลอดไฟมีมูลค่าสูงกว่ารุ่นหลอด LED/UHP แจ้งชั่วโมงการใช้งานมาตั้งแต่ต้น' },
  ]
));

// Smart TV
pages.push(md(
  'รับซื้อ-smart-tv',
  'รับซื้อ Smart TV มือสอง — Samsung LG Sony ทุกขนาด ราคาดี จ่ายทันที',
  'WE BUY รับซื้อ Smart TV มือสองทุกยี่ห้อ Samsung LG Sony รับทั้ง OLED QLED และ LED ทุกขนาดหน้าจอ ประเมินราคาฟรีผ่าน Line @webuy จ่ายเงินทันที',
  `**รับซื้อ Smart TV มือสอง** — WE BUY รับซื้อ Smart TV มือสองที่ยังมีตลาดรองรับ โดยเฉพาะ OLED และ QLED ระดับพรีเมียม

## Smart TV ที่รับซื้อ

- **OLED TV** LG OLED evo, Sony BRAVIA XR OLED — ราคาดีที่สุด
- **QLED / Neo QLED** Samsung ทุกรุ่น
- **Mini LED TV** LG QNED, TCL, Hisense
- **LED Smart TV** ทั่วไป ขนาด 43" ขึ้นไป

## ราคารับซื้อ Smart TV อ้างอิง

| ประเภท/ขนาด | ช่วงราคา |
|------------|---------|
| OLED 65" Premium | 15,000–40,000 บาท |
| QLED 65" | 8,000–20,000 บาท |
| LED 55"+ Smart TV | 3,000–10,000 บาท |
| LED 43" Smart TV | 1,500–5,000 บาท |

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
  [
    { q: 'รับซื้อ Smart TV ทุกยี่ห้อไหม?', a: 'รับครับ ทั้ง Samsung, LG, Sony, TCL, Hisense, Xiaomi, Panasonic และยี่ห้ออื่น ๆ เน้นรุ่น OLED และ QLED ที่ยังมีมูลค่าในตลาดสูง ส่งรูปและระบุรุ่นมาประเมินราคาผ่าน Line @webuy ได้เลย' },
    { q: 'TV ขนาดไหนที่รับซื้อ?', a: 'รับตั้งแต่ 43" ขึ้นไปครับ โดยเฉพาะ 55" และ 65" ซึ่งเป็นขนาดที่ตลาดมือสองต้องการสูงสุด' },
  ]
));

// Apple TV
pages.push(md(
  'รับซื้อ-apple-tv',
  'รับซื้อ Apple TV มือสอง — Apple TV 4K ทุกรุ่น ราคาดี จ่ายทันที',
  'WE BUY รับซื้อ Apple TV มือสอง ทั้ง Apple TV 4K Gen 1/2/3 ประเมินราคาตามรุ่นและสภาพ จ่ายเงินทันที บริการตลอด 24 ชม.',
  `**รับซื้อ Apple TV มือสอง** — WE BUY ปิด Apple ecosystem ครบ รับซื้อ Apple TV ทุกรุ่นที่ยังมีตลาดรองรับ

## Apple TV รุ่นที่รับซื้อ

| รุ่น | ช่วงราคา |
|------|---------|
| Apple TV 4K (3rd Gen) | 2,500–3,800 บาท |
| Apple TV 4K (2nd Gen) | 1,800–2,800 บาท |
| Apple TV 4K (1st Gen) | 1,000–1,800 บาท |
| Apple TV HD | 800–1,500 บาท |

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
  [{ q: 'รับซื้อ Apple TV ทุกรุ่นไหม?', a: 'รับครับ ทั้ง Apple TV 4K Gen 1, 2, 3 และ Apple TV HD ส่งรูปมาประเมินราคาผ่าน Line @webuy ได้เลย' }]
));

// HomePod
pages.push(md(
  'รับซื้อ-homepod',
  'รับซื้อ HomePod มือสอง — HomePod, HomePod mini รับทุกสี ราคาดี',
  'WE BUY รับซื้อ HomePod มือสอง ทั้ง HomePod รุ่น 2nd Gen และ HomePod mini ทุกสี รับทั้งที่มีกล่องและไม่มีกล่อง จ่ายเงินทันที',
  `**รับซื้อ HomePod มือสอง** — WE BUY รับซื้อ HomePod และ HomePod mini ทุกรุ่น ทุกสี

## HomePod ที่รับซื้อ

| รุ่น | ช่วงราคา |
|------|---------|
| HomePod (2nd Gen) | 4,500–7,000 บาท |
| HomePod mini | 1,500–2,800 บาท |

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353
`,
  [{ q: 'รับซื้อ HomePod ทุกรุ่นไหม?', a: 'รับครับ ทั้ง HomePod Gen 2 และ HomePod mini ทุกสี ส่งรูปมาประเมินราคาผ่าน Line @webuy ได้เลย' }]
));

// ════════════════════════════════════════════════
// WRITE FILES
// ════════════════════════════════════════════════

let created = 0;
let skipped = 0;

for (const content of pages) {
  const slugMatch = content.match(/^slug: "(.+)"$/m);
  if (!slugMatch) { console.warn('No slug found, skipping'); continue; }
  const slug = slugMatch[1];
  const filename = path.join(POSTS_DIR, `${slug}.md`);

  if (fs.existsSync(filename)) {
    console.log(`SKIP (exists): ${slug}`);
    skipped++;
    continue;
  }

  fs.writeFileSync(filename, content, 'utf8');
  console.log(`CREATED: ${slug}`);
  created++;
}

console.log(`\n✅ Done! Created: ${created}, Skipped: ${skipped}, Total: ${pages.length}`);
