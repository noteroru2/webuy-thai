# Batch 5.7 — Final Claim Sweep for SEO Appendix + Meta Copy

**Project:** เรารับซื้อ.com V2 Recovery  
**Branch:** `recovery/batch-5-mobile-ux-cwv`  
**Date:** 2026-07-07  
**Base:** Batch 5.5–5.6 mobile UX + landing polish (`77a3d5f`)

---

## Executive summary

ล้าง claim-heavy copy ที่เหลือใน core pages ทั้ง visible longform, SEO appendix, meta/JSON-LD text โดยไม่แตะ layout หลัก, schema structure, slug, redirect หรือ sitemap logic

**ผลรวม: ผ่านเกณฑ์ Batch 5.7**

| Gate | Result |
|------|--------|
| Core visible HTML — no claim-heavy | ✅ `claim-audit critical=0` |
| SEO appendix core pages | ✅ NaturalSeoSections + longform swept |
| Meta / JSON-LD text core pages | ✅ swept |
| `npm run build` | ✅ 780 pages |
| SEO audit | ✅ 0 errors |
| Schema audit | ✅ 0 errors / 0 warnings |
| Mobile UX audit | ✅ 0 errors / 0 warnings |
| Slug / schema structure / sitemap / redirect | ✅ ไม่เปลี่ยน |

**Safe to commit:** ✅ ใช่ — บน branch `recovery/batch-5-mobile-ux-cwv` (ยังไม่ commit ตามคำสั่ง)

---

## Claims พบก่อนแก้ (จาก Batch 5.6 known gaps + initial audit)

| ตำแหน่ง | Claim ที่พบ |
|---------|-------------|
| Money page SEO appendix (longform) | `ราคาสูงที่สุด`, `100%`, `10-15 นาที`, `สูงสุด`, `ให้ราคาสูง` |
| `รับซื้อ.astro` meta/JSON-LD | `ให้ราคาสูง`, `จ่ายเงินสดทันที`, `ประเมินราคาด่วน 24 ชม.` |
| `รับซื้อโน๊ตบุ๊ค.astro` meta | `จ่ายเงินสดทันที บริการ 24 ชม.` |
| `รับซื้อไอโฟน.astro` appendix | `ให้ราคาสูง`, `10-15 นาที`, `100%`, `อันดับหนึ่ง` |
| `ProvincialGrid.astro` | `วิ่งรับซื้อทั่วประเทศ` |
| `NaturalSeoSections.astro` | `ลูกค้าทั่วประเทศ`, ไม่มี appendix heading UX |
| Homepage `index.astro` | blog preview ไม่กรอง claim-heavy posts |
| `RecentTradesSlider.astro` | `15 นาทีที่แล้ว` |
| Service hub cards | `รับทุกสภาพ` (Apple Watch) |

**Initial claim-audit (ก่อนแก้):** `critical=13`, `warning=34`

---

## Claims ที่แก้แล้ว (แทนด้วยข้อความปลอดภัย)

| Claim เดิม | ข้อความแทน |
|------------|------------|
| จ่ายเงินสดทันที / รับเงินสดทันที | ตรวจรับและชำระเงินหลังยืนยันสภาพ |
| ให้ราคาสูง / ราคาสูงที่สุด | ประเมินตามสภาพจริง / แจ้งราคาประเมินเบื้องต้น |
| 10-15 นาที / 15-30 นาที | ตามขั้นตอนตรวจรับจริง / ในเวลาทำการ |
| 100% (marketing) | ตามที่แจ้ง / ตามขั้นตอนที่แนะนำ |
| วิ่งรับซื้อทั่วประเทศ | ให้บริการในหลายพื้นที่ตามหน้าพื้นที่ให้บริการ |
| รับทุกสภาพ | ประเมินตามสภาพและสุขภาพแบต |
| สูงสุด (superlative marketing) | มากขึ้น / ในระดับสูง / ตามสภาพตลาด |

---

## ไฟล์ที่แก้

### Scripts + lib (ใหม่/อัปเดต)

| File | หน้าที่ |
|------|--------|
| `scripts/claim-audit.mjs` | audit core source + dist HTML (critical/warning/ignored) |
| `scripts/apply-core-claim-sweep.mjs` | bulk phrase replacement + extended patterns |
| `src/lib/claim-filter.ts` | `hasClaimHeavyCopy()`, `isSafeHomePreviewPost()` |

