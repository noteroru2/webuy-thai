# Homepage Header & Hero Polish Report

**โปรเจกต์:** เรารับซื้อ.com  
**วันที่:** 8 กรกฎาคม 2026  
**ขอบเขต:** Header, Logo lockup, Hero, Homepage spacing/cards, Footer, Design tokens  
**ข้อจำกัดที่รักษา:** ไม่แก้ slug, ไม่แตะ sitemap/redirects/gone-paths/schema logic, ไม่สร้างหน้าใหม่

---

## ไฟล์ที่แก้

| ไฟล์ | ประเภทการเปลี่ยนแปลง |
|------|---------------------|
| `src/styles/design-system.css` | อัปเดต design tokens (orange/navy/teal) |
| `src/styles/tailwind.css` | อัปเดต `@theme` ให้สอดคล้องกับ tokens ใหม่ |
| `src/components/BrandLogo.astro` | Logo lockup placeholder ใหม่ (monogram + wordmark) |
| `src/components/landing/LandingNav.astro` | Header redesign + sticky scroll shadow |
| `src/components/landing/Hero.astro` | Hero redesign พร้อม floating card |
| `src/components/landing/ButtonLink.astro` | เพิ่ม `min-h-11` สำหรับ tap target |
| `src/components/layout/SiteFooter.astro` | Footer polish navy + CTA |
| `src/components/services/ServiceCard.astro` | Card polish (height, clamp, shadow) |
| `src/components/landing/FeatureCard.astro` | Card polish |
| `src/components/ui/ServiceCategoryGrid.astro` | Category card polish + soft-gray bg |
| `src/components/ui/EstimateCards.astro` | Estimate card polish |
| `src/components/home/BlogPreviewMagazine.astro` | Article section polish (3–4 ใบ) |
| `src/components/CtaBand.astro` | ปรับสีให้สอดคล้อง navy/orange/LINE |
| `src/pages/index.astro` | Spacing, alternate backgrounds, ลด text density, จำกัดบทความ 4 ใบ |

---

## สิ่งที่ปรับใน Header

- ความสูง header **76–84px** (`h-[4.75rem]` / `lg:h-[5.25rem]`)
- พื้นหลัง **white** สะอาด + border `#E8ECF1`
- **Sticky** พร้อม shadow เมื่อ scroll (`is-scrolled` class + inline script)
- Logo ซ้าย มีพื้นที่หายใจมากขึ้น
- Nav กลาง **6 รายการ:** หน้าแรก, รับซื้อ, โน๊ตบุ๊ค, คอมพิวเตอร์, iPhone, ติดต่อเรา
- CTA ขวา 2 ปุ่ม: **โทร** (outline) + **ส่งรูปทาง LINE** (primary เขียว)
- Tap target ทุกปุ่ม/nav **≥ 44px** (`min-h-11`)
- Mobile menu เรียบง่าย: hamburger + dropdown สะอาด, รายการเสริม (MacBook, iPad, กล้อง ฯลฯ) อยู่ใน mobile เท่านั้น

---

## สิ่งที่ปรับใน Logo Lockup

- สร้าง **placeholder brand system** ใน `BrandLogo.astro`:
  - **Icon area:** monogram **W** บนพื้น navy gradient ในกรอบ rounded square
  - **Wordmark:** `WE BUY` (letter-spacing กว้าง, navy)
  - **Subtitle:** `เรารับซื้อ` (muted gray)
- ลบ tagline ยาว 3 บรรทัดออก — ให้ header โปร่งขึ้น
- รองรับ `variant="footer"` สำหรับพื้น navy (ข้อความขาว)
- สีหลัก: orange `#F59E0B`, navy `#0B1F3A`, teal accent ใน hero bullets

---

## สิ่งที่ปรับใน Hero

- ภาพร้าน `shop-owner-ubon-showroom.webp` + **dark navy overlay** แทน white wash
- **Floating white card** บน hero พร้อม shadow, radius 18px, backdrop blur เบา
- **H1 ใหม่:**  
  `รับซื้อสินค้าไอทีมือสอง / ประเมินราคาเบื้องต้นก่อนได้`
- **Subheadline ใหม่:** ครบหมวดสินค้า + ช่องทาง LINE
- CTA หลัก: ส่งรูปประเมินทาง LINE | รอง: ดูหมวดสินค้าที่รับซื้อ
- Trust bullets 3 จุด (ฟรี / ตรวจรับก่อนจ่าย / ทั่วประเทศ) ด้วย teal accent
- Mobile: padding ลดลง (`py-10` → `py-16` desktop) — CTA เห็นเร็ว ไม่สูงเกิน
- Trust strip ด้านล่างใช้ navy `#0B1F3A`

