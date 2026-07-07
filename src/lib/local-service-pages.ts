import { getSocialLinks } from './site';
import { LINE_OA_URL } from './site-line';

export type ProvinceKey =
	| 'ubon'
	| 'khonkaen'
	| 'udonthani'
	| 'korat'
	| 'bangkok'
	| 'chiangmai'
	| 'phuket'
	| 'hatyai'
	| 'chonburi';

export type ServiceKey = 'notebook' | 'iphone' | 'ipad' | 'macbook' | 'server' | 'cctv';

type ProvinceConfig = {
	key: ProvinceKey;
	label: string;
	shortLabel: string;
	focusAreas: string[];
	localAngle: string;
	meetupNote: string;
	sellerPatterns: string[];
	crossLinks: Partial<Record<ServiceKey, { href: string; label: string }>>;
};

type ServiceConfig = {
	key: ServiceKey;
	label: string;
	shortLabel: string;
	hubPath: string;
	serviceType: string;
	valueAngle: string;
	decisionFactors: string[];
	prepareItems: string[];
};

export type ImportantLocalServiceContext = {
	provinceKey: ProvinceKey;
	serviceKey: ServiceKey;
	province: ProvinceConfig;
	service: ServiceConfig;
	servicePageTitle: string;
	areaServedNames: string[];
	crossLinks: Array<{ href: string; label: string }>;
};

