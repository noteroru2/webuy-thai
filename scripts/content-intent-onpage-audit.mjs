import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distDir = join(root, 'dist');

const PAGES_METADATA = [
	{
		route: '/',
		file: 'index.html',
		focusKeyword: 'รับซื้อโน๊ตบุ๊คและคอมพิวเตอร์',
		semanticKeywords: ['รับซื้อคอม', 'รับซื้อ MacBook', 'รับซื้อ iPad', 'รับซื้อ iPhone', 'รับซื้อกล้อง', 'นัดรับ', 'ประเมินราคา'],
		intentType: 'Trust / entity page'
	},
	{
		route: '/รับซื้อ/',
		file: 'รับซื้อ/index.html',
		focusKeyword: 'รับซื้ออุปกรณ์ไอที',
		semanticKeywords: ['รับซื้อโน๊ตบุ๊ค', 'รับซื้อคอม', 'รับซื้อ MacBook', 'รับซื้อไอแพด', 'รับซื้อไอโฟน', 'รับซื้อกล้อง', 'ประเมินราคา'],
		intentType: 'Commercial investigation'
	},
	{
		route: '/รับซื้อโน๊ตบุ๊ค/',
		file: 'รับซื้อโน๊ตบุ๊ค/index.html',
		focusKeyword: 'รับซื้อโน๊ตบุ๊ค',
		semanticKeywords: ['โน๊ตบุ๊คมือสอง', 'ขายโน๊ตบุ๊ค', 'เช็กราคาโน๊ตบุ๊ค', 'รุ่น', 'สเปก', 'สภาพ', 'นัดรับ'],
		intentType: 'Transactional'
	},
	{
		route: '/รับซื้อคอม/',
		file: 'รับซื้อคอม/index.html',
		focusKeyword: 'รับซื้อคอม',
		semanticKeywords: ['คอมพิวเตอร์มือสอง', 'PC', 'คอมประกอบ', 'CPU', 'RAM', 'การ์ดจอ', 'ประเมินราคา'],
		intentType: 'Transactional'
	},
	{
		route: '/รับซื้อแมคบุ๊ค/',
		file: 'รับซื้อแมคบุ๊ค/index.html',
		focusKeyword: 'รับซื้อแมคบุ๊ค',
		semanticKeywords: ['MacBook มือสอง', 'MacBook Pro', 'MacBook Air', 'ความจุ', 'สุขภาพแบต', 'ตรวจเครื่อง'],
		intentType: 'Transactional'
	},
	{
		route: '/รับซื้อไอโฟน/',
		file: 'รับซื้อไอโฟน/index.html',
		focusKeyword: 'รับซื้อไอโฟน',
		semanticKeywords: ['ไอโฟนมือสอง', 'iPhone', 'ความจุ', 'สุขภาพแบต', 'iCloud', 'Face ID', 'เครื่องศูนย์'],
		intentType: 'Transactional'
	},
	{
		route: '/รับซื้อไอแพด/',
		file: 'รับซื้อไอแพด/index.html',
		focusKeyword: 'รับซื้อไอแพด',
		semanticKeywords: ['ไอแพดมือสอง', 'iPad Pro', 'iPad Air', 'ความจุ', 'สภาพจอ', 'แบตเตอรี่', 'โมเดล'],
		intentType: 'Transactional'
	},
	{
		route: '/รับซื้อกล้อง/',
		file: 'รับซื้อกล้อง/index.html',
		focusKeyword: 'รับซื้อกล้อง',
		semanticKeywords: ['กล้องมือสอง', 'เลนส์', 'ชัตเตอร์', 'เซนเซอร์', 'สภาพ', 'อุปกรณ์', 'ประกัน'],
		intentType: 'Transactional'
	},
	{
		route: '/พื้นที่ให้บริการ/',
		file: 'พื้นที่ให้บริการ/index.html',
		focusKeyword: 'พื้นที่ให้บริการรับซื้อ',
		semanticKeywords: ['กรุงเทพ', 'อุบลราชธานี', 'ขอนแก่น', 'โคราช', 'อุดรธานี', 'ต่างจังหวัด', 'นัดรับ'],
		intentType: 'Local intent'
	},
	{
		route: '/contact/',
		file: 'contact/index.html',
		focusKeyword: 'ติดต่อเรา',
		semanticKeywords: ['LINE @webuy', 'เบอร์โทร', 'แผนที่', 'ส่งรูปประเมิน', 'เวลาทำการ'],
		intentType: 'Contact / conversion'
	},
	{
		route: '/ความน่าเชื่อถือ/',
		file: 'ความน่าเชื่อถือ/index.html',
		focusKeyword: 'ความน่าเชื่อถือ',
		semanticKeywords: ['จดทะเบียนการค้า', 'AMPHON TRADING', 'ขั้นตอนการประเมิน', 'รีวิว', 'โปร่งใส'],
		intentType: 'Trust / entity page'
	},
	{
		route: '/บริการ/',
		file: 'บริการ/index.html',
		focusKeyword: 'บริการรับซื้อ',
		semanticKeywords: ['ซ่อมคอม', 'ซ่อมโน๊ตบุ๊ค', 'ซ่อมมือถือ', 'จำหน่ายไอที', 'รับซื้อคอม', 'อุบลราชธานี'],
		intentType: 'Commercial investigation'
	},
	{
		route: '/คู่มือก่อนขาย/',
		file: 'คู่มือก่อนขาย/index.html',
		focusKeyword: 'คู่มือก่อนขาย',
		semanticKeywords: ['เช็กสเปก', 'ล้างข้อมูล', 'ความปลอดภัย', 'ราคาตลาด', 'ขั้นตอนการขาย'],
		intentType: 'Informational'
	},
	{
		route: '/เช็กราคาก่อนขาย/',
		file: 'เช็กราคาก่อนขาย/index.html',
		focusKeyword: 'เช็กราคาก่อนขาย',
		semanticKeywords: ['เตรียมข้อมูล', 'ส่งสเปก', 'รูปถ่าย', 'ติดต่อประเมิน', 'ตกลงราคา'],
		intentType: 'Informational'
	},
	{
		route: '/ราคากลางรับซื้อ/',
		file: 'ราคากลางรับซื้อ/index.html',
		focusKeyword: 'ราคากลางรับซื้อ',
		semanticKeywords: ['ปัจจัยราคา', 'ราคาตลาด', 'ค่าเสื่อม', 'สภาพเครื่อง', 'ตารางราคา'],
		intentType: 'Informational'
	},
	// Secondary money pages
	{
		route: '/รับซื้อ-apple-watch/',
		file: 'รับซื้อ-apple-watch/index.html',
		focusKeyword: 'รับซื้อ apple watch',
		semanticKeywords: ['แอปเปิ้ลวอชมือสอง', 'GPS', 'Cellular', 'สุขภาพแบต', 'ริ้วรอย', 'สายชาร์จ'],
		intentType: 'Transactional'
	},
	{
		route: '/รับซื้อคอมประกอบ/',
		file: 'รับซื้อคอมประกอบ/index.html',
		focusKeyword: 'รับซื้อคอมประกอบ',
		semanticKeywords: ['คอมประกอบมือสอง', 'แยกชิ้นส่วน', 'CPU', 'การ์ดจอ', 'RAM', 'PSU', 'กล่องอุปกรณ์'],
		intentType: 'Transactional'
	},
	{
		route: '/รับซื้อสมาร์ทโฟน-android/',
		file: 'รับซื้อสมาร์ทโฟน-android/index.html',
		focusKeyword: 'รับซื้อสมาร์ทโฟน android',
		semanticKeywords: ['มือถือแอนดรอยด์มือสอง', 'Samsung', 'Oppo', 'Vivo', 'Xiaomi', 'สภาพจอ', 'ความจุ'],
		intentType: 'Transactional'
	},
	{
		route: '/รับซื้อ-ups/',
		file: 'รับซื้อ-ups/index.html',
		focusKeyword: 'รับซื้อ ups',
		semanticKeywords: ['เครื่องสำรองไฟมือสอง', 'APC', 'Syndome', 'แบตเตอรี่เสื่อม', 'ประมูลเครื่องสำรองไฟ'],
		intentType: 'Transactional'
	},
	{
		route: '/รับซื้อลำโพง/',
		file: 'รับซื้อลำโพง/index.html',
		focusKeyword: 'รับซื้อลำโพง',
		semanticKeywords: ['ลำโพงบลูทูธมือสอง', 'Marshall', 'JBL', 'Harman Kardon', 'เครื่องศูนย์', 'เสียงปกติ'],
		intentType: 'Transactional'
	},
	{
		route: '/รับซื้อเครื่องเกม/',
		file: 'รับซื้อเครื่องเกม/index.html',
		focusKeyword: 'รับซื้อเครื่องเกม',
		semanticKeywords: ['เครื่องเล่นเกมมือสอง', 'PlayStation 5', 'Nintendo Switch', 'จอยเกม', 'แผ่นเกม', 'อุปกรณ์ครบ'],
		intentType: 'Transactional'
	}
];

