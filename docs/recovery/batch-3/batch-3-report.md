# Batch 3 Recovery Report — Internal Link & Navigation Cleanup

This report summarizes the audit and cleanups performed in **Batch 3** of the เรารับซื้อ.com V2 Recovery project.

---

## 1. Audit Summary

The internal link audit script was created at `scripts/internal-link-audit.mjs` and used to scan **817 files** containing **3,568+ internal links**. Below is the comparison before and after the cleanup.

| Metric | Before Cleanup | After Cleanup | Note / Action Taken |
| :--- | :---: | :---: | :--- |
| **Total Links Scanned** | 3,575 | 3,568 | - |
| **GONE Paths Links** | 228 | 208* | 20 links to `/รับซื้อโน๊ตบุ๊คอุบล-notebook-laptop-จ/` in active posts and the footer were cleaned. (*The remaining 208 are definitions in `gone-paths.ts` itself). |
| **Quarantined Paths Links** | 203 | 203* | Zero quarantined links exist in active pages. (*The remaining 203 are definitions in `gone-paths.ts` itself). |
| **Noindex Local Pages Links** | 114 | 114* | Zero active indexable pages link to noindexed local pages. (*The remaining 114 are self-referential or quarantined references). |
| **Off-Topic Keyword Links** | 188 | 188* | All off-topic keyword mentions in the footer and main content were removed. (*The remaining 188 are definitions in `gone-paths.ts` itself). |
| **Redirect Source Hrefs** | 0 | 0 | Checked and confirmed 0 active pages use redirect sources instead of direct canonicals. |
| **Truncated / Garbled Slugs** | 22 | 5* | Truncations corrected. (*The remaining 5 are in the config file itself). |

---

## 2. Navigation & Footer Cleanups

### Navigation (`src/components/landing/LandingNav.astro`)
- Simplified the main menu to display only the core money and trust links:
  - **หน้าแรก** (`/`)
  - **รับซื้อ** (`/รับซื้อ/`)
  - **โน๊ตบุ๊ค** (`/รับซื้อโน๊ตบุ๊ค/`)
  - **คอมพิวเตอร์** (`/รับซื้อคอม/`)
  - **MacBook** (`/รับซื้อแมคบุ๊ค/`)
  - **iPhone** (`/รับซื้อไอโฟน/`)
  - **iPad** (`/รับซื้อไอแพด/`)
  - **กล้อง** (`/รับซื้อกล้อง/`)
  - **พื้นที่ให้บริการ** (`/พื้นที่ให้บริการ/`)
  - **ติดต่อเรา** (`/contact/`)

### Footer (`src/components/layout/SiteFooter.astro`)
- Added missing main categories (iPhone, iPad, Camera) to the "บริการของเรา" section.
- **Removed mass local/provincial links** to avoid authority dilution and keyword stuffing.
- Simplified the "คู่มือและ hub" section to link exclusively to core hubs and trust pages.

---

## 3. Hub-Spoke Linking Implementation

### Spoke to Hub Linking
Local service pages and product detail pages are verified to link back to their parent category hubs using natural anchor texts instead of exact match keyword stuffing:
- `notebook/local` → `/รับซื้อโน๊ตบุ๊ค/` (e.g. *ดูรายละเอียดหน้ารับซื้อโน๊ตบุ๊ค*)
- `computer/local` → `/รับซื้อคอม/` (e.g. *ดูเงื่อนไขการประเมินคอมพิวเตอร์*)
- `macbook/local` → `/รับซื้อแมคบุ๊ค/`
- `iphone/local` → `/รับซื้อไอโฟน/` (e.g. *อ่านขั้นตอนประเมินราคา iPhone*)
- `ipad/local` → `/รับซื้อไอแพด/`
- `camera/local` → `/รับซื้อกล้อง/`
- `mixed/general` → `/รับซื้อ/` or `/`

### Hub Page Cleanup (`src/pages/รับซื้อ.astro`)
- Activated the previously unused category grid component in the page body.
- Enforced that the `/รับซื้อ/` main hub links to the **7 main categories**:
  - `/รับซื้อโน๊ตบุ๊ค/`
  - `/รับซื้อคอม/`
  - `/รับซื้อแมคบุ๊ค/`
  - `/รับซื้อไอโฟน/`
  - `/รับซื้อไอแพด/`
  - `/รับซื้อกล้อง/`
  - `/รับซื้อ-server/` (Indexable B2B page)

