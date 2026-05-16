import { shouldNoindexAsOffTopic } from './content-quality-utils.mjs';
import {
	AMPHOE_META,
	BANGKOK_PC_META,
	BANGKOK_PC_SLUG_TO_DISTRICT,
	SLUG_PROVINCE_MAP,
	hashSlug,
	interpolate,
	pick,
	pickMany,
} from './local-seo-content-data.mjs';

const PROVINCES = [
	'กรุงเทพมหานคร',
	'กรุงเทพฯ',
	'อุบลราชธานี',
	'ขอนแก่น',
	'นครราชสีมา',
	'โคราช',
	'อุดรธานี',
	'มหาสารคาม',
	'สุรินทร์',
	'ศรีสะเกษ',
	'ยโสธร',
	'ร้อยเอ็ด',
	'บุรีรัมย์',
	'กาฬสินธุ์',
	'มุกดาหาร',
	'นครพนม',
	'สกลนคร',
	'หนองคาย',
	'หนองบัวลำภู',
	'บึงกาฬ',
	'ชัยภูมิ',
	'อำนาจเจริญ',
	'ชลบุรี',
	'ภูเก็ต',
	'ปทุมธานี',
	'เลย',
];

const PROVINCE_GUIDES = {
	อุบลราชธานี: {
		iphone: '/รับซื้อไอโฟน-อุบลราชธานี-คู่มือ/',
		notebook: '/รับซื้อโน๊ตบุ๊ค-อุบลราชธานี-คู่มือ/',
		macbook: '/รับซื้อ-macbook-อุบลราชธานี-ปัจจัยราคา-2026/',
		meeting: 'เซ็นทรัลอุบลฯ สุนีย์ทาวเวอร์ ม.อุบลฯ วารินชำราบ',
	},
	ขอนแก่น: {
		iphone: '/รับซื้อไอโฟน-ขอนแก่น-คู่มือ/',
		notebook: '/รับซื้อโน๊ตบุ๊ค/',
		macbook: '/รับซื้อแมคบุ๊ค/',
		meeting: 'เซ็นทรัลขอนแก่น มข. ตลาดต้นตาล',
	},
	นครราชสีมา: {
		iphone: '/รับซื้อไอโฟน/',
		notebook: '/รับซื้อโน๊ตบุ๊ค-โคราช/',
		macbook: '/รับซื้อแมคบุ๊ค/',
		meeting: 'เซ็นทรัลโคราช โซนตัวเมือง',
	},
	อุดรธานี: {
		iphone: '/รับซื้อไอโฟน-อุดรธานี/',
		notebook: '/รับซื้อโน๊ตบุ๊ค/',
		macbook: '/รับซื้อแมคบุ๊ค/',
		meeting: 'เซ็นทรัลอุดรธานี โซนตัวเมือง',
	},
};

const DEFAULT_GUIDES = {
	iphone: '/รับซื้อไอโฟน/',
	notebook: '/รับซื้อโน๊ตบุ๊ค/',
	pc: '/รับซื้อคอม/',
	macbook: '/รับซื้อแมคบุ๊ค/',
	ipad: '/รับซื้อไอแพด/',
	camera: '/รับซื้อกล้อง/',
	android: '/รับซื้อสมาร์ทโฟน-android/',
	watch: '/รับซื้อ-apple-watch/',
	game: '/รับซื้อเครื่องเกม/',
	speaker: '/รับซื้อลำโพง/',
};

const BANGKOK_DISTRICT_RE =
	/ดินแดง|บางรัก|ลาดพร้าว|บางนา|จตุจักร|ห้วยขวาง|พระโขนง|ธนบุรี|บึงกุ่ม|สาทร|ปทุมวัน|บางเขน|บางกะปิ|บางซื่อ|บางพลัด|บางแค|บางคอแหลม|บางบอน|ทุ่งครุ|ทวีวัฒนา|ภาษีเจริญ|ราษฎร์บูรณะ|คลองสาน|ป้อมปราบ|ดุสิต|พระนคร|สายไหม|คันนายาว|หลักสี่|หนองจอก|หนองแขม|สะพานสูง|บางขุนเทียน|บางกอกน้อย|บางกอกใหญ่|วัฒนา/;

function normalizeProvince(text) {
	for (const p of PROVINCES) {
		if (text.includes(p)) return p === 'กรุงเทพฯ' ? 'กรุงเทพมหานคร' : p;
	}
	if (/กรุงเทพ|bangkok/i.test(text)) return 'กรุงเทพมหานคร';
	return null;
}

function extractDistrictFromTitle(title, province) {
	const t = String(title ?? '');

	if (/MacBook,\s*iMac\s*,\s*iPhone\s*,\s*iPad/i.test(t) && province) {
		const local = t
			.replace(/^.*iPad\s*/i, '')
			.replace(province, '')
			.trim();
		if (local && local.length > 1) return local;
	}

	const pcMatch = t.match(/รับซื้อคอม\s+([^\s,]+)/i);
	if (pcMatch?.[1] && !PROVINCES.includes(pcMatch[1])) {
		return pcMatch[1].trim();
	}

	if (province && t.includes(province)) {
		const before = t.split(province)[0];
		const words = before.trim().split(/\s+/);
		const last = words.at(-1);
		if (last && last.length > 2 && !/macbook|imac|iphone|ipad|รับซื้อ/i.test(last)) return last;
	}
	return null;
}

