/**
 * rewrite-local-pages.mjs
 * เขียนเนื้อหา local pages ใหม่ด้วย geo จริง, landmark, FAQ เฉพาะจังหวัด
 * Run: node scripts/rewrite-local-pages.mjs
 */

import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const POSTS_DIR = join(process.cwd(), 'src', 'content', 'posts');
const TODAY = '2026-06-06';

// ข้อมูล geo จริงแต่ละเมือง
const CITY_DATA = {
  chiangmai: {
    label: 'เชียงใหม่',
    areas: ['เมืองเชียงใหม่', 'นิมมานเหมินท์', 'ช้างคลาน', 'แม่ริม', 'สันกำแพง', 'แม่เหียะ'],
    landmark: 'ใกล้ Central Festival, Maya, One Nimman, มช., ม.แม่โจ้',
    sellerNote: 'นักศึกษา ม.เชียงใหม่-ม.แม่โจ้, คนทำงานย่านนิมมาน, ร้านค้าในตัวเมือง',
    meetup: 'นัดรับได้ทุกโซนในเชียงใหม่ ส่งรูปมา Line ก่อนนัด',
  },
  phuket: {
    label: 'ภูเก็ต',
    areas: ['เมืองภูเก็ต', 'ป่าตอง', 'กะรน', 'กะทู้', 'ถลาง', 'รัษฎา'],
    landmark: 'ใกล้ Central Phuket, Jungceylon, Robinson, ม.สงขลานครินทร์วิทยาเขตภูเก็ต',
    sellerNote: 'คนทำงานโรงแรม/ท่องเที่ยว, ชาวต่างชาติพำนักในภูเก็ต, ธุรกิจในตัวเมือง',
    meetup: 'รับซื้อทุกโซนภูเก็ต ส่งรูปมา Line ก่อนนัด',
  },
  hatyai: {
    label: 'หาดใหญ่',
    areas: ['หาดใหญ่', 'เมืองสงขลา', 'คลองแห', 'บ้านพรุ', 'คอหงส์', 'ม.อ. หาดใหญ่'],
    landmark: 'ใกล้ Central Festival หาดใหญ่, Lee Garden, ตลาดเกษตร, ม.อ. หาดใหญ่',
    sellerNote: 'นักศึกษา ม.อ., พ่อค้าแม่ค้าตลาดหาดใหญ่, คนทำงานออฟฟิศในตัวเมือง',
    meetup: 'รับซื้อทุกโซนหาดใหญ่-สงขลา ส่งรูปมา Line ก่อนนัด',
  },
  chonburi: {
    label: 'ชลบุรี',
    areas: ['เมืองชลบุรี', 'ศรีราชา', 'พัทยา', 'แหลมฉบัง', 'บ้านบึง', 'อมตะนคร'],
    landmark: 'ใกล้ Central Pattaya, Amata Nakorn, นิคมฯแหลมฉบัง, ศรีราชา',
    sellerNote: 'พนักงานนิคมฯ, คนทำงานพัทยา, ครอบครัวในเมืองชลบุรี',
    meetup: 'รับซื้อทุกโซนชลบุรี ทั้งพัทยา ศรีราชา เมืองชลบุรี ส่งรูปมา Line ก่อน',
  },
  nonthaburi: {
    label: 'นนทบุรี',
    areas: ['เมืองนนทบุรี', 'ปากเกร็ด', 'บางใหญ่', 'บางบัวทอง', 'รัตนาธิเบศร์', 'MRT สายสีม่วง'],
    landmark: 'ใกล้ Central Westgate, IKEA บางใหญ่, MRT สายสีม่วง, The Mall บางแค',
    sellerNote: 'ครอบครัวและคนทำงานฝั่ง MRT สายสีม่วง-รัตนาธิเบศร์',
    meetup: 'นัดรับได้แถว MRT สายสีม่วงทุกสถานี ส่งรูปมา Line ก่อนนัด',
  },
  pathum: {
    label: 'ปทุมธานี',
    areas: ['เมืองปทุมธานี', 'คลองหลวง', 'ธัญบุรี', 'รังสิต', 'ลำลูกกา', 'ม.ธรรมศาสตร์ รังสิต'],
    landmark: 'ใกล้ Future Park รังสิต, Central Rangsit, ม.ธรรมศาสตร์ รังสิต, SCB City รังสิต',
    sellerNote: 'นักศึกษา ม.ธรรมศาสตร์ รังสิต, คนทำงานรังสิต-คลองหลวง, ครอบครัวย่านธัญบุรี',
    meetup: 'นัดรับได้ทุกโซนปทุมธานี แถวรังสิต-ธัญบุรี-คลองหลวง ส่งรูปมา Line ก่อน',
  },
  rayong: {
    label: 'ระยอง',
    areas: ['เมืองระยอง', 'มาบตาพุด', 'บ้านฉาง', 'ปลวกแดง', 'EEC', 'นิคมฯ WHA'],
    landmark: 'ใกล้ Central ระยอง, นิคมฯมาบตาพุด, EEC ระยอง, ระยองพัฒนาเมือง',
    sellerNote: 'พนักงานนิคมฯ EEC-มาบตาพุด, คนทำงานระยอง, ครอบครัวในเมือง',
    meetup: 'รับซื้อทุกโซนระยอง ส่งรูปมา Line ก่อนนัด',
  },
  ayutthaya: {
    label: 'พระนครศรีอยุธยา',
    areas: ['เมืองอยุธยา', 'อุทัย', 'ผักไห่', 'ท่าเรือ', 'บ้านเลน', 'นิคมฯสหรัตนนคร'],
    landmark: 'ใกล้ Central Ayutthaya, Big C อยุธยา, นิคมฯสหรัตนนคร, Rojana',
    sellerNote: 'คนทำงานนิคมฯ, ครอบครัวและนักศึกษาในเมืองอยุธยา',
    meetup: 'นัดรับได้ทุกโซนอยุธยา ส่งรูปมา Line ก่อนนัด',
  },
  nakhonpathom: {
    label: 'นครปฐม',
    areas: ['เมืองนครปฐม', 'สามพราน', 'กำแพงแสน', 'นครชัยศรี', 'ม.มหิดล ศาลายา'],
    landmark: 'ใกล้ Central Salaya, The Mall นครปฐม, ม.มหิดล ศาลายา, ม.เกษตรศาสตร์ กำแพงแสน',
    sellerNote: 'นักศึกษา ม.มหิดล ศาลายา, คนทำงานสามพราน-ศาลายา, ครอบครัวในตัวเมือง',
    meetup: 'นัดรับได้ทุกโซนนครปฐม ส่งรูปมา Line ก่อนนัด',
  },
  phitsanulok: {
    label: 'พิษณุโลก',
    areas: ['เมืองพิษณุโลก', 'บางระกำ', 'วังทอง', 'พรหมพิราม', 'ม.นเรศวร'],
    landmark: 'ใกล้ Central Plaza พิษณุโลก, Robinson พิษณุโลก, ม.นเรศวร, Big C พิษณุโลก',
    sellerNote: 'นักศึกษา ม.นเรศวร, คนทำงานออฟฟิศพิษณุโลก, ครอบครัวตัวเมือง',
    meetup: 'นัดรับได้ทุกโซนพิษณุโลก ส่งรูปมา Line ก่อนนัด',
  },
  chiangrai: {
    label: 'เชียงราย',
    areas: ['เมืองเชียงราย', 'แม่สาย', 'เชียงแสน', 'แม่จัน', 'ม.แม่ฟ้าหลวง'],
    landmark: 'ใกล้ Central Plaza เชียงราย, Robinson เชียงราย, ม.แม่ฟ้าหลวง',
    sellerNote: 'นักศึกษา ม.แม่ฟ้าหลวง, คนทำงานตัวเมืองเชียงราย, ธุรกิจชายแดน',
    meetup: 'นัดรับได้ทุกโซนเชียงราย ส่งรูปมา Line ก่อนนัด',
  },
  lampang: {
    label: 'ลำปาง',
    areas: ['เมืองลำปาง', 'เกาะคา', 'แม่เมาะ', 'สบปราบ'],
    landmark: 'ใกล้ Big C ลำปาง, Tesco Lotus ลำปาง, ตลาดใหม่ลำปาง',
    sellerNote: 'คนทำงานในเมืองลำปาง, ครอบครัว, นักศึกษา',
    meetup: 'นัดรับได้ทุกโซนลำปาง ส่งรูปมา Line ก่อนนัด',
  },
  suratthani: {
    label: 'สุราษฎร์ธานี',
    areas: ['เมืองสุราษฎร์ธานี', 'เกาะสมุย', 'เกาะพงัน', 'บ้านดอน', 'ท่าข้าม'],
    landmark: 'ใกล้ Central Suratthani, Robinson สุราษฎร์, ท่าเรือเกาะสมุย',
    sellerNote: 'คนทำงานโรงแรมเกาะสมุย-เกาะพงัน, ธุรกิจในตัวเมือง, คนพื้นที่',
    meetup: 'นัดรับได้ทุกโซนสุราษฎร์ธานี ส่งรูปมา Line ก่อนนัด',
  },
  nakhonsri: {
    label: 'นครศรีธรรมราช',
    areas: ['เมืองนครศรีธรรมราช', 'ทุ่งสง', 'ลาดหญ้า', 'ท่าศาลา', 'ม.วลัยลักษณ์'],
    landmark: 'ใกล้ Central Nakhon Si Thammarat, Robinson นครศรี, ม.วลัยลักษณ์',
    sellerNote: 'นักศึกษา ม.วลัยลักษณ์, คนทำงานในเมือง, ธุรกิจในตัวเมือง',
    meetup: 'นัดรับได้ทุกโซนนครศรีธรรมราช ส่งรูปมา Line ก่อนนัด',
  },
};

