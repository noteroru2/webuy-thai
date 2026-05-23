/**
 * SEO audit for built Astro static output (dist/) or partial source scan.
 *
 * Usage:
 *   npm run build && npm run seo:audit
 *   node scripts/seo-audit.mjs --dist=dist
 *   node scripts/seo-audit.mjs --source   # frontmatter-only (limited checks)
 */
import { config as loadEnv } from 'dotenv';
import {
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

loadEnv({ path: join(root, '.env') });

const TITLE_MAX = 60;
const TITLE_HARD_MAX = 70;
const DESC_DUPLICATE_WARN = 2;
const DESC_DUPLICATE_ERROR = 5;

const args = process.argv.slice(2);
const distArg = args.find((a) => a.startsWith('--dist='))?.split('=')[1];
const useSource = args.includes('--source');
const distDir = resolve(root, distArg ?? 'dist');

function loadSiteOrigin() {
	const url =
		process.env.SITE_URL ??
		(process.env.COOLIFY_FQDN ? `https://${process.env.COOLIFY_FQDN}` : null) ??
		process.env.COOLIFY_URL ??
		'https://example.com';
	return url.replace(/\/+$/, '');
}

function loadWhitelist() {
	const path = join(__dirname, 'seo-audit-whitelist.json');
	if (!existsSync(path)) return { canonicalSitemap: [], legacyAliases: [] };
	return JSON.parse(readFileSync(path, 'utf8'));
}

/** Issue codes skipped for legacy alias pages (minimal redirect HTML). */
const LEGACY_RELAXED_ISSUE_CODES = new Set([
	'description_missing',
	'h1_missing',
	'h1_multiple',
	'jsonld_missing',
	'canonical_mismatch',
]);

function matchLegacyAlias(pagePath, whitelist) {
	for (const rule of whitelist.legacyAliases ?? []) {
		if (new RegExp(rule.pathPattern).test(pagePath)) return rule;
	}
	return null;
}

function isLegacyAlias(pagePath, whitelist) {
	return matchLegacyAlias(pagePath, whitelist) !== null;
}

function hasFileExtension(segment) {
	return /\.[a-z0-9]{2,12}$/i.test(segment);
}

function normalizePathname(input) {
	if (!input) return '/';
	let p = String(input).trim();
	try {
		if (/^https?:\/\//i.test(p)) {
			p = new URL(p).pathname;
		}
	} catch {
		return null;
	}
	if (!p.startsWith('/')) p = `/${p}`;
	p = p.replace(/\/+/g, '/');
	const lastSeg = p.replace(/\/$/, '').split('/').pop() ?? '';
	const isFile = hasFileExtension(lastSeg);
	if (isFile && p.endsWith('/')) p = p.slice(0, -1);
	if (!isFile && p.length > 1 && !p.endsWith('/')) p = `${p}/`;
	return decodeURIComponent(p);
}

function filePathToUrlPath(filePath, distRoot) {
	const rel = relative(distRoot, dirname(filePath)).replace(/\\/g, '/');
	if (!rel || rel === '.') return '/';
	return normalizePathname(`/${rel}/`);
}

function walkIndexHtml(distRoot) {
	const pages = [];
	function walk(dir) {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			if (entry.name.startsWith('.') || entry.name === '_astro') continue;
			const full = join(dir, entry.name);
			if (entry.isDirectory()) walk(full);
			else if (entry.name === 'index.html') pages.push(full);
		}
	}
	walk(distRoot);
	return pages;
}

function stripTags(html) {
	return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function decodeEntities(s) {
	return s
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'");
}

function firstMatch(html, regex) {
	const m = html.match(regex);
	return m ? decodeEntities(m[1].trim()) : null;
}

function allMatches(html, regex) {
	const out = [];
	let m;
	const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : `${regex.flags}g`);
	while ((m = re.exec(html)) !== null) out.push(m);
	return out;
}

