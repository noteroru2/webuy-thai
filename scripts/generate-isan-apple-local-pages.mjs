import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const postsDir = join(process.cwd(), 'src', 'content', 'posts');
mkdirSync(postsDir, { recursive: true });

const isanProvinces = [
	'อุบลราชธานี',
	'ขอนแก่น',
	'อุดรธานี',
	'โคราช',
	'บุรีรัมย์',
	'สุรินทร์',
	'ศรีสะเกษ',
	'ยโสธร',
	'ร้อยเอ็ด',
	'มหาสารคาม',
	'กาฬสินธุ์',
	'ชัยภูมิ',
	'นครพนม',
	'สกลนคร',
	'หนองคาย',
	'หนองบัวลำภู',
	'เลย',
	'มุกดาหาร',
	'อำนาจเจริญ',
	'บึงกาฬ',
];

const categoryConfigs = [
	{
		key: 'macbook',
		prefix: 'รับซื้อแมคบุ๊ค-',
		pubDate: '2026-05-23',
		mainLink: '/รับซื้อแมคบุ๊ค/',
		heroPool: [
			'/media/notebook-showcase/macbook-air-on-box.webp',
			'/media/notebook-showcase/macbook-boot-screen.webp',
		],
		exclude: new Set(['ขอนแก่น', 'อุดรธานี', 'โคราช']),
		render: ({ province, slug, heroImage, heroImageAlt }) => `---
title: "รับซื้อแมคบุ๊ค ${province} ประเมินจากรุ่น ชิป รอบชาร์จ และสภาพจริงก่อนนัดรับ"
description: "ขาย MacBook มือสองใน${province}ได้ที่ WE BUY รับซื้อ MacBook Air และ MacBook Pro ประเมินจากรุ่น ชิป RAM SSD รอบชาร์จ และสภาพเครื่องจริงก่อนนัดรับ"
pubDate: "2026-05-23"
updatedDate: "2026-05-23"
slug: "${slug}"
heroImage: "${heroImage}"
heroImageAlt: "${heroImageAlt}"
qualityScore: 9
qualityFlags: []
faqItems:
  - question: "ขาย MacBook ใน${province}ควรส่งข้อมูลอะไรเพื่อเช็กราคา"
    answer: "ควรส่งรุ่นเต็ม ชิป RAM SSD จำนวนรอบชาร์จ รูปหน้าจอ รูปบอดี้ และแจ้งตำหนิ เช่น แบตเสื่อม จอมีเงา หรือคีย์บอร์ดมีปัญหา เพื่อให้ประเมินได้ใกล้ราคาจริง"
  - question: "MacBook ติด iCloud ยังขายได้ไหม"
    answer: "ควรปลด iCloud และปิด Find My ก่อนขาย เพราะถ้ายังติดบัญชีอยู่จะกระทบการรับซื้อและราคาค่อนข้างมาก"
  - question: "MacBook แบตเสื่อมหรือจอมีตำหนิยังขายได้ไหม"
    answer: "ขายได้ แต่ราคาจะปรับตามต้นทุนแบตหรือจอที่ต้องเปลี่ยนจริง แนะนำให้แจ้งอาการและส่งรูปให้ครบตั้งแต่แรก"
---

ถ้าคุณกำลังหา **รับซื้อแมคบุ๊ค ${province}** และอยากเริ่มจากการประเมินที่ดูข้อมูลจริง ไม่ใช่เดาราคาจากคำว่า Air หรือ Pro อย่างเดียว หน้านี้ถูกทำขึ้นเพื่อช่วยให้คุณเตรียมข้อมูลได้ถูกตั้งแต่รอบแรก เพราะ MacBook มือสองเป็นกลุ่มสินค้าที่ราคาต่างกันชัดจากชิป รุ่น ปี รอบชาร์จ และสภาพจอ

WE BUY รับซื้อทั้ง **MacBook Air และ MacBook Pro** ใน${province} โดยเริ่มจากประเมินผ่านแชตก่อน แล้วค่อยตกลงวิธีนัดรับหรือจัดส่งตามความเหมาะสม ช่วยลดการเดินทางเสียรอบและทำให้รู้ช่วงราคาก่อนตัดสินใจจริง

## MacBook แบบไหนที่ตลาดยังต้องการ

- MacBook Air ชิป Apple Silicon ที่แบตยังดีและสภาพสวย
- MacBook Pro ที่ RAM และ SSD ยังตอบโจทย์งานจริง
- เครื่องที่ปลด iCloud และปิด Find My พร้อมส่งต่อ
- เครื่องที่จอไม่เป็นเส้น บอดี้ไม่บุบหนัก และคีย์บอร์ดยังใช้งานครบ

## ปัจจัยที่มีผลกับราคามากที่สุด

- รุ่นและชิป เช่น Intel, M1, M2, M3 หรือรุ่นใหม่กว่า
- RAM และ SSD
- จำนวนรอบชาร์จและสุขภาพแบตเตอรี่
- สภาพหน้าจอ บอดี้ และคีย์บอร์ด
- มีอะแดปเตอร์แท้ กล่อง หรืออุปกรณ์เดิมครบหรือไม่

ถ้าคุณยังไม่แน่ใจว่าควรเตรียมอะไรบ้างก่อนขาย ดูต่อได้ที่ [รับซื้อแมคบุ๊ค](${categoryConfigs[0]?.mainLink ?? '/รับซื้อแมคบุ๊ค/'}), [ก่อนขาย MacBook ลบข้อมูล](/ก่อนขาย-macbook-ลบข้อมูล/) และ [MacBook แบตเสื่อมขายได้ไหม](/macbook-แบตเสื่อม-ขายได้ไหม/)

## ถ้าขายจาก${province}ควรเริ่มยังไง

เริ่มจากส่งรุ่นเต็ม ชิป RAM SSD รอบชาร์จ และรูปเครื่องจริงผ่าน Line ก่อน จากนั้นค่อยคุยรายละเอียดเรื่องนัดรับหรือวิธีส่งเครื่อง วิธีนี้ช่วยให้รู้ช่วงราคาคร่าว ๆ และช่วยคัดเคสที่ต้องตรวจละเอียด เช่น จอมีเงา แบตเสื่อม หรือเครื่องเคยซ่อมมาก่อน

## สรุป

หน้า **รับซื้อแมคบุ๊ค ${province}** เหมาะกับคนที่ต้องการขาย MacBook แบบประเมินตามสภาพจริง ยิ่งส่งข้อมูลครบตั้งแต่แรก ก็ยิ่งได้ช่วงราคาชัดและจบงานง่ายขึ้น
`,
	},
	{
		key: 'iphone',
		prefix: 'รับซื้อไอโฟน-',
		pubDate: '2026-05-23',
		mainLink: '/รับซื้อไอโฟน/',
		heroPool: [
			'/media/apple-local/iphone15-black-back.webp',
			'/media/apple-local/iphone15-black-front.webp',
			'/media/apple-local/iphone15-black-side.webp',
			'/media/apple-local/iphone-orange-back.webp',
			'/media/apple-local/iphone-orange-duo.webp',
			'/media/apple-local/iphone-dark-front.webp',
		],
		exclude: new Set(['อุบลราชธานี', 'อุดรธานี', 'โคราช']),
		render: ({ province, slug, heroImage, heroImageAlt }) => `---
title: "รับซื้อไอโฟน ${province} ประเมินจากรุ่น ความจุ แบต และสภาพจริงก่อนนัดรับ"
description: "ขาย iPhone มือสองใน${province}ได้ที่ WE BUY รับซื้อหลายรุ่น ประเมินจากรุ่น ความจุ สุขภาพแบต สภาพจอ Face ID และสถานะ iCloud ก่อนนัดรับ"
pubDate: "2026-05-23"
updatedDate: "2026-05-23"
slug: "${slug}"
heroImage: "${heroImage}"
heroImageAlt: "${heroImageAlt}"
qualityScore: 9
qualityFlags: []
faqItems:
  - question: "ขาย iPhone ใน${province}ควรส่งข้อมูลอะไรบ้าง"
    answer: "ควรส่งรุ่น ความจุ สุขภาพแบต รูปหน้าจอ รูปบอดี้ และแจ้งว่า Face ID, กล้อง และ True Tone ปกติหรือไม่ เพื่อให้ประเมินได้แม่นขึ้น"
  - question: "iPhone จอแตกหรือแบตต่ำยังขายได้ไหม"
    answer: "ขายได้ แต่ราคาจะปรับตามต้นทุนซ่อมจริง ยิ่งแจ้งอาการครบตั้งแต่แรก การประเมินก็ยิ่งตรงและลดการต่อรองหน้างาน"
  - question: "iPhone ติด iCloud รับซื้อไหม"
    answer: "ควรปลด iCloud และปิด Find My ก่อนขาย เพราะถ้ายังติดบัญชีอยู่จะกระทบกับการรับซื้อและราคามาก"
---

ถ้าคุณกำลังหา **รับซื้อไอโฟน ${province}** และอยากเริ่มจากการประเมินที่ดูตามเครื่องจริง ไม่ใช่ดูแค่ชื่อรุ่น หน้านี้จะช่วยให้คุณเข้าใจว่าการรับซื้อ iPhone มือสองควรดูอะไรบ้าง และควรเตรียมข้อมูลยังไงถึงจะได้ช่วงราคาที่ใกล้ความจริงที่สุดก่อนนัดรับ

WE BUY รับซื้อ iPhone มือสองใน${province}โดยดูทั้ง **รุ่น, ความจุ, สุขภาพแบตเตอรี่, สภาพจอ, Face ID, True Tone, กล้อง, บอดี้ และสถานะ iCloud** เพราะ iPhone เป็นสินค้าที่รายละเอียดเล็ก ๆ หลายอย่างมีผลกับราคาอย่างชัดเจน

## ปัจจัยที่มีผลกับราคา iPhone

- รุ่นและความจุของเครื่อง
- สุขภาพแบตเตอรี่
- สภาพหน้าจอและเฟรมเครื่อง
- Face ID, True Tone และกล้องยังทำงานปกติหรือไม่
- สถานะ iCloud และการรีเซ็ตเครื่องพร้อมส่งต่อ

ถ้าคุณยังต้องเตรียมเครื่องก่อนขาย ดูต่อได้ที่ [รับซื้อไอโฟน](${categoryConfigs[1]?.mainLink ?? '/รับซื้อไอโฟน/'}), [ก่อนขาย iPhone ล้างข้อมูล](/ก่อนขาย-iphone-ล้างข้อมูล/), [ขาย iPhone ติด Apple ID ได้ไหม](/ขาย-iphone-ติด-apple-id-ได้ไหม/) และ [ขายมือถือให้ร้านปลอดภัยไหม](/ขายมือถือให้ร้าน-ปลอดภัยไหม/)

## ลูกค้าใน${province}ควรเริ่มต้นยังไง

เริ่มจากส่งรุ่น ความจุ สุขภาพแบต และรูปเครื่องจริงผ่าน Line ก่อน จากนั้นค่อยคุยรายละเอียดเรื่องนัดรับหรือวิธีส่งเครื่อง วิธีนี้ช่วยลดการเสียเวลาและทำให้รู้แนวราคาก่อนคุยหน้างาน

## สรุป

หน้า **รับซื้อไอโฟน ${province}** เหมาะกับคนที่ต้องการขาย iPhone แบบประเมินตามสภาพจริง ยิ่งส่งข้อมูลครบตั้งแต่แรก ก็ยิ่งได้ช่วงราคาชัดและจบงานง่ายขึ้น
`,
	},
	{
		key: 'ipad',
		prefix: 'รับซื้อไอแพด-',
		pubDate: '2026-05-23',
		mainLink: '/รับซื้อไอแพด/',
		heroPool: ['/media/apple-local/ipad-mini-silver-back.webp'],
		exclude: new Set(['อุบลราชธานี']),
		render: ({ province, slug, heroImage, heroImageAlt }) => `---
title: "รับซื้อไอแพด ${province} ประเมินจากรุ่น ความจุ สภาพจอ และแบตเตอรี่ก่อนนัดรับ"
description: "ขาย iPad มือสองใน${province}ได้ที่ WE BUY รับซื้อ iPad Pro, Air, mini และรุ่นธรรมดา ประเมินจากรุ่น ความจุ Wi-Fi หรือ Cellular สภาพจอ แบตเตอรี่ และอุปกรณ์ก่อนนัดรับ"
pubDate: "2026-05-23"
updatedDate: "2026-05-23"
slug: "${slug}"
heroImage: "${heroImage}"
heroImageAlt: "${heroImageAlt}"
qualityScore: 9
qualityFlags: []
faqItems:
  - question: "ขาย iPad ใน${province}ควรส่งข้อมูลอะไรเพื่อเช็กราคา"
    answer: "ควรส่งรุ่น ความจุ สี สถานะ Wi-Fi หรือ Cellular รูปหน้าจอ รูปตัวเครื่อง และแจ้งว่ามี Apple Pencil หรือคีย์บอร์ดมาด้วยหรือไม่ เพื่อให้ประเมินได้ใกล้ราคาจริงขึ้น"
  - question: "iPad จอแตกหรือแบตเสื่อมยังขายได้ไหม"
    answer: "ขายได้ แต่ราคาจะปรับตามต้นทุนซ่อมจริง โดยเฉพาะรุ่นจอใหญ่หรือรุ่นที่มี Face ID ควรถ่ายรูปตำหนิและแจ้งอาการให้ครบตั้งแต่แรก"
  - question: "iPad ติด iCloud รับซื้อไหม"
    answer: "ควรปลด iCloud และปิด Find My ก่อนขาย เพราะหากยังติดบัญชีอยู่จะกระทบการรับซื้อและราคามาก"
---

ถ้าคุณกำลังหา **รับซื้อไอแพด ${province}** แบบคุยราคาได้ชัดตั้งแต่แรก วิธีที่ดีที่สุดคือส่งข้อมูลเครื่องให้ครบก่อน เพราะราคา iPad ไม่ได้ดูแค่ปีหรือคำว่า Pro กับ Air แต่ดูทั้งรุ่น ความจุ สถานะ Wi‑Fi หรือ Cellular สภาพจอ แบตเตอรี่ และอุปกรณ์ที่มีมาครบด้วย

WE BUY รับซื้อ iPad มือสองใน${province} โดยเริ่มจากประเมินผ่านแชตก่อน แล้วค่อยตกลงวิธีนัดรับหรือจัดส่งตามความสะดวก ช่วยลดการเดินทางเสียรอบและทำให้รู้ช่วงราคาได้เร็วขึ้น

## iPad แบบไหนที่ตลาดยังต้องการ

- iPad Pro รุ่นชิป M-series ที่จอและแบตยังดี
- iPad Air รุ่นใหม่ที่ความจุ 128GB ขึ้นไป
- iPad mini สำหรับคนที่ต้องการเครื่องพกพา
- iPad รุ่นธรรมดาที่ใช้งานเรียนหรือทำงานพื้นฐานได้ดี

## ปัจจัยที่มีผลกับราคามากที่สุด

- รุ่นและชิปของเครื่อง
- ความจุและสถานะ Wi‑Fi หรือ Cellular
- สภาพหน้าจอ กระจก และเฟรมเครื่อง
- สุขภาพแบตเตอรี่และอาการชาร์จเข้า
- มี Apple Pencil คีย์บอร์ด หรือกล่องเดิมมาครบหรือไม่

ถ้าคุณยังไม่แน่ใจเรื่องการเตรียมเครื่องก่อนขาย ดูต่อได้ที่ [รับซื้อไอแพด](${categoryConfigs[2]?.mainLink ?? '/รับซื้อไอแพด/'}), [iPad Gen 9 มือสองขายได้กี่บาท](/ipad-gen-9-มือสอง-ขายได้กี่บาท/) และ [ร้านรับซื้อไอทีประเมินราคาจากอะไร](/ร้านรับซื้อไอที-ประเมินราคาจากอะไร/)

## ถ้าขายจาก${province}ควรเริ่มอย่างไร

เริ่มจากส่งรุ่น ความจุ รูปหน้าจอ รูปด้านหลัง และแจ้งตำหนิให้ครบผ่าน Line ก่อน วิธีนี้ช่วยให้รู้ช่วงราคาคร่าว ๆ และช่วยคัดเคสที่ต้องตรวจละเอียด เช่น จอแตก แบตเสื่อม หรือเครื่องเคยซ่อมมาก่อน

## สรุป

หน้า **รับซื้อไอแพด ${province}** เหมาะกับคนที่ต้องการขาย iPad แบบประเมินตามสภาพจริง ยิ่งส่งข้อมูลครบตั้งแต่แรก ก็ยิ่งได้ช่วงราคาชัดและจบงานง่ายขึ้น
`,
	},
];

