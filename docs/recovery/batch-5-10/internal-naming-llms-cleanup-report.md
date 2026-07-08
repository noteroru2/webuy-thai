# รายงานการปรับปรุงชื่อภายในและล้างคำศัพท์เชิงเทคนิคใน llms.txt (Batch 5.10)

**เป้าหมาย:** ลบคำศัพท์เชิงเทคนิค SEO/AEO/GEO ออกจากโครงสร้างโค้ดภายในตัวแปร พร็อป คลาสสไตล์ และไฟล์ข้อมูลสำหรับบอท (llms.txt) เพื่อให้ระบบโค้ดสะอาดและไม่หลงเหลือคีย์เวิร์ดเหล่านี้ในการเรนเดอร์หรือการสแกนโค้ดของ Search Engine / AI Engine

---

## 1. การปรับปรุงคลาสสไตล์และรหัสตำแหน่ง (CSS & ID Renaming)

ได้ทำการเปลี่ยนชื่อ Class และ ID ที่ใช้งานภายในซอร์สโค้ดของไฟล์หน้าเว็บและคอมโพเนนต์ต่าง ๆ ดังนี้:

- `.money-seo-appendix` ➡️ `.service-detail-appendix` (อ้างอิง: `src/styles/money-page.css` และหน้าหมวดสินค้าทั้งหมด)
- `.seo-appendix` ➡️ `.service-detail-appendix` (อ้างอิง: `src/pages/รับซื้อ.astro`)
- `.seo-appendix-heading` ➡️ `.service-detail-heading` (อ้างอิง: `src/pages/รับซื้อ.astro`)
- `#seo-about-heading` ➡️ `#service-about-heading` (อ้างอิง: `src/components/home/SeoProseSection.astro`)

---

## 2. การปรับปรุงตัวแปรและ Component Props (`geo` ➡️ `locationContext`)

เปลี่ยนชื่อพร็อปและตัวแปรของกล่องข้อความอธิบายบริบทเชิงพื้นที่จากเดิม `geo` เป็น `locationContext` เพื่อให้สื่อความหมายอย่างตรงไปตรงมาสำหรับฟังก์ชันการวิเคราะห์ตามจังหวัดของหน้าและบทความ:

- **คอมโพเนนต์หลัก:** `src/components/longform/NaturalSeoSections.astro` (ปรับเปลี่ยน Type และการใช้งานในแท็กทั้งหมด)
- **ไลบรารีข้อมูล:** `src/lib/article-longform.ts` (ปรับปรุงฟิลด์ `LongformConfig`)
- **หน้าเว็บเรียกใช้งาน:** ปรับปรุงใน 8 หน้าหลักที่มีการแสดงบล็อกพื้นที่ เช่น `contact.astro`, `ความน่าเชื่อถือ.astro`, `คู่มือก่อนขาย.astro`, `พื้นที่ให้บริการ.astro`, `ราคากลางรับซื้อ.astro`, `เกี่ยวกับเรา.astro`, และหน้าหมวดรับซื้ออื่น ๆ

---

## 3. การเขียนเอกสาร llms.txt และ llms-full.txt ใหม่

ปรับเปลี่ยนหัวข้อและคำอธิบายภายในไฟล์บอกกรอบข้อมูล AI เพื่อไม่ให้ใช้ศัพท์เทคนิคหลังบ้านในการคุยกับ AI Agent:

- **llms.txt.ts:**
  - `## SEO / AEO hubs (primary navigation)` ➡️ `## Core service pages (primary navigation)`
  - `## Ubon Ratchathani guides (GEO / local)` ➡️ `## Ubon Ratchathani guides (Service area coverage)`
  - `## Answering policy (AEO / AI)` ➡️ `## Answering guidance for users (Answering policy)`
- **llms-full.txt.ts:**
  - `## 3. Geographical Reach (GEO Optimization)` ➡️ `## 3. Service area coverage`
  - `## 4. SEO / AEO Hubs` ➡️ `## 4. Core service pages`
  - `to ensure optimal AEO and Rich Results.` ➡️ `to ensure optimal search experiences and Rich Results.`
  - `## 7. AI Interaction Rules (AEO Guidelines)` ➡️ `## 7. User answer guidelines (Answering guidance for users)`

*หมายเหตุ: คงไว้ซึ่งข้อมูลสำคัญของแบรนด์ WE BUY, AMPHON TRADING, ข้อมูลนัดรับ, การแอดไลน์ @webuy และเบอร์โทร 064-257-9353 ครบถ้วน*

---

## 4. ผลการตรวจสอบความถูกต้อง (QA Audit Results)

ทุกการตรวจสอบผ่านเกณฑ์อย่างสมบูรณ์ 100%:

### 4.1 Build & Sitemap Result
- **สถานะ:** สำเร็จโดยไม่มีข้อผิดพลาด (PASS)
- **ผลลัพธ์:** หน้าเว็บถูกคอมไพล์ 780 หน้า พร้อมสร้างดัชนี Sitemap XML ครบถ้วน

### 4.2 SEO Audit
- **สถานะ:** 0 errors
- **ผลลัพธ์:** หน้าเว็บทั้งหมดผ่านเกณฑ์ความสะอาดทางโครงสร้าง

### 4.3 Schema Audit
- **สถานะ:** 0 errors / 0 warnings
- **ผลลัพธ์:** โครงสร้างข้อมูล Schema.org ถูกต้องสมบูรณ์

### 4.4 Mobile UX Audit
- **สถานะ:** PASS (0 errors / 0 warnings)
- **ผลลัพธ์:** การทดสอบความพร้อมทางโมบายผ่านเกณฑ์

### 4.5 Claim Audit
- **สถานะ:** PASS (0 critical / 0 warnings)
- **ผลลัพธ์:** คำเคลมราคาสูงเกินจริงเป็นศูนย์

### 4.6 Visible AI/SEO Copy Audit
- **สถานะ:** PASS (0 critical / 0 warnings)
- **ผลลัพธ์:**
  - **Critical (dist HTML):** 0
  - **Warning (source code):** 0 (ล้างคำศัพท์เทคนิคในระดับโค้ดของซอร์สโค้ดหลักเสร็จสิ้นจนเป็น 0)
  - **Ignored (recovery/docs):** 557
  - **ไฟล์รายงาน:** `docs/recovery/batch-5-10/visible-ai-seo-copy-audit.json`

---

## 5. การรับประกันโครงสร้างระบบ (Non-Breaking Guarantee)

การแก้ไขทั้งหมดใน Batch 5.10 นี้เป็นเพียงการปรับปรุงและชำระล้างโค้ดส่วนหน้า (Source-level Refactoring) **โดยไม่ได้เปลี่ยนโครงสร้าง Slug, ลิงก์เชื่อมโยง, ข้อมูล Meta Tags ปลั๊กอิน, หรือเปลี่ยนคุณลักษณะโครงสร้าง Schema XML หลังบ้านแต่อย่างใด**