function parseJsonLd(html) {
	const blocks = allMatches(html, /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
	const results = [];
	for (const [, raw] of blocks) {
		const text = raw.trim();
		if (!text) continue;
		try {
			JSON.parse(text);
			results.push({ ok: true });
		} catch (err) {
			results.push({ ok: false, error: err.message });
		}
	}
	return results;
}

function parseImages(html) {
	const tags = allMatches(html, /<img\b[^>]*>/gi);
	const important = [];
	const allMissingAlt = [];

	for (const [tag] of tags) {
		const altMatch = /\balt=["']([^"']*)["']/i.exec(tag);
		const alt = altMatch ? altMatch[1].trim() : null;
		const isImportant =
			/\bclass=["'][^"']*hero/i.test(tag) ||
			/\bfetchpriority=["']high["']/i.test(tag) ||
			/\bloading=["']eager["']/i.test(tag) ||
			/class=["'][^"']*hero-img/i.test(tag);

		if (alt === null || alt === '') {
			allMissingAlt.push(tag.slice(0, 120));
			if (isImportant) important.push(tag.slice(0, 120));
		}
	}
	return { important, allMissingAlt };
}

function parseInternalLinks(html) {
	const hrefs = [];
	const re = /<a\b[^>]*\bhref=["']([^"']*)["']/gi;
	let m;
	while ((m = re.exec(html)) !== null) {
		let href = m[1].trim();
		if (
			!href ||
			href.startsWith('#') ||
			href.startsWith('http://') ||
			href.startsWith('https://') ||
			href.startsWith('mailto:') ||
			href.startsWith('tel:') ||
			href.startsWith('javascript:') ||
			href.startsWith('line:')
		) {
			continue;
		}
		href = href.split('#')[0].split('?')[0];
		if (!href || href === '/') {
			hrefs.push('/');
			continue;
		}
		if (href.startsWith('/')) hrefs.push(normalizePathname(href));
	}
	return [...new Set(hrefs)];
}

function buildLinkTargets(distRoot, pages) {
	const targets = new Set();
	for (const p of pages) {
		targets.add(p.path);
		if (p.path.endsWith('/') && p.path !== '/') targets.add(p.path.slice(0, -1));
	}
	try {
		for (const entry of readdirSync(distRoot, { withFileTypes: true })) {
			if (!entry.isFile()) continue;
			targets.add(`/${entry.name}`);
		}
	} catch {
		/* ignore */
	}
	return targets;
}

function linkExists(href, targets, distRoot) {
	const norm = normalizePathname(href);
	if (!norm) return false;
	if (targets.has(norm)) return true;
	const rel = norm.replace(/^\//, '').replace(/\/$/, '');
	if (!rel) return true;
	const asFile = join(distRoot, rel);
	const asIndex = join(distRoot, rel, 'index.html');
	return existsSync(asFile) || existsSync(asIndex);
}

function matchCanonicalSitemapRule(pagePath, canonicalPath, whitelist, { requireSitemapExclusion = false } = {}) {
	for (const rule of whitelist.canonicalSitemap ?? []) {
		if (requireSitemapExclusion && !rule.excludeFromSitemap) continue;
		const pattern = new RegExp(rule.pathPattern);
		if (pattern.test(pagePath) && canonicalPath === normalizePathname(rule.canonicalPath)) {
			return rule;
		}
	}
	return null;
}

function isWhitelistedCanonical(pagePath, canonicalPath, whitelist) {
	return matchCanonicalSitemapRule(pagePath, canonicalPath, whitelist) !== null;
}

function isWhitelistedSitemapExclusion(pagePath, canonicalPath, whitelist) {
	return matchCanonicalSitemapRule(pagePath, canonicalPath, whitelist, {
		requireSitemapExclusion: true,
	}) !== null;
}

function addIssue(pageIssues, code, severity, message, extra = {}) {
	pageIssues.push({ code, severity, message, ...extra });
}

function auditHtmlPage(filePath, distRoot, siteOrigin, whitelist) {
	const html = readFileSync(filePath, 'utf8');
	const pagePath = filePathToUrlPath(filePath, distRoot);
	const pageUrl = `${siteOrigin}${pagePath === '/' ? '' : pagePath}`;
	const issues = [];

	const title = firstMatch(html, /<title[^>]*>([^<]*)<\/title>/i);
	const description = firstMatch(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
	const canonical = firstMatch(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
	const robots = firstMatch(html, /<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i);
	const metaRefresh = /<meta\s+http-equiv=["']refresh["'][^>]*content=["'][^"']*url=/i.test(html);
	const isNoindex = robots?.toLowerCase().includes('noindex') ?? false;
	const canonicalPath = canonical ? normalizePathname(canonical) : null;
	const expectedSelf = normalizePathname(pageUrl);
	const legacyAlias =
		isLegacyAlias(pagePath, whitelist) ||
		Boolean(metaRefresh && isNoindex && canonicalPath && canonicalPath !== expectedSelf);

	const h1Tags = allMatches(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi);
	const h1Texts = h1Tags.map(([, inner]) => stripTags(inner)).filter(Boolean);

	const jsonLd = parseJsonLd(html);
	const { important: imgsNoAlt } = parseImages(html);
	const internalLinks = parseInternalLinks(html);

	// Title
	if (!title) {
		addIssue(issues, 'title_missing', 'error', 'Missing <title>');
	} else if (title.length > TITLE_HARD_MAX) {
		addIssue(issues, 'title_too_long', 'error', `Title ${title.length} chars (max ~${TITLE_HARD_MAX})`, {
			value: title.length,
		});
	} else if (title.length > TITLE_MAX) {
		addIssue(issues, 'title_long', 'warn', `Title ${title.length} chars (recommended ≤${TITLE_MAX})`, {
			value: title.length,
		});
	}

	// Description
	if (!legacyAlias && !description) {
		addIssue(issues, 'description_missing', 'error', 'Missing meta description');
	} else if (description && description.length > 160) {
		addIssue(issues, 'description_long', 'warn', `Description ${description.length} chars (recommended ≤160)`, {
			value: description.length,
		});
	}

	// Canonical
	if (!canonical) {
		addIssue(issues, 'canonical_missing', 'error', 'Missing canonical link');
	} else {
		if (!canonicalPath) {
			addIssue(issues, 'canonical_invalid', 'error', `Invalid canonical URL: ${canonical}`);
		} else {
			const whitelisted = isWhitelistedCanonical(pagePath, canonicalPath, whitelist);
			if (!legacyAlias && canonicalPath !== expectedSelf && !whitelisted) {
				addIssue(
					issues,
					'canonical_mismatch',
					'warn',
					`Canonical points to ${canonicalPath}, page is ${pagePath}`,
					{ canonical: canonicalPath, page: pagePath },
				);
			}
			if (!canonical.startsWith(siteOrigin)) {
				addIssue(issues, 'canonical_host', 'error', 'Canonical host does not match SITE_URL');
			}
		}
	}

	// H1
	if (!legacyAlias) {
		if (h1Texts.length === 0) {
			addIssue(issues, 'h1_missing', 'error', 'No H1 found');
		} else if (h1Texts.length > 1) {
			addIssue(issues, 'h1_multiple', 'error', `${h1Texts.length} H1 tags found`, { count: h1Texts.length });
		}
	}

	// JSON-LD
	if (!legacyAlias && jsonLd.length === 0) {
		addIssue(issues, 'jsonld_missing', 'warn', 'No JSON-LD blocks found');
	}
	for (const block of jsonLd) {
		if (!block.ok) {
			addIssue(issues, 'jsonld_invalid', 'error', `Invalid JSON-LD: ${block.error}`);
		}
	}

	// Images
	for (const _ of imgsNoAlt) {
		addIssue(issues, 'img_alt_missing', 'warn', 'Important image missing alt text');
	}

	return {
		file: relative(root, filePath).replace(/\\/g, '/'),
		path: pagePath,
		url: pageUrl,
		title,
		description,
		canonical: canonical ? normalizePathname(canonical) : null,
		isNoindex,
		isLegacyAlias: legacyAlias,
		h1Count: h1Texts.length,
		jsonLdCount: jsonLd.length,
		internalLinks,
		issues,
	};
}

function loadSitemapUrls(distRoot) {
	const urls = new Set();
	const files = readdirSync(distRoot).filter((f) => /^sitemap-\d+\.xml$/i.test(f));
	for (const file of files) {
		const xml = readFileSync(join(distRoot, file), 'utf8');
		if (!/<urlset\b/i.test(xml)) continue;
		for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/gi)) {
			try {
				urls.add(normalizePathname(new URL(m[1].trim()).pathname));
			} catch {
				/* ignore */
			}
		}
	}
	return urls;
}

function loadNoindexSlugsFromSource() {
	const postsDir = join(root, 'src', 'content', 'posts');
	const slugs = new Set();
	if (!existsSync(postsDir)) return slugs;
	for (const file of readdirSync(postsDir).filter((f) => f.endsWith('.md'))) {
		const raw = readFileSync(join(postsDir, file), 'utf8');
		if (!/^noindex:\s*true\s*$/m.test(raw)) continue;
		const m = raw.match(/^slug:\s*"?([^"\n]+)"?\s*$/m);
		if (m) slugs.add(m[1].trim());
	}
	return slugs;
}

function auditSourcePosts(siteOrigin) {
	const postsDir = join(root, 'src', 'content', 'posts');
	const pages = [];
	if (!existsSync(postsDir)) return pages;

	for (const file of readdirSync(postsDir).filter((f) => f.endsWith('.md'))) {
		const raw = readFileSync(join(postsDir, file), 'utf8');
		const slug = raw.match(/^slug:\s*"?([^"\n]+)"?\s*$/m)?.[1]?.trim();
		if (!slug) continue;
		const title = raw.match(/^title:\s*"?([^"\n]+)"?\s*$/m)?.[1]?.trim() ?? '';
		const description = raw.match(/^description:\s*"?([^"\n]+)"?\s*$/m)?.[1]?.trim() ?? '';
		const noindex = /^noindex:\s*true\s*$/m.test(raw);
		const canonicalRaw = raw.match(/^canonical:\s*"?([^"\n]+)"?\s*$/m)?.[1]?.trim();
		const path = normalizePathname(`/${slug}/`);
		const issues = [];
		if (!title) addIssue(issues, 'title_missing', 'error', 'Missing title in frontmatter');
		if (!description) addIssue(issues, 'description_missing', 'error', 'Missing description in frontmatter');
		if (canonicalRaw) {
			const cp = normalizePathname(canonicalRaw);
			if (cp !== path && !isWhitelistedCanonical(path, cp, loadWhitelist())) {
				addIssue(issues, 'canonical_mismatch', 'warn', `canonical ${cp} vs path ${path}`);
			}
		}
		pages.push({
			file: `src/content/posts/${file}`,
			path,
			url: `${siteOrigin}${path === '/' ? '' : path}`,
			title,
			description,
			canonical: canonicalRaw ? normalizePathname(canonicalRaw) : null,
			isNoindex: noindex,
			h1Count: null,
			jsonLdCount: null,
			internalLinks: [],
			issues,
			sourceOnly: true,
		});
	}
	return pages;
}

function buildDescriptionIndex(pages) {
	const map = new Map();
	for (const p of pages) {
		if (!p.description) continue;
		const key = p.description.trim();
		if (!map.has(key)) map.set(key, []);
		map.get(key).push(p.path);
	}
	return map;
}

function applyDuplicateDescriptions(pages, descIndex) {
	for (const [desc, paths] of descIndex) {
		if (paths.length < DESC_DUPLICATE_WARN) continue;
		const severity = paths.length >= DESC_DUPLICATE_ERROR ? 'error' : 'warn';
		const code = paths.length >= DESC_DUPLICATE_ERROR ? 'description_duplicate_high' : 'description_duplicate';
		for (const p of pages) {
			if (p.isLegacyAlias) continue;
			if (p.description?.trim() === desc) {
				addIssue(
					p.issues,
					code,
					severity,
					`Description duplicated on ${paths.length} pages`,
					{ paths },
				);
			}
		}
	}
}

function auditSitemapAndLinks(pages, sitemapUrls, siteOrigin, whitelist, distRoot) {
	const linkTargets = distRoot ? buildLinkTargets(distRoot, pages) : new Set(pages.map((p) => p.path));
	const pathSet = new Set(pages.map((p) => p.path));
	const global = [];

	for (const p of pages) {
		if (p.isNoindex && sitemapUrls.has(p.path)) {
			addIssue(p.issues, 'noindex_in_sitemap', 'error', 'Noindex page appears in sitemap', { path: p.path });
		}
		if (!p.isNoindex && !sitemapUrls.has(p.path) && !p.sourceOnly) {
			const canonicalPath = p.canonical ?? p.path;
			const isSelfCanonical = canonicalPath === p.path;
			const sitemapWhitelisted = isWhitelistedSitemapExclusion(p.path, canonicalPath, whitelist);

			if (sitemapWhitelisted && !isSelfCanonical) {
				addIssue(
					p.issues,
					'sitemap_canonical_whitelisted',
					'info',
					`Intentionally omitted from sitemap (canonical ${canonicalPath})`,
					{ path: p.path, canonical: canonicalPath },
				);
			} else {
				const severity = isSelfCanonical ? 'error' : 'warn';
				addIssue(
					p.issues,
					'missing_from_sitemap',
					severity,
					isSelfCanonical
						? 'Self-canonical indexable page missing from sitemap'
						: 'Indexable page missing from sitemap',
					{ path: p.path, canonical: canonicalPath },
				);
			}
		}

		const canonicalPath = p.canonical ?? p.path;
		if (
			sitemapUrls.has(p.path) &&
			canonicalPath &&
			canonicalPath !== p.path &&
			!isWhitelistedCanonical(p.path, canonicalPath, whitelist)
		) {
			addIssue(
				p.issues,
				'sitemap_canonical_mismatch',
				'error',
				`In sitemap but canonical is ${canonicalPath}`,
				{ path: p.path, canonical: canonicalPath },
			);
			global.push({
				code: 'sitemap_canonical_mismatch',
				severity: 'error',
				message: `${p.path} in sitemap, canonical ${canonicalPath}`,
				path: p.path,
			});
		}

		for (const link of p.internalLinks ?? []) {
			if (!linkExists(link, linkTargets, distRoot ?? '')) {
				addIssue(p.issues, 'broken_internal_link', 'error', `Broken internal link: ${link}`, {
					href: link,
				});
			}
		}
	}

	for (const sitemapPath of sitemapUrls) {
		if (!pathSet.has(sitemapPath)) {
			global.push({
				code: 'sitemap_orphan_url',
				severity: 'warn',
				message: `Sitemap URL not found in built HTML: ${sitemapPath}`,
				path: sitemapPath,
			});
		}
	}

	return global;
}

function auditLegacyAliasCompliance(pages, sitemapUrls, whitelist) {
	for (const p of pages) {
		if (!p.isLegacyAlias && !isLegacyAlias(p.path, whitelist)) continue;
		p.isLegacyAlias = true;

		// Drop relaxed issues if any slipped through (e.g. source mode).
		p.issues = p.issues.filter((i) => !LEGACY_RELAXED_ISSUE_CODES.has(i.code));

		if (!p.isNoindex) {
			addIssue(
				p.issues,
				'legacy_alias_missing_noindex',
				'error',
				'Legacy alias page must have noindex',
				{ path: p.path },
			);
			continue;
		}

		if (sitemapUrls.has(p.path)) {
			addIssue(
				p.issues,
				'legacy_alias_in_sitemap',
				'error',
				'Legacy alias page must not appear in sitemap',
				{ path: p.path },
			);
			continue;
		}

		addIssue(
			p.issues,
			'legacy_alias_checked',
			'info',
			'Legacy alias: noindex, not in sitemap, cross-canonical allowed',
			{ path: p.path, canonical: p.canonical },
		);
	}
}

function isActionableIssue(issue) {
	return issue.severity === 'error' || issue.severity === 'warn';
}

function summarize(pages, globalIssues) {
	const allIssues = [...globalIssues];
	for (const p of pages) allIssues.push(...p.issues.map((i) => ({ ...i, path: p.path })));

	const errors = allIssues.filter((i) => i.severity === 'error').length;
	const warnings = allIssues.filter((i) => i.severity === 'warn').length;
	const info = allIssues.filter((i) => i.severity === 'info').length;
	const whitelisted = allIssues.filter(
		(i) => i.severity === 'info' && i.code === 'sitemap_canonical_whitelisted',
	).length;
	const legacyInfo = allIssues.filter(
		(i) => i.severity === 'info' && i.code === 'legacy_alias_checked',
	).length;
	const pagesWithErrors = pages.filter((p) => p.issues.some((i) => i.severity === 'error')).length;
	const pagesWithWarnings = pages.filter((p) => p.issues.some((i) => i.severity === 'warn')).length;
	const pagesWithInfo = pages.filter((p) => p.issues.some((i) => i.severity === 'info')).length;

	return {
		pagesScanned: pages.length,
		pagesWithErrors,
		pagesWithWarnings,
		pagesWithInfo,
		pagesClean: pages.filter((p) => !p.issues.some(isActionableIssue)).length,
		totalErrors: errors,
		totalWarnings: warnings,
		totalInfo: info,
		totalWhitelisted: whitelisted,
		totalLegacyInfo: legacyInfo,
	};
}

function printReport(summary, pages, globalIssues) {
	console.log('\n=== SEO Audit Summary ===\n');
	console.table([
		{
			Metric: 'Pages scanned',
			Value: summary.pagesScanned,
		},
		{
			Metric: 'Pages with errors',
			Value: summary.pagesWithErrors,
		},
		{
			Metric: 'Pages with warnings',
			Value: summary.pagesWithWarnings,
		},
		{
			Metric: 'Clean pages',
			Value: summary.pagesClean,
		},
		{
			Metric: 'Total errors',
			Value: summary.totalErrors,
		},
		{
			Metric: 'Total warnings',
			Value: summary.totalWarnings,
		},
		{
			Metric: 'Sitemap whitelisted (info)',
			Value: summary.totalWhitelisted,
		},
		{
			Metric: 'Legacy alias (info)',
			Value: summary.totalLegacyInfo,
		},
		{
			Metric: 'Total info (all)',
			Value: summary.totalInfo,
		},
	]);

	const issueCounts = {};
	for (const p of pages) {
		for (const i of p.issues) {
			issueCounts[i.code] = (issueCounts[i.code] ?? 0) + 1;
		}
	}
	for (const g of globalIssues) {
		issueCounts[g.code] = (issueCounts[g.code] ?? 0) + 1;
	}

	if (Object.keys(issueCounts).length) {
		console.log('\n=== Issues by type ===\n');
		console.table(
			Object.entries(issueCounts)
				.sort((a, b) => b[1] - a[1])
				.map(([code, count]) => ({ code, count })),
		);
	}

	const top = pages
		.filter((p) => p.issues.some(isActionableIssue))
		.sort((a, b) => b.issues.filter(isActionableIssue).length - a.issues.filter(isActionableIssue).length)
		.slice(0, 15)
		.map((p) => ({
			path: p.path,
			errors: p.issues.filter((i) => i.severity === 'error').length,
			warnings: p.issues.filter((i) => i.severity === 'warn').length,
			top: p.issues[0]?.code ?? '-',
		}));

	if (top.length) {
		console.log('\n=== Pages needing attention (top 15) ===\n');
		console.table(top);
	}
}

function main() {
	const siteOrigin = loadSiteOrigin();
	const whitelist = loadWhitelist();
	let pages = [];
	let mode = 'dist';

	if (useSource) {
		mode = 'source';
		pages = auditSourcePosts(siteOrigin);
		console.warn('Running in --source mode (frontmatter only). H1, images, JSON-LD, and link checks are limited.');
	} else {
		if (!existsSync(distDir)) {
			console.error(`\nSEO audit requires build output at "${distDir}".\nRun: npm run build\nOr: node scripts/seo-audit.mjs --source\n`);
			process.exit(1);
		}
		const htmlFiles = walkIndexHtml(distDir);
		for (const file of htmlFiles) {
			pages.push(auditHtmlPage(file, distDir, siteOrigin, whitelist));
		}
	}

	const descIndex = buildDescriptionIndex(pages);
	applyDuplicateDescriptions(pages, descIndex);

	const sitemapUrls = mode === 'dist' ? loadSitemapUrls(distDir) : new Set();
	const globalIssues = auditSitemapAndLinks(
		pages,
		sitemapUrls,
		siteOrigin,
		whitelist,
		mode === 'dist' ? distDir : null,
	);

	if (mode === 'dist') {
		auditLegacyAliasCompliance(pages, sitemapUrls, whitelist);
	}

	const summary = summarize(pages, globalIssues);

	const report = {
		generatedAt: new Date().toISOString(),
		mode,
		siteOrigin,
		summary,
		globalIssues,
		pages: pages.map((p) => ({
			path: p.path,
			url: p.url,
			title: p.title,
			titleLength: p.title?.length ?? 0,
			description: p.description,
			descriptionLength: p.description?.length ?? 0,
			canonical: p.canonical,
			isNoindex: p.isNoindex,
			isLegacyAlias: p.isLegacyAlias ?? false,
			h1Count: p.h1Count,
			jsonLdCount: p.jsonLdCount,
			issues: p.issues,
		})),
	};

	const reportsDir = join(root, 'reports');
	mkdirSync(reportsDir, { recursive: true });
	const outPath = join(reportsDir, 'seo-audit.json');
	writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');

	printReport(summary, pages, globalIssues);

	console.log(`\nReport written to ${relative(root, outPath).replace(/\\/g, '/')}\n`);

	const exitCode = summary.totalErrors > 0 ? 1 : 0;
	process.exit(exitCode);
}

main();
