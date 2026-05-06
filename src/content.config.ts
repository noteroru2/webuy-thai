import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
	schema: z.object({
		title: z.string(),
		titleHtml: z.string().optional(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		/** URL path segment — ต้องตรงกับ slug เดิมบน WordPress เพื่อ SEO */
		slug: z.string(),
		heroImage: z.string().optional(),
		heroImageAlt: z.string().optional(),
		wpPostId: z.number().optional(),
		/** บทความที่ไม่ตรงแกนแบรนด์หลัก เช่นโปรโมตร้านบุคคลที่สาม — ไม่ให้ index แต่ยังเข้าถึงทาง URL ได้ */
		noindex: z.boolean().optional(),
		/** คำถาม-คำตอบสำหรับ JSON-LD FAQPage (AEO) */
		faqItems: z
			.array(
				z.object({
					question: z.string(),
					answer: z.string(),
				}),
			)
			.optional(),
	}),
});

export const collections = { posts };