const FORBIDDEN_CLAIMS = [
	'ราคาสูงที่สุด',
	'อันดับ 1',
	'รับทุกสภาพ',
	'จ่ายสดทันที',
	'จ่ายเงินสดทันที',
	'15 นาที',
	'100%',
	'สู้ทุกราคา',
	'ไม่กดราคาแน่นอน'
];

const FORBIDDEN_SEO_TERMS = [
	'SEO',
	'AEO',
	'GEO',
	'Answer Engine',
	'AI Overview',
	'Generative AI',
	'Generative AI Summary'
];

function stripTags(html) {
	return html
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function countWords(text) {
	return text.split(/\s+/).filter(w => w.length > 0).length;
}

function runAudit() {
	console.log('Starting Content Intent & On-page SEO Audit...');

	const results = [];
	const titlesMap = new Map();
	const metasMap = new Map();

	// Pass 1: Scan and cache titles/metas to detect duplicates
	for (const page of PAGES_METADATA) {
		let filePath = join(distDir, page.file);
		if (!existsSync(filePath) && page.fileAlt) {
			filePath = join(distDir, page.fileAlt);
		}
		if (!existsSync(filePath)) continue;

		try {
			const html = readFileSync(filePath, 'utf8');
			const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
			const title = titleMatch ? titleMatch[1].trim() : '';

			const metaMatch = html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i) ||
				html.match(/<meta[^>]+content=["']([\s\S]*?)["'][^>]*name=["']description["'][^>]*>/i);
			const desc = metaMatch ? metaMatch[1].trim() : '';

			if (title) {
				if (!titlesMap.has(title)) titlesMap.set(title, []);
				titlesMap.get(title).push(page.route);
			}
			if (desc) {
				if (!metasMap.has(desc)) metasMap.set(desc, []);
				metasMap.get(desc).push(page.route);
			}
		} catch (e) {
			// ignore
		}
	}

	let totalPass = 0;
	let totalWarning = 0;
	let totalFail = 0;
	let totalScoreSum = 0;

	// Pass 2: Main audit
	for (const page of PAGES_METADATA) {
		let filePath = join(distDir, page.file);
		if (!existsSync(filePath) && page.fileAlt) {
			filePath = join(distDir, page.fileAlt);
		}

		if (!existsSync(filePath)) {
			console.warn(`File not found for route: ${page.route}. Skipped.`);
			continue;
		}

		const html = readFileSync(filePath, 'utf8');
		
		// Clean up style/script blocks BEFORE running regexes
		const cleanHtml = html
			.replace(/<script[\s\S]*?<\/script>/gi, ' ')
			.replace(/<style[\s\S]*?<\/style>/gi, ' ');

		const visibleText = stripTags(cleanHtml);
		const wordCount = countWords(visibleText);

		const issues = [];
		const recommendations = [];

		// Initialize scores
		let onPageScore = 0; // max 6
		let structureScore = 0; // max 5
		let linksScore = 0; // max 3
		let imageScore = 0; // max 3

		// --- 1. Page Title Optimization ---
		const titleMatch = cleanHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
		const title = titleMatch ? titleMatch[1].trim() : '';
		let titlePass = false;

		if (!title) {
			issues.push({ id: 'missing_title', severity: 'error', desc: 'Missing page title tag' });
		} else {
			const hasKeyword = title.toLowerCase().includes(page.focusKeyword.toLowerCase()) || 
				page.semanticKeywords.some(sw => title.toLowerCase().includes(sw.toLowerCase()));
			const isClaimHeavy = FORBIDDEN_CLAIMS.some(claim => title.includes(claim));
			const isTooLong = title.length > 70;
			const isTooShort = title.length < 25;

			const dupPages = titlesMap.get(title) || [];
			const isDuplicate = dupPages.length > 1;

			if (!hasKeyword) {
				issues.push({ id: 'title_no_keyword', severity: 'warning', desc: 'Title does not contain focus keyword or semantic terms' });
			}
			if (isClaimHeavy) {
				issues.push({ id: 'title_forbidden_claims', severity: 'error', desc: 'Title contains forbidden claim terms (e.g. ราคาสูงที่สุด, อันดับ 1)' });
			}
			if (isTooLong) {
				issues.push({ id: 'title_too_long', severity: 'warning', desc: `Title is too long (${title.length} chars, recommended < 70)` });
			}
			if (isTooShort) {
				issues.push({ id: 'title_too_short', severity: 'warning', desc: `Title is too short (${title.length} chars, recommended > 25)` });
			}
			if (isDuplicate) {
				issues.push({ id: 'title_duplicate', severity: 'warning', desc: `Title is duplicated across pages: ${dupPages.filter(r => r !== page.route).join(', ')}` });
			}

			if (hasKeyword && !isClaimHeavy && !isDuplicate) {
				titlePass = true;
				onPageScore++;
			}
		}

		// --- 2. Meta Description Optimization ---
		const metaMatch = cleanHtml.match(/<meta[^>]+name=["']description["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i) ||
			cleanHtml.match(/<meta[^>]+content=["']([\s\S]*?)["'][^>]*name=["']description["'][^>]*>/i);
		const desc = metaMatch ? metaMatch[1].trim() : '';
		let descPass = false;

		if (!desc) {
			issues.push({ id: 'missing_description', severity: 'error', desc: 'Missing meta description tag' });
		} else {
			const hasKeyword = desc.toLowerCase().includes(page.focusKeyword.toLowerCase()) || 
				page.semanticKeywords.some(sw => desc.toLowerCase().includes(sw.toLowerCase()));
			const isClaimHeavy = FORBIDDEN_CLAIMS.some(claim => desc.includes(claim));
			const isTooLong = desc.length > 165;
			const isTooShort = desc.length < 60;

			const dupPages = metasMap.get(desc) || [];
			const isDuplicate = dupPages.length > 1;

			if (!hasKeyword) {
				issues.push({ id: 'desc_no_keyword', severity: 'warning', desc: 'Description does not contain focus keyword or semantic terms' });
			}
			if (isClaimHeavy) {
				issues.push({ id: 'desc_forbidden_claims', severity: 'error', desc: 'Description contains forbidden claim terms' });
			}
			if (isTooLong) {
				issues.push({ id: 'desc_too_long', severity: 'warning', desc: `Description is too long (${desc.length} chars, recommended < 165)` });
			}
			if (isTooShort) {
				issues.push({ id: 'desc_too_short', severity: 'warning', desc: `Description is too short (${desc.length} chars, recommended > 60)` });
			}
			if (isDuplicate) {
				issues.push({ id: 'desc_duplicate', severity: 'warning', desc: `Description is duplicated across pages: ${dupPages.filter(r => r !== page.route).join(', ')}` });
			}

			if (hasKeyword && !isClaimHeavy && !isDuplicate) {
				descPass = true;
				onPageScore++;
			}
		}

		// --- 3. URL Friendly & Canonical ---
		let urlPass = true;
		const canonicalMatch = cleanHtml.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([\s\S]*?)["'][^>]*>/i) ||
			cleanHtml.match(/<link[^>]+href=["']([\s\S]*?)["'][^>]*rel=["']canonical["'][^>]*>/i);
		const canonical = canonicalMatch ? canonicalMatch[1].trim() : '';

		if (!canonical) {
			issues.push({ id: 'missing_canonical', severity: 'error', desc: 'Missing canonical link' });
			urlPass = false;
		} else {
			// Check if canonical contains route (in punycode or raw form)
			const expectedSegment = page.route === '/' ? '' : decodeURIComponent(page.route);
			const decodedCanonical = decodeURIComponent(canonical);
			if (!decodedCanonical.includes(expectedSegment)) {
				issues.push({ id: 'canonical_mismatch', severity: 'error', desc: `Canonical URL does not match current route. Got: ${canonical}, Expected: *${expectedSegment}` });
				urlPass = false;
			}
		}

		if (urlPass) {
			onPageScore++;
		}

		// --- 4. Hero / Featured Image & Alt ---
		let heroImagePass = false;
		const imgRegex = /<img([^>]+)>/gi;
		let imgMatch;
		let totalImages = 0;
		let imagesWithAlt = 0;
		let imagesWithDimensions = 0;
		let heroHasAlt = false;

		// First image is usually hero
		const firstImgMatch = cleanHtml.match(/<img([^>]+)>/i);
		if (firstImgMatch) {
			const attrs = firstImgMatch[1];
			const hasAlt = /alt=["'][^"']+["']/i.test(attrs);
			if (hasAlt) {
				heroImagePass = true;
				heroHasAlt = true;
			}
		}

		while ((imgMatch = imgRegex.exec(cleanHtml)) !== null) {
			totalImages++;
			const attrs = imgMatch[1];
			const hasAlt = /alt=["'][^"']+["']/i.test(attrs) || /alt\s*=\s*\{\s*[^}]+\s*\}/i.test(attrs);
			const hasWidth = /width=["']\d+["']/i.test(attrs) || /width\s*=\s*\{\s*\d+\s*\}/i.test(attrs);
			const hasHeight = /height=["']\d+["']/i.test(attrs) || /height\s*=\s*\{\s*\d+\s*\}/i.test(attrs);

			if (hasAlt) imagesWithAlt++;
			if (hasWidth && hasHeight) imagesWithDimensions++;
		}

		if (heroImagePass) {
			onPageScore++;
		}

		if (totalImages >= 3) {
			imageScore++;
		} else {
			issues.push({ id: 'low_image_count', severity: 'warning', desc: `Low image count (${totalImages}/3 recommended)` });
		}

		if (totalImages > 0 && imagesWithAlt === totalImages) {
			imageScore++;
		} else if (totalImages > 0) {
			issues.push({ id: 'missing_image_alts', severity: 'warning', desc: `Some images are missing non-empty alt text (${imagesWithAlt}/${totalImages} have alt)` });
		}

		if (totalImages > 0 && imagesWithDimensions === totalImages) {
			imageScore++;
		} else if (totalImages > 0) {
			issues.push({ id: 'missing_image_dimensions', severity: 'warning', desc: `Some images are missing explicit width/height dimensions (${imagesWithDimensions}/${totalImages} have dimensions)` });
		}

		// --- 5. Use H1 on Focus Keyword ---
		const h1Matches = cleanHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
		let h1Pass = false;

		if (h1Matches.length === 0) {
			issues.push({ id: 'missing_h1', severity: 'error', desc: 'Missing H1 tag' });
		} else if (h1Matches.length > 1) {
			issues.push({ id: 'multiple_h1s', severity: 'error', desc: `Multiple H1 tags found (${h1Matches.length})` });
		} else {
			const h1Content = h1Matches[0].replace(/<[^>]+>/g, '').trim();
			const hasKeyword = h1Content.toLowerCase().includes(page.focusKeyword.toLowerCase()) || 
				page.semanticKeywords.some(sw => h1Content.toLowerCase().includes(sw.toLowerCase()));
			const isClaimHeavy = FORBIDDEN_CLAIMS.some(claim => h1Content.includes(claim));

			if (!hasKeyword) {
				issues.push({ id: 'h1_no_keyword', severity: 'warning', desc: 'H1 does not contain focus keyword or semantic terms' });
			}
			if (isClaimHeavy) {
				issues.push({ id: 'h1_forbidden_claims', severity: 'error', desc: 'H1 contains forbidden claim terms' });
			}

			if (hasKeyword && !isClaimHeavy) {
				h1Pass = true;
				onPageScore++;
			}
		}

		// --- 6. Focus Keyword in 1st Paragraph ---
		// We'll search for the first <p> content in visible text
		const pMatch = cleanHtml.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
		const firstP = pMatch ? pMatch[1].replace(/<[^>]+>/g, '').trim() : '';
		let pPass = false;

		if (!firstP) {
			issues.push({ id: 'missing_first_paragraph', severity: 'warning', desc: 'Could not detect first paragraph (<p> tag)' });
		} else {
			const hasKeyword = firstP.toLowerCase().includes(page.focusKeyword.toLowerCase()) || 
				page.semanticKeywords.some(sw => firstP.toLowerCase().includes(sw.toLowerCase()));
			if (!hasKeyword) {
				issues.push({ id: 'first_p_no_keyword', severity: 'warning', desc: 'First paragraph does not contain focus keyword or semantic terms' });
			} else {
				pPass = true;
				onPageScore++;
			}
		}

		// --- Structure and Header Hierarchy ---
		const h2Matches = cleanHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];
		const h3Matches = cleanHtml.match(/<h3[^>]*>([\s\S]*?)<\/h3>/gi) || [];

		if (h1Matches.length === 1) {
			structureScore++;
		}
		if (h2Matches.length >= 4) {
			structureScore++;
		} else {
			issues.push({ id: 'low_h2_count', severity: 'warning', desc: `Low H2 heading count (${h2Matches.length}/4 recommended)` });
		}
		if (h3Matches.length >= 2) {
			structureScore++;
		} else {
			issues.push({ id: 'low_h3_count', severity: 'warning', desc: `Low H3 heading count (${h3Matches.length}/2 recommended)` });
		}

		// Check keyword presence under H2/H3
		let h2h3HasKeyword = false;
		for (const h2 of h2Matches) {
			const text = h2.replace(/<[^>]+>/g, '').toLowerCase();
			if (text.includes(page.focusKeyword.toLowerCase()) || page.semanticKeywords.some(sw => text.includes(sw.toLowerCase()))) {
				h2h3HasKeyword = true;
				break;
			}
		}
		for (const h3 of h3Matches) {
			const text = h3.replace(/<[^>]+>/g, '').toLowerCase();
			if (text.includes(page.focusKeyword.toLowerCase()) || page.semanticKeywords.some(sw => text.includes(sw.toLowerCase()))) {
				h2h3HasKeyword = true;
				break;
			}
		}

		if (h2h3HasKeyword) {
			structureScore++;
		} else {
			issues.push({ id: 'h2_h3_no_keyword', severity: 'warning', desc: 'No H2 or H3 heading contains the focus keyword or semantic terms' });
		}

		// Check for text walls (paragraphs exceeding 800 chars)
		const paragraphs = cleanHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
		let hasTextWall = false;
		for (const p of paragraphs) {
			const text = p.replace(/<[^>]+>/g, '').trim();
			if (text.length > 800) {
				hasTextWall = true;
				issues.push({ id: 'text_wall_detected', severity: 'warning', desc: `Paragraph exceeds 800 characters (${text.length} chars). Potential readability issue on mobile.` });
			}
		}

		if (!hasTextWall) {
			structureScore++;
		}

		// --- Links Analysis ---
		const hrefRegex = /<a[^>]+href=["']([^"']+)["']/gi;
		let linkMatch;
		let internalLinksCount = 0;
		let externalLinksCount = 0;
		let linksToCore = false;
		let linksToArticle = false;

		while ((linkMatch = hrefRegex.exec(cleanHtml)) !== null) {
			const url = linkMatch[1];
			const isExternal = /^https?:\/\//i.test(url) && !url.includes('xn--c3c3a0aa6cvaf8b9dze.com') && !url.includes('เรารับซื้อ.com') && !url.includes('localhost');
			
			if (isExternal) {
				// Only treat educational/official links as positive external links
				const isInfoLink = /apple\.com|microsoft\.com|google\.com|wikipedia|support/i.test(url);
				if (isInfoLink) {
					externalLinksCount++;
				}
			} else {
				internalLinksCount++;
				if (url === '/' || url === '/รับซื้อ/' || url.includes('/รับซื้อโน๊ตบุ๊ค/') || url.includes('/รับซื้อคอม/')) {
					linksToCore = true;
				}
				if (url.includes('/คู่มือก่อนขาย/') || url.includes('/blog/')) {
					linksToArticle = true;
				}
			}
		}

		if (internalLinksCount >= 3) {
			linksScore++;
		} else {
			issues.push({ id: 'low_internal_links', severity: 'warning', desc: `Low internal link count (${internalLinksCount}/3 recommended)` });
		}

		if (externalLinksCount >= 1) {
			linksScore++;
		} else {
			// Informational pages require external links, money pages warning is optional but logged.
			if (page.intentType === 'Informational') {
				issues.push({ id: 'missing_external_link', severity: 'warning', desc: 'Informational page is missing authoritative external links (e.g. Apple/Microsoft Support)' });
			} else {
				issues.push({ id: 'no_external_link_money', severity: 'info', desc: 'Money page lacks informational external links (acceptable if conversion-focused)' });
			}
		}

		if (linksToCore && linksToArticle) {
			linksScore++;
		} else {
			issues.push({ id: 'missing_navigation_links', severity: 'warning', desc: `Lacks links to core categories (${linksToCore ? 'yes' : 'no'}) or articles (${linksToArticle ? 'yes' : 'no'})` });
		}

		// --- Forbidden Claims & Terms Scanning ---
		for (const claim of FORBIDDEN_CLAIMS) {
			const re = new RegExp(claim, 'gi');
			if (re.test(visibleText)) {
				issues.push({ id: 'forbidden_claim_copy', severity: 'error', desc: `Public copywriting contains forbidden claim term: "${claim}"` });
			}
		}

		for (const term of FORBIDDEN_SEO_TERMS) {
			const re = new RegExp(`\\b${term}\\b`, 'i');
			if (re.test(visibleText)) {
				issues.push({ id: 'forbidden_seo_term_copy', severity: 'error', desc: `Public copywriting contains visible SEO/AEO/GEO jargon: "${term}"` });
			}
		}

		// Calculate overall score
		// onPage: max 6, structure: max 5, links: max 3, images: max 3. Total: 17
		const totalPossible = 17;
		const totalScore = onPageScore + structureScore + linksScore + imageScore;
		totalScoreSum += totalScore;

		const overallPercent = Math.round((totalScore / totalPossible) * 100);

		// Determine rating
		let rating = 'PASS';
		const hasErrors = issues.some(i => i.severity === 'error');
		const hasWarnings = issues.some(i => i.severity === 'warning');

		if (hasErrors || overallPercent < 60) {
			rating = 'FAIL';
			totalFail++;
		} else if (hasWarnings || overallPercent < 85) {
			rating = 'NEEDS IMPROVEMENT';
			totalWarning++;
		} else {
			totalPass++;
		}

		// Priority determination
		let priority = 'P3';
		if (rating === 'FAIL') {
			priority = 'P0';
		} else if (overallPercent < 80) {
			priority = 'P1';
		} else if (overallPercent < 90) {
			priority = 'P2';
		}

		// Formulate recommendations
		if (!titlePass) recommendations.push('Optimize the page title: include the focus keyword, keep it under 70 characters, and remove any claim-heavy words.');
		if (!descPass) recommendations.push('Improve meta description: ensure it summarizes the page, includes a safe call-to-action, has keywords, and is 60-160 chars.');
		if (!h1Pass) recommendations.push('Ensure a single H1 tag is present on the page, containing the primary focus keyword in user-friendly language.');
		if (h2Matches.length < 4) recommendations.push(`Add more structural H2 sections (currently: ${h2Matches.length}, recommended >= 4) representing user sub-intents.`);
		if (h3Matches.length < 2) recommendations.push(`Include at least 2 H3 subheadings (currently: ${h3Matches.length}) to elaborate on H2 topics.`);
		if (totalImages < 3) recommendations.push('Add at least 3 relevant images to make the content visually engaging and representative of the service.');
		if (imagesWithAlt < totalImages) recommendations.push('Provide descriptive alt text for all image tags, including the focus keyword where natural.');
		if (imagesWithDimensions < totalImages) recommendations.push('Add explicit width and height dimensions to all images to prevent layout shifts (CLS).');
		if (externalLinksCount === 0 && page.intentType === 'Informational') recommendations.push('Link to authoritative official documentations (e.g. Apple Support) for resetting/checking devices.');
		if (!linksToCore || !linksToArticle) recommendations.push('Enhance internal linking: link to main product category pages and relevant blog guides.');
		if (hasTextWall) recommendations.push('Break down long paragraphs (>800 chars) into shorter, mobile-friendly sentences or bullet lists.');

		results.push({
			page: page.route,
			focusKeyword: page.focusKeyword,
			intentType: page.intentType,
			scores: {
				onPage: `${onPageScore}/6`,
				structure: `${structureScore}/5`,
				links: `${linksScore}/3`,
				images: `${imageScore}/3`,
				overall: `${overallPercent}%`
			},
			rating,
			priority,
			issues,
			recommendations
		});
	}

	const auditJson = {
		summary: {
			totalPages: PAGES_METADATA.length,
			passCount: totalPass,
			warningCount: totalWarning,
			failCount: totalFail,
			averageScore: `${Math.round((totalScoreSum / (PAGES_METADATA.length * 17)) * 100)}%`
		},
		results
	};

	// Save JSON result
	const outputDir = join(root, 'docs/recovery/batch-6');
	mkdirSync(outputDir, { recursive: true });
	writeFileSync(join(outputDir, 'content-intent-onpage-audit.json'), JSON.stringify(auditJson, null, 2), 'utf8');

	console.log('\n=== Content Intent & On-page SEO Audit Summary ===\n');
	console.table({
		'Total Pages Checked': PAGES_METADATA.length,
		'PASS (Good Quality)': totalPass,
		'WARNING (Needs Improvement)': totalWarning,
		'FAIL (Critical Issues)': totalFail,
		'Average Quality Score': `${Math.round((totalScoreSum / (PAGES_METADATA.length * 17)) * 100)}%`
	});

	console.log(`\nResults saved to docs/recovery/batch-6/content-intent-onpage-audit.json\n`);
}

runAudit();