### Components

| File | การเปลี่ยนแปลง |
|------|----------------|
| `src/components/longform/NaturalSeoSections.astro` | details/summary appendix UX, `geo` default, max-width |
| `src/components/money-pages/ProvincialGrid.astro` | ลบ nationwide pickup claim |
| `src/components/money-pages/RecentTradesSlider.astro` | ลบ `15 นาทีที่แล้ว` |
| `src/components/home/BlogPreviewMagazine.astro` | alt ปลอดภัย (จาก main) |

### Core pages

| Page | File |
|------|------|
| `/` | `src/pages/index.astro` — blog preview filter |
| `/รับซื้อ/` | `src/pages/รับซื้อ.astro` |
| `/รับซื้อโน๊ตบุ๊ค/` | `src/pages/รับซื้อโน๊ตบุ๊ค.astro` |
| `/รับซื้อคอม/` | `src/pages/รับซื้อคอม.astro` |
| `/รับซื้อแมคบุ๊ค/` | `src/pages/รับซื้อแมคบุ๊ค.astro` |
| `/รับซื้อไอโฟน/` | `src/pages/รับซื้อไอโฟน.astro` |
| `/รับซื้อไอแพด/` | `src/pages/รับซื้อไอแพด.astro` |
| `/รับซื้อกล้อง/` | `src/pages/รับซื้อกล้อง.astro` |
| `/ความน่าเชื่อถือ/` | `src/pages/ความน่าเชื่อถือ.astro` |

**ไม่แก้:** `/พื้นที่ให้บริการ/`, `/contact/` — ไม่พบ claim-heavy ในรอบนี้

---

## Core pages ที่ตรวจ

```
/  /รับซื้อ/  /รับซื้อโน๊ตบุ๊ค/  /รับซื้อคอม/  /รับซื้อแมคบุ๊ค/
/รับซื้อไอโฟน/  /รับซื้อไอแพด/  /รับซื้อกล้อง/
/พื้นที่ให้บริการ/  /contact/  /ความน่าเชื่อถือ/
```

---

## Meta / Schema text ที่แก้ (ตัวอย่าง)

| Page | Field | After |
|------|-------|-------|
| `/รับซื้อ/` | JSON-LD `description` | ประเมินราคาเบื้องต้นตามรุ่น สเปก และสภาพจริงผ่าน LINE |
| `/รับซื้อ/` | `Service.description` | ประเมินตามสภาพจริง ตรวจรับและชำระเงินหลังยืนยันสภาพ |
| `/รับซื้อโน๊ตบุ๊ค/` | `description` | ประเมินราคาเบื้องต้น ตรวจรับและชำระเงินหลังยืนยันสภาพ |
| Money pages | longform appendix | ลบ timing/cash/superlative claims |

ไม่เปลี่ยน `@type`, `@id`, หรือโครงสร้าง JSON-LD

---

## SEO appendix UX

- Heading: **"รายละเอียดเพิ่มเติมสำหรับผู้ที่ต้องการอ่านเงื่อนไข"**
- `<details open>` — เนื้อหาเข้าถึงได้ ไม่ cloaking
- `max-width: 42rem`, paragraph spacing ปรับแล้ว
- default `geo` → `"ลูกค้าในหลายพื้นที่"`

---

## Claim audit result

**Output:** `docs/recovery/batch-5-7/claim-audit.json`  
**Generated:** 2026-07-07T15:59:37Z

```json
{ "critical": 0, "warning": 34, "passed": true }
```

| Tier | Count | หมายเหตุ |
|------|-------|----------|
| **critical** | **0** | ✅ ผ่าน |
| **warning** | 34 | legacy `[slug].astro`, `บริการ.astro` — นอก scope |

---

## Build result

```
npm run build → 780 page(s) built
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
0 errors, 26 warnings (legacy duplicate descriptions / canonical — non-core)
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
704 issues — pre-existing legacy/quarantine links (นอกเกณฑ์ Batch 5.7)
```

---

## Recommendation

| Question | Answer |
|----------|--------|
| ผ่านเกณฑ์ Batch 5.7? | ✅ ใช่ |
| Safe to commit? | ✅ ใช่ บน `recovery/batch-5-mobile-ux-cwv` |
| ข้อควรระวัง | แยก commit จาก audit JSON ที่ regenerate ถ้าไม่ต้องการ noise |

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