// Hero images ที่มีอยู่ในโปรเจค
const HERO = {
  iphone: '/media/apple-local/iphone-orange-duo.webp',
  iphone_dark: '/media/apple-local/iphone-dark-front.webp',
  iphone15: '/media/apple-local/iphone15-black-front.webp',
  macbook: '/media/notebook-showcase/macbook-air-on-box.webp',
  macbook_boot: '/media/notebook-showcase/macbook-boot-screen.webp',
  notebook: '/media/notebook-showcase/notebook-lineup-showroom.webp',
  notebook2: '/media/notebook-showcase/acer-aspire-3-silver.webp',
  gaming: '/media/notebook-showcase/rog-strix-open-front.webp',
  server: null,
  cctv: null,
};

// ============================================================
// PAGE DEFINITIONS — (slug, cityKey, serviceType, custom content)
// ============================================================

const pages = [
  // --- เชียงใหม่ ---
  {
    slug: 'รับซื้อ-iphone-เชียงใหม่',
    city: 'chiangmai', service: 'iphone',
    heroImage: HERO.iphone,
    priceSummary: `
| รุ่น | ช่วงราคาอ้างอิง |
|------|----------------|
| iPhone 16 Pro Max | 25,000–33,000 บาท |
| iPhone 15 Pro Max | 20,000–27,000 บาท |
| iPhone 14 Pro | 14,000–20,000 บาท |
| iPhone 13 | 8,000–14,000 บาท |

*ราคาปรับตามสุขภาพแบต สภาพเครื่อง และความครบของอุปกรณ์*`,
    extraFaq: [
      { q: 'รับซื้อ iPhone ในเชียงใหม่ต้องนำเครื่องมาที่ร้านไหม?', a: 'ไม่ต้องครับ ส่งรูปมาประเมินทาง Line @webuy ก่อนได้เลย เมื่อตกลงราคาค่อยนัดรับใน เมืองเชียงใหม่, นิมมาน หรือโซนอื่นตามสะดวก' },
      { q: 'ขาย iPhone มือสองแถวนิมมานเหมินท์ได้ไหม?', a: 'ได้ครับ เรานัดรับได้ทุกย่านในเชียงใหม่ ทั้งนิมมาน ช้างคลาน Maya Central Festival ส่งรูปมาก่อนนัดประหยัดเวลา' },
      { q: 'iPhone ติด iCloud ขายได้ไหมในเชียงใหม่?', a: 'ต้องปลด iCloud ออกก่อนครับ ถ้ายังติดอยู่ราคาจะต่ำลงมาก แนะนำให้ปลดออกก่อนส่งรูปมาประเมิน' },
    ],
  },
  {
    slug: 'รับซื้อ-macbook-เชียงใหม่',
    city: 'chiangmai', service: 'macbook',
    heroImage: HERO.macbook,
    priceSummary: `
| รุ่น | ช่วงราคาอ้างอิง |
|------|----------------|
| MacBook Pro M4 14 นิ้ว | 38,000–52,000 บาท |
| MacBook Air M3 13 นิ้ว | 25,000–35,000 บาท |
| MacBook Pro M2 14 นิ้ว | 28,000–38,000 บาท |
| MacBook Air M2 13 นิ้ว | 18,000–26,000 บาท |

*ราคาขึ้นอยู่กับ RAM, SSD, รอบชาร์จ และสภาพเครื่อง*`,
    extraFaq: [
      { q: 'ขาย MacBook ในเชียงใหม่ไม่รู้รอบชาร์จ ทำยังไง?', a: 'เปิด About This Mac > System Information > Power จะเห็นรอบชาร์จครับ หรือส่งรูปหน้าจอ Battery Status มาก่อน แล้วเราช่วยอ่านค่าให้' },
      { q: 'MacBook รุ่นเก่า (Intel) ขายได้ไหมในเชียงใหม่?', a: 'รับซื้อครับ ทุกรุ่นทุกสเปก แค่แจ้งรุ่น ปี RAM SSD และสภาพเครื่องมาก่อน' },
      { q: 'มีร้านรับซื้อ MacBook ในเชียงใหม่แบบจ่ายสดทันทีไหม?', a: 'WE BUY รับซื้อ MacBook ในเชียงใหม่ ส่งรูปมาประเมินผ่าน Line @webuy แล้วนัดรับ จ่ายสดทันทีทุกวัน' },
    ],
  },
  {
    slug: 'รับซื้อโน๊ตบุ๊ค-เชียงใหม่',
    city: 'chiangmai', service: 'notebook',
    heroImage: HERO.notebook,
    priceSummary: `
| ประเภทโน๊ตบุ๊ค | ช่วงราคาอ้างอิง |
|----------------|----------------|
| Gaming: ROG, Alienware, Razer | 12,000–40,000 บาท |
| Premium: Dell XPS, HP Spectre | 10,000–25,000 บาท |
| Business: ThinkPad, Latitude | 4,000–18,000 บาท |
| ทั่วไป: ASUS, Acer, Lenovo | 2,000–12,000 บาท |

*ราคาขึ้นอยู่กับ CPU, RAM, SSD, GPU, สภาพจอและบอดี้*`,
    extraFaq: [
      { q: 'รับซื้อโน๊ตบุ๊คทุกยี่ห้อในเชียงใหม่ไหม?', a: 'รับครับ ทุกยี่ห้อ ASUS Lenovo Dell HP Acer MSI Razer รวมถึง MacBook ส่งรูปมาประเมินผ่าน Line @webuy ได้เลย' },
      { q: 'โน๊ตบุ๊คเสียบางส่วน ขายได้ไหมในเชียงใหม่?', a: 'ได้ครับ รับซื้อทุกสภาพ ทั้งเครื่องที่ใช้งานได้ดีและเครื่องที่มีอาการ แค่แจ้งสภาพจริงมาก่อนเพื่อประเมินราคาให้แม่นยำ' },
      { q: 'นัดรับโน๊ตบุ๊คแถวมหาวิทยาลัยเชียงใหม่ได้ไหม?', a: 'ได้ครับ นัดรับได้ทุกโซนในเชียงใหม่รวมถึงแถว มช. ม.แม่โจ้ นิมมาน Maya ส่งรูปมา Line ก่อนนัด' },
    ],
  },
  {
    slug: 'รับซื้อ-server-เชียงใหม่',
    city: 'chiangmai', service: 'server',
    heroImage: null,
    priceSummary: `
| รุ่น Server | ช่วงราคาอ้างอิง |
|------------|----------------|
| HP ProLiant DL360/DL380 Gen10 | 15,000–80,000 บาท |
| Dell PowerEdge R640/R740 | 15,000–90,000 บาท |
| IBM/Lenovo System x | 10,000–50,000 บาท |
| Supermicro 1U/2U | 8,000–40,000 บาท |

*ราคาขึ้นอยู่กับ CPU, RAM, HDD, สภาพ PSU และ Generation*`,
    extraFaq: [
      { q: 'มีองค์กรหรือบริษัทในเชียงใหม่ที่ต้องการขาย Server ยกชุดไหม?', a: 'รับซื้อ Server ยกชุดในเชียงใหม่ครับ ทั้งองค์กร โรงแรม สถาบันการศึกษา ส่งรายการสินค้ามาประเมินผ่าน Line @webuy ได้เลย' },
      { q: 'ขาย Server พร้อม Rack Cabinet ในเชียงใหม่ได้ไหม?', a: 'รับซื้อทั้งชุดครับ ทั้ง Server, Rack, UPS, Switch, KVM จ่ายสดทันที นัดเข้าไปดูสถานที่ได้เลย' },
      { q: 'Server เก่ารุ่น Gen7/Gen8 ยังขายได้ไหม?', a: 'ขายได้ครับ แต่ราคาจะต่ำกว่า Gen10 มาก ส่งรายละเอียดสเปกมาก่อนเพื่อประเมินความคุ้มค่า' },
    ],
  },

  // --- ภูเก็ต ---
  {
    slug: 'รับซื้อ-iphone-ภูเก็ต',
    city: 'phuket', service: 'iphone',
    heroImage: HERO.iphone15,
    priceSummary: `
| รุ่น | ช่วงราคาอ้างอิง |
|------|----------------|
| iPhone 16 Pro Max | 25,000–33,000 บาท |
| iPhone 15 Pro Max | 20,000–27,000 บาท |
| iPhone 14 Pro | 14,000–20,000 บาท |
| iPhone 13 | 8,000–14,000 บาท |`,
    extraFaq: [
      { q: 'ขาย iPhone ในภูเก็ตนัดรับที่ไหนได้บ้าง?', a: 'นัดรับได้ทุกโซนในภูเก็ต ทั้งเมืองภูเก็ต ป่าตอง กะรน Jungceylon Central Phuket ส่งรูปมาประเมินก่อนนัด' },
      { q: 'ชาวต่างชาติอยู่ภูเก็ตขาย iPhone ได้ไหม?', a: 'ได้ครับ ต้องการแค่เครื่องและ iCloud ออก สื่อสารภาษาอังกฤษได้ด้วย ทัก Line @webuy ได้เลย' },
      { q: 'โรงแรมในภูเก็ตต้องการขาย iPhone เก่ายกชุดได้ไหม?', a: 'รับซื้อยกชุดครับ ทั้ง iPhone, iPad, MacBook ยิ่งมากยิ่งราคาดี ส่งรายการมาประเมินผ่าน Line @webuy' },
    ],
  },
  {
    slug: 'รับซื้อ-macbook-ภูเก็ต',
    city: 'phuket', service: 'macbook',
    heroImage: HERO.macbook,
    priceSummary: `
| รุ่น | ช่วงราคาอ้างอิง |
|------|----------------|
| MacBook Pro M4 | 38,000–52,000 บาท |
| MacBook Air M3 | 25,000–35,000 บาท |
| MacBook Pro M2 | 28,000–38,000 บาท |
| MacBook Air M1 | 12,000–18,000 บาท |`,
    extraFaq: [
      { q: 'ขาย MacBook ในภูเก็ตส่งรูปทาง Line ได้เลยไหม?', a: 'ได้เลยครับ ส่งรูปหน้าจอ ด้านหลัง และ System Info มาทาง Line @webuy แล้วได้ราคาภายใน 15 นาที' },
      { q: 'MacBook เครื่องต่างประเทศ ซื้อจาก Duty Free ขายได้ไหมในภูเก็ต?', a: 'ขายได้ครับ ราคาใกล้เคียงกัน แค่ตรวจสอบว่าปลด iCloud ออกแล้วก็พอ' },
    ],
  },
  {
    slug: 'รับซื้อโน๊ตบุ๊ค-ภูเก็ต',
    city: 'phuket', service: 'notebook',
    heroImage: HERO.notebook2,
    priceSummary: `
| ประเภทโน๊ตบุ๊ค | ช่วงราคาอ้างอิง |
|----------------|----------------|
| Gaming: ROG, MSI Raider | 12,000–38,000 บาท |
| Premium: Dell XPS, HP Envy | 8,000–22,000 บาท |
| Business: ThinkPad, ProBook | 4,000–15,000 บาท |
| ทั่วไป: ASUS, Acer, Lenovo | 2,000–10,000 บาท |`,
    extraFaq: [
      { q: 'รับซื้อโน๊ตบุ๊คในภูเก็ตทุกยี่ห้อไหม?', a: 'รับครับ ทุกยี่ห้อ ASUS Lenovo Dell HP Acer MSI Razer MacBook ส่งรูปมาประเมินผ่าน Line @webuy ได้เลย' },
      { q: 'โน๊ตบุ๊คมือสองจากต่างประเทศขายได้ไหมในภูเก็ต?', a: 'ขายได้ครับ ราคาไม่ต่างจากเครื่องไทย ขึ้นอยู่กับสเปกและสภาพเครื่องเป็นหลัก' },
      { q: 'โรงแรมในภูเก็ตอยากขายโน๊ตบุ๊คออฟฟิศยกชุดได้ไหม?', a: 'รับซื้อยกชุดครับ ทั้ง notebook, PC, iPad, iPhone ยิ่งมากยิ่งราคาดี ส่งรายการมาประเมิน' },
    ],
  },

  // --- หาดใหญ่ ---
  {
    slug: 'รับซื้อ-iphone-หาดใหญ่',
    city: 'hatyai', service: 'iphone',
    heroImage: HERO.iphone,
    priceSummary: `
| รุ่น | ช่วงราคาอ้างอิง |
|------|----------------|
| iPhone 16 Pro Max | 25,000–33,000 บาท |
| iPhone 15 Pro Max | 20,000–27,000 บาท |
| iPhone 14 Pro | 14,000–20,000 บาท |
| iPhone 13 | 8,000–14,000 บาท |`,
    extraFaq: [
      { q: 'ขาย iPhone ในหาดใหญ่นัดรับที่ไหนได้บ้าง?', a: 'นัดรับได้ทุกโซน ทั้ง Central Festival หาดใหญ่, Lee Garden, ตลาดเกษตร, แถว ม.อ. ส่งรูปมา Line ก่อนนัด' },
      { q: 'iPhone จากมาเลเซียขายในหาดใหญ่ได้ไหม?', a: 'ขายได้ครับ iPhone จากต่างประเทศราคาใกล้เคียงกัน แค่ปลด iCloud ออกก่อน' },
      { q: 'มีร้านรับซื้อ iPhone ในหาดใหญ่จ่ายสดทันทีไหม?', a: 'WE BUY รับซื้อ iPhone หาดใหญ่ ส่งรูปมาประเมินผ่าน Line @webuy แล้วนัดรับ จ่ายสดทันที' },
    ],
  },
  {
    slug: 'รับซื้อ-macbook-หาดใหญ่',
    city: 'hatyai', service: 'macbook',
    heroImage: HERO.macbook_boot,
    priceSummary: `
| รุ่น | ช่วงราคาอ้างอิง |
|------|----------------|
| MacBook Pro M4 | 38,000–52,000 บาท |
| MacBook Air M3 | 25,000–35,000 บาท |
| MacBook Pro M2 | 28,000–38,000 บาท |
| MacBook Air M1 | 12,000–18,000 บาท |`,
    extraFaq: [
      { q: 'ขาย MacBook ในหาดใหญ่ต้องมาที่ร้านไหม?', a: 'ไม่ต้องครับ ส่งรูปมาประเมินทาง Line @webuy ก่อน พอตกลงราคาค่อยนัดรับในหาดใหญ่หรือสงขลา' },
      { q: 'MacBook จากสิงคโปร์หรือมาเลเซียขายในหาดใหญ่ได้ไหม?', a: 'ขายได้ครับ ราคาเดียวกันกับเครื่องไทย ขึ้นอยู่กับสเปกและสภาพเป็นหลัก' },
    ],
  },
  {
    slug: 'รับซื้อโน๊ตบุ๊ค-หาดใหญ่',
    city: 'hatyai', service: 'notebook',
    heroImage: HERO.notebook,
    priceSummary: `
| ประเภทโน๊ตบุ๊ค | ช่วงราคาอ้างอิง |
|----------------|----------------|
| Gaming: ROG, MSI | 12,000–38,000 บาท |
| Premium: Dell XPS | 8,000–22,000 บาท |
| Business: ThinkPad | 4,000–15,000 บาท |
| ทั่วไป: ASUS, Acer | 2,000–10,000 บาท |`,
    extraFaq: [
      { q: 'รับซื้อโน๊ตบุ๊คในหาดใหญ่ทุกยี่ห้อไหม?', a: 'รับครับ ทุกยี่ห้อ ส่งรูปมาประเมินผ่าน Line @webuy ได้เลย' },
      { q: 'นัดรับโน๊ตบุ๊คแถว ม.อ. หาดใหญ่ได้ไหม?', a: 'ได้ครับ นัดรับได้ทุกโซนในหาดใหญ่รวมถึงแถว ม.อ. ตลาดเกษตร Central Festival' },
    ],
  },

  // --- ชลบุรี ---
  {
    slug: 'รับซื้อ-iphone-ชลบุรี',
    city: 'chonburi', service: 'iphone',
    heroImage: HERO.iphone_dark,
    priceSummary: `
| รุ่น | ช่วงราคาอ้างอิง |
|------|----------------|
| iPhone 16 Pro Max | 25,000–33,000 บาท |
| iPhone 15 Pro Max | 20,000–27,000 บาท |
| iPhone 14 Pro | 14,000–20,000 บาท |
| iPhone 13 | 8,000–14,000 บาท |`,
    extraFaq: [
      { q: 'ขาย iPhone ในชลบุรีนัดรับที่ไหนได้บ้าง?', a: 'นัดรับได้ทุกโซนในชลบุรี ทั้งเมืองชลบุรี ศรีราชา พัทยา แหลมฉบัง ส่งรูปมา Line ก่อนนัด' },
      { q: 'ทำงานในนิคมฯ อยากขาย iPhone มือสองได้เลยไหม?', a: 'ได้เลยครับ ส่งรูปมาประเมินผ่าน Line @webuy แล้วนัดรับแถวศรีราชา-แหลมฉบัง หรือจุดสะดวกในชลบุรี' },
    ],
  },
  {
    slug: 'รับซื้อ-macbook-ชลบุรี',
    city: 'chonburi', service: 'macbook',
    heroImage: HERO.macbook,
    priceSummary: `
| รุ่น | ช่วงราคาอ้างอิง |
|------|----------------|
| MacBook Pro M4 | 38,000–52,000 บาท |
| MacBook Air M3 | 25,000–35,000 บาท |
| MacBook Pro M2 | 28,000–38,000 บาท |
| MacBook Air M1 | 12,000–18,000 บาท |`,
    extraFaq: [
      { q: 'ขาย MacBook ในชลบุรีต้องนำเครื่องมาที่ร้านไหม?', a: 'ไม่ต้องครับ ส่งรูปมาประเมินทาง Line @webuy ก่อน พอตกลงราคาค่อยนัดรับในชลบุรี ศรีราชา หรือพัทยา' },
    ],
  },
  {
    slug: 'รับซื้อ-iphone-ระยอง',
    city: 'rayong', service: 'iphone',
    heroImage: HERO.iphone,
    priceSummary: `
| รุ่น | ช่วงราคาอ้างอิง |
|------|----------------|
| iPhone 16 Pro Max | 25,000–33,000 บาท |
| iPhone 15 Pro Max | 20,000–27,000 บาท |
| iPhone 14 Pro | 14,000–20,000 บาท |
| iPhone 13 | 8,000–14,000 บาท |`,
    extraFaq: [
      { q: 'ขาย iPhone ในระยองนัดรับที่ไหน?', a: 'นัดรับได้ทุกโซนในระยอง ทั้งเมืองระยอง มาบตาพุด บ้านฉาง EEC ส่งรูปมา Line ก่อนนัด' },
      { q: 'พนักงานนิคมฯ EEC ระยองอยากขาย iPhone ได้เลยไหม?', a: 'ได้เลยครับ ส่งรูปมาประเมินผ่าน Line @webuy แล้วนัดรับแถวระยอง-มาบตาพุด' },
    ],
  },
  {
    slug: 'รับซื้อ-macbook-ระยอง',
    city: 'rayong', service: 'macbook',
    heroImage: HERO.macbook,
    priceSummary: `
| รุ่น | ช่วงราคาอ้างอิง |
|------|----------------|
| MacBook Pro M4 | 38,000–52,000 บาท |
| MacBook Air M3 | 25,000–35,000 บาท |
| MacBook Air M2 | 18,000–26,000 บาท |`,
    extraFaq: [
      { q: 'ขาย MacBook ในระยองได้เลยไหม?', a: 'ได้ครับ ส่งรูปมาประเมินทาง Line @webuy แล้วนัดรับในระยอง' },
    ],
  },

  // --- นนทบุรี ---
  {
    slug: 'รับซื้อ-iphone-นนทบุรี',
    city: 'nonthaburi', service: 'iphone',
    heroImage: HERO.iphone15,
    priceSummary: `
| รุ่น | ช่วงราคาอ้างอิง |
|------|----------------|
| iPhone 16 Pro Max | 25,000–33,000 บาท |
| iPhone 15 Pro Max | 20,000–27,000 บาท |
| iPhone 14 Pro | 14,000–20,000 บาท |
| iPhone 13 | 8,000–14,000 บาท |`,
    extraFaq: [
      { q: 'ขาย iPhone แถว MRT สายสีม่วงนนทบุรีได้เลยไหม?', a: 'ได้เลยครับ นัดรับได้ทุกสถานี MRT สายสีม่วง ส่งรูปมาประเมินผ่าน Line @webuy ก่อน' },
      { q: 'ขาย iPhone ในนนทบุรี นัดรับแถว Central Westgate ได้ไหม?', a: 'ได้ครับ นัดรับได้แถว Central Westgate, IKEA บางใหญ่ หรือจุดสะดวกในนนทบุรี' },
    ],
  },
  {
    slug: 'รับซื้อ-macbook-นนทบุรี',
    city: 'nonthaburi', service: 'macbook',
    heroImage: HERO.macbook_boot,
    priceSummary: `
| รุ่น | ช่วงราคาอ้างอิง |
|------|----------------|
| MacBook Pro M4 | 38,000–52,000 บาท |
| MacBook Air M3 | 25,000–35,000 บาท |
| MacBook Air M2 | 18,000–26,000 บาท |`,
    extraFaq: [
      { q: 'ขาย MacBook ในนนทบุรีต้องมาที่ร้านไหม?', a: 'ไม่ต้องครับ ส่งรูปมาประเมินทาง Line @webuy ก่อน พอตกลงค่อยนัดรับแถวนนทบุรี-บางใหญ่' },
    ],
  },
  {
    slug: 'รับซื้อโน๊ตบุ๊ค-นนทบุรี',
    city: 'nonthaburi', service: 'notebook',
    heroImage: HERO.notebook,
    priceSummary: `
| ประเภทโน๊ตบุ๊ค | ช่วงราคาอ้างอิง |
|----------------|----------------|
| Gaming: ROG, MSI | 12,000–38,000 บาท |
| Business: ThinkPad, Latitude | 4,000–15,000 บาท |
| ทั่วไป: ASUS, Acer, Lenovo | 2,000–10,000 บาท |`,
    extraFaq: [
      { q: 'รับซื้อโน๊ตบุ๊คในนนทบุรีทุกยี่ห้อไหม?', a: 'รับครับ ทุกยี่ห้อ ส่งรูปมาประเมินผ่าน Line @webuy แล้วนัดรับแถวนนทบุรี-MRT สายสีม่วง' },
    ],
  },

  // --- ปทุมธานี ---
  {
    slug: 'รับซื้อ-iphone-ปทุมธานี',
    city: 'pathum', service: 'iphone',
    heroImage: HERO.iphone,
    priceSummary: `
| รุ่น | ช่วงราคาอ้างอิง |
|------|----------------|
| iPhone 16 Pro Max | 25,000–33,000 บาท |
| iPhone 15 Pro Max | 20,000–27,000 บาท |
| iPhone 14 Pro | 14,000–20,000 บาท |
| iPhone 13 | 8,000–14,000 บาท |`,
    extraFaq: [
      { q: 'ขาย iPhone ในปทุมธานีนัดรับที่ไหน?', a: 'นัดรับได้ทุกโซน ทั้งรังสิต Future Park, Central Rangsit, ธัญบุรี, คลองหลวง ส่งรูปมา Line ก่อนนัด' },
      { q: 'นักศึกษา ม.ธรรมศาสตร์ รังสิต อยากขาย iPhone ได้เลยไหม?', a: 'ได้เลยครับ ส่งรูปมาประเมินผ่าน Line @webuy แล้วนัดรับแถวรังสิต' },
    ],
  },
  {
    slug: 'รับซื้อ-macbook-ปทุมธานี',
    city: 'pathum', service: 'macbook',
    heroImage: HERO.macbook,
    priceSummary: `
| รุ่น | ช่วงราคาอ้างอิง |
|------|----------------|
| MacBook Pro M4 | 38,000–52,000 บาท |
| MacBook Air M3 | 25,000–35,000 บาท |
| MacBook Air M2 | 18,000–26,000 บาท |`,
    extraFaq: [
      { q: 'ขาย MacBook ในปทุมธานีได้เลยไหม?', a: 'ได้ครับ ส่งรูปมาประเมินทาง Line @webuy แล้วนัดรับในรังสิต-ปทุมธานี' },
    ],
  },

  // --- พิษณุโลก ---
  {
    slug: 'รับซื้อ-iphone-พิษณุโลก',
    city: 'phitsanulok', service: 'iphone',
    heroImage: HERO.iphone_dark,
    priceSummary: `
| รุ่น | ช่วงราคาอ้างอิง |
|------|----------------|
| iPhone 16 Pro Max | 25,000–33,000 บาท |
| iPhone 15 Pro | 18,000–24,000 บาท |
| iPhone 14 Pro | 14,000–20,000 บาท |
| iPhone 13 | 8,000–14,000 บาท |`,
    extraFaq: [
      { q: 'รับซื้อ iPhone ในพิษณุโลกนัดรับที่ไหน?', a: 'นัดรับได้ทุกโซนในพิษณุโลก ทั้งแถว Central Plaza, ม.นเรศวร ส่งรูปมา Line ก่อนนัด' },
    ],
  },
  {
    slug: 'รับซื้อ-macbook-พิษณุโลก',
    city: 'phitsanulok', service: 'macbook',
    heroImage: HERO.macbook,
    priceSummary: `
| รุ่น | ช่วงราคาอ้างอิง |
|------|----------------|
| MacBook Air M3 | 25,000–35,000 บาท |
| MacBook Air M2 | 18,000–26,000 บาท |
| MacBook Air M1 | 12,000–18,000 บาท |`,
    extraFaq: [
      { q: 'ขาย MacBook ในพิษณุโลกส่งรูปมา Line ได้เลยไหม?', a: 'ได้เลยครับ ส่งรูปมาประเมินทาง Line @webuy แล้วนัดรับในพิษณุโลก' },
    ],
  },
  {
    slug: 'รับซื้อโน๊ตบุ๊ค-พิษณุโลก',
    city: 'phitsanulok', service: 'notebook',
    heroImage: HERO.notebook2,
    priceSummary: `
| ประเภทโน๊ตบุ๊ค | ช่วงราคาอ้างอิง |
|----------------|----------------|
| Gaming: ROG, MSI | 12,000–35,000 บาท |
| Business: ThinkPad | 4,000–15,000 บาท |
| ทั่วไป: ASUS, Lenovo | 2,000–10,000 บาท |`,
    extraFaq: [
      { q: 'รับซื้อโน๊ตบุ๊คในพิษณุโลกทุกยี่ห้อไหม?', a: 'รับครับ ทุกยี่ห้อ ส่งรูปมาประเมินผ่าน Line @webuy ได้เลย' },
    ],
  },

  // --- เชียงราย ---
  {
    slug: 'รับซื้อ-iphone-เชียงราย',
    city: 'chiangrai', service: 'iphone',
    heroImage: HERO.iphone,
    priceSummary: `
| รุ่น | ช่วงราคาอ้างอิง |
|------|----------------|
| iPhone 16 Pro Max | 25,000–33,000 บาท |
| iPhone 15 Pro | 18,000–24,000 บาท |
| iPhone 14 Pro | 14,000–20,000 บาท |
| iPhone 13 | 8,000–14,000 บาท |`,
    extraFaq: [
      { q: 'รับซื้อ iPhone ในเชียงรายนัดรับที่ไหน?', a: 'นัดรับได้ทุกโซนในเชียงราย ทั้ง Central Plaza, ม.แม่ฟ้าหลวง ส่งรูปมา Line ก่อนนัด' },
    ],
  },
  {
    slug: 'รับซื้อโน๊ตบุ๊ค-เชียงราย',
    city: 'chiangrai', service: 'notebook',
    heroImage: HERO.notebook,
    priceSummary: `
| ประเภทโน๊ตบุ๊ค | ช่วงราคาอ้างอิง |
|----------------|----------------|
| Gaming: ROG, MSI | 12,000–35,000 บาท |
| Business/ทั่วไป: ASUS, Lenovo | 2,000–12,000 บาท |`,
    extraFaq: [
      { q: 'รับซื้อโน๊ตบุ๊คในเชียงรายทุกยี่ห้อไหม?', a: 'รับครับ ทุกยี่ห้อ ส่งรูปมาประเมินผ่าน Line @webuy ได้เลย' },
    ],
  },

  // --- นครปฐม ---
  {
    slug: 'รับซื้อ-iphone-นครปฐม',
    city: 'nakhonpathom', service: 'iphone',
    heroImage: HERO.iphone15,
    priceSummary: `
| รุ่น | ช่วงราคาอ้างอิง |
|------|----------------|
| iPhone 16 Pro Max | 25,000–33,000 บาท |
| iPhone 15 Pro | 18,000–24,000 บาท |
| iPhone 14 Pro | 14,000–20,000 บาท |`,
    extraFaq: [
      { q: 'ขาย iPhone ในนครปฐมนัดรับที่ไหน?', a: 'นัดรับได้ทุกโซน ทั้ง Central Salaya, ม.มหิดล ศาลายา, ตัวเมืองนครปฐม ส่งรูปมา Line ก่อนนัด' },
    ],
  },
  {
    slug: 'รับซื้อ-macbook-นครปฐม',
    city: 'nakhonpathom', service: 'macbook',
    heroImage: HERO.macbook,
    priceSummary: `
| รุ่น | ช่วงราคาอ้างอิง |
|------|----------------|
| MacBook Air M3 | 25,000–35,000 บาท |
| MacBook Air M2 | 18,000–26,000 บาท |`,
    extraFaq: [
      { q: 'ขาย MacBook ในนครปฐมได้เลยไหม?', a: 'ได้ครับ ส่งรูปมาประเมินทาง Line @webuy แล้วนัดรับในนครปฐม' },
    ],
  },

  // --- พระนครศรีอยุธยา ---
  {
    slug: 'รับซื้อ-iphone-พระนครศรีอยุธยา',
    city: 'ayutthaya', service: 'iphone',
    heroImage: HERO.iphone,
    priceSummary: `
| รุ่น | ช่วงราคาอ้างอิง |
|------|----------------|
| iPhone 16 Pro Max | 25,000–33,000 บาท |
| iPhone 15 Pro | 18,000–24,000 บาท |
| iPhone 14 Pro | 14,000–20,000 บาท |`,
    extraFaq: [
      { q: 'ขาย iPhone ในอยุธยานัดรับที่ไหน?', a: 'นัดรับได้ทุกโซนในอยุธยา ทั้ง Central Ayutthaya, นิคมฯสหรัตนนคร, Rojana ส่งรูปมา Line ก่อนนัด' },
    ],
  },

  // --- สุราษฎร์ธานี ---
  {
    slug: 'รับซื้อ-iphone-สุราษฎร์ธานี',
    city: 'suratthani', service: 'iphone',
    heroImage: HERO.iphone_dark,
    priceSummary: `
| รุ่น | ช่วงราคาอ้างอิง |
|------|----------------|
| iPhone 16 Pro Max | 25,000–33,000 บาท |
| iPhone 15 Pro | 18,000–24,000 บาท |
| iPhone 14 Pro | 14,000–20,000 บาท |`,
    extraFaq: [
      { q: 'ขาย iPhone ในสุราษฎร์ธานีนัดรับที่ไหน?', a: 'นัดรับได้ทุกโซน ทั้ง Central Suratthani, ตัวเมือง, เกาะสมุย ส่งรูปมา Line ก่อนนัด' },
    ],
  },

  // --- นครศรีธรรมราช ---
  {
    slug: 'รับซื้อ-iphone-นครศรีธรรมราช',
    city: 'nakhonsri', service: 'iphone',
    heroImage: HERO.iphone,
    priceSummary: `
| รุ่น | ช่วงราคาอ้างอิง |
|------|----------------|
| iPhone 16 Pro Max | 25,000–33,000 บาท |
| iPhone 15 Pro | 18,000–24,000 บาท |
| iPhone 14 Pro | 14,000–20,000 บาท |`,
    extraFaq: [
      { q: 'ขาย iPhone ในนครศรีธรรมราชนัดรับที่ไหน?', a: 'นัดรับได้ทุกโซน ทั้ง Central Nakhon Si, ม.วลัยลักษณ์, ตัวเมือง ส่งรูปมา Line ก่อนนัด' },
    ],
  },
  {
    slug: 'รับซื้อ-macbook-นครศรีธรรมราช',
    city: 'nakhonsri', service: 'macbook',
    heroImage: HERO.macbook,
    priceSummary: `
| รุ่น | ช่วงราคาอ้างอิง |
|------|----------------|
| MacBook Air M3 | 25,000–35,000 บาท |
| MacBook Air M2 | 18,000–26,000 บาท |`,
    extraFaq: [
      { q: 'ขาย MacBook ในนครศรีธรรมราชได้เลยไหม?', a: 'ได้ครับ ส่งรูปมาประเมินทาง Line @webuy แล้วนัดรับในนครศรี' },
    ],
  },
];