/** Resolve amphoe/district reliably from slug (preferred) or title. */
export function resolveLocation({ title, slug, classification }) {
	const s = String(slug ?? '');
	let district = null;
	let province = classification.province ?? null;

	const pcSlug = s.match(/^รับซื้อคอม-(.+)$/);
	if (pcSlug) {
		district = BANGKOK_PC_SLUG_TO_DISTRICT[pcSlug[1]] ?? pcSlug[1];
		province = province ?? 'กรุงเทพมหานคร';
	}

	if (!district && classification.type === 'apple_bundle' && /^รับซื้อ/.test(s) && !/คอม|โน๊ต|กล้อง|harddisk|โดรน/i.test(s)) {
		const amphoe = s.replace(/^รับซื้อ/, '').trim();
		if (amphoe.length > 1) district = amphoe;
	}

	if (!district) {
		district = extractDistrictFromTitle(title, province);
	}

	if (!district && classification.district) {
		district = classification.district;
	}

	if (!province && district && AMPHOE_META[district]) {
		province = AMPHOE_META[district].province;
	}

	if (SLUG_PROVINCE_MAP[s]) {
		province = SLUG_PROVINCE_MAP[s].province;
	}

	if (!province && /buy-camera-/.test(s)) {
		province = SLUG_PROVINCE_MAP[s]?.province ?? province;
	}

	return { district, province };
}

export function classifyPost({ title, slug, body }) {
	const titleText = String(title ?? '');
	const slugText = String(slug ?? '');

	if (shouldNoindexAsOffTopic(titleText, slugText)) {
		return { type: 'off_topic', province: null, district: null, product: null };
	}

	if (/รับซ่อม/i.test(titleText) && !/รับซื้อ/i.test(titleText)) {
		return { type: 'repair', province: normalizeProvince(titleText), district: null, product: 'repair' };
	}

	if (/MacBook,\s*iMac\s*,\s*iPhone\s*,\s*iPad/i.test(titleText)) {
		const province = normalizeProvince(titleText);
		const district = extractDistrictFromTitle(titleText, province);
		return { type: 'apple_bundle', province, district, product: 'apple' };
	}

	if (/รับซื้อคอม|รับซื้อ\s*pc|รับซื้อคอมพิวเตอร์|รับเหมาคอม|ประมูลคอม/i.test(titleText) || /^รับซื้อคอม-/.test(slugText)) {
		const province =
			normalizeProvince(titleText) ??
			(BANGKOK_DISTRICT_RE.test(titleText) || /^รับซื้อคอม-/.test(slugText) ? 'กรุงเทพมหานคร' : null);
		const district = extractDistrictFromTitle(titleText, province);
		return { type: 'pc', province, district, product: 'pc' };
	}

	if (/รับซื้อโน๊ตบุ๊ค|notebook|laptop/i.test(titleText)) {
		const province = normalizeProvince(titleText);
		let brand = null;
		if (/asus/i.test(titleText)) brand = 'ASUS';
		else if (/hp/i.test(titleText)) brand = 'HP';
		else if (/dell/i.test(titleText)) brand = 'Dell';
		else if (/acer/i.test(titleText)) brand = 'Acer';
		else if (/lenovo|เลโนโว่/i.test(titleText)) brand = 'Lenovo';
		return { type: 'notebook', province, district: extractDistrictFromTitle(titleText, province), product: 'notebook', brand };
	}

	if (/รับซื้อไอโฟน|รับซื้อ\s*iphone|ขายไอโฟน|ขาย\s*iphone|รับซื้อโทรศัพท์|รับซื้อมือถือ|รับซื้อซัมซุง|samsung|s24|s23/i.test(titleText)) {
		const province = normalizeProvince(titleText);
		return {
			type: 'iphone',
			province,
			district: extractDistrictFromTitle(titleText, province),
			product: /ซัมซุง|samsung/i.test(titleText) ? 'android' : 'iphone',
		};
	}

	if (/รับซื้อไอแพด|รับซื้อ\s*ipad/i.test(titleText)) {
		return { type: 'ipad', province: normalizeProvince(titleText), district: extractDistrictFromTitle(titleText), product: 'ipad' };
	}

	if (/รับซื้อแมคบุ๊ค|macbook/i.test(titleText)) {
		return { type: 'macbook', province: normalizeProvince(titleText), district: extractDistrictFromTitle(titleText), product: 'macbook' };
	}

	if (/รับซื้อกล้อง|mirrorless|canon|nikon|fujifilm|panasonic/i.test(titleText) || /buy-camera-/.test(slugText)) {
		return { type: 'camera', province: normalizeProvince(titleText) ?? SLUG_PROVINCE_MAP[slugText]?.province, district: null, product: 'camera' };
	}

	if (/รับซื้อ.*(?:ทีวี|smart\s*tv|โทรทัศน์)/i.test(titleText)) {
		return { type: 'tv', province: normalizeProvince(titleText), district: null, product: 'tv' };
	}

	if (/harddisk|ฮาร์ดดิส/i.test(titleText)) {
		return { type: 'storage', province: normalizeProvince(titleText), district: null, product: 'storage' };
	}

	if (/รับซื้อโดรน|drone/i.test(titleText)) {
		return { type: 'drone', province: normalizeProvince(titleText), district: null, product: 'drone' };
	}

	if (/apple\s*watch/i.test(titleText)) {
		return { type: 'watch', province: normalizeProvince(titleText), district: null, product: 'watch' };
	}

	if (/ps5|play\s*station|เครื่องเกม/i.test(titleText)) {
		return { type: 'game', province: normalizeProvince(titleText), district: null, product: 'game' };
	}

	if (/marshall|ลำโพง/i.test(titleText)) {
		return { type: 'speaker', province: normalizeProvince(titleText), district: null, product: 'speaker' };
	}

	if (/รับซื้อจอ/i.test(titleText)) {
		return { type: 'monitor', province: normalizeProvince(titleText), district: null, product: 'monitor' };
	}

	if (/วิธีเช็ค|ข้อดีที่ทำให้|อันดับ/i.test(titleText) && !/รับซื้อ/i.test(titleText)) {
		return { type: 'editorial', province: normalizeProvince(titleText), district: null, product: null };
	}

	return { type: 'generic', province: normalizeProvince(titleText), district: extractDistrictFromTitle(titleText), product: 'generic' };
}

