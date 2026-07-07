import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

// Helper to normalize paths: leading slash, trailing slash, decoded, no queries/hashes
function normalizeUrlPath(rawPath) {
	if (!rawPath) return null;
	let p = rawPath.trim();
	// Remove query params and hash
	p = p.split('?')[0].split('#')[0];
	if (!p) return null;
	
	// Skip external links, tel, mailto, line protocol, etc.
	if (/^(https?:|mailto:|tel:|line:|javascript:)/i.test(p)) {
		return null;
	}
	
	// Skip assets and files
	if (/\.(png|jpg|jpeg|gif|webp|svg|css|js|xml|txt|ts|json|bmp)$/i.test(p)) {
		return null;
	}
	if (p.startsWith('/media/') || p.startsWith('/assets/') || p.startsWith('/_astro/')) {
		return null;
	}
	
	// Ensure leading slash and decode
	try {
		p = decodeURIComponent(p);
	} catch (e) {
		// Ignore decode error and use raw
	}
	
	if (!p.startsWith('/')) {
		p = '/' + p;
	}
	// Normalize duplicate slashes
	p = p.replace(/\/+/g, '/');
	
	// Ensure trailing slash unless it's just root '/'
	if (p !== '/' && !p.endsWith('/')) {
		p = p + '/';
	}
	
	return p;
}

// 1. Read GONE_PATHS from src/config/gone-paths.ts
function getGonePaths() {
	const gonePathsFile = path.join(ROOT_DIR, 'src/config/gone-paths.ts');
	if (!fs.existsSync(gonePathsFile)) {
		console.warn('⚠️ src/config/gone-paths.ts not found.');
		return new Set();
	}
	const content = fs.readFileSync(gonePathsFile, 'utf8');
	const paths = new Set();
	const matches = content.match(/"([^"]+)"/g) || [];
	for (const match of matches) {
		const raw = match.replace(/"/g, '');
		const norm = normalizeUrlPath(raw);
		if (norm) paths.add(norm);
	}
	return paths;
}

// 2. Read Redirects from public/_redirects
function getRedirects() {
	const redirectsFile = path.join(ROOT_DIR, 'public/_redirects');
	const redirectMap = new Map();
	if (!fs.existsSync(redirectsFile)) {
		console.warn('⚠️ public/_redirects not found.');
		return redirectMap;
	}
	const content = fs.readFileSync(redirectsFile, 'utf8');
	const lines = content.split('\n');
	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		const parts = trimmed.split(/\s+/);
		if (parts.length >= 2) {
			const source = normalizeUrlPath(parts[0]);
			const target = normalizeUrlPath(parts[1]);
			if (source && target && source !== target) {
				redirectMap.set(source, target);
			}
		}
	}
	return redirectMap;
}

// 3. Scan posts & quarantine to get indexability status
function scanContentCollections() {
	const postsDir = path.join(ROOT_DIR, 'src/content/posts');
	const quarantineDir = path.join(ROOT_DIR, 'src/content/quarantine');
	
	const noindexPaths = new Set();
	const quarantinePaths = new Set();
	
	// Helper to extract frontmatter slug and noindex
	function parseFrontmatter(filePath) {
		const content = fs.readFileSync(filePath, 'utf8');
		const frontmatterMatch = content.match(/^---([\s\S]*?)---/);
		if (!frontmatterMatch) return { slug: null, noindex: false };
		
		const fmText = frontmatterMatch[1];
		let slug = null;
		let noindex = false;
		
		const slugMatch = fmText.match(/^slug:\s*["']?([^"\n\r']+)["']?/m);
		if (slugMatch) slug = slugMatch[1];
		
		const noindexMatch = fmText.match(/^noindex:\s*(true|false)/m);
		if (noindexMatch) noindex = noindexMatch[1] === 'true';
		
		return { slug, noindex };
	}
	
	// Scan active posts
	if (fs.existsSync(postsDir)) {
		const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
		for (const file of files) {
			const filePath = path.join(postsDir, file);
			const { slug, noindex } = parseFrontmatter(filePath);
			const finalSlug = slug || file.replace(/\.mdx?$/, '');
			const normPath = normalizeUrlPath('/' + finalSlug + '/');
			if (normPath && noindex) {
				noindexPaths.add(normPath);
			}
		}
	}
	
	// Scan quarantined files
	function walkDir(dir) {
		let results = [];
		if (!fs.existsSync(dir)) return results;
		const list = fs.readdirSync(dir);
		for (const file of list) {
			const fullPath = path.join(dir, file);
			const stat = fs.statSync(fullPath);
			if (stat && stat.isDirectory()) {
				results = results.concat(walkDir(fullPath));
			} else if (file.endsWith('.md') || file.endsWith('.mdx')) {
				results.push(fullPath);
			}
		}
		return results;
	}
	
	const quarantineFiles = walkDir(quarantineDir);
	for (const filePath of quarantineFiles) {
		const { slug } = parseFrontmatter(filePath);
		const filename = path.basename(filePath).replace(/\.mdx?$/, '');
		const finalSlug = slug || filename;
		const normPath = normalizeUrlPath('/' + finalSlug + '/');
		if (normPath) {
			quarantinePaths.add(normPath);
		}
	}
	
	return { noindexPaths, quarantinePaths };
}