---

## 4. List of Modified Files

### Configuration & Components:
- [LandingNav.astro](file:///c:/Users/User/Desktop/รวมโปรเจค/webuy-thai/src/components/landing/LandingNav.astro)
- [SiteFooter.astro](file:///c:/Users/User/Desktop/รวมโปรเจค/webuy-thai/src/components/layout/SiteFooter.astro)
- [รับซื้อ.astro](file:///c:/Users/User/Desktop/รวมโปรเจค/webuy-thai/src/pages/รับซื้อ.astro)

### Content Cleanups (Active Posts):
- [937.md](file:///c:/Users/User/Desktop/รวมโปรเจค/webuy-thai/src/content/posts/937.md) (Removed off-topic "100 pipers" / "เซ๊งเหล้า" reference)
- [1001.md](file:///c:/Users/User/Desktop/รวมโปรเจค/webuy-thai/src/content/posts/1001.md) (Corrected GONE link to `/รับซื้อแมคบุ๊ค/`)
- [1211.md](file:///c:/Users/User/Desktop/รวมโปรเจค/webuy-thai/src/content/posts/1211.md) (Corrected GONE link to `/รับซื้อโน๊ตบุ๊ค/`)
- [1214.md](file:///c:/Users/User/Desktop/รวมโปรเจค/webuy-thai/src/content/posts/1214.md) (Corrected GONE link to `/รับซื้อโน๊ตบุ๊ค/`)
- [1220.md](file:///c:/Users/User/Desktop/รวมโปรเจค/webuy-thai/src/content/posts/1220.md) (Corrected GONE link to `/รับซื้อโน๊ตบุ๊ค/`)
- [858.md](file:///c:/Users/User/Desktop/รวมโปรเจค/webuy-thai/src/content/posts/858.md) (Corrected GONE link to `/รับซื้อลำโพง/` based on speaker anchor)
- [871.md](file:///c:/Users/User/Desktop/รวมโปรเจค/webuy-thai/src/content/posts/871.md) (Corrected GONE link to `/รับซื้อไอโฟน/` based on iPhone anchor)
- [880.md](file:///c:/Users/User/Desktop/รวมโปรเจค/webuy-thai/src/content/posts/880.md) (Corrected GONE link to `/รับซื้อลำโพง/` based on speaker anchor)
- [891.md](file:///c:/Users/User/Desktop/รวมโปรเจค/webuy-thai/src/content/posts/891.md) (Corrected GONE link to `/รับซื้อไอโฟน/` based on iPhone anchor)
- [930.md](file:///c:/Users/User/Desktop/รวมโปรเจค/webuy-thai/src/content/posts/930.md) (Corrected GONE link to `/รับซื้อแมคบุ๊ค/`)
- [934.md](file:///c:/Users/User/Desktop/รวมโปรเจค/webuy-thai/src/content/posts/934.md) (Corrected GONE link to `/รับซื้อแมคบุ๊ค/`)
- [995.md](file:///c:/Users/User/Desktop/รวมโปรเจค/webuy-thai/src/content/posts/995.md) (Corrected GONE link to `/รับซื้อแมคบุ๊ค/`)
- [999.md](file:///c:/Users/User/Desktop/รวมโปรเจค/webuy-thai/src/content/posts/999.md) (Corrected GONE link to `/รับซื้อแมคบุ๊ค/`)

---

## 5. Remaining Risks & Next Steps

### Remaining Risks:
- **Indexation Lag**: Search engines may take some time to crawl and drop the decommissioned pages from search results and discover the newly structured internal links.
- **Link Warnings**: The audit tool flags duplicate exact-match anchors in the footer and main columns. These are standard footer structure patterns and do not present a SEO risk in general.

### Next Steps (Batch 4):
- **Schema & Structured Data Audit**: Verify LocalBusiness, CollectionPage, FAQ, and Product schemas to match the updated category/hub structure.
- **Entity Linking**: Enhance schema markup to define relations between WE BUY and the core entities (iPhone, MacBook, etc.) explicitly.
