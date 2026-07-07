# Batch 5.7 — Final Claim Sweep for SEO Appendix + Meta Copy

**Project:** เรารับซื้อ.com V2 Recovery  
**Date:** 2026-07-07  
**Scope:** Core money pages — visible longform, SEO appendix, frontmatter meta, JSON-LD text fields only  
**Out of scope:** slug changes, new/deleted pages, redirect/sitemap logic, schema type/structure

---

## Executive summary

Batch 5.7 ล้าง claim-heavy copy ที่เหลือจาก Batch 5.6 ใน core pages ทั้ง visible content, SEO appendix, meta description และ JSON-LD text โดยไม่แตะ layout หลักหรือ schema structure

**ผลรวม:** ผ่านเกณฑ์ Batch 5.7 ทั้งหมด

| Gate | Result |
|------|--------|
| Core visible HTML — no claim-heavy | ✅ `claim-audit critical=0` |
| SEO appendix core pages | ✅ ผ่าน (NaturalSeoSections + hub appendix) |
| Meta / JSON-LD text core pages | ✅ ผ่าน |
| `npm run build` | ✅ 780 pages |
| SEO audit | ✅ 0 errors |
| Schema audit | ✅ 0 errors / 0 warnings |
| Mobile UX audit | ✅ 0 errors / 0 warnings |
| Slug / schema structure / sitemap / redirect | ✅ ไม่เปลี่ยน |

**Safe to commit:** ✅ **ใช่** — เฉพาะงาน Batch 5.7 core claim sweep (แนะนำแยก commit จาก legacy post changes อื่นใน working tree ถ้ามี)

---

## Claims พบก่อนแก้ (จาก Batch 5.6 known gaps + initial audit)

| ตำแหน่ง | Claim ที่พบ |
|---------|-------------|
| `TrustBadges.astro` | `15 นาที`, `100%`, `77 จังหวัด` |
| `StepCards.astro` | `ตีราคา`, `รับเงินสดทันที`, `10-15 นาที` |
| `ComparisonTable.astro` | `ราคาสูงที่สุด`, `สู้ทุกราคา`, `ไม่กดราคาแน่นอน` |
| `DataPrivacyBlock.astro` | `1,000,000%`, `สูงสุด`, guarantee language |
| `ProvincialGrid.astro` | `วิ่งรับซื้อทั่วประเทศ`, `รับถึงที่ทั่วประเทศ` |
| `SeoProseSection.astro` | `คุ้มค่าที่สุด`, `ทั่วประเทศ`, `ไม่กดราคาหน้างาน` |
| `NaturalSeoSections.astro` | `100%`, `สูงสุด`, geo claim-heavy |
| Core page meta / JSON-LD | `จ่ายเงินสดทันที`, `ราคาสูงที่สุด`, `15 นาที` |
| SEO appendix บน hub (`รับซื้อ.astro`) | claim ใน longform ยาว |
| Homepage blog preview (`index.html`) | alt text จาก legacy post title: `ด่วนที่สุด ให้ราคาสูง รับถึงที่ จ่ายเงินสด 100%` |

**Initial `claim-audit` (ก่อนแก้):** `critical=7–8` รวม 2 hits สุดท้ายบน `dist/index.html` จาก blog preview

---

## Claims ที่แก้แล้ว (แทนด้วยข้อความปลอดภัย)

| Claim เดิม | ข้อความแทน (ตัวอย่าง) |
|------------|----------------------|
| ราคาสูงที่สุด / ให้ราคาสูง / สู้ทุกราคา | ประเมินตามรุ่น สเปก และสภาพจริง / แจ้งราคาประเมินเบื้องต้นก่อนตกลงขาย |
| จ่ายเงินสดทันที / รับเงินสดทันที / ตีราคาให้ทันที | ตรวจรับและยืนยันสภาพก่อนชำระเงิน |
| 10-15 นาที / 15 นาที / ประเมิน 15 นาที | ส่งรูปประเมินเบื้องต้นทาง LINE / ตอบกลับในเวลาทำการ |
| 100% / 1,000,000% | เงื่อนไขขึ้นอยู่กับการตรวจรับสินค้าจริง |
| รับถึงที่ทั่วประเทศ / ทั่วประเทศทุกจังหวัด | ประเมินออนไลน์สำหรับลูกค้าต่างจังหวัด |
| รับทุกสภาพ | แนะนำให้ล้างข้อมูลและออกจากบัญชีก่อนส่งมอบ (บริบทเตรียมขาย) |
| อันดับ 1 | ลบหรือแทนด้วยภาษา neutral ในส่วนที่ไม่ใช่ core |

