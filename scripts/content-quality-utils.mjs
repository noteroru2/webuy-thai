const PROVINCE_NAMES = [
	'กรุงเทพมหานคร',
	'กรุงเทพฯ',
	'กระบี่',
	'กาญจนบุรี',
	'กาฬสินธุ์',
	'กำแพงเพชร',
	'ขอนแก่น',
	'จันทบุรี',
	'ฉะเชิงเทรา',
	'ชลบุรี',
	'ชัยนาท',
	'ชัยภูมิ',
	'ชุมพร',
	'เชียงราย',
	'เชียงใหม่',
	'ตรัง',
	'ตราด',
	'ตาก',
	'นครนายก',
	'นครปฐม',
	'นครพนม',
	'นครราชสีมา',
	'นครศรีธรรมราช',
	'นครสวรรค์',
	'นนทบุรี',
	'นราธิวาส',
	'น่าน',
	'บึงกาฬ',
	'บุรีรัมย์',
	'ปทุมธานี',
	'ประจวบคีรีขันธ์',
	'ปราจีนบุรี',
	'ปัตตานี',
	'พระนครศรีอยุธยา',
	'พะเยา',
	'พังงา',
	'พัทลุง',
	'พิจิตร',
	'พิษณุโลก',
	'เพชรบุรี',
	'เพชรบูรณ์',
	'แพร่',
	'ภูเก็ต',
	'มหาสารคาม',
	'มุกดาหาร',
	'แม่ฮ่องสอน',
	'ยโสธร',
	'ยะลา',
	'ร้อยเอ็ด',
	'ระนอง',
	'ระยอง',
	'ราชบุรี',
	'ลพบุรี',
	'ลำปาง',
	'ลำพูน',
	'เลย',
	'ศรีสะเกษ',
	'สกลนคร',
	'สงขลา',
	'สตูล',
	'สมุทรปราการ',
	'สมุทรสงคราม',
	'สมุทรสาคร',
	'สระแก้ว',
	'สระบุรี',
	'สิงห์บุรี',
	'สุโขทัย',
	'สุพรรณบุรี',
	'สุราษฎร์ธานี',
	'สุรินทร์',
	'หนองคาย',
	'หนองบัวลำภู',
	'อ่างทอง',
	'อำนาจเจริญ',
	'อุดรธานี',
	'อุตรดิตถ์',
	'อุทัยธานี',
	'อุบลราชธานี',
];

export const OFF_TOPIC_TITLE_PATTERNS = [
	/จำนำ/i,
	/จ[ำํา]น[ำํา]/i,
	/รับจำนำ/i,
	/รับจ[ำํา]น[ำํา]/i,
	/ร้านจำนำ/i,
	/ร้านรับจ[ำํา]น[ำํา]/i,
	/โรงรับจำนำ/i,
	/รับซื้อเหล้า/i,
	/รับซื้อไวน์/i,
	/รับซื้อวิสกี้/i,
	/รับซื้อวอดก้า/i,
	/รับซื้อบรั่นดี/i,
	/รับซื้อคอนญัก/i,
	/รับซื้อเบียร์/i,
	/รับซื้อเหรียญญี่ปุ่น/i,
	/รับซื้อเงินญี่ปุ่น/i,
	/รับซื้อเหรียญเยน/i,
	/รับซื้อตั๋วจำนำ/i,
	/รับซื้อกระดาษ/i,
	/รับซื้อรถมือสอง/i,
	/รับซื้อโมเดล/i,
	/รับขายฝาก/i,
	/ขายฝากที่ดิน/i,
	/รับจำนอง/i,
	/รับซื้ออาคารพาณิชย์/i,
	/รับซื้อเครื่องใช้ไฟฟ้า/i,
	/รับซื้อแอร์/i,
	/รับซื้อตู้เย็น/i,
	/รับซื้อตู้แช่/i,
	/รับซื้อเครื่องซักผ้า/i,
	/รับซื้อนาฬิกา/i,
	/ร้านรับจํานำ/i,
	/ร้านรับจํานํา/i,
	/จํา-นํา/i,
	/รับซื้อเฟอร์นิเจอร์/i,
	/รับประมูลเฟอร์นิเจอร์/i,
	/รับซื้อเฟอร์สำนักงาน/i,
];