const PROVINCES: Record<ProvinceKey, ProvinceConfig> = {
	ubon: {
		key: 'ubon',
		label: 'อุบลราชธานี',
		shortLabel: 'อุบล',
		focusAreas: ['เมืองอุบลราชธานี', 'วารินชำราบ', 'แจระแม', 'ขามใหญ่'],
		localAngle:
			'คนค้นหาในอุบลมักอยากรู้เรื่องนัดรับในเมืองและฝั่งวารินให้ชัดก่อน เพราะต้องกะเวลาเดินทางและอยากรู้แนวราคาก่อนออกจากบ้าน',
		meetupNote:
			'หน้านี้จึงเน้นคำตอบแบบใช้งานจริงสำหรับโซนตัวเมืองอุบล จุดนัดที่เดินทางสะดวก และการคัดข้อมูลก่อนคุยนัดรับ',
		sellerPatterns: [
			'มีทั้งเครื่องใช้งานส่วนตัวของพนักงานออฟฟิศและเครื่องนักศึกษาที่ต้องการอัปเกรดรุ่น',
			'เคสที่เจอบ่อยคืออยากรู้ราคาก่อนเข้าตัวเมือง หรืออยากเทียบหลายหมวด Apple กับโน๊ตบุ๊คในรอบเดียว',
			'ผู้ขายมักต้องการประเมินให้ใกล้ราคาจบก่อนนัด เพื่อไม่เสียเวลาเดินทางหลายรอบ',
		],
		crossLinks: {
			notebook: { href: '/รับซื้อโน๊ตบุ๊ค-อุบลราชธานี/', label: 'รับซื้อโน๊ตบุ๊คอุบล' },
			iphone: { href: '/รับซื้อไอโฟน-อุบลราชธานี/', label: 'รับซื้อไอโฟนอุบล' },
			ipad: { href: '/รับซื้อไอแพด-อุบลราชธานี/', label: 'รับซื้อไอแพดอุบล' },
			macbook: { href: '/รับซื้อแมคบุ๊ค-อุบลราชธานี/', label: 'รับซื้อแมคบุ๊คอุบลราชธานี' },
		},
	},
	khonkaen: {
		key: 'khonkaen',
		label: 'ขอนแก่น',
		shortLabel: 'ขอนแก่น',
		focusAreas: ['เมืองขอนแก่น', 'ศิลา', 'บ้านเป็ด', 'โซนรอบมหาวิทยาลัยขอนแก่น'],
		localAngle:
			'ฝั่งขอนแก่นมักมีคนขายที่อยากคุยราคาให้ชัดตั้งแต่แชตแรก โดยเฉพาะกลุ่มนักศึกษา คนทำงาน และเจ้าของเครื่องที่อยากอัปเกรดเร็ว',
		meetupNote:
			'เนื้อหาในหน้าหลักขอนแก่นจึงควรตอบเรื่องรุ่น สภาพ และขั้นตอนเริ่มคุยราคาให้ไว ไม่อ้อมไปไกลจาก intent หลัก',
		sellerPatterns: [
			'มักมีเครื่องจากโซนมหาวิทยาลัยหรือคนทำงานในตัวเมืองที่ต้องการประเมินก่อนนัดจริง',
			'คำถามที่เจอบ่อยคือถ้าเครื่องมีตำหนิหรือแบตเสื่อมจะยังขายได้ประมาณไหน',
			'หลายเคสอยากรู้ว่าจะต้องส่งรูปมุมไหนบ้างเพื่อไม่ให้ต้องส่งเพิ่มหลายรอบ',
		],
		crossLinks: {
			notebook: { href: '/รับซื้อโน๊ตบุ๊ค-ขอนแก่น/', label: 'รับซื้อโน๊ตบุ๊คขอนแก่น' },
			iphone: { href: '/รับซื้อไอโฟน-ขอนแก่น/', label: 'รับซื้อไอโฟนขอนแก่น' },
			ipad: { href: '/รับซื้อไอแพด-ขอนแก่น/', label: 'รับซื้อไอแพดขอนแก่น' },
			macbook: { href: '/รับซื้อแมคบุ๊ค-ขอนแก่น/', label: 'รับซื้อแมคบุ๊คขอนแก่น' },
		},
	},
	udonthani: {
		key: 'udonthani',
		label: 'อุดรธานี',
		shortLabel: 'อุดร',
		focusAreas: ['เมืองอุดรธานี', 'หมากแข้ง', 'บ้านเลื่อม', 'โซนรอบศูนย์การค้าในตัวเมือง'],
		localAngle:
			'คนขายในอุดรมักเริ่มจากส่งสเปกหรือรูปจริงมาก่อน แล้วค่อยตัดสินใจเรื่องนัดรับหรือวิธีส่งต่อให้เหมาะกับระยะทาง',
		meetupNote:
			'หน้าจังหวัดอุดรจึงควรช่วยคัดข้อมูลให้ครบตั้งแต่ต้น โดยเฉพาะเครื่องที่มีสเปกหลายตัวเลือกหรือมีอุปกรณ์เสริมหลายชิ้น',
		sellerPatterns: [
			'มักมีผู้ขายที่อยากคุยรายละเอียดผ่านแชตก่อนเพื่อลดการเดินทางเสียรอบ',
			'หลายเคสเป็นเครื่องใช้งานจริงที่ยังเปิดติดดี แต่ต้องการรู้ผลของแบต รอบชาร์จ หรือประวัติซ่อมต่อราคา',
			'คนขายบางกลุ่มมีหลายอุปกรณ์พร้อมกันและต้องการประเมินแบบเป็นชุด',
		],
		crossLinks: {
			notebook: { href: '/รับซื้อโน๊ตบุ๊ค-อุดรธานี/', label: 'รับซื้อโน๊ตบุ๊คอุดรธานี' },
			iphone: { href: '/รับซื้อไอโฟน-อุดรธานี/', label: 'รับซื้อไอโฟนอุดรธานี' },
			ipad: { href: '/รับซื้อไอแพด-อุดรธานี/', label: 'รับซื้อไอแพดอุดรธานี' },
			macbook: { href: '/รับซื้อแมคบุ๊ค-อุดรธานี/', label: 'รับซื้อแมคบุ๊คอุดรธานี' },
		},
	},
	korat: {
		key: 'korat',
		label: 'นครราชสีมา',
		shortLabel: 'โคราช',
		focusAreas: ['เมืองนครราชสีมา', 'หัวทะเล', 'จอหอ', 'ปากช่อง'],
		localAngle:
			'ฝั่งโคราชมีคนค้นหาที่ต้องการประเมินให้รู้เรื่องเร็ว เพราะตัวจังหวัดใหญ่และหลายคนอยากคัดราคาเบื้องต้นก่อนค่อยนัดจริง',
		meetupNote:
			'หน้าหลักของโคราชจึงควรตอบแบบตรงประเด็นเรื่องรุ่น สภาพ และเงื่อนไขที่ทำให้ราคาเปลี่ยน โดยไม่เขียนกว้างจนดูซ้ำจังหวัดอื่น',
		sellerPatterns: [
			'ผู้ขายมักต้องการเปรียบเทียบว่าถ้าซ่อมก่อนขายกับขายตามสภาพ แบบไหนคุ้มกว่า',
			'หลายเคสมีอุปกรณ์ครบกล่องและอยากรู้ว่าช่วยดันราคาได้จริงแค่ไหน',
			'คำถามที่พบบ่อยคือควรส่งรูปจุดไหนเพื่อให้ประเมินได้แม่นและไม่ต้องนัดหลายรอบ',
		],
		crossLinks: {
			notebook: { href: '/รับซื้อโน๊ตบุ๊ค-โคราช/', label: 'รับซื้อโน๊ตบุ๊คโคราช' },
			iphone: { href: '/รับซื้อไอโฟน-โคราช/', label: 'รับซื้อไอโฟนโคราช' },
			ipad: { href: '/รับซื้อไอแพด-โคราช/', label: 'รับซื้อไอแพดโคราช' },
			macbook: { href: '/รับซื้อแมคบุ๊ค-โคราช/', label: 'รับซื้อแมคบุ๊คโคราช' },
		},
	},
	bangkok: {
		key: 'bangkok',
		label: 'กรุงเทพมหานคร',
		shortLabel: 'กรุงเทพ',
		focusAreas: ['ลาดพร้าว', 'สาทร', 'จตุจักร', 'ห้วยขวาง', 'สุขุมวิท', 'อ่อนนุช', 'พระโขนง'],
		localAngle:
			'กรุงเทพมีคนขายหลากหลายโซน ทั้ง office worker ในสีลม สาทร นักศึกษารอบจตุจักร และคนทำงานแถว BTS/MRT ที่อยากขายเร็วตอนเย็น',
		meetupNote:
			'นัดรับได้ทุกโซน BTS-MRT ไม่ต้องเดินทางมาที่ร้าน ส่งรูปมาประเมินทาง Line ก่อนแล้วค่อยนัดจุดสะดวกในกรุงเทพ',
		sellerPatterns: [
			'พนักงานออฟฟิศย่านสีลม-สาทร อยากขายช่วงเย็นหลังเลิกงาน ต้องการนัดแถว BTS',
			'นักศึกษาและคนอาศัยแถวลาดพร้าว-จตุจักร ขายเครื่องเพื่ออัปเกรด',
			'คนอาศัยแถวสุขุมวิท-อ่อนนุช ต้องการขายไว ราคาดี ไม่อยากรอนาน',
		],
		crossLinks: {
			iphone: { href: '/รับซื้อไอโฟน/', label: 'รับซื้อไอโฟน' },
			macbook: { href: '/รับซื้อแมคบุ๊ค/', label: 'รับซื้อแมคบุ๊ค' },
			notebook: { href: '/รับซื้อโน๊ตบุ๊ค/', label: 'รับซื้อโน๊ตบุ๊ค' },
			server: { href: '/รับซื้อ-server/', label: 'รับซื้อ Server' },
		},
	},
	chiangmai: {
		key: 'chiangmai',
		label: 'เชียงใหม่',
		shortLabel: 'เชียงใหม่',
		focusAreas: ['เมืองเชียงใหม่', 'นิมมานเหมินท์', 'ช้างคลาน', 'แม่ริม', 'สันกำแพง'],
		localAngle:
			'เชียงใหม่มีทั้งกลุ่มนักศึกษา ม.เชียงใหม่ ม.แม่โจ้ คนทำงานย่านนิมมาน และองค์กร/ร้านค้าในตัวเมืองที่ต้องการขายอุปกรณ์ไอทีเก่า',
		meetupNote:
			'นัดได้ทุกย่านในเมืองเชียงใหม่ ส่งรูปมา Line ก่อนนัด ประเมินไวภายใน 15 นาที ไม่ต้องนำเครื่องมาก่อน',
		sellerPatterns: [
			'นักศึกษา ม.เชียงใหม่ และ ม.แม่โจ้ ขายเครื่องเก่าเพื่ออัปเกรดรุ่นใหม่',
			'คนทำงานย่านนิมมานเหมินท์และ One Nimman ต้องการขายไว ราคาดี',
			'ร้านค้า องค์กร โรงแรมในเชียงใหม่ที่มีอุปกรณ์ไอทียกชุดต้องการขาย',
		],
		crossLinks: {
			iphone: { href: '/รับซื้อ-iphone-เชียงใหม่/', label: 'รับซื้อ iPhone เชียงใหม่' },
			macbook: { href: '/รับซื้อ-macbook-เชียงใหม่/', label: 'รับซื้อ MacBook เชียงใหม่' },
			notebook: { href: '/รับซื้อโน๊ตบุ๊ค-เชียงใหม่/', label: 'รับซื้อโน๊ตบุ๊คเชียงใหม่' },
			server: { href: '/รับซื้อ-server-เชียงใหม่/', label: 'รับซื้อ Server เชียงใหม่' },
		},
	},
	phuket: {
		key: 'phuket',
		label: 'ภูเก็ต',
		shortLabel: 'ภูเก็ต',
		focusAreas: ['เมืองภูเก็ต', 'ป่าตอง', 'กะรน', 'กะทู้', 'ถลาง'],
		localAngle:
			'ภูเก็ตมีทั้งคนไทยและผู้อาศัยต่างชาติที่ต้องการขายอุปกรณ์ไอทีก่อนย้ายออก รวมถึงธุรกิจโรงแรมและร้านค้าที่ต้องการขายอุปกรณ์ยกชุด',
		meetupNote:
			'รับซื้อทุกโซนในภูเก็ต ส่งรูปมา Line ก่อนนัด ประเมินราคาทางออนไลน์ได้ก่อนตัดสินใจ',
		sellerPatterns: [
			'คนทำงานในโรงแรมและธุรกิจท่องเที่ยวภูเก็ตที่มีอุปกรณ์ไอทียกชุด',
			'ชาวต่างชาติที่พำนักในภูเก็ตต้องการขายก่อนย้ายออก',
			'คนพื้นที่และนักศึกษาในเมืองภูเก็ตที่ต้องการขายเครื่องเก่าเพื่ออัปเกรด',
		],
		crossLinks: {
			iphone: { href: '/รับซื้อ-iphone-ภูเก็ต/', label: 'รับซื้อ iPhone ภูเก็ต' },
			macbook: { href: '/รับซื้อ-macbook-ภูเก็ต/', label: 'รับซื้อ MacBook ภูเก็ต' },
			notebook: { href: '/รับซื้อโน๊ตบุ๊ค-ภูเก็ต/', label: 'รับซื้อโน๊ตบุ๊คภูเก็ต' },
		},
	},
	hatyai: {
		key: 'hatyai',
		label: 'สงขลา',
		shortLabel: 'หาดใหญ่',
		focusAreas: ['หาดใหญ่', 'เมืองสงขลา', 'คลองแห', 'บ้านพรุ', 'คอหงส์'],
		localAngle:
			'หาดใหญ่เป็นศูนย์กลางการค้าภาคใต้ มีทั้งนักศึกษา ม.อ. คนทำงานและพ่อค้าแม่ค้าที่อยากขายอุปกรณ์ไอทีแลกเงินสดไว',
		meetupNote:
			'รับซื้อทุกโซนในหาดใหญ่และสงขลา ส่งรูปมา Line ก่อน ได้ราคาเร็ว นัดรับได้ทั้งตลาดเกษตรและ Central Festival',
		sellerPatterns: [
			'นักศึกษา ม.อ. หาดใหญ่ ต้องการขายเครื่องเก่าเพื่ออัปเกรดหรือใช้เงินเร่งด่วน',
			'พ่อค้าแม่ค้าและร้านค้าในตลาดหาดใหญ่ที่มีอุปกรณ์ไอทียกชุด',
			'คนทำงานในเขตอุตสาหกรรมและออฟฟิศหาดใหญ่ที่ต้องการขายเร็วได้เงินทันที',
		],
		crossLinks: {
			iphone: { href: '/รับซื้อ-iphone-หาดใหญ่/', label: 'รับซื้อ iPhone หาดใหญ่' },
			macbook: { href: '/รับซื้อ-macbook-หาดใหญ่/', label: 'รับซื้อ MacBook หาดใหญ่' },
			notebook: { href: '/รับซื้อโน๊ตบุ๊ค-หาดใหญ่/', label: 'รับซื้อโน๊ตบุ๊คหาดใหญ่' },
		},
	},
	chonburi: {
		key: 'chonburi',
		label: 'ชลบุรี',
		shortLabel: 'ชลบุรี',
		focusAreas: ['เมืองชลบุรี', 'ศรีราชา', 'พัทยา', 'แหลมฉบัง', 'บ้านบึง'],
		localAngle:
			'ชลบุรีมีทั้งแรงงานและผู้บริหารในนิคมอุตสาหกรรม คนทำงานในพัทยา-ศรีราชา และครอบครัวที่ต้องการขายอุปกรณ์เก่าแลกเงิน',
		meetupNote:
			'รับซื้อทุกโซนในชลบุรี ทั้งพัทยา ศรีราชา และตัวเมืองชลบุรี ส่งรูปมา Line ประเมินก่อนนัด',
		sellerPatterns: [
			'พนักงานนิคมอุตสาหกรรมแหลมฉบัง-ศรีราชา ต้องการขายอุปกรณ์ไอทียกชุดหรือของใช้ส่วนตัว',
			'คนทำงานในพัทยาและโรงแรมที่ต้องการขายอุปกรณ์ก่อนย้ายงาน',
			'ครอบครัวและนักศึกษาในเมืองชลบุรีที่อยากขายเครื่องเก่าแลกเงินสด',
		],
		crossLinks: {
			iphone: { href: '/รับซื้อ-iphone-ชลบุรี/', label: 'รับซื้อ iPhone ชลบุรี' },
			macbook: { href: '/รับซื้อ-macbook-ชลบุรี/', label: 'รับซื้อ MacBook ชลบุรี' },
			notebook: { href: '/รับซื้อโน๊ตบุ๊ค/', label: 'รับซื้อโน๊ตบุ๊ค' },
		},
	},
};