function shouldRewrite(filePath) {
	if (!existsSync(filePath)) return true;
	const source = readFileSync(filePath, 'utf8');
	return source.includes('legacy_alias') || source.includes('qualityScore: 1');
}

const created = [];
const updated = [];
const skipped = [];

for (const config of categoryConfigs) {
	const targetProvinces = isanProvinces.filter((province) => !config.exclude.has(province));
	targetProvinces.forEach((province, index) => {
		const slug = `${config.prefix}${province}`;
		const filePath = join(postsDir, `${slug}.md`);
		const existedBefore = existsSync(filePath);
		const heroImage = config.heroPool[index % config.heroPool.length];
		const heroImageAlt =
			config.key === 'iphone'
				? `ตัวอย่าง iPhone ที่รับประเมินใน${province}`
				: config.key === 'ipad'
					? `ตัวอย่าง iPad ที่รับประเมินใน${province}`
					: `ตัวอย่าง MacBook ที่รับประเมินใน${province}`;

		if (!shouldRewrite(filePath)) {
			skipped.push(slug);
			return;
		}

		const content = config.render({ province, slug, heroImage, heroImageAlt });
		writeFileSync(filePath, content, 'utf8');

		if (existedBefore) {
			updated.push(slug);
		} else {
			created.push(slug);
		}
	});
}

console.log(JSON.stringify({ created, updated, skipped }, null, 2));