---

## ไฟล์ที่แก้

### Shared components (money pages + longform + home)

| File | การเปลี่ยนแปลง |
|------|----------------|
| `src/components/money-pages/TrustBadges.astro` | ลบ timing / 100% / nationwide claims |
| `src/components/money-pages/StepCards.astro` | ขั้นตอนปลอดภัย — LINE ประเมิน → ตรวจรับ → ชำระเงิน |
| `src/components/money-pages/ComparisonTable.astro` | ตารางเปรียบเทียบแบบ neutral |
| `src/components/money-pages/DataPrivacyBlock.astro` | ลบ guarantee / 1,000,000% |
| `src/components/money-pages/ProvincialGrid.astro` | ลบ "วิ่งรับซื้อทั่วประเทศ" |
| `src/components/home/SeoProseSection.astro` | soften superlative / nationwide / ไม่กดราคา |
| `src/components/longform/NaturalSeoSections.astro` | claim sweep + SEO appendix UX (ดูด้านล่าง) |
| `src/components/home/BlogPreviewMagazine.astro` | alt ใช้ `heroImageAlt` หรือ `"ภาพประกอบบทความ"` ไม่ใช้ title |
| `src/lib/claim-filter.ts` | **ใหม่** — `hasClaimHeavyCopy()`, `isSafeHomePreviewPost()` |

### Core pages

| Page | File |
|------|------|
| `/` | `src/pages/index.astro` |
| `/รับซื้อ/` | `src/pages/รับซื้อ.astro` (+ resolve merge conflict, `.seo-appendix` styles) |
| `/รับซื้อโน๊ตบุ๊ค/` | `src/pages/รับซื้อโน๊ตบุ๊ค.astro` |
| `/รับซื้อคอม/` | `src/pages/รับซื้อคอม.astro` |
| `/รับซื้อแมคบุ๊ค/` | `src/pages/รับซื้อแมคบุ๊ค.astro` |
| `/รับซื้อไอโฟน/` | `src/pages/รับซื้อไอโฟน.astro` |
| `/รับซื้อไอแพด/` | `src/pages/รับซื้อไอแพด.astro` |
| `/รับซื้อกล้อง/` | `src/pages/รับซื้อกล้อง.astro` |
| `/พื้นที่ให้บริการ/` | `src/pages/พื้นที่ให้บริการ.astro` |
| `/contact/` | `src/pages/contact.astro` |
| `/ความน่าเชื่อถือ/` | `src/pages/ความน่าเชื่อถือ.astro` |

### Scripts (audit tooling)

| File | หน้าที่ |
|------|--------|
| `scripts/claim-audit.mjs` | **ใหม่** — critical / warning / ignored tiers |
| `scripts/schema-audit.mjs` | JSON-LD syntax + presence บน core |
| `scripts/mobile-ux-audit.mjs` | viewport, mobile CTA, table scroll |
| `scripts/apply-core-claim-sweep.mjs` | helper สำหรับ bulk replace (ไม่ใช่ deliverable หลัก) |

---

## Core pages ที่ตรวจ

```
/
/รับซื้อ/
/รับซื้อโน๊ตบุ๊ค/
/รับซื้อคอม/
/รับซื้อแมคบุ๊ค/
/รับซื้อไอโฟน/
/รับซื้อไอแพด/
/รับซื้อกล้อง/
/พื้นที่ให้บริการ/
/contact/
/ความน่าเชื่อถือ/
```

ตรวจทั้ง: source `.astro`, shared components, frontmatter meta, JSON-LD text, built `dist/**/*.html`

---

## Meta / Schema text ที่แก้ (ตัวอย่าง)

| Page | Field | Before (แนว) | After (แนว) |
|------|-------|--------------|-------------|
| `/รับซื้อ/` | `description` (Organization) | จ่ายเงินสดทันที / ราคาสูง | ประเมินราคาเบื้องต้นตามรุ่น สเปก และสภาพจริงผ่าน LINE |
| Money pages | `WebPage.description` | instant cash / highest price | แจ้งราคาประเมินเบื้องต้นก่อนตกลงขาย |
| Money pages | `Service.serviceType` | — | คง type เดิม แก้เฉพาะข้อความใน name/description |
| `/` | `HowTo` / FAQ text | ชำระเงินทันที | ตรวจรับและชำระเงิน |
| Homepage | blog preview filter | แสดง legacy title ใน alt | กรองด้วย `isSafeHomePreviewPost()` + alt ปลอดภัย |