---

## สิ่งที่ปรับใน Homepage Cards / Footer

### Homepage sections
- เพิ่ม spacing ระหว่าง section (`py-16` → `py-24`)
- Alternate backgrounds: white / `#F5F7FA` / `#fffbeb` (beige CTA band)
- ลดความยาว intro text ใต้หัวข้อ — จำกัด `max-w-[32–36rem]`
- ใช้ `--width-container: 75rem` สม่ำเสมอ

### Cards
- **ServiceCard / FeatureCard / CategoryCard:** radius 16px, shadow tokens, `line-clamp` title/description, min-height สม่ำเสมอ, hover เบา
- **EstimateCards:** header navy, CTA LINE เขียว, ข้อความสั้นลง
- **BlogPreviewMagazine:** แสดงสูงสุด **4 บทความ**, metadata เหลือแค่วันที่, excerpt 2 บรรทัด, ปุ่ม "ดูบทความทั้งหมด"

### Footer
- พื้น **navy `#0B1F3A`** เต็มรูปแบบ
- Logo lockup `variant="footer"` ไม่มีกล่องขาวรอบ
- Typography: white/60 สำหรับลิงก์, spacing เพิ่ม (`py-16` → `py-24`)
- Columns สมดุล: brand 4 col + links 8 col
- CTA band: **ส่งรูปทาง LINE** (primary) + **โทร** (outline)

---

## Design Tokens ที่อัปเดต

```css
--color-orange: #F59E0B
--color-navy: #0B1F3A
--color-teal: #14B8A6
--color-bg-soft: #F5F7FA
--color-text: #1F2937
--radius-card: 1rem (14–18px range)
--shadow-card / --shadow-card-hover / --shadow-header
--width-container: 75rem
```

Brand palette ใน Tailwind เปลี่ยนจาก teal-sky เป็น **orange accent** โดย LINE button ยังคงเขียว

---

## ผล QA

| คำสั่ง | ผล |
|--------|-----|
| `npm run build` | ✅ สำเร็จ |
| `npm run sitemap` | ✅ สร้าง sitemap ครบ (pages 19, services 468, blog 1, local 48) |
| `node scripts/seo-audit.mjs --source` | ✅ 0 errors (25 warnings เป็น duplicate description ที่มีอยู่เดิม) |
| `node scripts/internal-link-audit.mjs` | ✅ รันสำเร็จ (704 issues เป็น legacy/quarantine ที่มีอยู่เดิม ไม่เกี่ยวกับงานนี้) |
| `node scripts/schema-audit.mjs` | ✅ 0 critical errors, 0 warnings |
| `node scripts/mobile-ux-audit.mjs` | ✅ PASS ทุก route รวม `/` (0 errors, 0 warnings) |

---

## ข้อเสนอแนะสำหรับ Logo Final Asset (รอบถัดไป)

1. **Export SVG lockup** จาก design tool โดยใช้โครงสร้างเดียวกับ placeholder ปัจจุบัน:
   - Monogram W บน navy rounded square (48×48 viewBox)
   - Wordmark WE BUY + subtitle เรารับซื้อ แยก layer
2. **สร้างไฟล์ raster** สำหรับ schema/PWA:
   - `public/logo-we-buy.png` (512×512 และ 180×180 apple-touch)
   - อัปเดต `PUBLIC_ORG_LOGO_URL` ถ้าจำเป็น (ไม่แตะ schema logic ในรอบนี้)
3. **Favicon** — ปรับ `public/favicon.svg` ให้ตรง monogram ใหม่ (navy + orange W)
4. **Dark/light variants:**
   - Header: navy text on white
   - Footer: white text on navy
   - OG/social: full-color lockup บนพื้นขาวหรือ navy
5. **ทดสอบขนาดจริง** ที่ 44px icon / 52px header / ไม่ให้ wordmark ตกบรรทัดบน mobile 320px

---

## สรุปภาพรวม

หน้าแรกดู **premium, clean, trustworthy** ขึ้นชัดเจน ผ่าน mobile UX audit โดยไม่แตะโครง SEO สำคัญ (slug, schema logic, sitemap, redirects ไม่ถูกแก้)