// 4. Check if path is truncated / garbled
function isTruncatedOrGarbled(normPath) {
	if (!normPath) return false;
	
	// Literal checks for truncated provinces
	if (normPath.includes('ศรีสะเก') && !normPath.includes('ศรีสะเกษ')) return true;
	if (normPath.includes('กาฬสินธ') && !normPath.includes('กาฬสินธุ์')) return true;
	if (normPath.includes('ภูเก') && !normPath.includes('ภูเก็ต')) return true;
	
	// Standalone "บุรี" truncation like "รับซื้อกล้องมือสอง-บุรี/"
	// Valid prefixes for "บุรี" in Thailand provinces: สุพรรณ, สระ, สิงห์, กาญจน, นนท, ปราจีน, ชล, ราช, เพชร, ลพ, บุรีรัมย์
	if (normPath.includes('บุรี/')) {
		const validSuffixes = [
			'สุพรรณบุรี', 'สระบุรี', 'สิงห์บุรี', 'กาญจนบุรี', 'นนทบุรี', 
			'ปราจีนบุรี', 'ชลบุรี', 'ราชบุรี', 'เพชรบุรี', 'ลพบุรี', 'บุรีรัมย์',
			'จันทบุรี'
		];
		let isMatched = false;
		for (const valid of validSuffixes) {
			if (normPath.includes(valid)) {
				isMatched = true;
				break;
			}
		}
		if (!isMatched) return true;
	}
	
	// Checks for obvious cut-off endings
	const endings = ['อุบลราชธ', 'อุบลรา', 'ยโ', 'อำนาจเจ', 'เมืองนค', 'เมืองมห', 'เมืองร้', 'เมืองศร', 'เมืองสก', 'เมืองสุ', 'เมืองอำ', 'เมืองเล', 'โกสุมพิ', 'โพนทอง'];
	for (const ending of endings) {
		// e.g. /รับซื้อโน๊ตบุ๊ค-ยโ/ or /จำนำ-notebook-โน๊ตบุ๊ค-อุบลราชธ/
		// Match word boundaries or end of slug
		const regex = new RegExp(`[-/]${ending}(/|$)`);
		if (regex.test(normPath)) {
			return true;
		}
	}
	
	return false;
}

// 5. Check if path is off-topic
function isOffTopic(normPath) {
	if (!normPath) return false;
	const offTopicKeywords = [
		'รับซื้อเหล้า', 'รับซื้อไวน์', 'รับซื้อเบียร์', 
		'รับจำนำ', 'ตั๋วจำนำ', 'รับซื้อกระดาษ', 'เหรียญญี่ปุ่น'
	];
	for (const kw of offTopicKeywords) {
		if (normPath.includes(kw)) {
			return true;
		}
	}
	return false;
}

