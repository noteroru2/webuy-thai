# Batch 5.8 — Legacy Template + Secondary Page Claim Sweep

**Project:** เรารับซื้อ.com V2 Recovery  
**Branch:** `recovery/batch-5-mobile-ux-cwv`  
**Date:** 2026-07-07  
**Base:** Batch 5.7 (core `claim-audit critical=0`, `warning=34`)

---

## Executive summary

ล้าง claim-heavy copy ใน legacy template และ secondary pages เพื่อลด `claim-audit` warnings จาก **34 → 0** โดยไม่แตะ slug, schema structure, sitemap หรือ redirect logic

**ผลรวม: ผ่านเกณฑ์ Batch 5.8**

| Gate | Before | After |
|------|--------|-------|
| claim-audit critical | 0 | **0** |
| claim-audit warning | 34 | **0** |
| claim-audit ignored | 0 | 11,733 (docs/recovery reports) |
| Build | 780 pages | **780 pages** |
| SEO audit errors | 0 | **0** |
| Schema audit | 0/0 | **0/0** |
| Mobile UX audit | 0/0 | **0/0** |

**Safe to commit:** ✅ ใช่ (ยังไม่ commit ตามคำสั่ง)

---

## Claims พบก่อนแก้ (34 warnings)

| ไฟล์ | จำนวน hits | Claim หลัก |
|------|------------|------------|
| `src/pages/[slug].astro` | 4 | `15 นาที`, `จ่ายเงินสดทันที`, `จ่ายสดทันที` |
| `src/pages/บริการ.astro` | 1 | `อันดับหนึ่ง`, `100%` |
| `src/pages/คู่มือก่อนขาย.astro` | 1 | `ปลอดภัย 100%?` |
| `src/pages/รับซื้อ-apple-watch.astro` | 5 | `ราคาสูงที่สุด`, `จ่ายเงินสดทันที`, `100%`, `รับทุกสภาพ` |
| `src/pages/รับซื้อ-ups.astro` | 2 | `อันดับหนึ่ง` |
| `src/pages/รับซื้อคอมประกอบ.astro` | 3 | `ราคาสูงที่สุด`, `จ่ายเงินสดทันที`, `15-30 นาที` |
| `src/pages/รับซื้อลำโพง.astro` | 3 | `จ่ายเงินสดทันที`, `15-30 นาที` |
| `src/pages/รับซื้อสมาร์ทโฟน-android.astro` | 5 | `ราคาสูงที่สุด`, `จ่ายเงินสดทันที`, `10-15 นาที` |
| `src/pages/รับซื้อโน๊ตบุ๊ค-อุบลราชธานี-คู่มือ.astro` | 2 | `15-30 นาที`, `10-15 นาที` |
| `src/pages/รับซื้อโน๊ตบุ๊ค-โคราช.astro` | 2 | `อันดับหนึ่ง`, `ปลอดภัย 100%` |
| `src/pages/รับซื้อไอโฟน-ขอนแก่น-คู่มือ.astro` | 1 | `ทุกสภาพ` |
| `src/pages/รับซื้อไอโฟน-อุดรธานี.astro` | 2 | `10-15 นาที`, `ปลอดภัย 100%` |
| `src/pages/รับซื้อไอโฟน-อุบลราชธานี-คู่มือ.astro` | 1 | `จ่ายเงินสดทันที` |
| `src/pages/เช็กราคาก่อนขาย.astro` | 1 | `มั่นใจสูงสุด 100%` |

**เพิ่มเติมระหว่าง QA (นอกรายการเดิม แต่จับได้ใน audit):**
- `src/pages/รับซื้อเครื่องเกม.astro` — 4 hits
- `src/pages/ราคากลางรับซื้อ.astro` — 1 hit (`ราคาสูงขึ้น` ใน heading การศึกษา)

---

## Claims ที่แก้แล้ว

| Claim เดิม | ข้อความแทน |
|------------|------------|
| จ่ายเงินสดทันที / จ่ายสดทันที / รับเงินสดทันที | ตรวจรับและชำระเงินหลังยืนยันสภาพ |
| ให้ราคาสูง / ราคาสูงที่สุด | ประเมินตามรุ่น สเปก และสภาพจริง |
| 10-15 / 15-30 / 15 นาที | ตอบกลับในเวลาทำการ / ตามขั้นตอนตรวจรับจริง |
| ปลอดภัย 100% | ตามขั้นตอนที่แนะนำ |
| รับทุกสภาพ / ทุกสภาพ | ประเมินตามสภาพและอาการของสินค้า |
| อันดับหนึ่ง / ตัวเลือกอันดับหนึ่ง | ให้ความสำคัญกับลูกค้า / หนึ่งในปัจจัยที่ลูกค้าใช้พิจารณา |
| ราคาสูงขึ้น (heading การศึกษา) | ราคาประเมินดีขึ้น |

