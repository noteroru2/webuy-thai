import fs from 'fs';
import path from 'path';

const distDir = './dist';
const auditRoutes = [
	{ route: '/', file: 'index.html' },
	{ route: '/รับซื้อ/', file: 'รับซื้อ/index.html' },
	{ route: '/รับซื้อโน๊ตบุ๊ค/', file: 'รับซื้อโน๊ตบุ๊ค/index.html' },
	{ route: '/รับซื้อคอม/', file: 'รับซื้อคอม/index.html' },
	{ route: '/รับซื้อแมคบุ๊ค/', file: 'รับซื้อแมคบุ๊ค/index.html' },
	{ route: '/รับซื้อไอโฟน/', file: 'รับซื้อไอโฟน/index.html' },
	{ route: '/รับซื้อไอแพด/', file: 'รับซื้อไอแพด/index.html' },
	{ route: '/รับซื้อกล้อง/', file: 'รับซื้อกล้อง/index.html' },
	{ route: '/พื้นที่ให้บริการ/', file: 'พื้นที่ให้บริการ/index.html' },
	{ route: '/contact/', file: 'contact/index.html' },
	{ route: '/ความน่าเชื่อถือ/', file: 'ความน่าเชื่อถือ/index.html' }
];

console.log('Starting Mobile UX Audit...');

const results = [];
let overallPass = true;

for (const item of auditRoutes) {
	const filePath = path.join(distDir, item.file);
	if (!fs.existsSync(filePath)) {
		console.warn(`Warning: Built file not found for ${item.route} at ${filePath}. Run npm run build first.`);
		results.push({
			route: item.route,
			status: 'skipped',
			reason: 'File not found'
		});
		continue;
	}

	const content = fs.readFileSync(filePath, 'utf8');
	const errors = [];
	const warnings = [];

	// 1. H1 Count check
	const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
	if (h1Matches.length === 0) {
		errors.push('Missing H1 tag');
	} else if (h1Matches.length > 1) {
		errors.push(`Multiple H1 tags found (${h1Matches.length})`);
	}

	// 2. Image dimensions check
	const imgRegex = /<img([^>]+)>/gi;
	let imgMatch;
	let totalImages = 0;
	let missingDimensions = 0;

	while ((imgMatch = imgRegex.exec(content)) !== null) {
		const attrs = imgMatch[1];
		totalImages++;
		const hasWidth = /width=["']\d+["']/i.test(attrs) || /width\s*=\s*\{\s*\d+\s*\}/i.test(attrs);
		const hasHeight = /height=["']\d+["']/i.test(attrs) || /height\s*=\s*\{\s*\d+\s*\}/i.test(attrs);
		
		if (!hasWidth || !hasHeight) {
			missingDimensions++;
			errors.push(`Image missing width or height dimensions: ${imgMatch[0].substring(0, 100)}...`);
		}
	}

	// 3. Tap Target size & CTA checks
	const hasLineCTA = content.includes('line.me') || content.includes('@webuy');
	if (!hasLineCTA) {
		errors.push('Missing primary LINE CTA URL (@webuy)');
	}

	// Check main CTA tap heights (specifically the menu and key buttons)
	// We scan the mobile nav anchors and details toggle
	const toggleMatch = content.match(/<summary[^>]*class="[^"]*p-3[^"]*"[^>]*>/gi);
	if (!toggleMatch && content.includes('เปิดเมนู')) {
		warnings.push('Mobile menu toggle button might have small padding (recommended p-3 for >= 44px tap target)');
	}

	// 4. Horizontal Overflow Check
	// Check for elements with hardcoded widths > 390px inline styles that might overflow
	const largeWidthStyle = content.match(/style="[^"]*width:\s*\d{3,}px[^"]*"/gi);
	if (largeWidthStyle) {
		for (const style of largeWidthStyle) {
			const widthVal = parseInt(style.match(/\d+/)[0], 10);
			if (widthVal > 390) {
				errors.push(`Hardcoded inline width of ${widthVal}px might cause overflow on 360px-390px mobile viewports`);
			}
		}
	}

	// Verify status
	const pass = errors.length === 0;
	if (!pass) overallPass = false;

	results.push({
		route: item.route,
		status: pass ? 'pass' : 'fail',
		h1Count: h1Matches.length,
		totalImages,
		imagesMissingDimensions: missingDimensions,
		errors,
		warnings
	});

	console.log(`- ${item.route}: ${pass ? 'PASS' : 'FAIL'} (${errors.length} errors, ${warnings.length} warnings)`);
}

const auditReport = {
	timestamp: new Date().toISOString(),
	overallPass,
	results
};

const outputDir = './docs/recovery/batch-5';
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'mobile-ux-audit.json'), JSON.stringify(auditReport, null, 2), 'utf8');

console.log(`\nAudit finished. Results written to ${path.join(outputDir, 'mobile-ux-audit.json')}`);
if (!overallPass) {
	process.exit(1);
} else {
	process.exit(0);
}
