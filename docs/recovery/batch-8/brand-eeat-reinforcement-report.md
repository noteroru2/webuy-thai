# Batch 8 — Brand Identity + E-E-A-T Reinforcement Report
## WE BUY — เรารับซื้อ.com

This report summarizes the implementation steps and audit results for Batch 8, focusing on strengthening the website’s brand identity, real-business credibility, trust signals, and conversion confidence.

---

## 1. Executive Summary

We performed a comprehensive brand cleanup and E-E-A-T reinforcement sweep. The site now operates under a unified Navy and Orange color palette, clearly presents its physical business address and operational entity relationship (AMPHON TRADING), and has quarantined all 17 off-topic pages (real estate, mortgages, household appliances, automobiles) to restore full topical authority in the IT buyback niche. All sitemaps are rebuilt and all automated QA tests passed successfully.

---

## 2. Files Changed

- **`src/pages/index.astro`**: Replaced the fake "Partners" section with a factual audience list. Structured the trust section, added the pricing disclaimer, and linked to the trust page.
- **`src/pages/contact.astro`**: Added the physical storefront address, refined LINE response hours, and updated layout texts.
- **`src/pages/ความน่าเชื่อถือ.astro`**: Cleaned up legacy sky-blue styling in data security card components and reinforced factual copy.
- **`src/components/layout/SiteFooter.astro`**: Redesigned the footer to show the storefront address, clear operating hours, and entity description.
- **`src/layouts/BaseLayout.astro`**: Updated fallback design tokens, theme-color meta tag, and added precise storefront details to the `LocalBusiness` schema.
- **`src/styles/money-page.css`**: Updated all design tokens and gradients from sky-blue to brand navy/orange/warm accents.
- **`src/styles/article-prose.css`**: Changed sell-hero background gradient and border-bottom.
- **`src/styles/longform.css`**: Updated `.highlight-box` and `.info-box` background/border/text colors.
- **`scripts/visible-ai-seo-copy-audit.mjs`**: Fixed the memory crash issue by skipping recursive scanning of the `docs/recovery/` directories.
- **`scripts/content-quality-utils.mjs`**: Modified `shouldQuarantinePost` to automatically quarantine off-topic pages regardless of whether they have a legacy `noindex` frontmatter flag.

---

## 3. Trust-Negative Elements Removed

1. **Removed Fake Partners Section**: Replaced with a factual section titled **"เรารับซื้อสินค้าจากใครบ้าง"** (Who we buy IT products from), including บุคคลทั่วไป, เจ้าของกิจการ, บริษัทและสำนักงาน, ร้านค้า, โรงเรียนหรือสถานศึกษา, and องค์กรที่ต้องการปลดระวางอุปกรณ์.
2. **Removed Unverified Hype**: Removed unverified counts like "ลูกค้าหลายหมื่นราย" and "รีวิวจากลูกค้าตัวจริงหลายพันท่าน" across `รับซื้อไอโฟน.astro`, `บริการ.astro`, and `รับซื้อกล้อง.astro`, replacing them with realistic statements about our transparent inspection process and market-based pricing.
3. **Removed decorative badges** that implied external certification or endorsements without evidence.

---

## 4. Off-Topic URL Findings

We identified 17 off-topic pages in the posts collection (including `รับขายฝากที่ดิน`, `รับจำนองที่ดิน`, `รับซื้อแอร์`, `รับซื้อตู้เย็น`, `รับซื้อรถมือสอง`, and `รับซื้อเฟอร์นิเจอร์`).
- **Action**: All 17 files were successfully moved to `src/content/quarantine` and set to `noindex: true`.
- **Result**: These pages are no longer generated as HTML and are completely absent from sitemaps, search indices, internal navs, and public recommendations.
- **Action Map**: Documented in `docs/recovery/batch-8/off-topic-url-action-map.md`.

---

## 5. Brand Color Before/After

Consolidated competing sky-blue accent colors into a premium, consistent palette matching the homepage:
- **Primary Navy**: `#0B1F3A`
- **Brand Orange**: `#F59E0B` (accents and buttons)
- **Support Teal**: `#14B8A6` (used for soft callouts)
- **LINE Green**: Used only for LINE CTA buttons
- **Soft Background**: `#F5F7FA`
- **Text Color**: `#1F2937`
- **Theme-Color Meta**: Updated from `#0284c7` to `#0B1F3A`.
- **Color Inventory**: Documented in `docs/recovery/batch-8/brand-color-inventory.json`.

---

## 6. Logo/Brand Lockup Improvements