function guidesFor(province) {
	return PROVINCE_GUIDES[province] ?? null;
}

function locationLabel(province, district) {
	if (district && province) return `${district} ${province}`;
	if (province) return province;
	if (district) return district;
	return '';
}

function extractProductHint(title) {
	const t = String(title ?? '');
	if (/m50|eos\s*m/i.test(t)) return 'Canon EOS M50';
	if (/fujifilm/i.test(t)) return 'Fujifilm';
	if (/panasonic/i.test(t)) return 'Panasonic';
	if (/canon/i.test(t)) return 'Canon';
	if (/nikon/i.test(t)) return 'Nikon';
	if (/s24\s*ultra/i.test(t)) return 'Samsung S24 Ultra';
	if (/s23\s*ultra/i.test(t)) return 'Samsung S23 Ultra';
	if (/dji/i.test(t)) return 'DJI';
	return null;
}

// --- FAQ pools (large; each post picks a unique subset) ---

function faqPoolPc(district, loc) {
	const d = district ?? 'กรุงเทพ';
	return [
		{
			question: `รับซื้อคอมเขต${d} ต้องส่งสเปกอะไรบ้าง`,
			answer: 'ส่งชื่อ CPU, RAM, การ์ดจอ, ความจุ SSD/HDD และรูปเครื่องจริง 4 มุม รวมถึงรูปหน้าจอ Device Manager หรือ CPU-Z จะช่วยให้ราคาแม่นขึ้น',
		},
		{
			question: `นัดรับคอมใน${loc || d} ได้ที่ไหน`,
			answer: `นัดรับได้ตามจุดสะดวกในเขต เช่น BTS/MRT หรือห้างใกล้บ้าน แจ้งจุดเมื่อทัก Line @webuy`,
		},
		{
			question: 'คอมเกมมิ่งกับคอมสำนักงานราคาต่างกันไหม',
			answer: 'ต่างกันชัดเจน คอมเกมมิ่งดูการ์ดจอและ PSU เป็นหลัก ส่วนคอมออฟฟิศดู CPU/RAM/SSD มากกว่า',
		},
		{
			question: 'คอมเปิดไม่ติดยังขายได้ไหม',
			answer: 'ได้บางกรณี ขึ้นกับว่าเป็นอาการ PSU บอร์ด หรือการ์ดจอ ส่งอาการและรูปมาประเมินก่อน',
		},
		{
			question: 'รับซื้อคอมจากบริษัทในกรุงเทพได้ไหม',
			answer: 'รับได้ ทั้งเครื่องเดี่ยวและล็อตเล็ก แจ้งจำนวนเครื่องและสเปกรวมผ่าน Line',
		},
		{
			question: 'ต้องลบข้อมูลก่อนส่งมอบไหม',
			answer: 'ควรสำรองและฟอร์แมต HDD/SSD หรือถอดดิสก์ออกก่อน หากต้องการให้ช่วยลบข้อมูลแจ้งล่วงหน้าได้',
		},
		{
			question: 'ประเมินราคาคอมใช้เวลานานไหม',
			answer: 'ถ้าส่งสเปกและรูปครบ มักได้ช่วงราคาเบื้องต้นภายในเวลาทำการ',
		},
		{
			question: 'จ่ายเงินหลังรับคอมอย่างไร',
			answer: 'ตรวจเครื่องตรงตามที่แจ้งแล้วโอนหรือจ่ายสดทันทีหน้างาน',
		},
	];
}

function faqPoolApple(district, loc) {
	return [
		{
			question: `รับซื้อ iPhone ใน${loc} ต้องปิดอะไรก่อนส่ง`,
			answer: 'ออกจาก iCloud ปิด Find My และรีเซ็ตเครื่องหลังสำรองข้อมูลแล้ว',
		},
		{
			question: `นัดรับ MacBook ที่${district} ได้ที่ไหน`,
			answer: 'นัดรับได้ที่จุดกลางอำเภอ ปั๊มสายหลัก หรือห้างในจังหวัด แจ้งเมื่อทัก Line',
		},
		{
			question: 'iPad ที่เคยซ่อมจอยังขายได้ไหม',
			answer: 'ขายได้ แต่ควรแจ้งประวัติซ่อมและส่งรูปจอขณะเปิดสีขาว',
		},
		{
			question: 'แบต MacBook ต่ำกว่า 80% มีผลไหม',
			answer: 'มีผลต่อราคา โดยเฉพาะถ้าขึ้น Service Recommended',
		},
		{
			question: 'รับซื้อ iMac ที่ไม่มีกล่องได้ไหม',
			answer: 'ได้ แต่กล่องและอุปกรณ์ครบช่วยให้ราคาดีขึ้น',
		},
		{
			question: 'เครื่องติด Activation Lock รับไหม',
			answer: 'ต้องปลดล็อกก่อน หากยังติดบัญชีอาจรับไม่ได้',
		},
		{
			question: 'ขาย iPhone หลายเครื่องพร้อมกันได้ไหม',
			answer: 'ได้ ส่งรายการรุ่นและรูปแยกเครื่องเพื่อประเมินรวดเร็ว',
		},
	];
}