// 6. Find all files to scan
function getFilesToScan() {
	const directories = [
		{ dir: 'src/pages', ext: ['.astro'] },
		{ dir: 'src/components', ext: ['.astro'] },
		{ dir: 'src/content/posts', ext: ['.md', '.mdx'] },
		{ dir: 'src/config', ext: ['.ts'] },
		{ dir: 'src/data', ext: ['.ts'] }
	];
	
	let results = [];
	
	function walk(dir, allowedExts) {
		const fullDir = path.join(ROOT_DIR, dir);
		if (!fs.existsSync(fullDir)) return;
		const list = fs.readdirSync(fullDir);
		for (const file of list) {
			const fullPath = path.join(fullDir, file);
			const stat = fs.statSync(fullPath);
			if (stat && stat.isDirectory()) {
				walk(path.join(dir, file), allowedExts);
			} else {
				const ext = path.extname(file);
				if (allowedExts.includes(ext)) {
					results.push(fullPath);
				}
			}
		}
	}
	
	for (const { dir, ext } of directories) {
		walk(dir, ext);
	}
	
	return results;
}

// Main execution
function runAudit() {
	console.log('🔍 Starting Internal Link Audit...');
	
	const gonePaths = getGonePaths();
	const redirectMap = getRedirects();
	const { noindexPaths, quarantinePaths } = scanContentCollections();
	const files = getFilesToScan();
	
	console.log(`- Loaded ${gonePaths.size} gone paths`);
	console.log(`- Loaded ${redirectMap.size} redirect rules`);
	console.log(`- Loaded ${noindexPaths.size} noindex pages`);
	console.log(`- Loaded ${quarantinePaths.size} quarantined paths`);
	console.log(`- Found ${files.length} files to scan`);
	
	const scanReport = [];
	let totalLinksScanned = 0;
	let totalIssuesCount = 0;
	
	const stats = {
		goneCount: 0,
		quarantineCount: 0,
		noindexCount: 0,
		offTopicCount: 0,
		redirectSourceCount: 0,
		truncatedCount: 0,
		duplicateAnchorCount: 0
	};
	
	// Regex patterns to match potential internal links
	// Match href="..." or href='...' or href={`...`}
	const hrefRegex = /\bhref=(?:["']([^"']*)["']|\{["']([^"']*)["']\}|\{\`([^`]*)\`\})/g;
	// Match markdown links [text](url)
	const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
	// Match string literals starting with / in js/ts/astro
	const rawPathRegex = /['"`](\/[^'"`\s>]+)['"`]/g;
	
	for (const file of files) {
		const relativePath = path.relative(ROOT_DIR, file).replace(/\\/g, '/');
		const content = fs.readFileSync(file, 'utf8');
		const fileIssues = [];
		const seenLinksInFile = new Map(); // path -> Array of anchors
		
		function registerLink(url, anchor, lineNum, type) {
			const norm = normalizeUrlPath(url);
			if (!norm) return;
			
			totalLinksScanned++;
			
			// Check issues
			const issues = [];
			
			if (gonePaths.has(norm)) {
				issues.push({ code: 'LINK_TO_GONE_PATH', severity: 'critical', message: `Links to a GONE path: ${norm}` });
				stats.goneCount++;
			}
			
			if (quarantinePaths.has(norm)) {
				issues.push({ code: 'LINK_TO_QUARANTINED_PATH', severity: 'critical', message: `Links to a quarantined path: ${norm}` });
				stats.quarantineCount++;
			}
			
			if (noindexPaths.has(norm)) {
				issues.push({ code: 'LINK_TO_NOINDEX_PATH', severity: 'warning', message: `Links to a noindex local page: ${norm}` });
				stats.noindexCount++;
			}
			
			if (isOffTopic(norm)) {
				issues.push({ code: 'LINK_TO_OFF_TOPIC', severity: 'critical', message: `Links to off-topic keyword path: ${norm}` });
				stats.offTopicCount++;
			}
			
			if (isTruncatedOrGarbled(norm)) {
				issues.push({ code: 'LINK_TO_TRUNCATED_SLUG', severity: 'critical', message: `Links to a truncated/garbled slug: ${norm}` });
				stats.truncatedCount++;
			}
			
			if (redirectMap.has(norm)) {
				const canonical = redirectMap.get(norm);
				issues.push({ 
					code: 'LINK_TO_REDIRECT_SOURCE', 
					severity: 'warning', 
					message: `Links to redirect source instead of canonical: ${norm} -> ${canonical}` 
				});
				stats.redirectSourceCount++;
			}
			
			// Duplicate anchor check within the same file (avoid exact match spam)
			if (anchor) {
				const cleanAnchor = anchor.trim();
				if (!seenLinksInFile.has(norm)) {
					seenLinksInFile.set(norm, []);
				}
				const anchors = seenLinksInFile.get(norm);
				if (anchors.includes(cleanAnchor)) {
					issues.push({
						code: 'DUPLICATE_EXACT_MATCH_ANCHOR',
						severity: 'warning',
						message: `Duplicate link to same URL with exact-match anchor text: "${cleanAnchor}" to ${norm}`
					});
					stats.duplicateAnchorCount++;
				} else {
					anchors.push(cleanAnchor);
				}
			}
			
			if (issues.length > 0) {
				for (const issue of issues) {
					totalIssuesCount++;
					fileIssues.push({
						line: lineNum,
						type,
						url,
						normalizedUrl: norm,
						anchor: anchor || null,
						...issue
					});
				}
			}
		}
		
		// Parse line by line to get line numbers
		const lines = content.split('\n');
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const lineNum = i + 1;
			
			// 1. Check hrefs
			let hrefMatch;
			hrefRegex.lastIndex = 0;
			while ((hrefMatch = hrefRegex.exec(line)) !== null) {
				const url = hrefMatch[1] || hrefMatch[2] || hrefMatch[3];
				if (url) {
					// Try to find anchor text contextually in the line
					const anchorMatch = new RegExp(`<a\\b[^>]*href=["']${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>([\\s\\S]*?)</a>`, 'i').exec(line);
					const anchor = anchorMatch ? anchorMatch[1].replace(/<[^>]+>/g, '').trim() : '';
					registerLink(url, anchor, lineNum, 'HTML_HREF');
				}
			}
			
			// 2. Check markdown links
			let mdMatch;
			mdLinkRegex.lastIndex = 0;
			while ((mdMatch = mdLinkRegex.exec(line)) !== null) {
				const anchor = mdMatch[1];
				const url = mdMatch[2];
				registerLink(url, anchor, lineNum, 'MARKDOWN_LINK');
			}
			
			// 3. Check raw path strings in configs and scripts
			if (file.endsWith('.ts') || file.endsWith('.mjs')) {
				let rawMatch;
				rawPathRegex.lastIndex = 0;
				while ((rawMatch = rawPathRegex.exec(line)) !== null) {
					const url = rawMatch[1];
					registerLink(url, '', lineNum, 'RAW_PATH_STRING');
				}
			}
		}
		
		if (fileIssues.length > 0) {
			scanReport.push({
				file: relativePath,
				issues: fileIssues
			});
		}
	}
	
	// Write report
	const reportDir = path.join(ROOT_DIR, 'docs/recovery/batch-3');
	if (!fs.existsSync(reportDir)) {
		fs.mkdirSync(reportDir, { recursive: true });
	}
	
	const finalData = {
		summary: {
			totalFilesScanned: files.length,
			totalLinksScanned,
			totalIssuesCount,
			stats
		},
		details: scanReport
	};
	
	fs.writeFileSync(
		path.join(reportDir, 'internal-link-audit.json'),
		JSON.stringify(finalData, null, 2),
		'utf8'
	);
	
	console.log('\n--- Internal Link Audit Summary ---');
	console.log(`Total Files Scanned: ${files.length}`);
	console.log(`Total Links Scanned: ${totalLinksScanned}`);
	console.log(`Total Issues Found: ${totalIssuesCount}`);
	console.log(`  - GONE paths links: ${stats.goneCount}`);
	console.log(`  - Quarantined paths links: ${stats.quarantineCount}`);
	console.log(`  - Noindex local pages links: ${stats.noindexCount}`);
	console.log(`  - Off-topic keyword links: ${stats.offTopicCount}`);
	console.log(`  - Redirect source links: ${stats.redirectSourceCount}`);
	console.log(`  - Truncated/garbled slug links: ${stats.truncatedCount}`);
	console.log(`  - Duplicate exact-match anchors: ${stats.duplicateAnchorCount}`);
	console.log(`Report written to: docs/recovery/batch-3/internal-link-audit.json`);
	
	return finalData;
}

runAudit();
