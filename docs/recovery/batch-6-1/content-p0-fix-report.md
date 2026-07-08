# Batch 6.1 Content P0 Fix Report

โปรเจกต์: เรารับซื้อ.com  
รอบงาน: Batch 6.1 - P0 On-page Content Fix from Batch 6 Audit  
วันที่ตรวจซ้ำ: 2026-07-08

## 1. P0 ก่อนแก้ / หลังแก้

ก่อนแก้จาก Batch 6 audit:

- P0/FAIL หลักในรายงานเดิม: 10 หน้า
- ปัญหาหลัก: forbidden claim copy, Title/Meta/H1 ไม่ตรง focus keyword, image count ต่ำ, text wall ในหน้ารอง

หลังแก้และ rebuild:

- `content-intent-onpage-audit`: FAIL 0 หน้า
- PASS 7 หน้า
- NEEDS IMPROVEMENT 14 หน้า
- Average score 84%
- P0 จาก audit รอบนี้ลดเหลือ 0

## 2. Title / Meta / H1 ที่แก้

- `/รับซื้อไอแพด/`: มี Title, Meta และ H1 ที่มีคำว่า `รับซื้อไอแพด` แล้ว พร้อมภาพประกอบ 3 รูป
- `/พื้นที่ให้บริการ/`: มี Title, H1 และย่อหน้าแรกที่สื่อ `พื้นที่ให้บริการรับซื้อสินค้าไอที` แล้ว พร้อมภาพประกอบ 3 รูป
- `/contact/`: มี Title และ H1 ที่มี `ติดต่อเรา`, เพิ่ม H3 อย่างน้อย 2 หัวข้อ และภาพประกอบ 3 รูป
- `/รับซื้อสมาร์ทโฟน-android/`: ปรับ Title เป็น `รับซื้อสมาร์ทโฟน Android มือสอง`, ลด Meta ให้กระชับ, แยก intro ยาว และเพิ่มภาพ 3 รูป
- `/รับซื้อเครื่องเกม/`: ปรับ Title เป็น `รับซื้อเครื่องเกม PS5 Switch มือสอง`, ลด Meta ให้กระชับ, แยก intro ยาว และเพิ่มภาพ 3 รูป
- `/บริการ/`: ปรับ intro ให้มี `บริการรับซื้อ`, เพิ่ม H3 และเพิ่มภาพ 3 รูป

## 3. Claim Terms ที่ลบหรือปรับ

ปรับคำเสี่ยงในหน้าที่เกี่ยวข้องให้เป็นภาษาปลอดภัยขึ้น:

- `ราคาสูงสุด` / `ราคาสูงที่สุด` -> `ประเมินตามสภาพจริง`, `มีผลต่อช่วงราคาประเมิน`
- `จ่ายทันที` / `เงินสดทันที` -> `ชำระเงินหลังยืนยันสภาพ`, `ออกเอกสารหลังตกลงซื้อขาย`
- `รับทุกสภาพ` ในบริบทเสี่ยง -> เหลือเป็นการประเมินตามเงื่อนไขและสภาพจริง
- ข้อความเชิงรับประกันผลลัพธ์ถูกแทนด้วย `ส่งรูปและสเปกประเมินเบื้องต้นก่อนตกลงขาย`

หมายเหตุ: `claim-audit.mjs` ถูกปรับให้ไม่สแกนไฟล์รายงาน `claim-audit.json` ของตัวเองใน `docs/recovery` เพื่อป้องกัน self-recursive report artifact ที่ทำให้ audit timeout โดยไม่กระทบ public site.

## 4. หน้าที่เพิ่มรูปภาพ

เพิ่มหรือยืนยันภาพประกอบอย่างน้อย 3 รูปในหน้าสำคัญ:

- `/รับซื้อโน๊ตบุ๊ค/`
- `/รับซื้อคอม/`
- `/รับซื้อแมคบุ๊ค/`
- `/รับซื้อกล้อง/`
- `/รับซื้อไอแพด/`
- `/พื้นที่ให้บริการ/`
- `/contact/`
- `/ความน่าเชื่อถือ/`
- `/บริการ/`
- `/รับซื้อสมาร์ทโฟน-android/`
- `/รับซื้อเครื่องเกม/`

ยังเหลือ P1/P2 เรื่อง image count ในบาง informational/secondary pages เช่น `/คู่มือก่อนขาย/`, `/เช็กราคาก่อนขาย/`, `/ราคากลางรับซื้อ/`, `/รับซื้อคอมประกอบ/`, `/รับซื้อลำโพง/`.

## 5. หน้าที่เพิ่ม External Links

ยืนยันว่าหน้า informational มี external links ที่เปิดแท็บใหม่และใช้ `rel="noopener noreferrer"`:

- `/คู่มือก่อนขาย/`: Apple Support
- `/เช็กราคาก่อนขาย/`: Microsoft Support
- `/ราคากลางรับซื้อ/`: มีลิงก์อ้างอิงภายนอกแล้ว แต่ content-intent audit ยังไม่ให้คะแนน external link เพราะ whitelist ของสคริปต์นับเฉพาะบางโดเมนเช่น Apple/Microsoft/Google/Support

## 6. Text Wall ที่แตกออก

แตก intro ยาวและลด claim-heavy copy ในหน้า:

- `/รับซื้อสมาร์ทโฟน-android/`
- `/รับซื้อเครื่องเกม/`
- `/บริการ/`

ยังเหลือ text wall warning ในหน้ารองบางหน้า:

- `/รับซื้อ-apple-watch/`
- `/รับซื้อคอมประกอบ/`
- `/รับซื้อ-ups/`
- `/รับซื้อลำโพง/`

## 7. ผล Audit ใหม่

- `npm run build`: ผ่าน
- `npm run sitemap`: ผ่าน
- `node scripts/seo-audit.mjs --source`: 0 errors, 26 warnings เดิมนอก scope รอบนี้
- `node scripts/schema-audit.mjs`: 0 errors, 0 warnings
- `node scripts/mobile-ux-audit.mjs`: 0 errors, 0 warnings
- `node scripts/claim-audit.mjs`: 0 critical, 0 warnings
- `node scripts/visible-ai-seo-copy-audit.mjs`: 0 critical, 0 warnings
- `node scripts/content-intent-onpage-audit.mjs --source`: PASS 7, NEEDS IMPROVEMENT 14, FAIL 0, Average 84%

## 8. สิ่งที่ยังเหลือเป็น P1/P2

- SEO audit ยังมี warnings เดิม: duplicate descriptions และ canonical mismatch ของ legacy/local pages นอก scope Batch 6.1
- Content-intent P1/P2 ยังมี:
  - first paragraph keyword warnings ในบางหน้า
  - image count ต่ำในบาง informational/secondary pages
  - text wall warnings ในหน้ารองบางหน้า
  - informational external link scoring ใน `/ราคากลางรับซื้อ/`

## 9. Safe to Commit?

Safe to commit: ใช่ สำหรับ Batch 6.1 content/on-page cleanup หลังตรวจสอบแล้ว

ยังไม่ commit / push / deploy ตามข้อห้ามใน brief.