function faqPoolNotebook(brand, loc) {
	const b = brand ? ` ${brand}` : '';
	return [
		{
			question: `รับซื้อโน๊ตบุ๊ค${b}${loc ? `ใน${loc}` : ''} ดูอะไรบ้าง`,
			answer: 'ดู CPU, RAM, SSD, การ์ดจอ, สภาพจอ แบต และว่ามีติดบัญชีหรือไม่',
		},
		{
			question: 'โน๊ตบุ๊คเกมมิ่งกับสายออฟฟิศราคาต่างกันไหม',
			answer: 'ต่างกัน เกมมิ่งให้น้ำหนักการ์ดจอและจอรีเฟรชสูง ออฟฟิศดู CPU/RAM มากกว่า',
		},
		{
			question: 'จอเป็นเส้นยังขายได้ไหม',
			answer: 'ได้ แต่ราคาลดตามความรุนแรง ส่งรูปหน้าจอสีขาวและสีดำ',
		},
		{
			question: 'ต้องมีกล่องและสายชาร์จไหม',
			answer: 'ไม่บังคับ แต่ของครบช่วยให้ราคาดีขึ้น',
		},
		{
			question: 'นัดรับโน๊ตบุ๊คได้ที่ไหน',
			answer: 'นัดรับตามจังหวัดหรือจุดสะดวก ทัก Line @webuy เพื่อนัดคิว',
		},
		{
			question: 'ประเมินราคาโน๊ตบุ๊คใช้เวลาเท่าไร',
			answer: 'ถ้าส่งสเปกและรูปครบ มักตอบช่วงราคาเบื้องต้นในเวลาทำการ',
		},
	];
}

function faqPoolCamera(province, hint) {
	const model = hint ? ` (${hint})` : '';
	return [
		{
			question: `รับซื้อกล้อง${model}มือสองใน${province ?? 'อีสาน'} ดูอะไร`,
			answer: 'ดูรุ่น เลนส์ที่แถม จำนวนชัตเตอร์ สภาพยางและปุ่ม และอาการเซนเซอร์',
		},
		{
			question: 'ขายกล้องพร้อมเลนส์ได้ราคาดีกว่าไหม',
			answer: 'มักได้ดีกว่าขายแยก หากเลนส์เป็นคู่มาตรฐานและสภาพดี',
		},
		{
			question: 'กล้องมีรอยฟองน้ำในจอ EVF มีผลไหม',
			answer: 'มีผล ควรส่งรูปและอธิบายอาการตั้งแต่รอบแรก',
		},
		{
			question: 'ต้องมีกล่องและใบเสร็จไหม',
			answer: 'ไม่บังคับ แต่ช่วยเพิ่มความน่าเชื่อถือและราคา',
		},
		{
			question: 'นัดรับกล้องได้ที่ไหน',
			answer: `นัดรับใน${province ?? 'เมือง'} หรือจุดสะดวก ทัก Line @webuy`,
		},
		{
			question: 'รับซื้อกล้องที่เคยตกน้ำได้ไหม',
			answer: 'ได้บางกรณี ขึ้นกับอาการ ส่งรูปและทดสอบชัตเตอร์มาก่อน',
		},
	];
}

function buildFaq({ classification, loc, district, slug, title }) {
	const seed = hashSlug(slug ?? title ?? '');
	const hint = extractProductHint(title);

	let pool;
	if (classification.type === 'pc') pool = faqPoolPc(district, loc);
	else if (classification.type === 'apple_bundle') pool = faqPoolApple(district, loc);
	else if (classification.type === 'notebook') pool = faqPoolNotebook(classification.brand, loc);
	else if (classification.type === 'camera' || classification.type === 'editorial') pool = faqPoolCamera(classification.province, hint);
	else if (classification.type === 'iphone' || classification.product === 'android') {
		pool = [
			...faqPoolApple(district, loc),
			{
				question: `รับซื้อ${classification.product === 'android' ? ' Samsung' : ' iPhone'}${loc ? `ใน${loc}` : ''} ต้องเช็กอะไร`,
				answer: 'เช็ก Battery Health สภาพจอ ตำหนิตัวเครื่อง และปลดบัญชีก่อนส่งมอบ',
			},
		];
	} else {
		pool = faqPoolNotebook(null, loc);
	}

	return pickMany(pool, seed, 5);
}

function buildDescription({ title, classification, loc, slug, district }) {
	const seed = hashSlug(slug ?? title ?? '');
	const templates = {
		pc: [
			'รับซื้อคอมเขต{district} ประเมินจาก CPU การ์ดจอ SSD จริง นัดรับ{transit} จ่ายหลังตรวจเครื่อง Line @webuy',
			'ขายคอมมือสองใน{district} กรุงเทพฯ — รับทั้งคอมเกมมิ่งและสำนักงาน ส่งสเปกรับราคาเบื้องต้นก่อนนัดรับ',
			'บริการรับซื้อคอม{district} โปร่งใส ไม่กดราคาหน้างานเมื่อสเปกตรงที่แจ้ง ทัก Line @webuy',
		],
		apple_bundle: [
			'รับซื้อ iPhone iPad MacBook ที่{district} {province} ประเมินตรงสภาพจริง นัดรับสะดวก จ่ายทันที',
			'ขาย Apple มือสองใน{district} — ปลด iCloud ครบก่อนส่ง รับราคาใกล้ตลาด ทัก Line @webuy',
			'รับซื้อสินค้า Apple อำเภอ{district} ส่งรุ่นและรูปรับช่วงราคา นัดรับในจังหวัด',
		],
		notebook: [
			'รับซื้อโน๊ตบุ๊ค{brand}{loc} ดูสเปกจริงก่อนนัดรับ จ่ายหลังตรวจเครื่อง Line @webuy',
			'ขายโน๊ตบุ๊คมือสอง{loc} — แจ้งสภาพจอแบตตรงตามจริง ราคานิ่งกว่า',
		],
		camera: [
			'รับซื้อกล้องมือสอง{loc} ประเมินตามรุ่น เลนส์ และชัตเตอร์ นัดรับสะดวก Line @webuy',
			'ขายกล้อง{hint}{loc} — ส่งรูปและเลนส์ที่แถมรับราคาเบื้องต้นก่อนนัด',
		],
	};

	const type = classification.type === 'editorial' ? 'camera' : classification.type;
	const pool = templates[type] ?? [
		'รับซื้อสินค้าไอทีมือสอง{loc} ประเมินโปร่งใส นัดรับสะดวก จ่ายหลังตรวจเครื่อง Line @webuy',
	];

	const meta = district ? BANGKOK_PC_META[district] : null;
	const amphoe = district ? AMPHOE_META[district] : null;

	const vars = {
		district: district ?? '',
		province: classification.province ?? amphoe?.province ?? '',
		loc: loc ? `ใน${loc}` : '',
		brand: classification.brand ? ` ${classification.brand}` : '',
		transit: meta?.transit ? `แถว${meta.transit}` : '',
		hint: extractProductHint(title) ? ` ${extractProductHint(title)}` : '',
	};

	return interpolate(pick(pool, seed), vars).slice(0, 160);
}