export const OFF_TOPIC_SLUG_PATTERNS = [
	/จำนำ/i,
	/จ[ำํา]น[ำํา]/i,
	/รับจำนำ/i,
	/รับจ[ำํา]น[ำํา]/i,
	/ร้านจำนำ/i,
	/ร้านรับจ[ำํา]น[ำํา]/i,
	/รับซื้อเหล้า/i,
	/รับซื้อตั๋วจำนำ/i,
	/รับซื้อเหรียญญี่ปุ่น/i,
	/รับซื้อเงินญี่ปุ่น/i,
	/รับซื้อกระดาษ/i,
	/รับซื้อรถมือสอง/i,
	/รับซื้อโมเดล/i,
	/รับขายฝาก/i,
	/ขายฝากที่ดิน/i,
	/รับจำนอง/i,
	/รับซื้ออาคารพาณิชย์/i,
	/รับซื้อเครื่องใช้ไฟฟ้า/i,
	/รับซื้อแอร์/i,
	/รับซื้อตู้เย็น/i,
	/รับซื้อตู้แช่/i,
	/รับซื้อเครื่องซักผ้า/i,
	/รับซื้อนาฬิกา/i,
	/ร้านรับจํานำ/i,
	/ร้านรับจํานํา/i,
	/จํา-นํา/i,
	/รับซื้อเฟอร์นิเจอร์/i,
];

const DUPLICATE_FILLER_PATTERNS = [
	/จังหวัด/gi,
	/ใกล้ฉัน/gi,
	/มือสอง/gi,
	/ราคาดี/gi,
	/ราคาสูง/gi,
	/รับซื้อ/gi,
	/ร้านรับซื้อ/gi,
	/ใกล้บ้าน/gi,
	/ราคา/gi,
];

const CTA_PATTERNS = [
	/@webuy/gi,
	/add\s+line/gi,
	/โทร\s*0\d[\d-]{7,}/gi,
	/064-2579353/g,
	/สอบถาม/gi,
];

const REGION_DUMP_PATTERNS = [/ภาคเหนือ/g, /ภาคอีสาน/g, /ภาคกลาง/g, /ภาคใต้/g, /ภาคตะวันออก/g, /ภาคตะวันตก/g];
const DEVICE_KEYWORDS = /(macbook|แมคบุ๊ค|แม็คบุ๊ค|โน้ตบุ๊ค|โน๊ตบุ๊ค|notebook|laptop|คอม|คอมพิวเตอร์|iphone|ไอโฟน|ipad|ไอแพด|กล้อง|ลำโพง|ทีวี|smart tv|playstation|ps4|ps5|apple watch)/i;