const SERVICES: Record<ServiceKey, ServiceConfig> = {
	notebook: {
		key: 'notebook',
		label: 'รับซื้อโน๊ตบุ๊ค',
		shortLabel: 'โน๊ตบุ๊ค',
		hubPath: '/รับซื้อโน๊ตบุ๊ค/',
		serviceType: 'บริการรับซื้อโน๊ตบุ๊คมือสอง',
		valueAngle:
			'หมวดโน๊ตบุ๊คต้องดูทั้งรุ่น CPU RAM SSD การ์ดจอ สภาพจอ คีย์บอร์ด และสภาพบอดี้ เพราะแต่ละจุดส่งผลต่อราคาจริงค่อนข้างมาก',
		decisionFactors: ['รุ่นและสเปกหลัก', 'สภาพจอและบอดี้', 'แบต อะแดปเตอร์ และอุปกรณ์', 'ประวัติซ่อมหรืออาการแฝง'],
		prepareItems: ['ชื่อรุ่นเต็ม', 'CPU / RAM / SSD / การ์ดจอ', 'รูปหน้าจอและบอดี้รอบเครื่อง', 'แจ้งอาการผิดปกติและของที่มีให้ครบ'],
	},
	iphone: {
		key: 'iphone',
		label: 'รับซื้อไอโฟน',
		shortLabel: 'ไอโฟน',
		hubPath: '/รับซื้อไอโฟน/',
		serviceType: 'บริการรับซื้อ iPhone มือสอง',
		valueAngle:
			'หมวด iPhone เน้นรุ่น ความจุ สุขภาพแบต Face ID / True Tone และสถานะ iCloud เป็นหลัก เพราะเป็นจุดที่ทำให้ช่วงราคาขยับชัดที่สุด',
		decisionFactors: ['รุ่นและความจุ', 'สุขภาพแบตเตอรี่', 'Face ID / True Tone / กล้อง', 'สถานะ iCloud และ Find My'],
		prepareItems: ['รุ่นเต็มและความจุ', 'Battery Health', 'รูปหน้าจอ ขอบเครื่อง และฝาหลัง', 'แจ้งสถานะ Face ID และการปลด iCloud'],
	},
	ipad: {
		key: 'ipad',
		label: 'รับซื้อไอแพด',
		shortLabel: 'ไอแพด',
		hubPath: '/รับซื้อไอแพด/',
		serviceType: 'บริการรับซื้อ iPad มือสอง',
		valueAngle:
			'หมวด iPad ต้องดูรุ่น ความจุ Wi‑Fi หรือ Cellular สภาพจอ และอุปกรณ์เสริม เพราะรุ่นใกล้กันแต่รายละเอียดไม่เหมือนกันอาจทำให้ราคาแตกได้มาก',
		decisionFactors: ['รุ่นและความจุ', 'สถานะ Wi‑Fi หรือ Cellular', 'สภาพจอ แบต และบอดี้', 'อุปกรณ์เสริมอย่าง Apple Pencil หรือคีย์บอร์ด'],
		prepareItems: ['รุ่น iPad และความจุ', 'แจ้งว่าเป็น Wi‑Fi หรือ Cellular', 'รูปหน้าจอและด้านหลังเครื่อง', 'แจ้งว่ามี Apple Pencil / คีย์บอร์ด / กล่องหรือไม่'],
	},
	macbook: {
		key: 'macbook',
		label: 'รับซื้อแมคบุ๊ค',
		shortLabel: 'แมคบุ๊ค',
		hubPath: '/รับซื้อแมคบุ๊ค/',
		serviceType: 'บริการรับซื้อ MacBook มือสอง',
		valueAngle:
			'หมวด MacBook ต้องดูรุ่น ชิป RAM SSD รอบชาร์จ สุขภาพแบต และสถานะ iCloud เพราะเป็นสินค้าที่มูลค่าขึ้นลงตามสเปกและความพร้อมของเครื่องอย่างชัดเจน',
		decisionFactors: ['รุ่น ปี และชิป', 'RAM / SSD', 'รอบชาร์จและสุขภาพแบต', 'สถานะ iCloud และสภาพจอ / บอดี้'],
		prepareItems: ['ชื่อรุ่นและปีโดยประมาณ', 'ชิป RAM SSD', 'จำนวนรอบชาร์จหรือสภาพแบต', 'รูปหน้าจอ ตัวเครื่อง และอะแดปเตอร์'],
	},
	server: {
		key: 'server',
		label: 'รับซื้อ Server',
		shortLabel: 'Server',
		hubPath: '/รับซื้อ-server/',
		serviceType: 'บริการรับซื้อ Server มือสอง',
		valueAngle:
			'Server ราคาขึ้นอยู่กับ Brand/Model Generation จำนวน CPU/RAM/HDD และสภาพ Rails/Cage ประเมินแบบ B2B ได้ราคาดีกว่าขายทิ้ง',
		decisionFactors: ['Brand และ Model/Generation', 'จำนวน CPU Socket และ RAM slots', 'HDD/SSD ที่มีและ Capacity', 'สภาพ Power Supply และ Rails'],
		prepareItems: ['รุ่น Server และ SKU เต็ม', 'สเปก CPU, RAM, HDD/SSD ที่ติดตั้งอยู่', 'รูปด้านหน้า ด้านหลัง และ Label', 'แจ้งว่ามี Rails, Bezel, Cage หรือไม่'],
	},
	cctv: {
		key: 'cctv',
		label: 'รับซื้อกล้องวงจรปิด',
		shortLabel: 'CCTV',
		hubPath: '/รับซื้อกล้อง/',
		serviceType: 'บริการรับซื้อกล้องวงจรปิด/CCTV มือสอง',
		valueAngle:
			'CCTV ราคาขึ้นอยู่กับ Brand (Hikvision/Dahua/Axis) ประเภท IP หรือ Analog ความละเอียด และสภาพอุปกรณ์ — รับซื้อทั้งชุดและแยกชิ้น',
		decisionFactors: ['Brand และรุ่น', 'ประเภท IP Camera หรือ Analog', 'ความละเอียดและ Feature พิเศษ', 'จำนวน DVR/NVR และกล้อง'],
		prepareItems: ['Brand และรุ่นกล้องและ DVR/NVR', 'จำนวนกล้องและความละเอียด', 'รูปสภาพอุปกรณ์จริง', 'แจ้งว่ามีสายไฟ อุปกรณ์ติดตั้ง หรือ accessories'],
	},
};

