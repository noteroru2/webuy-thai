import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { loadGonePaths } from './load-gone-paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

// Single source of truth: src/config/gone-paths.ts
const gonePaths = loadGonePaths();

// Load noindex pages from active posts
const noindexPaths = new Set();
const postsDir = path.join(ROOT_DIR, 'src/content/posts');
if (fs.existsSync(postsDir)) {
	const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
	for (const file of files) {
		const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
		const frontmatterMatch = content.match(/^---([\s\S]*?)---/);
		if (frontmatterMatch) {
			const fmText = frontmatterMatch[1];
			const noindexMatch = fmText.match(/^noindex:\s*(true|false)/m);
			const slugMatch = fmText.match(/^slug:\s*["']?([^"\n\r']+)["']?/m);
			const slug = slugMatch ? slugMatch[1] : file.replace(/\.mdx?$/, '');
			const isNoindex = noindexMatch ? noindexMatch[1] === 'true' : false;
			if (isNoindex) {
				let p = '/' + slug + '/';
				p = p.replace(/\/+/g, '/');
				noindexPaths.add(p);
			}
		}
	}
}

function walkHtml(dir, fileList = []) {
	if (!fs.existsSync(dir)) return fileList;
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			walkHtml(fullPath, fileList);
		} else if (entry.name.endsWith('.html')) {
			fileList.push(fullPath);
		}
	}
	return fileList;
}

function normalizeUrlPath(url) {
	if (!url) return '';
	let clean = url.trim();
	clean = clean.split('#')[0].split('?')[0];
	if (clean.startsWith('http://') || clean.startsWith('https://')) {
		try {
			clean = new URL(clean).pathname;
		} catch (e) {
			return '';
		}
	}
	if (!clean.startsWith('/')) clean = '/' + clean;
	if (!clean.endsWith('/')) clean = clean + '/';
	clean = clean.replace(/\/+/g, '/');
	try {
		return decodeURIComponent(clean);
	} catch (e) {
		return clean;
	}
}

