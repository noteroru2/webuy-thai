# Recovery Batch 4 — Schema + Trust/Entity Report

## 1. Executive Summary
- **Goal**: Clean up, standardize, and optimize structured data (schemas) and Trust/Entity signals across all pages for **เรารับซื้อ.com V2 Recovery**.
- **Result**: Standardized `@id` graph relationships, eliminated unexpected/duplicate `LocalBusiness` schemas from subpages, removed `Article` schemas from core/secondary service pages, linked all services back to the global `#organization`, and added clear trust/entity signals (referencing **ห้างหุ้นส่วนจำกัด อำพล เทรดดิ้ง (AMPHON TRADING)**).
- **Key Metrics (Schema Audit)**:
  - **Before**: 47 Critical Errors, 1101 Warnings on active indexable pages.
  - **After**: **0 Critical Errors, 0 Warnings** (100% clean across all 780 built pages).

---

## 2. Before/After Comparison

| Metric | Before Batch 4 | After Batch 4 | Status |
| :--- | :---: | :---: | :---: |
| **Total Pages Scanned** | 780 | 780 | Verified |
| **Critical Errors** | 47 | **0** | Flawless |
| **Warnings** | 1101 | **0** | Flawless |
| **Global Organization ID** | Missing/Fragmented | `https://xn--c3c3a0aa6cvaf8b9dze.com/#organization` | Linked |
| **Homepage LocalBusiness ID**| Missing/Fragmented | `https://xn--c3c3a0aa6cvaf8b9dze.com/#localbusiness` | Linked |
| **Subpage LocalBusiness** | Present on all local pages | Restricted to `/`, `/contact/`, `/ความน่าเชื่อถือ/` | Resolved |
| **Service Page Articles** | Present on all service pages | **Removed** (Replaced by `Service`, `HowTo`) | Resolved |

---

## 3. Structural & Content Changes Made

### A. Global Layout Restructuring (`src/layouts/BaseLayout.astro`)
- Defined global `Organization` (`#organization`) with rich fields (legal name: **ห้างหุ้นส่วนจำกัด อำพล เทรดดิ้ง**, official logo, social links, contact points).
- Defined `WebSite` (`#website`) schema referencing the organization.
- Confirmed that `LocalBusiness` is only injected on approved pages (`/`, `/contact/`, `/ความน่าเชื่อถือ/`).

### B. Homepage Schema Updated (`src/pages/index.astro`)
- Delegated `Organization` and `LocalBusiness` definitions to `BaseLayout.astro`.
- Removed hardcoded fake reviews/ratings schemas to follow the strict search quality guidelines.

### C. Category Hub Page Updated (`src/pages/รับซื้อ.astro`)
- Formatted as `CollectionPage` with an `ItemList` pointing to the 7 core service pages.
- Linked breadcrumbs and FAQPage cleanly.

### D. Service Pages Schema Restructuring
- **Core Service Pages** (`รับซื้อโน๊ตบุ๊ค`, `รับซื้อคอม`, `รับซื้อแมคบุ๊ค`, `รับซื้อไอโฟน`, `รับซื้อไอแพด`, `รับซื้อกล้อง`):
  - Removed `Article` schema.
  - Linked `WebPage` to `#service`.
  - Configured `Service` schema with `@id: canonicalURL#service` and `provider: organizationId`.
  - Configured `HowTo` schema outlining the simple 4-step buyback process.
- **Local Service Pages Helper** (`src/lib/local-service-pages.ts`):
  - Removed `LocalBusiness` injection.
  - Formatted `Service` schema to link to `#organization` via `@id`.
- **Secondary Service Pages** (`รับซื้อ-apple-watch`, `รับซื้อ-ups`, `รับซื้อคอมประกอบ`, `รับซื้อลำโพง`, `รับซื้อสมาร์ทโฟน-android`, `รับซื้อเครื่องเกม`):
  - Removed `Article` schema.
  - Added clean `Service` and `HowTo` schemas.

### E. Trust & Entity Pages Content Additions
- **Areas Served & Contact** (`พื้นที่ให้บริการ.astro`, `contact.astro`):
  - Updated schemas to link to `#website` and `#organization`.
  - Added entity content to `/contact/` intro referencing **ห้างหุ้นส่วนจำกัด อำพล เทรดดิ้ง (AMPHON TRADING)** and pre-sale conditions.
- **Trust Page** (`ความน่าเชื่อถือ.astro`):
  - Added company credentials referencing **AMPHON TRADING** as the parent operator and outlined conditions for final payment based on physical inspection.

---

## 4. Quality Assurance Summary

1. **Astro Build (`npm run build`)**: Pass (780 pages built successfully).
2. **Sitemap Generation**: Pass (sitemap-index.xml + 4 child sitemaps, 100% clean).
3. **SEO Audit (`seo-audit.mjs`)**: **0 Errors**, minor description duplicates on legacy redirects.
4. **Internal Link Audit (`internal-link-audit.mjs`)**: **0 Links** to noindex/quarantine/gone-paths.
5. **Schema Audit (`schema-audit.mjs`)**: **0 Critical Errors, 0 Warnings**.

---

Report compiled by **Senior Technical SEO Engineer + Structured Data Specialist** on July 7, 2026.