// --- Unique body builders ---

function sectionPricingPc(seed, district) {
	const variants = [
		`## สิ่งที่ WE BUY ดูก่อนเสนอราคาคอมเขต${district}

| หมวด | รายละเอียดที่ควรแจ้ง |
|------|---------------------|
| CPU | รุ่นเต็ม เช่น i5-12400F, Ryzen 5 5600 |
| การ์ดจอ | รุ่นและ VRAM รวมถึงว่าเป็นบอร์ดเก่าหรือไม่ |
| RAM | ความจุและ DDR4/DDR5 |
| เก็บข้อมูล | SSD/HDD ความจุและสุขภาพดิสก์ |
| ตัวเครื่อง | สภาพเคส พัดลมเสียง อุณหภูมิสูงผิดปกติ |

ตารางนี้ช่วยลดการต่อรองหน้างาน เพราะราคาเบื้องต้นอิงข้อมูลเดียวกับที่ตรวจจริง`,

		`## ปัจจัยราคาคอมในเขต${district} ที่มักถูกมองข้าม

- **PSU** — เพาเวอร์ซัพพลายไม่พอหรือเสียงดังมีผลกับคอมเกมมิ่ง
- **เมนบอร์ด** — รุ่นเก่าจำกัด RAM หรืออัปเกรดการ์ดจอ
- **ท่อความร้อน** — ถ้าเครื่องร้อนบ่อย ผู้ซื้อปลายทางจะหักต้นทุนซ่อม
- **Windows OEM** — ไม่คุ้มเท่าตัวเครื่อง แต่ช่วยให้ใช้งานต่อได้ทันที`,

		`## ราคารับซื้อคอมขึ้น-ลงตามสเปกจริง

คอมเขต${district} ที่ขายดีมักเป็นเครื่องที่ **สเปกตรงโฆษณา** — การ์ดจอไม่ใช่ของปลอม RAM ครบตามที่แจ้ง และดิสก์ไม่มี bad sector ส่งภาพ CPU-Z + GPU-Z จะช่วยให้ได้ช่วงราคาแคบลง`,
	];
	return pick(variants, seed, 2);
}

function buildPcBody({ title, slug, district, loc, heroImage, guides }) {
	const seed = hashSlug(slug);
	const meta = BANGKOK_PC_META[district] ?? {
		transit: 'BTS/MRT สถานีหลัก',
		meet: 'ห้างหรือจุดสะดวกในเขต',
		angle: 'พื้นที่ในกรุงเทพฯ',
	};

	const intros = [
		`ผู้ขายคอมใน**เขต${district}** มักโทรมาถามสองเรื่อง: จะได้ราคาเท่าไร และนัดรับตรงไหนไม่เสียเวลา ${meta.angle} WE BUY ประเมินจากสเปกจริงผ่าน Line @webuy ก่อนนัดรับแถว${meta.transit}`,
		`ถ้าคุณอยู่แถว**${meta.transit}** และมีคอมตั้งโต๊ะไม่ได้ใช้ การส่งสเปก CPU การ์ดจอ และรูปเครื่อง 4 มุมจะช่วยให้รู้ช่วงราคาก่อนเดินทาง เรารับซื้อทั้งคอมสำนักงานและเกมมิ่งในเขต${district}`,
		`เขต${district} มีทั้งคอนโดออฟฟิศและบ้านเดี่ยวที่มักอัปเกรดเครื่องทุก 2–3 ปี แทนที่จะโพสต์ขายเองหลายวัน การปิดดีลกับผู้รับซื้อที่ตรวจหน้างานและจ่ายทันทีมักจบเร็วกว่า`,
	];

	const structureIndex = seed % 4;

	const structures = [
		() => `${pick(intros, seed)}
${heroImage ? `\n![${title}](${heroImage})\n` : ''}

## รับซื้อคอมพิวเตอร์ — เขต${district}

รับ **PC สำเร็จรูป คอมประกอบ All-in-One** ดูรายละเอียดหมวด [รับซื้อคอมพิวเตอร์](${DEFAULT_GUIDES.pc}) และ [รับซื้อคอมประกอบ](/รับซื้อคอมประกอบ/)

${sectionPricingPc(seed, district)}

## จุดนัดรับที่สะดวก

${meta.meet} — แจ้งจุดที่สะดวกเมื่อทัก Line

## ขั้นตอนขาย

1. ทัก [Line @webuy](https://line.me/R/ti/p/@webuy) ส่งสเปกและรูป
2. รับช่วงราคาเบื้องต้น
3. นัดรับเขต${district} ตรวจเครื่องและรับเงิน

**โทร 064-257-9353** · [ศูนย์รับซื้อสินค้าไอที](/รับซื้อ/)`,

		() => `${pick(intros, seed, 1)}
${heroImage ? `\n![${title}](${heroImage})\n` : ''}

## ก่อนโพสต์ขายคอมในเขต${district} ควรเตรียมอะไร

1. ถ่ายรูปหน้าจอ CPU-Z (แท็บ CPU + Memory)
2. ถ่ายรูป GPU-Z หรือ Device Manager (การ์ดจอ)
3. รูปตัวเคส 4 มุม และพัดลม/ฝาข้างถ้าแกะได้
4. แจ้งอาการเสียงดัง ร้อน หรือเปิดไม่ติดตามจริง

${sectionPricingPc(seed + 1, district)}

## บริการรับซื้อ

- คอมเกมมิ่ง (การ์ดจอแยก)
- คอมสำนักงาน Intel / AMD รุ่นใหม่
- ล็อตคอมจาก SME เล็ก

นัดรับ: ${meta.meet}

[Line @webuy](https://line.me/R/ti/p/@webuy) · [รับซื้อคอม](${DEFAULT_GUIDES.pc})`,

		() => `${pick(intros, seed, 2)}
${heroImage ? `\n![${title}](${heroImage})\n` : ''}

## ทำไมผู้ขายในเขต${district} ถึงเลือกปิดดีลหน้างาน

- ไม่ต้องโพสต์ขายเองหลายวัน
- รู้ราคาก่อนนัดจากสเปกจริง
- จ่ายทันทีหลังตรวจ ไม่ต้องรอโอนข้ามวัน

${sectionPricingPc(seed + 2, district)}

นัดรับแถว **${meta.transit}** — ${meta.meet}

[Line @webuy](https://line.me/R/ti/p/@webuy)`,

		() => `## รับซื้อคอมเขต${district} — สรุปสั้น

${meta.angle}

${heroImage ? `\n![${title}](${heroImage})\n` : ''}

${sectionPricingPc(seed + 3, district)}

| ประเภท | ตัวอย่างที่รับ |
|--------|---------------|
| ออฟฟิศ | i5/i7 + 16GB RAM |
| เกมมิ่ง | การ์ดจอ RTX 20 ขึ้นไป |
| All-in-One | iMac หรือ AIO ยี่ห้อดัง |

[รับซื้อคอม](${DEFAULT_GUIDES.pc}) · **064-257-9353** · [Line @webuy](https://line.me/R/ti/p/@webuy)`,
	];
	return structures[structureIndex]();
}