function runSchemaAudit() {
	console.log('🔍 Starting Schema Audit...');
	const htmlFiles = walkHtml(DIST_DIR);
	console.log(`- Found ${htmlFiles.length} HTML files in dist/`);
	
	const report = {
		summary: {
			totalScanned: htmlFiles.length,
			criticalErrors: 0,
			warnings: 0
		},
		details: []
	};
	
	for (const file of htmlFiles) {
		const relativePath = path.relative(DIST_DIR, file).replace(/\\/g, '/');
		const pathname = '/' + relativePath.replace(/index\.html$/, '').replace(/\.html$/, '');
		const cleanPathname = normalizeUrlPath(pathname);
		
		const htmlContent = fs.readFileSync(file, 'utf8');
		const isNoindexPage = htmlContent.includes('noindex') || htmlContent.includes('http-equiv="refresh"');
		if (isNoindexPage) continue;
		
		// Extract JSON-LD script blocks
		const jsonLdBlocks = [];
		const scriptRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
		let match;
		let parseErrors = 0;
		
		while ((match = scriptRegex.exec(htmlContent)) !== null) {
			const rawJson = match[1];
			try {
				const parsed = JSON.parse(rawJson);
				jsonLdBlocks.push(parsed);
			} catch (e) {
				parseErrors++;
			}
		}
		
		const issues = [];
		
		if (parseErrors > 0) {
			issues.push({
				code: 'INVALID_JSON_LD',
				severity: 'critical',
				message: `Failed to parse ${parseErrors} JSON-LD blocks on this page.`
			});
		}
		
		// Flatten @graph if present
		const schemas = [];
		for (const block of jsonLdBlocks) {
			if (block['@graph'] && Array.isArray(block['@graph'])) {
				schemas.push(...block['@graph']);
			} else {
				schemas.push(block);
			}
		}
		
		// Count schema types
		const typeCounts = {};
		for (const schema of schemas) {
			const type = schema['@type'];
			if (type) {
				typeCounts[type] = (typeCounts[type] || 0) + 1;
			}
		}
		
		// 1. Duplicate LocalBusiness
		if (typeCounts['LocalBusiness'] > 1) {
			issues.push({
				code: 'DUPLICATE_LOCAL_BUSINESS',
				severity: 'critical',
				message: `Duplicate LocalBusiness schemas found (${typeCounts['LocalBusiness']} times).`
			});
		}
		
		// 2. LocalBusiness on non-allowed pages
		const isHome = cleanPathname === '/';
		const isContact = cleanPathname === '/contact/';
		const isTrust = cleanPathname === '/ความน่าเชื่อถือ/';
		const allowedForLocalBusiness = isHome || isContact || isTrust;
		if (typeCounts['LocalBusiness'] > 0 && !allowedForLocalBusiness) {
			issues.push({
				code: 'UNEXPECTED_LOCAL_BUSINESS',
				severity: 'warning',
				message: `LocalBusiness schema should not be injected on this page (${cleanPathname}).`
			});
		}
		
		// 3. Duplicate Organization
		if (typeCounts['Organization'] > 1) {
			issues.push({
				code: 'DUPLICATE_ORGANIZATION',
				severity: 'critical',
				message: `Duplicate Organization schemas found (${typeCounts['Organization']} times).`
			});
		}
		
		// 4. Duplicate FAQPage
		if (typeCounts['FAQPage'] > 1) {
			issues.push({
				code: 'DUPLICATE_FAQ_PAGE',
				severity: 'critical',
				message: `Duplicate FAQPage schemas found (${typeCounts['FAQPage']} times).`
			});
		}
		
		// 5. FAQPage schema without visible FAQ content
		if (typeCounts['FAQPage'] > 0) {
			const hasDetailsTag = htmlContent.includes('<details');
			const hasFaqClass = htmlContent.toLowerCase().includes('faq');
			if (!hasDetailsTag && !hasFaqClass) {
				issues.push({
					code: 'FAQ_SCHEMA_WITHOUT_VISIBLE_CONTENT',
					severity: 'warning',
					message: 'FAQPage schema is present but no visible FAQ element (details tag or faq class) was found in HTML.'
				});
			}
		}
		
		// 6. Article Schema on core service/money pages (which are not blog posts)
		const isBlog = cleanPathname.startsWith('/blog/');
		const isPost = htmlContent.includes('article-prose') || isBlog; 
		if (typeCounts['Article'] > 0 || typeCounts['BlogPosting'] > 0) {
			// Check if it's a service hub page or category page
			const isServiceHub = cleanPathname === '/รับซื้อ/' || 
				cleanPathname === '/รับซื้อโน๊ตบุ๊ค/' || 
				cleanPathname === '/รับซื้อคอม/' || 
				cleanPathname === '/รับซื้อแมคบุ๊ค/' || 
				cleanPathname === '/รับซื้อไอโฟน/' || 
				cleanPathname === '/รับซื้อไอแพด/' || 
				cleanPathname === '/รับซื้อกล้อง/';
				
			if (isServiceHub) {
				issues.push({
					code: 'ARTICLE_SCHEMA_ON_SERVICE_PAGE',
					severity: 'critical',
					message: `Article/BlogPosting schema found on core service page (${cleanPathname}). Service pages should use Service/WebPage schema.`
				});
			}
		}
		
		// 7. Check invalid / missing fields and noindex references for each schema
		for (const schema of schemas) {
			const type = schema['@type'];
			if (!type) continue;
			
			// Required fields validation
			if (['LocalBusiness', 'Organization', 'WebPage', 'Service'].includes(type)) {
				if (!schema['@id']) {
					issues.push({
						code: 'MISSING_SCHEMA_ID',
						severity: 'warning',
						message: `Missing @id for schema type: ${type}`
					});
				}
				if (!schema['name']) {
					issues.push({
						code: 'MISSING_SCHEMA_NAME',
						severity: 'warning',
						message: `Missing 'name' field for schema type: ${type}`
					});
				}
			}
			
			// Validate URLs referenced in the schema to ensure they aren't gone or noindexed
			function checkUrls(obj) {
				if (!obj) return;
				if (typeof obj === 'string') {
					if (obj.startsWith('http://') || obj.startsWith('https://') || obj.startsWith('/')) {
						const norm = normalizeUrlPath(obj);
						if (gonePaths.has(norm)) {
							issues.push({
								code: 'SCHEMA_REFERENCES_GONE_URL',
								severity: 'critical',
								message: `Schema refers to GONE URL: ${obj}`
							});
						}
						if (noindexPaths.has(norm)) {
							issues.push({
								code: 'SCHEMA_REFERENCES_NOINDEX_URL',
								severity: 'critical',
								message: `Schema refers to NOINDEX URL: ${obj}`
							});
						}
					}
				} else if (Array.isArray(obj)) {
					for (const val of obj) checkUrls(val);
				} else if (typeof obj === 'object') {
					for (const key of Object.keys(obj)) {
						checkUrls(obj[key]);
					}
				}
			}
			checkUrls(schema);
		}
		
		// 8. BreadcrumbList path check
		const breadcrumbs = schemas.filter(s => s['@type'] === 'BreadcrumbList');
		for (const bc of breadcrumbs) {
			const items = bc.itemListElement || [];
			if (items.length > 0) {
				const lastItem = items[items.length - 1];
				const lastUrl = lastItem.item;
				if (lastUrl) {
					const normLast = normalizeUrlPath(lastUrl);
					if (normLast !== cleanPathname) {
						issues.push({
							code: 'BREADCRUMB_PATH_MISMATCH',
							severity: 'warning',
							message: `BreadcrumbList last item path (${normLast}) does not match current pathname (${cleanPathname})`
						});
					}
				}
			}
		}
		
		if (issues.length > 0) {
			report.details.push({
				file: relativePath,
				pathname: cleanPathname,
				jsonLdCount: jsonLdBlocks.length,
				types: Object.keys(typeCounts),
				issues
			});
			
			for (const issue of issues) {
				if (issue.severity === 'critical') {
					report.summary.criticalErrors++;
				} else {
					report.summary.warnings++;
				}
			}
		}
	}
	
	const reportDir = path.join(ROOT_DIR, 'docs/recovery/batch-4');
	if (!fs.existsSync(reportDir)) {
		fs.mkdirSync(reportDir, { recursive: true });
	}
	
	// Determine output filename: before or after
	// Check if schema-audit-before.json already exists. If not, write as before. Otherwise write as after.
	const beforeJsonPath = path.join(reportDir, 'schema-audit-before.json');
	const outputFilename = fs.existsSync(beforeJsonPath) ? 'schema-audit-after.json' : 'schema-audit-before.json';
	const outputPath = path.join(reportDir, outputFilename);
	
	fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8');
	console.log(`\n--- Schema Audit Summary ---`);
	console.log(`Total Pages Scanned: ${report.summary.totalScanned}`);
	console.log(`Critical Errors: ${report.summary.criticalErrors}`);
	console.log(`Warnings: ${report.summary.warnings}`);
	console.log(`Report written to: ${outputPath}\n`);
}

runSchemaAudit();
