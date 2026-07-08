# รายงานการลบข้อความ Visible SEO/AEO/GEO Copy (Batch 5.9)

**เป้าหมาย:** ลบคำและ section ที่พูดกับ search engine / AI engine โดยตรงออกจากหน้าเว็บ public ทั้งหมด แล้ว rewrite เป็นภาษาที่ลูกค้าอ่านได้อย่างเป็นธรรมชาติ

---

## 1. คำและ Section ที่พบก่อนการแก้ไข

ก่อนทำการแก้ไข ตรวจพบการใช้คำว่า **SEO**, **Local SEO**, **AEO**, **Answer Engine**, **GEO**, **Generative AI**, และ **AI Overview** บนหน้าเว็บไซต์หลักและองค์ประกอบต่าง ๆ ดังนี้:

- **Local Area Section:** ปรากฏคำว่า `Local SEO:` ตามด้วยรายชื่อคำค้นหาเชิงเทคนิค
- **SEO Prose Section (หน้าแรก):** ปรากฏกล่องคำแนะนำสำหรับ `Answer Engine (AEO)` และสรุปข้อมูล `Generative AI Summary (GEO)`
- **Natural SEO Sections (Longform component):** ปรากฏประเด็นและบทความเกี่ยวกับ `มุมมอง SEO, AEO และ GEO ที่ควรไปด้วยกัน` และย่อหน้าที่ชี้แนะการจัดทำข้อมูลให้บอท
- **FAQ Section Premium:** ปรากฏคำเกริ่นเริ่มต้นที่ระบุว่าคำถาม `เหมาะสำหรับการค้นหาและ AI Overview`
- **หน้าเฉพาะบุคคล/ท้องถิ่น (โคราช & อุดรฯ):** ปรากฏหัวข้อกล่อง `Generative AI Summary (GEO)`
- **หน้าหมวดสินค้าต่าง ๆ (กล้อง, คอม, MacBook, iPad, iPhone):** ปรากฏป้ายหัวข้อ `.appendix-label` ที่ระบุว่า `รายละเอียดเพิ่มเติมสำหรับ SEO — เนื้อหาด้านล่างเป็นการอธิบายเชิงลึก`

---

## 2. ไฟล์ที่ได้รับการแก้ไข

