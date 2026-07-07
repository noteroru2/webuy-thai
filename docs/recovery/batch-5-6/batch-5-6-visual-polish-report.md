# Batch 5.6 — Visual Landing Polish + Claim Sweep Report

**Project:** เรารับซื้อ.com V2 Recovery  
**Date:** 2026-07-07  
**Scope:** Claim sweep on core visible UI, money page landing layout, ServiceCategoryGrid polish, longform CSS, QA  
**Status:** Complete — ready for review (not committed/pushed/deployed)

---

## 1. Summary

รอบ Batch 5.6 ต่อจาก visual refresh ของ 5.5 โดยเน้น:

- ลบ claim/stat เสี่ยงใน **visible UI** ของ 11 หน้า core (hero, stat bar, FAQ accordion, ContactBox, CTA)
- แปลง money pages 6 หมวดจาก text wall เป็น **landing sections** (hero → stat bar → card grid → checklist → price table → 3-step → comparison → FAQ → CTA)
- ปรับ `/รับซื้อ/` hub header + SafeProcessBar แทน stat เดิม
- ปรับ `longform.css` และ `money-page.css` สำหรับ mobile readability
- QA ผ่านครบ: build 780 pages, SEO 0 errors, schema 0/0, mobile UX 0/0 บน core 11 หน้า

---

## 2. Claim / Stat Sweep

### แทนที่ใน visible UI (ก่อน → หลัง)

| เดิม (เสี่ยง) | ใหม่ (ปลอดภัย) | ตำแหน่ง |
|--------------|---------------|---------|
| `10,000+` | ส่งรูปประเมินได้ | `TrustBadges.astro` (5.5→5.6) |
| `15 นาที` | ตอบกลับในเวลาทำการ | `TrustBadges`, `StepCards`, `SeoProseSection` |
| `100%` | ตรวจตามสภาพจริง | `TrustBadges`, `ComparisonTable` |
| `77` | ประเมินออนไลน์ทั่วไทย | `TrustBadges` |
| `ราคาดีที่สุด จ่ายเงินสดทันที` | ประเมินตามสภาพจริง + LINE CTA | `/รับซื้อ/` H1/lead |
| `ให้ราคาสูง` (MacBook card) | ประเมินตามสเปกและสภาพ | `/รับซื้อ/` categories |
| `จ่ายสดทันที` / `ตีราคาให้ทันที` | ส่งรูปประเมินเบื้องต้น / ตอบในเวลาทำการ | iPhone `ContactBox` (2 จุด) |
| `1,000,000%` | ล้างข้อมูลตามมาตรฐานที่เหมาะสม | `DataPrivacyBlock.astro` |
| `ชำระเงินทันที` | ชำระเงิน | `index.astro` process step |
| `รับเงินสดทันที` / `10-15 นาที` | ตรวจรับก่อนชำระ / ตอบในเวลาทำการ | `StepCards`, money page FAQ answers |
| `ยกเลิกได้ 100%` (FAQ visible) | ยกเลิกได้ (ไม่บังคับขาย) | `/รับซื้อ/` FAQ body |

### Stat bar ใหม่

สร้าง `SafeProcessBar.astro` — 4 คอลัมน์ desktop / 2 คอลัมน์ tablet / 1 คอลัมน์ mobile:

1. ส่งรูปประเมินได้  
2. ตอบกลับในเวลาทำการ  
3. ตรวจตามสภาพจริง  
4. ประเมินออนไลน์ทั่วไทย  

ใช้บน money pages ทั้ง 6 หมวด + `/รับซื้อ/` hub

---

## 3. Files Changed

### สร้างใหม่

| File | Purpose |
|------|---------|
| `src/components/money-pages/SafeProcessBar.astro` | Process-based stat bar (ไม่มีตัวเลขโอเวอร์) |
| `src/components/money-pages/MoneyPageLanding.astro` | Landing sections A–F + comparison |
| `src/components/money-pages/MoneyPageFaq.astro` | FAQ accordion (สูงสุด 8 รายการ) |
| `src/styles/money-page.css` | Hero, sections, appendix, mobile 390px rules |
| `src/lib/moneyPageLanding.ts` | Per-category landing data (6 หมวด) |
| `scripts/batch-5-6-screenshots.mjs` | Screenshot capture script |

### แก้ไข — Components