function buildAppleBundleBody({ title, slug, district, province, loc, heroImage, guides }) {
	const seed = hashSlug(slug);
	const amphoe = AMPHOE_META[district] ?? null;
	const prov = province ?? amphoe?.province ?? '';
	const meet = amphoe?.meet ?? guides?.meeting ?? `จุดกลาง${prov}`;
	const blurb = amphoe?.blurb ?? `พื้นที่${district} มีผู้ขายมือถือและ Mac มือสองอยู่เรื่อย ๆ`;

	const focus = seed % 3;
	const structureIndex = seed % 4;
	const productBlocks = [
		`## iPhone และ iPad มือสองใน${loc}

เน้นประเมินจาก **รุ่น ความจุ Battery Health** และการปลด iCloud — ดู [รับซื้อไอโฟน](${guides?.iphone ?? DEFAULT_GUIDES.iphone}) และ [รับซื้อไอแพด](${DEFAULT_GUIDES.ipad})`,
		`## MacBook และ iMac ที่${district}

ดูชิป (M-series vs Intel) แบต สภาพจอ และ Activation Lock — อ่าน [ปัจจัยราคา MacBook อุบล](/รับซื้อ-macbook-อุบลราชธานี-ปัจจัยราคา-2026/) หรือ [รับซื้อ MacBook](${guides?.macbook ?? DEFAULT_GUIDES.macbook})`,
		`## สินค้า Apple ที่รับซื้อครบวงจร

| ประเภท | สิ่งที่ต้องเช็กก่อนส่ง |
|--------|----------------------|
| iPhone | iCloud, Face ID, สภาพจอ, แบต |
| iPad | รอยจอ, Apple Pencil แถมหรือไม่ |
| MacBook | ชิป, แบต, คีย์บอร์ด, พอร์ต |
| iMac | จอ, พัดลม, รีโมท/คีย์บอร์ดแถม |`,
	];

	const intros = [
		`${blurb} หากคุณอยู่**${loc}** และต้องการขาย iPhone, iPad หรือ Mac การแจ้งสภาพตรงตั้งแต่รอบแรกจะได้ราคาใกล้เครื่องจริงที่สุด`,
		`คนท้องถิ่นใน**${district}** มักขาย Apple มือสองเมื่ออัปรุ่นหรือย้ายงาน ${blurb}`,
		`การขาย Mac หรือ iPhone ใน${loc} ไม่จำเป็นต้องโพสต์หลายกลุ่ม — ส่งรุ่นและรูปให้ WE BUY ประเมินผ่าน Line @webuy ก่อนนัดรับที่${meet}`,
	];

	const checklist = seed % 2 === 0
		? `## เช็กลิสต์ก่อนนัดรับ

- [ ] ออกจาก iCloud และปิด Find My
- [ ] สำรองและรีเซ็ต (มือถือ/แท็บเล็ต)
- [ ] แจ้งรอยตำหนิและประวัติซ่อม
- [ ] เตรียมกล่องและสายชาร์จ (ถ้ามี)`
		: `## ข้อมูลที่ควรส่งใน Line

1. รุ่นเต็มและความจุ
2. รูป About / Battery Health
3. รูปเครื่อง 4 มุม + ตำหนิ
4. แจ้งว่ามีกล่อง/ใบเสร็จหรือไม่`;

	const layouts = [
		() => `${pick(intros, seed)}
${heroImage ? `\n![${title}](${heroImage})\n` : ''}
${pick(productBlocks, seed, focus)}
${checklist}
## นัดรับใน${loc}
${meet} — ทัก Line เพื่อเลือกเวลา
## สรุป
WE BUY รับซื้อสินค้า Apple มือสองใน${loc} **[Line @webuy](https://line.me/R/ti/p/@webuy)** · 064-257-9353`,

		() => `${pick(intros, seed, 1)}
${heroImage ? `\n![${title}](${heroImage})\n` : ''}
## นัดรับใน${loc}ก่อน
${meet}
${pick(productBlocks, seed, focus)}
${checklist}
[รับซื้อไอโฟน](${guides?.iphone ?? DEFAULT_GUIDES.iphone}) · [Line @webuy](https://line.me/R/ti/p/@webuy)`,

		() => `${blurb}
${heroImage ? `\n![${title}](${heroImage})\n` : ''}
${checklist}
${pick(productBlocks, seed, focus + 1)}
## ติดต่อ
${meet} · **Line @webuy** · [ศูนย์รับซื้อ](/รับซื้อ/)`,

		() => `**${loc}** — ${pick(intros, seed, 2)}
${pick(productBlocks, seed, focus)}
${heroImage ? `\n![${title}](${heroImage})\n` : ''}
นัดรับ: ${meet}
**064-257-9353** · [Line @webuy](https://line.me/R/ti/p/@webuy)`,
	];

	return layouts[structureIndex]();
}