ได้รับการตรวจสอบและแก้ไขโดยไม่มีการเปลี่ยนโครงสร้าง Schema, Slug, หรือลบหน้าเว็บใด ๆ:
1. [src/components/home/LocalAreaSection.astro](file:///c:/Users/User/Desktop/project%20ทั้งหมด/webuy-thai/src/components/home/LocalAreaSection.astro)
2. [src/components/home/SeoProseSection.astro](file:///c:/Users/User/Desktop/project%20ทั้งหมด/webuy-thai/src/components/home/SeoProseSection.astro)
3. [src/components/longform/NaturalSeoSections.astro](file:///c:/Users/User/Desktop/project%20ทั้งหมด/webuy-thai/src/components/longform/NaturalSeoSections.astro)
4. [src/components/home/FaqSectionPremium.astro](file:///c:/Users/User/Desktop/project%20ทั้งหมด/webuy-thai/src/components/home/FaqSectionPremium.astro)
5. [src/pages/ราคากลางรับซื้อ.astro](file:///c:/Users/User/Desktop/project%20ทั้งหมด/webuy-thai/src/pages/ราคากลางรับซื้อ.astro)
6. [src/pages/blog/index.astro](file:///c:/Users/User/Desktop/project%20ทั้งหมด/webuy-thai/src/pages/blog/index.astro)
7. [src/pages/รับซื้อโน๊ตบุ๊ค-โคราช.astro](file:///c:/Users/User/Desktop/project%20ทั้งหมด/webuy-thai/src/pages/รับซื้อโน๊ตบุ๊ค-โคราช.astro)
8. [src/pages/รับซื้อไอโฟน-อุดรธานี.astro](file:///c:/Users/User/Desktop/project%20ทั้งหมด/webuy-thai/src/pages/รับซื้อไอโฟน-อุดรธานี.astro)
9. [src/pages/รับซื้อกล้อง.astro](file:///c:/Users/User/Desktop/project%20ทั้งหมด/webuy-thai/src/pages/รับซื้อกล้อง.astro)
10. [src/pages/รับซื้อคอม.astro](file:///c:/Users/User/Desktop/project%20ทั้งหมด/webuy-thai/src/pages/รับซื้อคอม.astro)
11. [src/pages/รับซื้อแมคบุ๊ค.astro](file:///c:/Users/User/Desktop/project%20ทั้งหมด/webuy-thai/src/pages/รับซื้อแมคบุ๊ค.astro)
12. [src/pages/รับซื้อโน๊ตบุ๊ค.astro](file:///c:/Users/User/Desktop/project%20ทั้งหมด/webuy-thai/src/pages/รับซื้อโน๊ตบุ๊ค.astro)
13. [src/pages/รับซื้อไอแพด.astro](file:///c:/Users/User/Desktop/project%20ทั้งหมด/webuy-thai/src/pages/รับซื้อไอแพด.astro)
14. [src/pages/รับซื้อไอโฟน.astro](file:///c:/Users/User/Desktop/project%20ทั้งหมด/webuy-thai/src/pages/รับซื้อไอโฟน.astro)

---

## 3. ตัวอย่างการเปรียบเทียบก่อนและหลังการแก้ไข (Before/After)

### ตัวอย่างที่ 1: Local Area Section
* **Before:** `Local SEO: คำค้นหาเช่น "รับซื้อโน้ตบุ๊ค อุบลราชธานี" "รับซื้อคอม กรุงเทพ" "รับซื้อ MacBook ใกล้ฉัน" — แนะนำระบุจังหวัดและรุ่นเครื่องเมื่อติดต่อเพื่อให้ทีมงานตอบได้ตรงพื้นที่และคิวงาน`
* **After:** `พื้นที่ให้บริการ: แนะนำระบุจังหวัดและรุ่นเครื่องเมื่อติดต่อ เพื่อให้ทีมงานตอบได้ตรงพื้นที่และคิวงาน`

### ตัวอย่างที่ 2: SeoProseSection.astro (Header)
* **Before:** `คำแนะนำสำหรับ Answer Engine (AEO)` และ `Generative AI Summary (GEO)`
* **After:** `คำตอบสั้นสำหรับลูกค้า` และ `สรุปบริการของเรา`

### ตัวอย่างที่ 3: FaqSectionPremium.astro (Intro)
* **Before:** `ตอบสั้น ชัดเจน เหมาะสำหรับการค้นหาและ AI Overview — หากเคสซับซ้อนแนะนำติดต่อทีมงานโดยตรง`
* **After:** `ตอบคำถามที่ลูกค้าพบบ่อย เพื่อความเข้าใจที่ง่ายและรวดเร็ว — หากเคสซับซ้อนแนะนำติดต่อทีมงานโดยตรง`

### ตัวอย่างที่ 4: Blog Index Local section
* **Before Kicker/Title:** `Local intent` / `หน้าท้องถิ่นที่ควรดันต่อ` / `รวมหน้าที่มีคำค้นเชิงพื้นที่... เพื่อให้ authority ด้าน GEO ชัดขึ้น`
* **After Kicker/Title:** `พื้นที่ให้บริการ` / `พื้นที่ให้บริการนัดรับยอดนิยม` / `รวมคู่มือการขายและการประเมินราคาตามจังหวัดยอดนิยม เช่น อุบลราชธานี ขอนแก่น อุดรธานี และนครราชสีมา`

### ตัวอย่างที่ 5: หมวดหน้าสินค้าทั่วไป (.appendix-label)
* **Before:** `รายละเอียดเพิ่มเติมสำหรับ SEO — เนื้อหาด้านล่างเป็นการอธิบายเชิงลึก`
* **After:** `รายละเอียดการให้บริการเพิ่มเติมสำหรับลูกค้า`

---

## 4. ผลการตรวจสอบความถูกต้อง (QA Audit Results)

การรันคำสั่งรันระบบทดสอบของ Batch 5.9 ทั้งหมดให้ผลลัพธ์ผ่านเกณฑ์ 100%:

### 4.1 Build Result
- **สถานะ:** สำเร็จโดยไม่มีข้อผิดพลาด (PASS)
- **ไฟล์ผลลัพธ์:** สร้างไฟล์หน้าเว็บ 780 หน้าพร้อมไฟล์ sitemaps ในโฟลเดอร์ `dist` เรียบร้อย

### 4.2 SEO Audit
- **สถานะ:** 0 errors
- **รายละเอียด:** รายงานถูกบันทึกที่ `reports/seo-audit.json`

### 4.3 Schema Audit
- **สถานะ:** 0 errors / 0 warnings
- **รายละเอียด:** รายงานถูกบันทึกที่ `docs/recovery/batch-4/schema-audit-after.json`

### 4.4 Mobile UX Audit
- **สถานะ:** PASS (0 errors / 0 warnings)
- **รายละเอียด:** รายงานถูกบันทึกที่ `docs/recovery/batch-5/mobile-ux-audit.json`

### 4.5 Claim Audit
- **สถานะ:** PASS (0 critical / 0 warnings)
- **รายละเอียด:** รายงานถูกบันทึกที่ `docs/recovery/batch-5-8/claim-audit.json`

### 4.6 Visible AI/SEO Copy Audit
- **สถานะ:** PASS (0 critical)
- **รายละเอียด:**
  - **Critical (Public dist HTML):** 0
  - **Warning (Source code only):** 34 (พบเฉพาะโครงสร้างตัวแปรของโค้ด เช่น ชื่อพร็อป `geo`, ชื่อคลาส CSS `money-seo-appendix`, และเอกสาร `llms.txt.ts` เท่านั้น)
  - **Ignored (Recovery docs/reports):** 121
  - **ไฟล์ผลลัพธ์:** บันทึกไว้ที่ `docs/recovery/batch-5-9/visible-ai-seo-copy-audit.json`

---

## 5. การยืนยันความปลอดภัยในระบบ (Verification)

ขอยืนยันว่าหลังจากสร้างบิลด์ล่าสุดในไดเรกทอรี `dist` แล้ว:
- **ไม่มีคำว่า SEO, AEO, GEO หรือ AI Overview ปรากฏอยู่ในเนื้อหาที่เรนเดอร์ให้ผู้ใช้อ่านจริง (Visible Text)**
- ข้อมูลทางด้านเทคนิคหลังบ้าน (JSON-LD, Sitemap, Redirects) และ Meta SEO Tags ถูกคงอยู่ครบถ้วนตามหลักเกณฑ์ของนักวิเคราะห์คุณภาพ SEO
