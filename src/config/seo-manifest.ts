/**
 * Central SEO route manifest
 *
 * จุดประสงค์:
 * - เป็น source of truth สำหรับ static/core routes
 * - เก็บบทบาทของ URL ภายใน architecture ใหม่
 * - ใช้ร่วมกับ indexability, sitemap, internal links และ llms.txt ในอนาคต
 *
 * หมายเหตุ:
 * - Content collection pages ยังสามารถ override metadata ผ่าน frontmatter ได้
 * - Step 2 ยังไม่เปลี่ยน runtime SEO behavior
 */

export const PAGE_TYPES = [
	'money',
	'hub',
	'brand',
	'series',
	'model',
	'condition',
	'location',
	'guide',
	'case-study',
	'article',
	'trust',
	'about',
	'contact',
	'legacy',
] as const;

export type SeoPageType = (typeof PAGE_TYPES)[number];

export const SEARCH_INTENTS = [
	'transactional',
	'commercial',
	'informational',
	'local',
	'navigational',
] as const;

export type SearchIntent = (typeof SEARCH_INTENTS)[number];

export const INDEX_DECISIONS = [
	'inherit',
	'index',
	'noindex',
	'redirect',
	'gone',
] as const;

export type IndexDecision = (typeof INDEX_DECISIONS)[number];

export const MIGRATION_STATUSES = [
	'unreviewed',
	'keep',
	'rebuild',
	'merge',
	'redirect',
	'remove',
] as const;

export type MigrationStatus = (typeof MIGRATION_STATUSES)[number];

export const PORTFOLIO_ROLES = [
	'primary',
	'secondary',
	'tertiary',
	'support',
	'unassigned',
] as const;

export type PortfolioRole = (typeof PORTFOLIO_ROLES)[number];

export const GSC_PRIORITIES = [
	'critical',
	'high',
	'medium',
	'low',
	'unknown',
] as const;

export type GscPriority = (typeof GSC_PRIORITIES)[number];

export const SITEMAP_GROUPS = [
	'core',
	'services',
	'brands',
	'series',
	'models',
	'conditions',
	'locations',
	'guides',
	'cases',
	'articles',
	'other',
] as const;

export type SitemapGroup = (typeof SITEMAP_GROUPS)[number];

export const AI_PRIORITIES = [
	'primary',
	'secondary',
	'omit',
] as const;

export type AiPriority = (typeof AI_PRIORITIES)[number];

export interface SeoManifestEntry {
	path: string;

	pageType: SeoPageType;
	contentCluster?: string;

	primaryIntent: SearchIntent;
	secondaryIntents?: SearchIntent[];

	indexDecision: IndexDecision;
	migrationStatus: MigrationStatus;

	redirectTo?: string;

	parent?: string;
	relatedPages?: string[];

	portfolioRole: PortfolioRole;
	gscPriority: GscPriority;

	sitemapGroup: SitemapGroup;
	aiPriority: AiPriority;

	notes?: string;
}

/**
 * Normalize paths so the whole SEO system uses one URL format.
 *
 * Examples:
 * "รับซื้อคอม"      -> "/รับซื้อคอม/"
 * "/รับซื้อคอม"     -> "/รับซื้อคอม/"
 * "/รับซื้อคอม/"    -> "/รับซื้อคอม/"
 * "/"               -> "/"
 */
