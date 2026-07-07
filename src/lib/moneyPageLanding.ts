export interface LandingCard {
	title: string;
	desc: string;
}

export const notebookLanding = {
	evalCards: [
		{ title: 'รุ่นและแบรนด์', desc: 'ชื่อรุ่น CPU RAM SSD และการ์ดจอ (ถ้ามี)' },
		{ title: 'สภาพตัวเครื่อง', desc: 'รูปหน้าจอ ฝาหลัง ขอบเครื่อง และจุดที่มีตำหนิ' },
		{ title: 'อุปกรณ์ที่มี', desc: 'Adapter สายชาร์จ กล่อง และใบเสร็ม (ถ้ามี)' },
	] as LandingCard[],
	checklist: [
		'สำรองข้อมูลสำคัญก่อนล้างเครื่อง',
		'ออกจากบัญชี Apple ID / Microsoft ตามระบบ',
		'แจ้งอาการผิดปกติ เช่น จอเส้น แบตเสื่อม เปิดไม่ติด',
		'ถ่ายรูปสเปกจากหน้าตั้งค่าให้ชัด',
	],
};

export const pcLanding = {
	evalCards: [
		{ title: 'สเปกหลัก', desc: 'CPU RAM GPU SSD/HDD และระบบปฏิบัติการ' },
		{ title: 'สภาพใช้งาน', desc: 'อุณหภูมิ อาการค้าง หรือเสียงผิดปกติ (ถ้ามี)' },
		{ title: 'อุปกรณ์ครบชุด', desc: 'จอ คีย์บอร์ด เมาส์ และกล่อง (ถ้ามี)' },
	],
	checklist: [
		'สำรองไฟล์งานก่อนรีเซ็ตหรือล้างข้อมูล',
		'แจ้งว่าเป็นคอมแบรนด์หรือคอมประกอบ',
		'บอกอาการที่มี เช่น ร้อนผิดปกติ เปิดไม่ติด',
		'ถ่ายรูปภายในเคส (ถ้าเป็นคอมประกอม)',
	],
};

export const macbookLanding = {
	evalCards: [
		{ title: 'รุ่นและชิป', desc: 'MacBook Air/Pro ชิป Intel หรือ M-series และความจุ' },
		{ title: 'สุขภาพแบต', desc: 'Cycle Count และสภาพแบตเตอรี่จาก System Information' },
		{ title: 'บัญชี Apple', desc: 'ต้องปลด Apple ID และปิด Find My Mac ก่อนส่งมอบ' },
	],
	checklist: [
		'Sign out Apple ID และปิด Find My Mac',
		'สำรองข้อมูลด้วย Time Machine หรือ iCloud',
		'ถ่ายรูป About This Mac และหน้า Power',
		'แจ้งรอยตำหนิและอุปกรณ์ที่มีครบ',
	],
};

export const iphoneLanding = {
	evalCards: [
		{ title: 'รุ่นและความจุ', desc: 'Model Name ความจุ และรหัสรุ่น (ถ้ารู้)' },
		{ title: 'สุขภาพแบต', desc: 'Maximum Capacity จากเมนูแบตเตอรี่' },
		{ title: 'สภาพเครื่อง', desc: 'รูปหน้าจอ ฝาหลัง True Tone และ Face ID/Touch ID' },
	],
	checklist: [
		'ปลด iCloud และปิด Find My iPhone ก่อนส่งมอบ',
		'แจ้งว่าเครื่องศูนย์ไทยหรือต่างประเทศ',
		'บอกว่ามีกล่อง/อุปกรณ์แท้ครบหรือไม่',
		'แจ้งตำหนิจอ แบต หรืออาการอื่นตามจริง',
	],
};

export const ipadLanding = {
	evalCards: [
		{ title: 'รุ่นและความจุ', desc: 'iPad Pro/Air/mini รุ่น Wi-Fi หรือ Cellular' },
		{ title: 'หน้าจอและตัวเครื่อง', desc: 'รูปหน้าจอเปิดใช้งาน ฝาหลัง และขอบเครื่อง' },
		{ title: 'บัญชีและอุปกรณ์', desc: 'Apple ID อุปกรณ์แท้ และ Apple Pencil (ถ้ามี)' },
	],
	checklist: [
		'สำรองข้อมูลและ Sign out Apple ID',
		'แจ้งว่าใส่ซิมได้หรือ Wi-Fi อย่างเดียว',
		'บอกสภาพแบตและอาการจอ (ถ้ามี)',
		'ถ่ายรูปหน้า About และตัวเครื่องหลายมุม',
	],
};

export const cameraLanding = {
	evalCards: [
		{ title: 'รุ่นและชัตเตอร์', desc: 'ยี่ห้อ รุ่น และจำนวนชัตเตอร์ (shutter count ถ้ามี)' },
		{ title: 'เลนส์และอุปกรณ์', desc: 'รายการเลนส์ แคป ฟิลเตอร์ และกล่อง' },
		{ title: 'สภาพการทำงาน', desc: 'รูปหน้าจอ รูปตัวเลนส์ และจุดที่มีรอย' },
	],
	checklist: [
		'ถ่ายรูปหน้าจอเมนูและ serial number',
		'ทดสอบชัตเตอร์ โฟกัส และปุ่มสำคัญ',
		'แจ้งเลนส์ที่มาพร้อมและสภาพกระจก',
		'บอกว่ามีกล่อง/ใบเสร็ม/ประกันเหลือหรือไม่',
	],
};