| File | Change |
|------|--------|
| `TrustBadges.astro` | Safe process text (ไม่มีตัวเลข) |
| `StepCards.astro` | 3-step safe copy |
| `ComparisonTable.astro` | Process-based comparison, responsive cells |
| `SeoProseSection.astro` | Homepage SEO block claims softened |
| `ServiceCategoryGrid.astro` | Gradient + icon placeholder, equal-height cards |
| `DataPrivacyBlock.astro` | ลบ `1,000,000%` และ copy เสี่ยง |

### แก้ไข — Core Pages

| Page | Change |
|------|--------|
| `/` (`index.astro`) | TrustBadges safe, process step, CtaBand (จาก 5.5) |
| `/รับซื้อ/` | Safe H1/lead, SafeProcessBar, MacBook card desc, FAQ visible answers |
| `/รับซื้อโน๊ตบุ๊ค/` | Full landing layout (template) |
| `/รับซื้อคอม/` | Landing layout + safe hero/FAQ |
| `/รับซื้อแมคบุ๊ค/` | Landing layout + safe hero/FAQ |
| `/รับซื้อไอโฟน/` | Landing on longform + safe hero/ContactBox/MoneyPageFaq |
| `/รับซื้อไอแพด/` | Landing layout + safe hero/FAQ |
| `/รับซื้อกล้อง/` | Landing layout + safe hero/FAQ |
| `/พื้นที่ให้บริการ/` | ไม่มี claim เสี่ยงใน visible UI (ตรวจแล้ว) |
| `/contact/` | ไม่มี claim เสี่ยงใน visible UI (ตรวจแล้ว) |
| `/ความน่าเชื่อถือ/` | Hero/FAQ/card sections ปลอดภัยอยู่แล้ว |

### Styles

| File | Change |
|------|--------|
| `src/styles/longform.css` | max-width 820px, line-height 1.8, table overflow-x, info-box, mobile p |
| `src/styles/money-page.css` | hero max 75vh, section rhythm, responsive tables |

### Dev tooling (screenshots)

| File | Change |
|------|--------|
| `package.json` / `package-lock.json` | เพิ่ม `playwright` (devDependency) สำหรับ screenshot script |

---

## 4. Money Page Landing Sections

โครงที่ใช้ทุก money page (A–I):

| Section | Component / class | Background |
|---------|-------------------|------------|
| A. Compact hero | `money-page-hero` | Teal gradient |
| B. Safe stat bar | `SafeProcessBar` | White cards |
| C. ข้อมูลประเมินราคา | `MoneyPageLanding` eval grid | White |
| D. เช็กก่อนขาย | checklist card | Soft blue |
| E. ปัจจัยราคา | `PriceGuide` table | White |
| F. 3-step process | horizontal desktop / vertical mobile | Soft blue |
| G. Comparison | `ComparisonTable` (safe copy) | Navy table |
| H. FAQ | `MoneyPageFaq` | White |
| I. CTA + footer | `CtaBand` + navy footer | Yellow band |

เนื้อหา SEO ยาวเดิมถูกย้ายไป `money-seo-appendix` พร้อม label แยกชัด — **ไม่ rewrite เนื้อหาใหญ่**

---

## 5. ServiceCategoryGrid Fixes

- ทุก card มี **gradient + icon** ใต้ภาพ (ไม่เป็นพื้นเทาว่างเมื่อรูปไม่โหลด)
- `onerror` ซ่อนรูปแตก → แสดง gradient/icon แทน
- Equal height: `auto-rows-fr`, `min-h-[280px]`, flex column body
- Desktop 3–4 columns (`lg:grid-cols-3 xl:grid-cols-4`), mobile 1–2 columns
- ทุก card มี title, desc, CTA link "ดูรายละเอียด →"

---

## 6. Screenshot QA

**Location:** `docs/recovery/batch-5-6/screenshots/` (10 ไฟล์)

| Page | Desktop 1280 | Mobile 390 |
|------|--------------|------------|
| `/` | `home-desktop-1280.png` | `home-mobile-390.png` |
| `/รับซื้อ/` | `hub-desktop-1280.png` | `hub-mobile-390.png` |
| `/รับซื้อโน๊ตบุ๊ค/` | `notebook-desktop-1280.png` | `notebook-mobile-390.png` |
| `/รับซื้อไอโฟน/` | `iphone-desktop-1280.png` | `iphone-mobile-390.png` |
| `/รับซื้อกล้อง/` | `camera-desktop-1280.png` | `camera-mobile-390.png` |

