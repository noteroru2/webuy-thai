# Batch 5.5 — Visual UI Refresh Report

**Project:** เรารับซื้อ.com V2 Recovery  
**Date:** 2026-07-07  
**Scope:** Visual UI refresh inspired by reference site (teal/navy/yellow, mobile-first)  
**Status:** Complete — ready for review (not committed/pushed/deployed)

---

## 1. Summary

ปรับ UX/UI ของ 11 หน้า core ให้มีโครงสร้างภาพรวมสะอาด มืออาชีพ และ mobile-first ตามแนว reference site โดย:

- ใช้ design system สีขาว / teal / navy / yellow CTA
- Hero หน้าแรกมีภาพใหญ่ + floating card + navy trust strip
- สร้าง component กลางสำหรับการ์ดราคาตัวอย่าง, grid หมวดบริการ, CTA band
- ลบ fake testimonials (5-star) และ fake live trades slider ออกจากหน้า core
- ไม่แตะ slug, schema logic, redirects, sitemap logic, หรือ rewrite SEO content ใหญ่

---

## 2. Files Changed

### Design System & Global Styles

| File | Change |
|------|--------|
| `src/styles/design-system.css` | **Created** — CSS variables (--color-navy, --color-teal, --color-yellow-cta, etc.) |
| `src/styles/tailwind.css` | Brand tokens teal/navy/yellow (existing, aligned) |
| `src/styles/longform.css` | max-width 820px, line-height 1.85, H2 spacing |
| `src/styles/article-prose.css` | Article hero gradient → teal (was dark navy) |
| `src/layouts/BaseLayout.astro` | Import design-system.css; theme-color orange→teal; mobile CTA bar teal |

### Components

| File | Change |
|------|--------|
| `src/components/landing/Hero.astro` | Full-width hero image + floating white card + navy trust strip |
| `src/components/landing/LandingNav.astro` | White header, teal LINE CTA, hamburger mobile (existing) |
| `src/components/layout/SiteFooter.astro` | Navy footer; AMPHON TRADING mention; column label polish |
| `src/components/CtaBand.astro` | Yellow CTA band + teal button (existing, used on all core pages) |
| `src/components/TrustBar.astro` | Removed fake 4.9/5 rating; factual trust items + teal colors |
| `src/components/ui/EstimateCards.astro` | **Created** — 3-card estimate section with disclaimer |
| `src/components/ui/ServiceCategoryGrid.astro` | **Created** — 7-category grid with images |
| `src/components/ui/MoneyPageHero.astro` | **Created** — compact teal hero (available for money pages) |

### Core Pages (11)

| Page | Changes |
|------|---------|
| `/` (`index.astro`) | EstimateCards + ServiceCategoryGrid; removed testimonials + RecentTradesSlider |
| `/รับซื้อ/` | ServiceCategoryGrid + CtaBand; removed RecentTradesSlider |
| `/รับซื้อโน๊ตบุ๊ค/` | CtaBand (existing); removed RecentTradesSlider |
| `/รับซื้อคอม/` | CtaBand (existing); removed RecentTradesSlider |
| `/รับซื้อแมคบุ๊ค/` | Added CtaBand; removed RecentTradesSlider |
| `/รับซื้อไอโฟน/` | Added CtaBand; removed RecentTradesSlider |
| `/รับซื้อไอแพด/` | Added CtaBand; removed RecentTradesSlider |
| `/รับซื้อกล้อง/` | Added CtaBand; removed RecentTradesSlider |
| `/พื้นที่ให้บริการ/` | Added CtaBand |
| `/contact/` | Added CtaBand |
| `/ความน่าเชื่อถือ/` | Added CtaBand |

### QA Artifacts

| File | Purpose |
|------|---------|
| `docs/recovery/batch-5-5/screenshots/*.png` | 10 Playwright screenshots (5 pages × 2 viewports) |
| `scripts/batch-5-5-screenshots.mjs` | One-off screenshot helper (not added to package.json) |

---

## 3. Design Tokens / Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-navy` | `#0f172a` | Footer, trust strip |
| `--color-teal` | `#0284c7` | Primary CTA, links, hero accents |
| `--color-teal-dark` | `#0369a1` | CTA hover |
| `--color-teal-light` | `#0ea5e9` | Highlights |
| `--color-yellow-cta` | `#fbbf24` | CTA band accent |
| `--color-yellow-bg` | `#fffbeb` | CTA band background |
| `--color-bg-soft` | `#f0f9ff` | Section backgrounds (estimate cards) |
| `--color-card` | `#ffffff` | Cards |
| `--color-text` | `#111827` | Body text |
| `--radius-card` | `1rem` (14–20px range) | Cards, buttons |
| `--shadow-card` | Light multi-layer shadow | Cards |

**Theme color meta:** `#0284c7` (was `#f97316` orange)

---

## 4. Before / After Summary

### Header / Navigation

| Before | After |
|--------|-------|
| White header existed; orange accents in mobile bar | White header + teal LINE CTA; mobile contact bar teal gradient |
| Hamburger mobile panel | Unchanged — white panel, 44px+ tap targets |

### Homepage Hero

| Before | After |
|--------|-------|
| Flat teal block or simple text hero | Full-width professional showroom image |
| — | Floating white card: H1, subheadline, LINE CTA, secondary link |
| — | Navy trust strip below hero with factual trust points |

### Trust Intro

| Before | After |
|--------|-------|
| Mixed layout | Two-column white section: text bullets + team/showroom image |
| Fake 5-star testimonials section | **Removed** — violates no-fake-review rule |

### Example Estimate Cards

| Before | After |
|--------|-------|
| Inline cards on homepage only | Reusable `EstimateCards.astro` component |
| — | 3 cards desktop / 1 column mobile |
| — | Clear disclaimer: ราคาอ้างอิงเท่านั้น |