function includesAny(source: string, keywords: string[]): boolean {
	return keywords.some((keyword) => source.includes(keyword));
}

function detectProvinceKey(source: string): ProvinceKey | null {
	if (includesAny(source, ['กรุงเทพมหานคร', 'กรุงเทพ', 'กทม', 'ลาดพร้าว', 'จตุจักร', 'ห้วยขวาง', 'พระโขนง', 'วังทองหลาง', 'สาทร', 'บางกอก']))
		return 'bangkok';
	if (includesAny(source, ['เชียงใหม่'])) return 'chiangmai';
	if (includesAny(source, ['ภูเก็ต'])) return 'phuket';
	if (includesAny(source, ['หาดใหญ่', 'สงขลา'])) return 'hatyai';
	if (includesAny(source, ['ชลบุรี', 'พัทยา', 'ศรีราชา'])) return 'chonburi';
	if (includesAny(source, ['อุบล'])) return 'ubon';
	if (includesAny(source, ['ขอนแก่น'])) return 'khonkaen';
	if (includesAny(source, ['อุดร'])) return 'udonthani';
	if (includesAny(source, ['โคราช', 'นครราชสีมา'])) return 'korat';
	return null;
}

function detectServiceKey(source: string): ServiceKey | null {
	if (includesAny(source, ['server', 'เซิร์ฟเวอร์'])) return 'server';
	if (includesAny(source, ['cctv', 'กล้องวงจรปิด', 'ip camera', 'ip-camera'])) return 'cctv';
	if (includesAny(source, ['โน๊ตบุ๊ค', 'notebook', 'laptop'])) return 'notebook';
	if (includesAny(source, ['ไอโฟน', 'iphone'])) return 'iphone';
	if (includesAny(source, ['ไอแพด', 'ipad'])) return 'ipad';
	if (includesAny(source, ['แมคบุ๊ค', 'macbook'])) return 'macbook';
	return null;
}