function buildNotebookBody({ title, slug, classification, loc, heroImage, guides }) {
	const seed = hashSlug(slug);
	const brand = classification.brand ?? '';
	const brandLine = brand ? `เน้นโน๊ตบุ๊ค **${brand}**` : 'รับทุกแบรนด์สายทำงานและเกมมิ่ง';

	const bodies = [
		`โน๊ตบุ๊คมือสอง${loc ? `ใน${loc}` : ''} ราคาไม่ได้ขึ้นอยู่กับแบรนด์อย่างเดียว — **CPU, RAM, SSD และสภาพจอ** ตัดสินเรทราคา ${brandLine}

${heroImage ? `![${title}](${heroImage})\n\n` : ''}## สเปกที่ควรส่งประเมิน

- รุ่น CPU และการ์ดจอ (ถ้ามีแยก)
- RAM ความจุ / SSD
- สภาพจอ (เส้น จุดด่าง ฝ้า)
- แบตยังถอดปลั๊กได้กี่ชั่วโมง

ดูหมวด [รับซื้อโน๊ตบุ๊ค](${guides?.notebook ?? DEFAULT_GUIDES.notebook})

## นัดรับและจ่ายเงิน

นัดรับตามจังหวัด ตรวจเครื่องแล้วจ่ายทันที — [Line @webuy](https://line.me/R/ti/p/@webuy)`,

		`${brandLine}${loc ? ` สำหรับผู้ขายใน${loc}` : ''} การส่งภาพหน้าจอ DxDiag หรือรูปสติกเกอร์สเปกด้านหลังเครื่องช่วยให้ราคาเบื้องต้นแม่นขึ้น

${heroImage ? `![${title}](${heroImage})\n\n` : ''}## รุ่นที่ยังมีความต้องการ

โน๊ตบุ๊คสายทำงาน Intel รุ่น 11th ขึ้นไป, Ryzen 5000 ขึ้นไป และเกมมิ่งที่มี RTX 3060 ขึ้นไป มักปิดดีลได้เร็วถ้าสภาพดี

## ลิงก์ที่เกี่ยวข้อง

- [รับซื้อโน๊ตบุ๊ค](${guides?.notebook ?? DEFAULT_GUIDES.notebook})
- [รับซื้อคอม](${DEFAULT_GUIDES.pc})

**Line @webuy** · 064-257-9353`,
	];
	return pick(bodies, seed);
}

function buildCameraBody({ title, slug, classification, loc, heroImage }) {
	const seed = hashSlug(slug);
	const hint = extractProductHint(title);
	const province = classification.province ?? '';
	const meet = SLUG_PROVINCE_MAP[slug]?.meet ?? `เมือง${province}`;

	return `${hint ? `หากคุณถือ **${hint}** อยู่` : 'หากคุณมีกล้องมือสอง'}${loc ? `ใน${loc}` : ''} และต้องการขาย การส่งรูปตัวกล้อง เลนส์ที่แถม และหน้าจอแสดงจำนวนชัตเตอร์จะช่วยให้ราคาใกล้ความจริง

${heroImage ? `![${title}](${heroImage})\n\n` : ''}## สิ่งที่มีผลต่อราคากล้องมือสอง

- จำนวนชัตเตอร์ (shutter count)
- สภาพเซนเซอร์และยางที่ตัวกล้อง
- เลนส์ kit หรือเลนส์แยกที่มาด้วย
- กล่อง ใบรับประกัน (ถ้ามี)

## นัดรับ

${meet}

ดูหมวด [รับซื้อกล้อง](${DEFAULT_GUIDES.camera}) · [Line @webuy](https://line.me/R/ti/p/@webuy)`;
}

function buildIphoneBody({ title, slug, classification, loc, heroImage, guides }) {
	const seed = hashSlug(slug);
	const isAndroid = classification.product === 'android';
	const product = isAndroid ? 'Samsung และสมาร์ทโฟน Android' : 'iPhone';
	const link = isAndroid ? DEFAULT_GUIDES.android : (guides?.iphone ?? DEFAULT_GUIDES.iphone);

	return `การขาย**${product}**${loc ? `ใน${loc}` : ''} ควรเริ่มจาก Battery Health สภาพจอ และการปลดบัญชี — ข้อมูลตรงช่วยให้ราคาไม่ถูกหักหน้างาน

${heroImage ? `![${title}](${heroImage})\n\n` : ''}## ${isAndroid ? 'Samsung S24/S23 Ultra' : 'iPhone'} ที่ยังได้ราคาดี

${isAndroid ? 'รุ่น Ultra ที่แบตดี จอไม่เบิร์น และไม่ติดบัญชี มักปิดดีลเร็ว' : 'รุ่น 13 ขึ้นไปที่แบตยังดีและไม่มีงานซ่อมจอหนัก ยังมีความต้องการสูง'}

## ขั้นตอน

1. ส่งรุ่น ความจุ รูป Battery Health
2. รับช่วงราคาเบื้องต้น
3. นัดรับ${loc ? `ใน${loc}` : ''} และจ่ายทันที

[${isAndroid ? 'รับซื้อ Android' : 'รับซื้อไอโฟน'}](${link}) · [Line @webuy](https://line.me/R/ti/p/@webuy)`;
}