### Service Category Grid

| Before | After |
|--------|-------|
| Text links / mixed grids | `ServiceCategoryGrid.astro` — image cards, 2–4 columns responsive |
| On hub page: money-links only | Grid added above content on `/รับซื้อ/` and homepage |

### CTA Band (Yellow)

| Before | After |
|--------|-------|
| Only on 3 pages | All 11 core pages |
| — | Yellow background, short copy, teal LINE button |

### Footer (Navy)

| Before | After |
|--------|-------|
| Navy footer existed | AMPHON TRADING mention in about column |
| — | Column label "ข้อมูลช่วยตัดสินใจ" |

### Removed (Compliance)

| Component | Reason |
|-----------|--------|
| `RecentTradesSlider` on core pages | Fake "15 นาทีที่แล้ว" live timestamps |
| Testimonials with 5-star ratings | Fake review/rating — prohibited |

---

## 5. Mobile Viewport Results

Mobile UX audit on all 11 core pages after build:

| Viewport tested by audit | Result |
|--------------------------|--------|
| 360px, 390px, 430px, 768px, 1280px (script defaults) | **PASS — 0 errors, 0 warnings** |

Manual checks via Playwright screenshots at **390px** and **1280px**:

- No horizontal overflow observed on captured pages
- H1 single per page
- CTA visible above fold on homepage
- Tap targets ≥ 44px on CTA band buttons

Screenshots: `docs/recovery/batch-5-5/screenshots/`

| Page | Desktop 1280 | Mobile 390 |
|------|--------------|------------|
| `/` | `home-desktop-1280.png` | `home-mobile-390.png` |
| `/รับซื้อ/` | `hub-desktop-1280.png` | `hub-mobile-390.png` |
| `/รับซื้อโน๊ตบุ๊ค/` | `notebook-desktop-1280.png` | `notebook-mobile-390.png` |
| `/รับซื้อไอโฟน/` | `iphone-desktop-1280.png` | `iphone-mobile-390.png` |
| `/รับซื้อกล้อง/` | `camera-desktop-1280.png` | `camera-mobile-390.png` |

---

## 6. Accessibility Notes

- Hero image uses empty `alt=""` (decorative); meaningful content in card text
- CTA band uses `role="complementary"` + `aria-label`
- Trust strip / estimate section use `aria-labelledby` headings
- Nav mobile menu: existing keyboard/hamburger patterns preserved
- Color contrast: teal on white and white on navy meet readable contrast for CTAs
- No fake `aria-label` star ratings removed with testimonials section

---

## 7. Performance Notes

- Hero LCP image: `fetchpriority="high"`, explicit width/height (1600×900)
- Below-fold grid/card images: `loading="lazy"`, `decoding="async"`
- No new third-party scripts
- No heavy carousel / marquee on core pages (RecentTradesSlider removed)
- CSS-only styling; no new JS bundles
- Build: **780 pages** — unchanged count

---

## 8. QA Results

| Check | Result |
|-------|--------|
| `npm run build` | **PASS** (780 pages) |
| `npm run sitemap` | **PASS** — 19 + 468 + 1 + 48 URLs; no gone/noindex in sitemap |
| `node scripts/seo-audit.mjs --source` | **0 errors** (26 warnings — pre-existing duplicates/canonical on legacy pages) |
| `node scripts/schema-audit.mjs` | **0 errors, 0 warnings** |
| `node scripts/mobile-ux-audit.mjs` | **0 errors, 0 warnings** (all 11 core pages) |
| `node scripts/internal-link-audit.mjs` | UI components: **0 issues**; repo baseline 704 content issues unchanged (legacy markdown gone/quarantine links — not introduced by this batch) |

### QA Fix During Review

- `ServiceCategoryGrid` initially linked to `/รับซื้อคอมบริษัท/` (noindex) → corrected to `/รับซื้อคอม/`

---

## 9. Risks

| Risk | Mitigation |
|------|------------|
| Money page body text still contains legacy claim-heavy phrases (e.g. ราคาสูงที่สุด) | Not rewritten per scope — layout-only refresh |
| `RecentTradesSlider` still on non-core money pages | Out of scope; can address in future batch |
| Article template (`[slug].astro`) not fully restructured | Only CSS polish (hero teal, longform width) — safe for SEO |
| Orange accent may remain in some legacy page inline styles | Core layout/nav/footer migrated to teal |

---

## 10. Intentionally Not Done (SEO Safety)

| Item | Reason |
|------|--------|
| Slug / URL changes | Prohibited |
| New pages / page deletions | Prohibited |
| SEO content rewrite | Prohibited — only layout/spacing/typography |
| Schema logic changes | Prohibited |
| Redirects / gone-paths / sitemap logic | Prohibited |
| Fake reviews, ratings, live timestamps | Removed where found; not added |
| Claim-heavy new copy | Avoided in all new UI text |
| Full article template restructure | Risk to frontmatter/schema/slug |
| MoneyPageHero rollout to all money pages | Existing teal gradient headers already pass mobile audit |
| Commit / push / deploy | Awaiting owner review of this report |

---

## 11. Sign-off Checklist

- [x] 11 core pages refreshed
- [x] Design system tokens documented
- [x] Fake testimonials removed
- [x] Fake live trades removed from core pages
- [x] CTA band on all core pages
- [x] Build passes
- [x] SEO audit 0 errors
- [x] Schema audit 0 errors / 0 warnings
- [x] Mobile UX audit 0 errors / 0 warnings
- [x] Screenshots captured
- [ ] Commit / push / deploy — **pending owner approval**

---

*Generated for Batch 5.5 Visual UI Refresh — เรารับซื้อ.com V2 Recovery*
