import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * High-level page role.
 *
 * ยังเป็น optional เพื่อให้ content เก่าใช้งานต่อได้
 * โดยไม่ต้องแก้ Markdown 754 ไฟล์พร้อมกัน
 */
const pageTypeSchema = z.enum([
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
]);

/**
 * Search intent หลักของหน้า
 */
const intentSchema = z.enum([
	'transactional',
	'commercial',
	'informational',
	'local',
	'navigational',
]);

/**
 * การตัดสินใจเรื่อง index
 *
 * inherit:
 * ยังใช้ behavior เดิม เช่น noindex/canonical
 *
 * Step 2 จะสร้าง engine ที่อ่าน field นี้จริง
 */
const indexDecisionSchema = z.enum([
	'inherit',
	'index',
	'noindex',
	'redirect',
	'gone',
]);

/**
 * สถานะ migration ของ legacy URL
 */
const migrationStatusSchema = z.enum([
	'unreviewed',
	'keep',
	'rebuild',
	'merge',
	'redirect',
	'remove',
]);

/**
 * บทบาทของ URL ภายใน SEO portfolio
 */
const portfolioRoleSchema = z.enum([
	'primary',
	'secondary',
	'tertiary',
	'support',
	'unassigned',
]);

/**
 * Priority ที่ได้จาก GSC / historical evidence
 *
 * ไม่ใช่ Google priority
 * ใช้สำหรับ workflow ภายในเท่านั้น
 */
const gscPrioritySchema = z.enum([
	'critical',
	'high',
	'medium',
	'low',
	'unknown',
]);

/**
 * กลุ่ม sitemap สำหรับ architecture ใหม่
 */
const sitemapGroupSchema = z.enum([
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
]);

/**
 * URL ที่ควรถูกเลือกไปแสดงใน llms.txt / AI discovery map
 *
 * ไม่ใช่ ranking directive
 */
const aiPrioritySchema = z.enum([
	'primary',
	'secondary',
	'omit',
]);

/**
 * หลักฐานจากธุรกิจจริงที่รองรับเนื้อหา
 *
 * จะนำไปใช้ใน content quality gate ภายหลัง
 */
const businessEvidenceSchema = z.object({
	type: z.enum([
		'transaction',
		'price',
		'photo',
		'review',
		'location',
		'company',
		'service-area',
		'other',
	]),
	label: z.string(),
	url: z.string().optional(),
	date: z.coerce.date().optional(),
});

const postSchema = z.object({
	/* =========================================================
	 * Existing fields
	 * ======================================================= */

	title: z.string(),
	titleHtml: z.string().optional(),
	description: z.string(),
	pubDate: z.coerce.date(),
	updatedDate: z.coerce.date().optional(),
	slug: z.string(),
	heroImage: z.string().optional(),
	heroImageAlt: z.string().optional(),
	wpPostId: z.number().optional(),

	/**
	 * Legacy index-control field.
	 *
	 * ยังเก็บไว้เพื่อ backward compatibility
	 * ห้ามลบจนกว่า migration จะเสร็จ
	 */
	noindex: z.boolean().optional(),

	/**
	 * Path on this site เช่น /รับซื้อคอม/
	 *
	 * เก็บ field เดิมไว้ก่อน
	 * Step 2 จะสร้าง canonical resolver กลาง
	 */
	canonical: z.string().optional(),

	qualityScore: z.number().optional(),
	qualityFlags: z.array(z.string()).optional(),
	quarantineReason: z.string().optional(),

	faqItems: z
		.array(
			z.object({
				question: z.string(),
				answer: z.string(),
			}),
		)
		.optional(),

	/* =========================================================
	 * SEO Architecture V1
	 * ======================================================= */

	/**
	 * หน้าที่ของหน้าใน information architecture
	 *
	 * เช่น:
	 * money
	 * model
	 * condition
	 * location
	 * guide
	 */
	pageType: pageTypeSchema.optional(),

	/**
	 * Topic cluster
	 *
	 * ตัวอย่าง:
	 * notebook
	 * computer
	 * ram
	 * gpu
	 * macbook
	 * iphone
	 * ipad
	 * camera
	 * audio
	 * gaming
	 */
	contentCluster: z.string().optional(),

	/**
	 * Search intent หลัก
	 */
	primaryIntent: intentSchema.optional(),

	/**
	 * Search intent รอง
	 */
	secondaryIntents: z.array(intentSchema).optional(),

	/* =========================================================
	 * Indexability / Migration
	 * ======================================================= */

	/**
	 * Future source of truth สำหรับ indexability
	 *
	 * Step 1 ยังไม่มี code ใช้งาน field นี้
	 */
	indexDecision: indexDecisionSchema.optional(),

	/**
	 * URL migration decision
	 */
	migrationStatus: migrationStatusSchema.optional(),

	/**
	 * ใช้เมื่อ migrationStatus = redirect หรือ merge
	 *
	 * ตัวอย่าง:
	 * /รับซื้อโน๊ตบุ๊ค/
	 */
	redirectTo: z.string().optional(),

	/* =========================================================
	 * Site Architecture / Internal Links
	 * ======================================================= */

	/**
	 * Parent hub ของหน้า
	 *
	 * ตัวอย่าง:
	 * /รับซื้อโน๊ตบุ๊ค/
	 */
	parent: z.string().optional(),

	/**
	 * หน้าเกี่ยวข้องแบบ curated
	 *
	 * ใช้แทน recentPosts แบบสุ่มในอนาคต
	 */
	relatedPages: z.array(z.string()).optional(),

	/**
	 * บทบาทของหน้านี้เมื่อเทียบกับเว็บอื่นใน portfolio
	 */
	portfolioRole: portfolioRoleSchema.optional(),

	/* =========================================================
	 * Search Evidence
	 * ======================================================= */

	/**
	 * Priority จาก historical GSC / backlink audit
	 *
	 * ตัวอย่าง:
	 * critical = URL ที่เคยสร้าง traffic/lead สูง
	 */
	gscPriority: gscPrioritySchema.optional(),

	/* =========================================================
	 * Sitemap / AI Discovery
	 * ======================================================= */

	/**
	 * Sitemap bucket
	 */
	sitemapGroup: sitemapGroupSchema.optional(),

	/**
	 * llms.txt / AI content-map priority
	 */
	aiPriority: aiPrioritySchema.optional(),

	/* =========================================================
	 * Content Freshness / Accountability
	 * ======================================================= */

	/**
	 * วันที่คนตรวจเนื้อหาครั้งล่าสุด
	 *
	 * ต่างจาก updatedDate:
	 * updatedDate = เนื้อหาถูกแก้
	 * lastReviewed = ตรวจสอบความถูกต้องล่าสุด
	 */
	lastReviewed: z.coerce.date().optional(),

	/**
	 * ผู้เขียน / ผู้ตรวจ
	 *
	 * ต้องเป็นบุคคลหรือ entity จริงเท่านั้น
	 */
	author: z.string().optional(),
	reviewer: z.string().optional(),

	/**
	 * Evidence จากธุรกิจจริง
	 */
	businessEvidence: z.array(businessEvidenceSchema).optional(),
});

const posts = defineCollection({
	loader: glob({
		pattern: '**/*.md',
		base: './src/content/posts',
	}),
	schema: postSchema,
});

const quarantine = defineCollection({
	loader: glob({
		pattern: '**/*.md',
		base: './src/content/quarantine',
	}),
	schema: postSchema,
});

export const collections = {
	posts,
	quarantine,
};