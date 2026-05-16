import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const postSchema = z.object({
	title: z.string(),
	titleHtml: z.string().optional(),
	description: z.string(),
	pubDate: z.coerce.date(),
	updatedDate: z.coerce.date().optional(),
	slug: z.string(),
	heroImage: z.string().optional(),
	heroImageAlt: z.string().optional(),
	wpPostId: z.number().optional(),
	noindex: z.boolean().optional(),
	/** Path on this site (e.g. /รับซื้อคอม/) when this URL is a local variant of a hub page */
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
});

const posts = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
	schema: postSchema,
});

const quarantine = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/quarantine' }),
	schema: postSchema,
});

export const collections = { posts, quarantine };
