# แทรกรูปในบทความ

คู่มือนี้ใช้กับบทความ Markdown ใน `src/content/posts`

## 1. วางไฟล์รูป

เอารูปไปไว้ใน `public/uploads/` หรือโฟลเดอร์ย่อยที่จำง่าย เช่น

- `public/uploads/articles/iphone-khonkaen-front.jpg`
- `public/uploads/articles/macbook-udon-battery.jpg`

## 2. แทรกรูปแบบง่ายสุด

ถ้าต้องการแค่รูปอย่างเดียว ใช้ Markdown ปกติได้เลย ระบบจะจัด styling ให้อัตโนมัติ

```md
![รับซื้อไอโฟน ขอนแก่น ตัวอย่างเครื่องหน้าจอปกติ](/uploads/articles/iphone-khonkaen-front.jpg)
```

เหมาะกับ:

- รูปประกอบสั้น ๆ ระหว่างย่อหน้า
- รูปตัวอย่างสภาพเครื่อง
- รูปหน้าจอสเปกหรือค่าต่าง ๆ

## 3. รูปพร้อม caption แบบมาตรฐาน

ถ้าต้องการรูปที่มีคำอธิบายใต้ภาพ ใช้ snippet นี้แล้วเปลี่ยนข้อความกับ path รูปได้เลย

```html
<figure class="content-figure">
  <img
    src="/uploads/articles/iphone-khonkaen-front.jpg"
    alt="ตัวอย่างภาพเครื่อง iPhone ที่ใช้ส่งประเมินก่อนขาย"
    loading="lazy"
    decoding="async"
  />
  <figcaption>
    <strong>ตัวอย่างภาพส่งประเมิน:</strong> ถ่ายให้เห็นหน้าจอ ขอบเครื่อง และสภาพรวมชัด ๆ
  </figcaption>
</figure>
```

## 4. รูปใหญ่แบบ wide

ถ้ารูปเป็นภาพแนวนอนหรืออยากให้เด่นขึ้น ใช้คลาส `content-figure--wide`

```html
<figure class="content-figure content-figure--wide">
  <img
    src="/uploads/articles/macbook-udon-overview.jpg"
    alt="ตัวอย่าง MacBook มือสองที่เตรียมข้อมูลครบก่อนประเมินราคา"
    loading="lazy"
    decoding="async"
  />
  <figcaption>
    ภาพรวมเครื่องและอะแดปเตอร์ที่ควรถ่ายส่งก่อนนัดรับ
  </figcaption>
</figure>
```

## 5. รูปขนาดกะทัดรัด

ถ้าต้องการให้ภาพไม่กินความกว้างมาก เช่น ภาพหน้าจอตั้งค่าหรือภาพค่าแบต ใช้ `content-figure--compact`

```html
<figure class="content-figure content-figure--compact">
  <img
    src="/uploads/articles/ipad-battery-screen.jpg"
    alt="หน้าจอข้อมูลแบตเตอรี่ที่ใช้ประกอบการประเมินราคา"
    loading="lazy"
    decoding="async"
  />
  <figcaption>
    หน้าจอตัวอย่างที่ควรแนบเมื่อขอประเมินราคา
  </figcaption>
</figure>
```

## 6. โทนภาพนุ่มขึ้น

ถ้าต้องการกรอบที่ดูนุ่มขึ้น ใช้ `content-figure--soft`

```html
<figure class="content-figure content-figure--soft">
  <img
    src="/uploads/articles/camera-udon-lens-detail.jpg"
    alt="ตัวอย่างภาพหน้าเลนส์และสภาพภายนอกก่อนรับซื้อ"
    loading="lazy"
    decoding="async"
  />
  <figcaption>
    ใช้กับภาพรายละเอียดที่อยากให้ดูเป็นคู่มือมากขึ้น
  </figcaption>
</figure>
```

## 7. แนวทางเขียน alt และ caption

- `alt` บอกว่าภาพคืออะไรจริง ๆ
- `caption` บอกว่าผู้อ่านควรสังเกตอะไรจากภาพ
- ไม่ต้องยัดคีย์เวิร์ดซ้ำ ๆ
- ใช้ภาษาคนอ่าน ไม่ใช่คำโฆษณา

ตัวอย่างที่ดี:

- `alt="ตัวอย่างภาพแบตเตอรี่ iPhone ที่ใช้ส่งประเมินราคา"`
- `alt="สภาพบานพับโน๊ตบุ๊คที่ควรถ่ายให้เห็นก่อนขาย"`

ตัวอย่างที่ไม่ดี:

- `alt="รับซื้อไอโฟน รับซื้อไอโฟน ขายไอโฟน ราคาดี"`

## 8. ควรใส่รูปตรงไหนในบทความ

ตำแหน่งที่มักคุ้มที่สุดคือ

- หลังย่อหน้าที่อธิบายขั้นตอน
- หลังหัวข้อที่พูดถึงจุดตำหนิหรือปัจจัยราคา
- ก่อน FAQ ถ้ามีภาพช่วยสรุปเรื่องที่คนเข้าใจผิดบ่อย

ถ้าจะใส่หลายรูปในบทความเดียว แนะนำให้แต่ละรูปมีหน้าที่ชัด เช่น

- รูปตัวอย่างสภาพเครื่อง
- รูปหน้าจอสเปก
- รูปจุดตำหนิ
- รูปอุปกรณ์ที่ควรส่งมาพร้อมกัน
