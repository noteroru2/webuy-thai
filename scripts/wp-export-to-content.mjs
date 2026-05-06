/**
 * ดึงโพสต์จาก WordPress REST API แล้วเขียนเป็น Markdown ใน src/content/posts/
 * รันครั้งเดียวตอนย้าย — หลังจากนั้นแก้ไฟล์ .md ใน repo ได้เลย
 *
 * ใช้งาน: PUBLIC_WORDPRESS_URL ใน .env แล้ว npm run export:wp
 */
import { mkdirSync, writeFileSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import TurndownService from 'turndown';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
config({ path: join(root, '.env') });

const baseRaw = process.env.PUBLIC_WORDPRESS_URL?.replace(/\/+$/, '');
if (!baseRaw) {
	console.error('ตั้งค่า PUBLIC_WORDPRESS_URL ใน .env ก่อน');
	process.exit(1);
}

const OUT_DIR = join(root, 'src', 'content', 'posts');
const TIMEOUT_MS = Math.max(
	8000,
	Number(process.env.EXPORT_WP_TIMEOUT_MS ?? process.env.PUBLIC_WORDPRESS_TIMEOUT_MS ?? 60000),
);
const MAX_PAGES = Math.max(0, Number(process.env.EXPORT_WP_MAX_PAGES ?? 0) || 0);

function stripHtml(html) {
	if (!html) return '';
	return String(html)
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function normalizeWpSlug(slug) {
	try {
		return decodeURIComponent(slug);
	} catch {
		return slug;
	}
}

async function fetchJson(url) {
	const res = await fetch(url, {
		headers: { Accept: 'application/json' },
		signal: AbortSignal.timeout(TIMEOUT_MS),
	});
	if (!res.ok) throw new Error(`${res.status} ${res.statusText} ${url}`);
	return res.json();
}

async function fetchAllPosts() {
	const all = [];
	let page = 1;
	let totalPages = 1;

	while (page <= totalPages) {
		if (MAX_PAGES > 0 && page > MAX_PAGES) break;
		const url = new URL(`${baseRaw}/wp-json/wp/v2/posts`);
		url.searchParams.set('per_page', '100');
		url.searchParams.set('page', String(page));
		url.searchParams.set('_embed', '1');

		const res = await fetch(url, {
			headers: { Accept: 'application/json' },
			signal: AbortSignal.timeout(TIMEOUT_MS),
		});
		if (!res.ok) throw new Error(`posts page ${page}: ${res.status}`);
		if (page === 1) {
			const tp = res.headers.get('X-WP-TotalPages');
			if (tp) totalPages = parseInt(tp, 10) || 1;
		}
		all.push(...(await res.json()));
		page++;
	}

	return all.map((post) => ({
		...post,
		slug: normalizeWpSlug(post.slug),
	}));
}

function featuredUrl(post) {
	const m = post._embedded?.['wp:featuredmedia']?.[0];
	return m?.source_url;
}

function featuredAlt(post) {
	const m = post._embedded?.['wp:featuredmedia']?.[0];
	return m?.alt_text?.trim() || stripHtml(post.title?.rendered);
}

function buildTurndown() {
	const td = new TurndownService({
		headingStyle: 'atx',
		codeBlockStyle: 'fenced',
	});
	td.keep(['figure', 'iframe', 'script']);
	return td;
}

function frontmatterLine(obj) {
	return `${JSON.stringify(obj)}`;
}

async function main() {
	console.log(`Export จาก ${baseRaw} → ${OUT_DIR}`);
	mkdirSync(OUT_DIR, { recursive: true });

	for (const name of readdirSync(OUT_DIR).filter((f) => f.endsWith('.md'))) {
		rmSync(join(OUT_DIR, name));
	}

	const posts = await fetchAllPosts();
	const td = buildTurndown();

	for (const post of posts) {
		const plainTitle = stripHtml(post.title?.rendered);
		const excerptHtml = post.excerpt?.rendered ?? '';
		const plainDesc = stripHtml(excerptHtml) || plainTitle;
		const titleHtml = String(post.title?.rendered ?? plainTitle).trim();
		const bodyMd = td.turndown(post.content?.rendered ?? '');
		const hero = featuredUrl(post);
		const heroAlt = featuredAlt(post);
		const dayPublished = String(post.date ?? '').slice(0, 10);
		const dayModified = post.modified ? String(post.modified).slice(0, 10) : undefined;

		const fm = [
			'---',
			`title: ${frontmatterLine(plainTitle)}`,
			`titleHtml: ${frontmatterLine(titleHtml)}`,
			`description: ${frontmatterLine(plainDesc)}`,
			`pubDate: ${frontmatterLine(dayPublished)}`,
			...(dayModified && dayModified !== dayPublished
				? [`updatedDate: ${frontmatterLine(dayModified)}`]
				: []),
			`slug: ${frontmatterLine(post.slug)}`,
			`wpPostId: ${Number(post.id)}`,
		];
		if (hero) {
			fm.push(`heroImage: ${frontmatterLine(hero)}`);
			fm.push(`heroImageAlt: ${frontmatterLine(heroAlt || plainTitle)}`);
		}
		fm.push('---', '', bodyMd.trim(), '');
		const file = join(OUT_DIR, `${post.id}.md`);
		writeFileSync(file, fm.join('\n'), 'utf8');
	}

	console.log(`เขียน ${posts.length} ไฟล์แล้ว — รัน npm run build เพื่อทดสอบ`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