function buildCrossLinks(
	province: ProvinceConfig,
	service: ServiceConfig,
): Array<{ href: string; label: string }> {
	const hubLink = { href: service.hubPath, label: service.label };
	const others = (Object.entries(province.crossLinks) as Array<[ServiceKey, { href: string; label: string }]>)
		.filter(([key]) => key !== service.key)
		.map(([, link]) => link);
	return [hubLink, ...others];
}

export function getImportantLocalServiceContext(
	title: string,
	slug: string,
): ImportantLocalServiceContext | null {
	const source = `${title} ${slug}`.toLowerCase();
	const provinceKey = detectProvinceKey(source);
	const serviceKey = detectServiceKey(source);

	if (!provinceKey || !serviceKey) return null;

	const province = PROVINCES[provinceKey];
	const service = SERVICES[serviceKey];
	const provinceLabelForTitle =
		province.key === 'korat' ? province.shortLabel : province.label;

	return {
		provinceKey,
		serviceKey,
		province,
		service,
		servicePageTitle: `${service.label}${provinceLabelForTitle}`,
		areaServedNames: [province.label, ...province.focusAreas],
		crossLinks: buildCrossLinks(province, service),
	};
}

export function buildImportantLocalServiceJsonLd(
	context: ImportantLocalServiceContext,
	options: {
		articleUrl: string;
		canonicalUrl: string;
		description: string;
		orgId: string;
		orgName: string;
		businessPhone: string;
		featuredUrl?: string;
	},
): Array<Record<string, unknown>> {
	const serviceId = `${options.articleUrl}#service`;

	return [
		{
			'@context': 'https://schema.org',
			'@type': 'Service',
			'@id': serviceId,
			name: context.servicePageTitle,
			description: options.description,
			url: options.articleUrl,
			serviceType: context.service.serviceType,
			provider: { 
				'@type': 'Organization',
				'@id': `${new URL(options.articleUrl).origin}/#organization` 
			},
			areaServed: context.areaServedNames.map((name) => ({
				'@type': 'AdministrativeArea',
				name,
			})),
			availableChannel: {
				'@type': 'ServiceChannel',
				serviceUrl: options.articleUrl,
				availableLanguage: ['th-TH'],
				servicePhone: options.businessPhone,
			},
			mainEntityOfPage: {
				'@type': 'WebPage',
				'@id': options.canonicalUrl,
			},
		},
	];
}