**Mobile 390px observations:**

- Hero ไม่เกิน 75vh บน money pages
- LINE CTA เห็นเร็วใน hero
- Section cards มี padding พอดี
- ไม่พบ horizontal overflow บน core pages ที่ audit (mobile UX 0 errors)

---

## 7. Audit Results

| Check | Result |
|-------|--------|
| `npm run build` | **PASS** — 780 pages |
| `npm run sitemap` | **PASS** — 4 sitemaps generated |
| `node scripts/seo-audit.mjs --source` | **0 errors** (26 warnings ใน legacy pages — pre-existing) |
| `node scripts/schema-audit.mjs` | **0 errors / 0 warnings** |
| `node scripts/mobile-ux-audit.mjs` | **0 errors / 0 warnings** — 11 core pages PASS |
| `node scripts/internal-link-audit.mjs` | 704 issues — **pre-existing** legacy markdown (ไม่เกี่ยวกับ UI 5.6) |

### Mobile UX — Core Pages

```
/ PASS
/รับซื้อ/ PASS
/รับซื้อโน๊ตบุ๊ค/ PASS
/รับซื้อคอม/ PASS
/รับซื้อแมคบุ๊ค/ PASS
/รับซื้อไอโฟน/ PASS
/รับซื้อไอแพด/ PASS
/รับซื้อกล้อง/ PASS
/พื้นที่ให้บริการ/ PASS
/contact/ PASS
/ความน่าเชื่อถือ/ PASS
```

---

## 8. สิ่งที่ยังเหลือ (Known Gaps)

1. **SEO appendix** บน money pages ยังมี claim ใน paragraph ยาว (`ราคาสูงที่สุด`, `100%`, `10-15 นาที`) — ตั้งใจไม่ rewrite ตาม scope
2. **Meta description / jsonLd** บางหน้ายังมี `จ่ายเงินสดทันที` ใน frontmatter/schema — ไม่แตะ schema logic ตามข้อห้าม
3. **ความน่าเชื่อถือ** — section SEO ลึก (NaturalSeoSections) ยังมี `100%` / `สูงสุด` ในเนื้อหายาว
4. **Unused imports** บาง money page (`TrustBadges`, `StepCards`) — cleanup optional
5. **playwright** เพิ่มเป็น devDependency — ถ้าไม่ต้องการใน repo ถาวร อาจย้ายไป optional หรือใช้เฉพาะ CI

---

## 9. Pass Criteria Checklist

| เกณฑ์ | ผ่าน |
|-------|------|
| ไม่มี claim/stat เสี่ยงใน core **visible UI** (hero, stat bar, FAQ accordion, ContactBox, landing) | ✅ |
| Money pages เป็น landing page มากขึ้น | ✅ |
| `/รับซื้อ/` grid ไม่มี placeholder ว่าง | ✅ |
| Mobile 390px ไม่มี horizontal overflow (audit) | ✅ |
| CTA LINE เห็นง่าย | ✅ |
| Build ผ่าน | ✅ |
| SEO audit 0 errors | ✅ |
| Schema audit 0/0 | ✅ |
| Mobile UX audit 0/0 | ✅ |
| ไม่เปลี่ยน slug/schema/sitemap/redirect logic | ✅ |

---

## 10. Recommendation — Safe to Commit?

**แนะนำ: Safe to commit** สำหรับ Batch 5.5 + 5.6 รวมกัน หลัง human review screenshots

**เหตุผล:**

- Build + schema + mobile UX ผ่านครบ
- Visible UI ของ 11 core pages สะอาดจาก claim/stat เสี่ยงหลัก
- Money pages มี landing rhythm ชัดเจน
- ไม่มี slug/sitemap/redirect/schema logic เปลี่ยน

**ก่อน commit ควร:**

1. Review screenshots ใน `docs/recovery/batch-5-6/screenshots/` ด้วยตา
2. ตัดสินใจว่าจะเก็บ `playwright` ใน devDependencies หรือไม่
3. (Optional) รอบถัดไป: softening meta descriptions + SEO appendix claims แยก batch

**ยังไม่ commit / push / deploy** ตามข้อกำหนดงาน

---

*Report generated: Batch 5.6 Visual Landing Polish + Claim Sweep*
