import { getCollection } from 'astro:content';
import nonArticleSlugList from '../data/non-article-slugs.json';

/** URL path หนึ่งตอนที่ไม่ใช่บทความจาก content collection (ใช้ร่วมกับ sitemap) */
export const RESERVED_POST_SLUGS = new Set(nonArticleSlugList as string[]);

/**
 * บทความที่เผยแพร่ (ไม่ชน slug กับหน้า static) เรียงใหม่สุดก่อน
 */
export async function getPublishedPosts() {
	const posts = await getCollection(
		'posts',
		({ data }) => !RESERVED_POST_SLUGS.has(data.slug),
	);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