// ============================================================
// GENERATE CONTENT
// ============================================================

function titleCase(service) {
  const map = { iphone: 'iPhone', macbook: 'MacBook', notebook: 'โน๊ตบุ๊ค', server: 'Server', cctv: 'กล้องวงจรปิด' };
  return map[service] || service;
}

function generateMarkdown(page) {
  const city = CITY_DATA[page.city];
  if (!city) return null;

  const productLabel = titleCase(page.service);
  const title = `รับซื้อ${productLabel} ${city.label} มือสอง — ราคาดี จ่ายทันที ไม่มีวันหยุด`;

  const desc = `WE BUY รับซื้อ${productLabel}มือสองใน${city.label} ทุกรุ่น ทุกสภาพ ประเมินฟรี 15 นาที จ่ายเงินสดทันที ทักหา Line @webuy ได้เลย`;

  const heroLine = page.heroImage ? `heroImage: "${page.heroImage}"` : '';

  const faqBase = [
    { q: `WE BUY รับซื้อ${productLabel}ใน${city.label}ยังไง?`, a: `ส่งรูปมาประเมินผ่าน Line @webuy ก่อนได้เลยครับ แจ้งรุ่น สเปก และสภาพเครื่อง ได้ราคาใน 15 นาที จากนั้นนัดรับใน${city.label} — ${city.meetup}` },
    { q: `พื้นที่ไหนใน${city.label}รับซื้อ${productLabel}บ้าง?`, a: `รับซื้อทุกโซนในจังหวัด${city.label} รวมถึง${city.areas.join(', ')} — ${city.landmark}` },
    ...page.extraFaq,
  ];

  const faqYaml = faqBase.map(f => `  - question: "${f.q.replace(/"/g, "'")}"\n    answer: "${f.a.replace(/"/g, "'")}"`).join('\n');

  const areaList = city.areas.map(a => `- ${a}`).join('\n');

  const body = `**รับซื้อ${productLabel} ${city.label}** — WE BUY รับซื้อ${productLabel}มือสองทุกรุ่นใน${city.label} ประเมินฟรีใน 15 นาที จ่ายเงินสดทันที ทุกวันไม่มีวันหยุด

## โซนที่ให้บริการใน${city.label}

${areaList}

${city.landmark}

## ราคารับซื้ออ้างอิง
${page.priceSummary}

## วิธีขาย${productLabel}ใน${city.label}

1. **ส่งรูปมา Line @webuy** — รูปเครื่อง รุ่น สเปก และสภาพ
2. **ได้ราคาใน 15 นาที** — ทีมงานประเมินทันที ไม่ต้องรอนาน
3. **นัดรับในพื้นที่สะดวก** — ${city.meetup}
4. **รับเงินสดทันที** — จ่ายสด ไม่ต้องรอโอน

ติดต่อ [Line @webuy](https://line.me/R/ti/p/@webuy) หรือโทร 064-257-9353`;

  return `---
title: "${title}"
description: "${desc}"
pubDate: "${TODAY}"
updatedDate: "${TODAY}"
slug: "${page.slug}"
qualityScore: 9
qualityFlags: []
${heroLine}
faqItems:
${faqYaml}
---

${body}
`;
}

let written = 0;
let skipped = 0;

for (const page of pages) {
  const filePath = join(POSTS_DIR, `${page.slug}.md`);
  const content = generateMarkdown(page);
  if (!content) {
    console.log(`⚠️  skip (no city data): ${page.slug}`);
    skipped++;
    continue;
  }
  writeFileSync(filePath, content, 'utf8');
  console.log(`✅ written: ${page.slug}.md`);
  written++;
}

console.log(`\nDone. Written: ${written}, Skipped: ${skipped}`);