export function normalizeSeoPath(input: string): string {
	const raw = input.trim();

	if (!raw || raw === '/') {
		return '/';
	}

	const withoutQuery = raw.split(/[?#]/, 1)[0] ?? raw;
	const withLeadingSlash = withoutQuery.startsWith('/')
		? withoutQuery
		: `/${withoutQuery}`;

	return withLeadingSlash.endsWith('/')
		? withLeadingSlash
		: `${withLeadingSlash}/`;
}

function defineManifestEntry(
	entry: Omit<SeoManifestEntry, 'path'> & { path: string },
): SeoManifestEntry {
	return {
		...entry,
		path: normalizeSeoPath(entry.path),
		redirectTo: entry.redirectTo
			? normalizeSeoPath(entry.redirectTo)
			: undefined,
		parent: entry.parent
			? normalizeSeoPath(entry.parent)
			: undefined,
		relatedPages: entry.relatedPages?.map(normalizeSeoPath),
	};
}

/**
 * Core architecture ของเรารับซื้อ.com
 *
 * ตอนนี้ใส่เฉพาะหน้า static/core ที่เรารู้ชัดเจน
 * Legacy/content URLs หลายร้อยหน้าจะเพิ่มหลังทำ GSC decision map
 */
const CORE_MANIFEST_ENTRIES: SeoManifestEntry[] = [
	defineManifestEntry({
		path: '/',
		pageType: 'hub',
		contentCluster: 'general-buyback',
		primaryIntent: 'commercial',
		secondaryIntents: ['transactional'],
		indexDecision: 'index',
		migrationStatus: 'rebuild',
		portfolioRole: 'primary',
		gscPriority: 'critical',
		sitemapGroup: 'core',
		aiPriority: 'primary',
		relatedPages: [
			'/รับซื้อ/',
			'/เช็กราคาก่อนขาย/',
			'/ราคากลางรับซื้อ/',
		],
		notes: 'Homepage — General Buyback Authority #3',
	}),

	defineManifestEntry({
		path: '/รับซื้อ/',
		pageType: 'hub',
		contentCluster: 'general-buyback',
		primaryIntent: 'transactional',
		indexDecision: 'index',
		migrationStatus: 'rebuild',
		parent: '/',
		portfolioRole: 'primary',
		gscPriority: 'critical',
		sitemapGroup: 'services',
		aiPriority: 'primary',
		relatedPages: [
			'/รับซื้อโน๊ตบุ๊ค/',
			'/รับซื้อคอม/',
			'/รับซื้อแมคบุ๊ค/',
			'/รับซื้อไอโฟน/',
			'/รับซื้อไอแพด/',
			'/รับซื้อกล้อง/',
		],
	}),

	defineManifestEntry({
		path: '/รับซื้อโน๊ตบุ๊ค/',
		pageType: 'money',
		contentCluster: 'notebook',
		primaryIntent: 'transactional',
		indexDecision: 'index',
		migrationStatus: 'rebuild',
		parent: '/รับซื้อ/',
		portfolioRole: 'tertiary',
		gscPriority: 'critical',
		sitemapGroup: 'services',
		aiPriority: 'primary',
		relatedPages: [
			'/รับซื้อคอม/',
			'/เช็กราคาก่อนขาย/',
			'/คู่มือก่อนขาย/',
		],
		notes:
			'Notebook vertical site is portfolio primary; this domain remains a challenger.',
	}),

	defineManifestEntry({
		path: '/รับซื้อคอม/',
		pageType: 'money',
		contentCluster: 'computer',
		primaryIntent: 'transactional',
		indexDecision: 'index',
		migrationStatus: 'rebuild',
		parent: '/รับซื้อ/',
		portfolioRole: 'tertiary',
		gscPriority: 'critical',
		sitemapGroup: 'services',
		aiPriority: 'primary',
		relatedPages: [
			'/รับซื้อโน๊ตบุ๊ค/',
			'/รับซื้อ-server/',
			'/รับซื้อ/',
		],
	}),

	defineManifestEntry({
		path: '/รับซื้อแมคบุ๊ค/',
		pageType: 'money',
		contentCluster: 'macbook',
		primaryIntent: 'transactional',
		indexDecision: 'index',
		migrationStatus: 'rebuild',
		parent: '/รับซื้อ/',
		portfolioRole: 'tertiary',
		gscPriority: 'high',
		sitemapGroup: 'services',
		aiPriority: 'primary',
		relatedPages: [
			'/รับซื้อไอแพด/',
			'/รับซื้อไอโฟน/',
			'/เช็กราคาก่อนขาย/',
		],
	}),

	defineManifestEntry({
		path: '/รับซื้อไอโฟน/',
		pageType: 'money',
		contentCluster: 'iphone',
		primaryIntent: 'transactional',
		indexDecision: 'index',
		migrationStatus: 'rebuild',
		parent: '/รับซื้อ/',
		portfolioRole: 'tertiary',
		gscPriority: 'high',
		sitemapGroup: 'services',
		aiPriority: 'primary',
		relatedPages: [
			'/รับซื้อไอแพด/',
			'/รับซื้อแมคบุ๊ค/',
			'/วิธีล้างข้อมูล-iphone-ก่อนขาย/',
		],
		notes:
			'iPhone vertical site is portfolio primary; this domain remains a challenger.',
	}),

	defineManifestEntry({
		path: '/รับซื้อไอแพด/',
		pageType: 'money',
		contentCluster: 'ipad',
		primaryIntent: 'transactional',
		indexDecision: 'index',
		migrationStatus: 'rebuild',
		parent: '/รับซื้อ/',
		portfolioRole: 'tertiary',
		gscPriority: 'high',
		sitemapGroup: 'services',
		aiPriority: 'primary',
		relatedPages: [
			'/รับซื้อไอโฟน/',
			'/รับซื้อแมคบุ๊ค/',
			'/เช็กราคาก่อนขาย/',
		],
	}),

	defineManifestEntry({
		path: '/รับซื้อกล้อง/',
		pageType: 'money',
		contentCluster: 'camera',
		primaryIntent: 'transactional',
		indexDecision: 'index',
		migrationStatus: 'rebuild',
		parent: '/รับซื้อ/',
		portfolioRole: 'tertiary',
		gscPriority: 'high',
		sitemapGroup: 'services',
		aiPriority: 'secondary',
		notes:
			'Camera vertical domain is portfolio primary; keep this page as general-site challenger.',
	}),

	defineManifestEntry({
		path: '/รับซื้อลำโพง/',
		pageType: 'money',
		contentCluster: 'audio',
		primaryIntent: 'transactional',
		indexDecision: 'index',
		migrationStatus: 'rebuild',
		parent: '/รับซื้อ/',
		portfolioRole: 'secondary',
		gscPriority: 'medium',
		sitemapGroup: 'services',
		aiPriority: 'secondary',
	}),

	defineManifestEntry({
		path: '/รับซื้อ-server/',
		pageType: 'money',
		contentCluster: 'server',
		primaryIntent: 'transactional',
		secondaryIntents: ['commercial'],
		indexDecision: 'index',
		migrationStatus: 'rebuild',
		parent: '/รับซื้อ/',
		portfolioRole: 'secondary',
		gscPriority: 'medium',
		sitemapGroup: 'services',
		aiPriority: 'secondary',
	}),

	defineManifestEntry({
		path: '/เช็กราคาก่อนขาย/',
		pageType: 'hub',
		contentCluster: 'valuation',
		primaryIntent: 'commercial',
		secondaryIntents: ['informational'],
		indexDecision: 'index',
		migrationStatus: 'rebuild',
		parent: '/',
		portfolioRole: 'primary',
		gscPriority: 'high',
		sitemapGroup: 'core',
		aiPriority: 'primary',
		relatedPages: [
			'/ราคากลางรับซื้อ/',
			'/คู่มือก่อนขาย/',
			'/รับซื้อ/',
		],
	}),

	defineManifestEntry({
		path: '/ราคากลางรับซื้อ/',
		pageType: 'hub',
		contentCluster: 'valuation',
		primaryIntent: 'commercial',
		secondaryIntents: ['informational'],
		indexDecision: 'index',
		migrationStatus: 'rebuild',
		parent: '/',
		portfolioRole: 'primary',
		gscPriority: 'high',
		sitemapGroup: 'core',
		aiPriority: 'primary',
		relatedPages: [
			'/เช็กราคาก่อนขาย/',
			'/คู่มือก่อนขาย/',
		],
	}),

	defineManifestEntry({
		path: '/คู่มือก่อนขาย/',
		pageType: 'hub',
		contentCluster: 'before-selling',
		primaryIntent: 'informational',
		indexDecision: 'index',
		migrationStatus: 'rebuild',
		parent: '/',
		portfolioRole: 'primary',
		gscPriority: 'medium',
		sitemapGroup: 'guides',
		aiPriority: 'primary',
	}),

	defineManifestEntry({
		path: '/ความน่าเชื่อถือ/',
		pageType: 'trust',
		contentCluster: 'business-trust',
		primaryIntent: 'navigational',
		secondaryIntents: ['commercial'],
		indexDecision: 'index',
		migrationStatus: 'rebuild',
		parent: '/',
		portfolioRole: 'support',
		gscPriority: 'medium',
		sitemapGroup: 'core',
		aiPriority: 'primary',
	}),

	defineManifestEntry({
		path: '/เกี่ยวกับเรา/',
		pageType: 'about',
		contentCluster: 'business-entity',
		primaryIntent: 'navigational',
		indexDecision: 'index',
		migrationStatus: 'rebuild',
		parent: '/',
		portfolioRole: 'support',
		gscPriority: 'medium',
		sitemapGroup: 'core',
		aiPriority: 'primary',
	}),

	defineManifestEntry({
		path: '/contact/',
		pageType: 'contact',
		contentCluster: 'business-entity',
		primaryIntent: 'navigational',
		indexDecision: 'index',
		migrationStatus: 'keep',
		parent: '/',
		portfolioRole: 'support',
		gscPriority: 'medium',
		sitemapGroup: 'core',
		aiPriority: 'primary',
	}),
];

export const SEO_MANIFEST = new Map<string, SeoManifestEntry>(
	CORE_MANIFEST_ENTRIES.map((entry) => [entry.path, entry]),
);

export function getSeoManifestEntry(
	path: string,
): SeoManifestEntry | undefined {
	return SEO_MANIFEST.get(normalizeSeoPath(path));
}

export function hasSeoManifestEntry(path: string): boolean {
	return SEO_MANIFEST.has(normalizeSeoPath(path));
}