function escapeRegex(input) {
	return String(input).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function countMatches(text, patterns) {
	return patterns.reduce((count, pattern) => count + (text.match(pattern)?.length ?? 0), 0);
}

export function shouldNoindexAsOffTopic(title, slug) {
	const titleText = String(title ?? '');
	const slugText = String(slug ?? '');
	return (
		OFF_TOPIC_TITLE_PATTERNS.some((pattern) => pattern.test(titleText)) ||
		OFF_TOPIC_SLUG_PATTERNS.some((pattern) => pattern.test(slugText))
	);
}

export function stripMarkdownToPlainText(body) {
	return String(body ?? '')
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/`[^`]*`/g, ' ')
		.replace(/!\[[^\]]*]\(([^)]+)\)/g, ' ')
		.replace(/\[[^\]]*]\(([^)]+)\)/g, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/^#{1,6}\s+/gm, '')
		.replace(/[*_~>-]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

export function normalizeTitlePattern(title) {
	let normalized = String(title ?? '').toLowerCase();

	for (const province of PROVINCE_NAMES) {
		normalized = normalized.replace(new RegExp(escapeRegex(province.toLowerCase()), 'g'), ' ');
	}

	for (const pattern of DUPLICATE_FILLER_PATTERNS) {
		normalized = normalized.replace(pattern, ' ');
	}

	return normalized
		.replace(/[^\p{L}\p{N}\s-]/gu, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

export function buildDuplicatePatternMap(posts) {
	const counts = new Map();

	for (const post of posts) {
		const key = normalizeTitlePattern(post.title);
		if (!key || !DEVICE_KEYWORDS.test(post.title)) continue;
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}

	return counts;
}

export function getDuplicatePatternCount(title, duplicatePatternMap) {
	const key = normalizeTitlePattern(title);
	if (!key) return 0;
	return duplicatePatternMap.get(key) ?? 0;
}

export function analyzeContentQuality({ title, slug, body, duplicatePatternCount = 0 }) {
	const titleText = String(title ?? '');
	const slugText = String(slug ?? '');
	const bodyText = String(body ?? '');
	const plainText = stripMarkdownToPlainText(bodyText);
	const headingCount = bodyText.match(/^#{2,6}\s+/gm)?.length ?? 0;
	const ctaMentions = countMatches(bodyText, CTA_PATTERNS);
	const regionDumpMentions = countMatches(bodyText, REGION_DUMP_PATTERNS);
	const keywordListLines = bodyText
		.split('\n')
		.filter((line) => (line.match(/,/g)?.length ?? 0) >= 5 && /รับซื้อ|จำนำ|macbook|โน้ตบุ๊ค|ไอโฟน|คอม/i.test(line)).length;
	const serviceKeywordMentions = bodyText.match(/รับซื้อ|ขาย|ประเมินราคา|macbook|โน้ตบุ๊ค|โน๊ตบุ๊ค|iphone|ไอโฟน|คอม|คอมพิวเตอร์/gi)?.length ?? 0;
	const flags = [];
	let score = 0;

	if (shouldNoindexAsOffTopic(titleText, slugText)) {
		flags.push('off_topic');
		score += 6;
	}

	if (plainText.length < 900) {
		flags.push('thin_content');
		score += 2;
	}

	if (headingCount < 2) {
		flags.push('weak_structure');
		score += 1;
	}

	if (ctaMentions >= 3) {
		flags.push('cta_spam');
		score += 1;
	}

	if (keywordListLines >= 1) {
		flags.push('keyword_list');
		score += 2;
	}

	if (duplicatePatternCount >= 4) {
		flags.push('templated_local_page');
		score += 2;
	}

	if (regionDumpMentions >= 2) {
		flags.push('region_dump');
		score += 2;
	}

	if (serviceKeywordMentions >= 45) {
		flags.push('keyword_stuffing');
		score += 2;
	}

	if (/-\d+$/.test(slugText) && !/-(19|20)\d{2}$/.test(slugText)) {
		flags.push('slug_duplicate_suffix');
		score += 2;
	}

	const slugTail = slugText.split('-').filter(Boolean).at(-1) ?? '';
	if (
		slugText.length > 18 &&
		slugTail.length > 0 &&
		slugTail.length <= 2 &&
		!/^(19|20)\d{2}$/.test(slugTail)
	) {
		flags.push('slug_truncated_tail');
		score += 2;
	}

	if (/ใกล้ฉัน/i.test(titleText) || /ใกล้ฉัน/i.test(slugText)) {
		flags.push('near_me_template');
		score += 1;
	}

	return {
		plainTextLength: plainText.length,
		headingCount,
		ctaMentions,
		keywordListLines,
		duplicatePatternCount,
		serviceKeywordMentions,
		flags,
		score,
		isOffTopic: flags.includes('off_topic'),
	};
}

export function shouldAutoNoindexForQuality(analysis, currentNoindex) {
	if (currentNoindex === true) return false;
	if (analysis.isOffTopic) return true;
	if (analysis.score >= 4) return true;

	return (
		analysis.flags.includes('slug_duplicate_suffix') ||
		(analysis.flags.includes('templated_local_page') && analysis.flags.includes('keyword_list'))
	);
}

export function shouldQuarantinePost(analysis, currentNoindex) {
	if (currentNoindex !== true) return false;
	if (analysis.isOffTopic) return true;
	if (analysis.score >= 6) return true;

	return (
		(analysis.flags.includes('templated_local_page') && analysis.flags.includes('keyword_list')) ||
		(analysis.flags.includes('thin_content') &&
			(analysis.flags.includes('slug_duplicate_suffix') || analysis.flags.includes('slug_truncated_tail'))) ||
		(analysis.flags.includes('cta_spam') && analysis.flags.includes('region_dump'))
	);
}