function buildStorageBody({ title, slug, heroImage }) {
	return `รับซื้อ **ฮาร์ดดิสก์และ SSD** มือสอง ทั้ง 2.5", 3.5" และ M.2 ประเมินตามความจุ สุขภาพดิสก์ (SMART) และยี่ห้อ

${heroImage ? `![${title}](${heroImage})\n\n` : ''}## ข้อมูลที่ควรส่ง

- ความจุและรุ่น (เช่น WD Blue 1TB, Samsung 870 EVO)
- ภาพ CrystalDiskInfo หรือ SMART ไม่มีแดง
- แจ้งว่าเคยใช้งานหนักหรือมีเสียงผิดปกติ

[Line @webuy](https://line.me/R/ti/p/@webuy) · [รับซื้อคอม](${DEFAULT_GUIDES.pc})`;
}

function buildDroneBody({ title, slug, heroImage }) {
	const hint = /dji/i.test(title) ? 'DJI' : 'โดรน';
	return `รับซื้อ**${hint}** มือสอง ประเมินตามรุ่น จำนวนชั่วโมงบิน แบตเตอรี่ที่เหลือ และว่ามีใบลงทะเบียน/อุปกรณ์ครบหรือไม่

${heroImage ? `![${title}](${heroImage})\n\n` : ''}ส่งรูปตัวเครื่อง แบต และรีโมทที่มาด้วย — [Line @webuy](https://line.me/R/ti/p/@webuy)`;
}

function buildChonPcBody({ title, slug, heroImage }) {
	return `รับ**เหมาคอมและประมูลคอม**ในชลบุรี สำหรับร้าน ออฟฟิศ หรือผู้ที่ต้องการขายล็อต แจ้งจำนวนเครื่องและสเปกรวมผ่าน Line

${heroImage ? `![${title}](${heroImage})\n\n` : ''}เหมาะกับคอมสำนักงานเก่า คอมร้านอินเทอร์เน็ต หรือเครื่องที่ต้องการปิดสต็อก — [รับซื้อคอม](${DEFAULT_GUIDES.pc}) · [Line @webuy](https://line.me/R/ti/p/@webuy)`;
}

export function buildRewrittenBody({ title, slug, classification, heroImage }) {
	const { district, province } = resolveLocation({ title, slug, classification });
	const loc = locationLabel(province, district);
	const guides = guidesFor(province);

	if (classification.type === 'pc' && district && province === 'กรุงเทพมหานคร') {
		return buildPcBody({ title, slug, district, loc, heroImage, guides });
	}

	if (classification.type === 'apple_bundle' && district) {
		return buildAppleBundleBody({ title, slug, district, province, loc, heroImage, guides });
	}

	if (classification.type === 'notebook') {
		return buildNotebookBody({ title, slug, classification, loc, heroImage, guides });
	}

	if (classification.type === 'camera' || classification.type === 'editorial') {
		return buildCameraBody({ title, slug, classification, loc, heroImage });
	}

	if (classification.type === 'iphone') {
		return buildIphoneBody({ title, slug, classification, loc, heroImage, guides });
	}

	if (classification.type === 'storage') {
		return buildStorageBody({ title, slug, heroImage });
	}

	if (classification.type === 'drone') {
		return buildDroneBody({ title, slug, heroImage });
	}

	if (/ประมูลคอม|เหมาคอม/.test(title)) {
		return buildChonPcBody({ title, slug, heroImage });
	}

	// Fallback: still unique-ish per slug
	const seed = hashSlug(slug ?? title);
	const intro = pick(
		[
			`WE BUY รับซื้อสินค้าไอทีมือสอง${loc ? `ใน${loc}` : ''} ประเมินตามสภาพจริง`,
			`ต้องการขายอุปกรณ์ไอที${loc ? `ใน${loc}` : ''} ส่งรุ่นและรูปรับราคาเบื้องต้นก่อนนัดรับ`,
		],
		seed,
	);
	return `${intro}

${heroImage ? `![${title}](${heroImage})\n\n` : ''}- [รับซื้อโน๊ตบุ๊ค](${DEFAULT_GUIDES.notebook})
- [รับซื้อคอม](${DEFAULT_GUIDES.pc})
- [รับซื้อไอโฟน](${DEFAULT_GUIDES.iphone})

[Line @webuy](https://line.me/R/ti/p/@webuy) · 064-257-9353`;
}

export function buildRewrittenFrontmatterFields({ title, slug, classification }) {
	if (classification.type === 'off_topic' || classification.type === 'repair') {
		return { skip: true, reason: classification.type === 'repair' ? 'repair_service' : 'off_topic' };
	}

	const { district, province } = resolveLocation({ title, slug, classification });
	const loc = locationLabel(province, district);
	const description = buildDescription({ title, classification, loc, slug, district: district ?? '' });
	const faqItems = buildFaq({ classification, loc, district, slug, title });

	const bangkokPcSlug = slug && BANGKOK_PC_SLUG_TO_DISTRICT[slug.replace(/^รับซื้อคอม-/, '')];
	const canonical =
		classification.type === 'pc' && province === 'กรุงเทพมหานคร' && bangkokPcSlug
			? '/รับซื้อคอม/'
			: undefined;

	return {
		skip: false,
		description,
		faqItems,
		canonical,
		qualityScore: 0,
		qualityFlags: ['local-seo-rewritten', 'local-seo-unique-v2'],
		noindex: false,
		updatedDate: new Date().toISOString().slice(0, 10),
	};
}