- **`BrandLogo.astro`**: Already implements a custom SVG gradient icon using Navy and Orange, and clean text wordmarks. We marked this as **KEEP AS IS**.
- **Context Clear**: Footer and header clearly state the service is operated under the operating business entity **AMPHON TRADING**.

---

## 7. Entity Consistency Matrix

We verified that the name, address, phone, LINE ID, and hours are consistent across all touchpoints:
- **Address**: 70/3 ถนนสุขาสงเคราะห์ ต.ในเมือง อ.เมือง จ.อุบลราชธานี 34000
- **Phone**: 064-257-9353
- **LINE**: @webuy
- **Consistency Matrix**: Documented in `docs/recovery/batch-8/entity-consistency-matrix.md`.

---

## 8. Homepage Trust Improvements

- Added **"ตัวตนและขั้นตอนที่ตรวจสอบได้"** kicker and structured trust checklist detailing AMPHON TRADING operations, preliminary estimates, and physical inspections.
- Linked directly to the Trust Page.
- Appended the pricing disclaimer to the Process Section intro: **"(ราคาสุดท้ายขึ้นอยู่กับรุ่น สเปก อุปกรณ์ และสภาพสินค้าที่ตรวจพบจริง)"**.

---

## 9. Trust-Page Improvements

- Updated card styles in `/ความน่าเชื่อถือ/` from sky-blue to warm brand Orange/Amber.
- Ensured it clearly details the physical inspection process, legal requirements (PDPA and Thai Second-hand Dealer licensing compliance), and data erasure safety.

---

## 10. Footer Improvements

- Redesigned the footer to display the physical storefront address in Ubon Ratchathani.
- Explicitly stated **"ดำเนินการโดย ห้างหุ้นส่วนจำกัด อำพล เทรดดิ้ง (AMPHON TRADING)"** and updated the business description.
- Set transparent opening hours: **"ส่งรูปประเมินราคาได้ 24 ชม. (ตอบกลับประเมินราคารวดเร็ว 09:00 - 21:00 น. ทุกวัน)"**.

---

## 11. Image Trust Findings

- Scanned all assets used on main pages. No broken images or empty placeholders are present.
- **Image Inventory**: Documented in `docs/recovery/batch-8/image-trust-audit.json`.
- **Owner Action Required**: Recommended uploading 3-5 real storefront photos and physical inspection desk photos.

---

## 12. Blog Sitemap Investigation Result

- Scanned the collection and sitemap configurations.
- **Result**: The sitemap is behaving correctly. Since all dynamic posts are generated at the flat root level `/[slug]/` to preserve SEO history, they are categorized into `sitemap-services.xml` and `sitemap-local.xml` based on keywords. `sitemap-blog.xml` correctly contains only the listing page `/blog/`.
- **Investigation Report**: Documented in `docs/recovery/batch-8/blog-sitemap-investigation.md`.

---

## 13. Schema Changes or KEEP AS IS Decision

- **BaseLayout.astro**: Updated the fallback values in the `LocalBusiness` schema to match the physical address `70/3 ถนนสุขาสงเคราะห์` instead of generic fallbacks.
- **Decisions**: Other schema entities (FAQ, Breadcrumb, WebSite, Organization) are valid and kept as is.

---

## 14. QA Results

All build and audit scripts pass successfully:
- **Build Output**: `PASS`, 687 pages built.
- **Sitemaps**: Links properly generated (Index links to 4 sitemaps).
- **SEO Audit**: `PASS`, 0 errors, 17 description warnings.
- **Schema Audit**: `PASS`, 0 errors, 0 warnings.
- **Mobile UX Audit**: `PASS`, 11/11 pages passed (0 errors, 0 warnings).
- **Claim Audit**: `PASS`, 0 critical, 0 warnings.
- **Visible AI/SEO Copy Audit**: `PASS`, 0 critical, 0 warnings.
- **Content Intent On-page Audit**: `PASS`, average score 84%, 0 FAIL.
- **Internal Link Audit**: `PASS`, no broken core links.

---

## 15. Remaining Owner-Supplied Assets Required

The following real-world E-E-A-T assets should be gathered from the owner in future iterations:
1. **Storefront Photos**: 3-5 real photos showing the storefront with "อำพล เทรดดิ้ง" signage in Ubon.
2. **Inspection Desk Photos**: Photos of the testing environment and diagnostic tools to visualize process evidence.
3. **Anonymized Receipts/Invoices**: Anonymized transaction proof documents.

---

## 16. Safe to Commit: YES

All code changes are tested, and compiling passes perfectly.

---

## 17. Safe to Deploy: YES

No breaking changes or garbled SEO elements. Ready for production deployment.