**หมายเหตุ:** ไม่เปลี่ยน `@type`, `@id`, หรือโครงสร้าง JSON-LD array

---

## SEO appendix UX (NaturalSeoSections)

- เพิ่ม heading: **"รายละเอียดเพิ่มเติมสำหรับผู้ที่ต้องการอ่านเงื่อนไข"**
- ใช้ `<details>/<summary>` — เนื้อหาเปิดอยู่ (`open`) ไม่ซ่อนด้วย `display:none` / ไม่ cloaking
- จำกัดความกว้าง `max-width: 42rem`
- paragraph spacing ปรับให้อ่านง่ายขึ้น
- default `geo` → `"ลูกค้าในหลายพื้นที่"`
- Hub `/รับซื้อ/` มี `.seo-appendix` wrapper + heading เดียวกัน

---

## Claim audit result

**Output:** `docs/recovery/batch-5-7/claim-audit.json`  
**Generated:** 2026-07-07T14:50:04Z

```json
{
  "summary": {
    "critical": 0,
    "warning": 38,
    "ignored": 0,
    "passed": true
  }
}
```

| Tier | Count | หมายเหตุ |
|------|-------|----------|
| **critical** | **0** | core visible HTML + built dist — ผ่าน |
| **warning** | 38 | legacy non-core: `[slug].astro`, `บริการ.astro`, `คู่มือก่อนขาย.astro`, legacy posts — นอก scope Batch 5.7 |
| **ignored** | 0 | — |

**Fix สุดท้าย (homepage):** กรอง blog preview ด้วย `isSafeHomePreviewPost()` และไม่ใช้ post title เป็น `img alt` — แก้ 2 critical hits จาก Apple Watch local post titles

**`100%` pattern:** จำกัดให้จับเฉพาะบริบท claim (เช่น `จ่ายเงินสด 100%`) ไม่จับ CSS `min(100%, …)`

---

## Build result

```
npm run build
✓ 780 page(s) built in ~14s
```

---

## Sitemap result

```
npm run sitemap
sitemap-pages.xml    — 19 URLs
sitemap-services.xml — 468 URLs
sitemap-blog.xml     — 1 URL
sitemap-local.xml    — 48 URLs
sitemap-index.xml    — 4 sitemaps
```

ไม่มีการเปลี่ยน redirect / gone / sitemap logic

---

## SEO audit result

```
node scripts/seo-audit.mjs --source
Pages scanned:     754
Pages with errors: 0
Total errors:      0
Total warnings:    26  (legacy duplicate descriptions / canonical mismatch — non-core)
```

---

## Schema audit result

```
node scripts/schema-audit.mjs
0 errors, 0 warnings
```

---

## Mobile UX audit result

```
node scripts/mobile-ux-audit.mjs
0 errors, 0 warnings
```

---

## Internal link audit (reference only — pre-existing)

```
node scripts/internal-link-audit.mjs
704 issues (gone / quarantined / off-topic legacy links)
```

นอกเกณฑ์ผ่าน Batch 5.7 — ไม่ได้แก้ในรอบนี้

---

## สิ่งที่ไม่ได้แก้ (ตั้งใจ)

- Legacy blog posts (`src/content/posts/*`) — ยังมี warning ใน claim-audit
- `[slug].astro` template สำหรับ legacy local pages
- `src/pages/บริการ.astro`, `คู่มือก่อนขาย.astro` (non-core ในรายการ sweep)
- Redirect / sitemap / schema type structure

---

## Recommendation

| Question | Answer |
|----------|--------|
| ผ่านเกณฑ์ Batch 5.7? | ✅ ใช่ |
| Safe to commit? | ✅ **ใช่** สำหรับชุดไฟล์ Batch 5.7 ด้านบน |
| ข้อควรระวังก่อน commit | Working tree อาจมี legacy post changes / merge state จาก branch อื่น — แนะนำ `git status` และแยก commit เฉพาะ core claim sweep + audit scripts + รายงานนี้ |
| Deploy? | ไม่ได้รัน (ตามคำสั่ง) — พร้อม deploy หลัง commit/review |

---

## QA commands (re-run)

```bash
npm run build
npm run sitemap
node scripts/seo-audit.mjs --source
node scripts/internal-link-audit.mjs
node scripts/schema-audit.mjs
node scripts/mobile-ux-audit.mjs
node scripts/claim-audit.mjs
```