---

## `[slug].astro` template changes

| ตำแหน่ง | Before | After |
|---------|--------|-------|
| Meta description (transactional) | `ประเมินฟรีใน 15 นาที จ่ายเงินสดทันที` | `ประเมินเบื้องต้นในเวลาทำการ ตรวจรับและชำระเงินหลังยืนยันสภาพ` |
| Hero urgency bar | `ประเมินฟรี 15 นาที · จ่ายเงินสดทันที` | `ประเมินเบื้องต้นในเวลาทำการ · ชำระเงินหลังยืนยันสภาพ` |
| ContactBox (top) | `15 นาที จ่ายสดทันที` | `เวลาทำการ ชำระเงินหลังยืนยันสภาพ` |
| ContactBox (footer) | `ขายด่วน ได้เงินทันที … จ่ายสดทันที` | `ชำระเงินหลังยืนยันสภาพ … ประเมินเบื้องต้น` |

---

## ไฟล์ที่แก้

### Scripts
- `scripts/apply-legacy-claim-sweep.mjs` — **ใหม่** bulk sweep สำหรับ legacy/secondary pages
- `scripts/claim-audit.mjs` — output → `batch-5-8/`, docs/recovery → `ignored` tier, `passed` = critical=0 AND warning=0

### Pages (14 ตาม scope + 2 ที่พบระหว่าง QA)
- `src/pages/[slug].astro`
- `src/pages/บริการ.astro`
- `src/pages/คู่มือก่อนขาย.astro`
- `src/pages/รับซื้อ-apple-watch.astro`
- `src/pages/รับซื้อ-ups.astro`
- `src/pages/รับซื้อคอมประกอบ.astro`
- `src/pages/รับซื้อลำโพง.astro`
- `src/pages/รับซื้อสมาร์ทโฟน-android.astro`
- `src/pages/รับซื้อโน๊ตบุ๊ค-อุบลราชธานี-คู่มือ.astro`
- `src/pages/รับซื้อโน๊ตบุ๊ค-โคราช.astro`
- `src/pages/รับซื้อไอโฟน-ขอนแก่น-คู่มือ.astro`
- `src/pages/รับซื้อไอโฟน-อุดรธานี.astro`
- `src/pages/รับซื้อไอโฟน-อุบลราชธานี-คู่มือ.astro`
- `src/pages/เช็กราคาก่อนขาย.astro`
- `src/pages/รับซื้อเครื่องเกม.astro`
- `src/pages/ราคากลางรับซื้อ.astro`

---

## Claim audit result

**Output:** `docs/recovery/batch-5-8/claim-audit.json`  
**Generated:** 2026-07-07T16:15:32Z

```json
{
  "critical": 0,
  "warning": 0,
  "ignored": 11733,
  "passed": true
}
```

- **critical=0** — core pages ยังสะอาด
- **warning=0** — legacy `src/pages/*.astro` ไม่มี claim-heavy เหลือ
- **ignored** — ตัวอย่าง claim ใน `docs/recovery/**/*.md|json` (รายงานเก่า)

---

## Build result

```
npm run build → 780 page(s) built in ~13s
```

---

## Sitemap result

```
sitemap-pages.xml    — 19 URLs
sitemap-services.xml — 468 URLs
sitemap-blog.xml     — 1 URL
sitemap-local.xml    — 48 URLs
```

---

## SEO audit

```
node scripts/seo-audit.mjs --source
0 errors, 26 warnings (legacy duplicate descriptions / canonical — non-blocking)
```

---

## Schema audit

```
node scripts/schema-audit.mjs
0 errors, 0 warnings
```

---

## Mobile UX audit

```
node scripts/mobile-ux-audit.mjs
11/11 core pages PASS — 0 errors, 0 warnings
```

---

## Internal link audit (reference)

```
704 issues — pre-existing legacy/quarantine links (นอกเกณฑ์ Batch 5.8)
```

---

## สิ่งที่ไม่ได้แก้

- Slug / redirect / gone / sitemap logic
- Schema `@type` / `@id` structure
- `docs/recovery/**` เนื้อหารายงานเก่า (ย้ายไป `ignored` tier ใน audit)

---

## Recommendation

| Question | Answer |
|----------|--------|
| ผ่านเกณฑ์ Batch 5.8? | ✅ ใช่ |
| Safe to commit? | ✅ ใช่ |
| Deploy? | ไม่ได้รัน (ตามคำสั่ง) |

---

## QA commands

```bash
npm run build
npm run sitemap
node scripts/seo-audit.mjs --source
node scripts/internal-link-audit.mjs
node scripts/schema-audit.mjs
node scripts/mobile-ux-audit.mjs
node scripts/claim-audit.mjs
```
