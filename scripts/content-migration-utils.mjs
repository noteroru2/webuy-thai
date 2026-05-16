import { mkdirSync, existsSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import crypto from 'node:crypto';

const IMAGE_EXTENSIONS = new Set([
	'.avif',
	'.bmp',
	'.gif',
	'.ico',
	'.jfif',
	'.jpeg',
	'.jpg',
	'.png',
	'.svg',
	'.webp',
]);

const CONTENT_TYPE_TO_EXT = new Map([
	['image/avif', '.avif'],
	['image/bmp', '.bmp'],
	['image/gif', '.gif'],
	['image/jpeg', '.jpg'],
	['image/jpg', '.jpg'],
	['image/png', '.png'],
	['image/svg+xml', '.svg'],
	['image/webp', '.webp'],
	['image/x-icon', '.ico'],
]);

const NAMED_ENTITY_MAP = new Map([
	['amp', '&'],
	['apos', "'"],
	['gt', '>'],
	['hellip', '...'],
	['laquo', '"'],
	['ldquo', '"'],
	['lsaquo', "'"],
	['lsquo', "'"],
	['lt', '<'],
	['mdash', '--'],
	['nbsp', ' '],
	['ndash', '-'],
	['raquo', '"'],
	['rdquo', '"'],
	['rsaquo', "'"],
	['rsquo', "'"],
	['quot', '"'],
]);

function shortHash(input) {
	return crypto.createHash('sha1').update(input).digest('hex').slice(0, 10);
}

function escapeRegex(input) {
	return String(input).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function trimSlashes(input) {
	return String(input ?? '')
		.replace(/^\/+/, '')
		.replace(/\/+$/, '');
}

function ensureTrailingSlash(pathname) {
	if (pathname === '/' || pathname === '') return '/';
	if (pathname.endsWith('/')) return pathname;
	if (/\.[a-z0-9]+$/i.test(pathname)) return pathname;
	return `${pathname}/`;
}

function normalizeSpace(text) {
	return String(text)
		.replace(/\u00a0/g, ' ')
		.replace(/\r\n?/g, '\n');
}

function replaceEntities(text) {
	return normalizeSpace(text).replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (full, entity) => {
		if (entity[0] === '#') {
			const isHex = entity[1]?.toLowerCase() === 'x';
			const raw = isHex ? entity.slice(2) : entity.slice(1);
			const codePoint = Number.parseInt(raw, isHex ? 16 : 10);
			return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : full;
		}

		return NAMED_ENTITY_MAP.get(entity.toLowerCase()) ?? full;
	});
}

function inferExtensionFromContentType(contentType) {
	if (!contentType) return '';
	return CONTENT_TYPE_TO_EXT.get(contentType.split(';')[0].trim().toLowerCase()) ?? '';
}

function decodePathSegment(input) {
	try {
		return decodeURIComponent(input);
	} catch {
		return input;
	}
}

function sanitizeFileSegment(input, fallback = 'asset') {
	const cleaned = decodePathSegment(String(input ?? fallback))
		.normalize('NFKC')
		.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^\.+/, '')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);

	return cleaned || fallback;
}

function parseMarkdownTarget(rawTarget) {
	const trimmed = rawTarget.trim();
	if (trimmed.startsWith('<')) {
		const closeIndex = trimmed.indexOf('>');
		if (closeIndex > 0) {
			const url = trimmed.slice(1, closeIndex);
			const titleMatch = trimmed.slice(closeIndex + 1).trim().match(/^["']([\s\S]*?)["']$/);
			return { url, title: titleMatch?.[1] ?? '' };
		}
	}

	const parts = trimmed.match(/^(\S+)(?:\s+["']([\s\S]*?)["'])?$/);
	if (!parts) {
		return { url: trimmed, title: '' };
	}

	return { url: parts[1], title: parts[2] ?? '' };
}

function formatMarkdownTarget(url, title = '') {
	const needsWrap = /[\s()]/.test(url);
	const encodedUrl = needsWrap ? `<${url}>` : url;
	return title ? `${encodedUrl} "${title}"` : encodedUrl;
}

async function replaceAllAsync(input, regex, replacer) {
	let output = '';
	let lastIndex = 0;

	regex.lastIndex = 0;
	for (let match = regex.exec(input); match; match = regex.exec(input)) {
		output += input.slice(lastIndex, match.index);
		output += await replacer(match);
		lastIndex = match.index + match[0].length;
		if (!regex.global) break;
		if (match[0].length === 0) regex.lastIndex += 1;
	}

	output += input.slice(lastIndex);
	return output;
}

export function decodeHtmlEntities(text) {
	return replaceEntities(text);
}

export function stripHtml(html) {
	if (!html) return '';
	return decodeHtmlEntities(String(html))
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

export function normalizeWpSlug(slug) {
	try {
		return decodeURIComponent(slug);
	} catch {
		return slug;
	}
}

export function frontmatterLine(value) {
	return JSON.stringify(value);
}

export function createMigrationContext(options) {
	const {
		rootDir,
		mediaPublicBase = '/media/imported',
		timeoutMs = 60000,
		currentSiteOrigin,
		legacyHosts = [],
		downloadRemoteAssets = true,
		resetMediaDir = false,
		logger = console,
	} = options;

	const mediaBase = `/${trimSlashes(mediaPublicBase)}`;
	const mediaFsBase = join(rootDir, 'public', ...trimSlashes(mediaBase).split('/').filter(Boolean));
	const assetCache = new Map();
	const internalHosts = new Set(
		[currentSiteOrigin, ...legacyHosts]
			.filter(Boolean)
			.flatMap((value) => {
				try {
					return [new URL(value).hostname.toLowerCase()];
				} catch {
					return [String(value).toLowerCase()];
				}
			}),
	);

	const stats = {
		assetsDownloaded: 0,
		assetsFailed: 0,
		assetsReused: 0,
		htmlEntitiesDecoded: 0,
		imagesRewritten: 0,
		internalLinksRewritten: 0,
	};

	if (resetMediaDir) {
		rmSync(mediaFsBase, { force: true, recursive: true });
	}
	mkdirSync(mediaFsBase, { recursive: true });

	function countEntityDecodes(before, after) {
		if (before !== after) stats.htmlEntitiesDecoded += 1;
		return after;
	}

	function isLikelyImageUrl(rawUrl) {
		try {
			const url = new URL(rawUrl);
			const extension = extname(url.pathname).toLowerCase();
			return IMAGE_EXTENSIONS.has(extension) || /\/wp-content\/uploads\//i.test(url.pathname);
		} catch {
			return false;
		}
	}

	function rewriteInternalUrl(rawUrl) {
		if (!/^https?:\/\//i.test(rawUrl)) return rawUrl;

		try {
			const url = new URL(rawUrl);
			if (!internalHosts.has(url.hostname.toLowerCase())) return rawUrl;
			const pathname = ensureTrailingSlash(decodeURI(url.pathname));
			stats.internalLinksRewritten += 1;
			return `${pathname}${url.search}${url.hash}`;
		} catch {
			return rawUrl;
		}
	}

	async function downloadAsset(rawUrl, hint = 'asset') {
		if (!/^https?:\/\//i.test(rawUrl)) return rawUrl;
		if (!downloadRemoteAssets) return rawUrl;

		if (assetCache.has(rawUrl)) {
			return assetCache.get(rawUrl);
		}

		const url = new URL(rawUrl);
		const hostDir = sanitizeFileSegment(url.hostname.toLowerCase(), 'external');
		const originalExtension = extname(url.pathname).toLowerCase();
		const baseName = sanitizeFileSegment(
			originalExtension ? decodePathSegment(url.pathname.split('/').pop()?.slice(0, -originalExtension.length) ?? hint) : decodePathSegment(url.pathname.split('/').pop() ?? hint),
			hint,
		);
		const fileHash = shortHash(rawUrl);
		const baseDir = join(mediaFsBase, hostDir);

		mkdirSync(baseDir, { recursive: true });

		let extension = IMAGE_EXTENSIONS.has(originalExtension) ? originalExtension : '';
		let targetRelativePath = '';
		let targetAbsolutePath = '';

		const setTargetPath = (ext) => {
			const filename = `${baseName}-${fileHash}${ext || ''}`;
			targetRelativePath = `${mediaBase}/${hostDir}/${filename}`;
			targetAbsolutePath = join(baseDir, filename);
		};

		setTargetPath(extension);

		if (targetAbsolutePath && existsSync(targetAbsolutePath)) {
			assetCache.set(rawUrl, targetRelativePath);
			stats.assetsReused += 1;
			return targetRelativePath;
		}

		try {
			const res = await fetch(url, {
				headers: { Accept: 'image/*,*/*;q=0.8' },
				signal: AbortSignal.timeout(timeoutMs),
			});
			if (!res.ok) {
				logger.warn(`download failed ${res.status} ${url}`);
				assetCache.set(rawUrl, rawUrl);
				stats.assetsFailed += 1;
				return rawUrl;
			}

			if (!extension) {
				extension = inferExtensionFromContentType(res.headers.get('content-type'));
				setTargetPath(extension);
			}

			const bytes = Buffer.from(await res.arrayBuffer());
			writeFileSync(targetAbsolutePath, bytes);
			assetCache.set(rawUrl, targetRelativePath);
			stats.assetsDownloaded += 1;
			return targetRelativePath;
		} catch (error) {
			const reason =
				error && typeof error === 'object' && 'cause' in error && error.cause
					? error.cause
					: error;
			logger.warn(`download skipped ${url} (${reason})`);
			assetCache.set(rawUrl, rawUrl);
			stats.assetsFailed += 1;
			return rawUrl;
		}
	}

	async function rewriteMarkdownLinks(text) {
		return replaceAllAsync(text, /(!?)\[([^\]]*)\]\(([^)]+)\)/g, async (match) => {
			const [, marker, label, rawTarget] = match;
			const isImage = marker === '!';
			const { url, title } = parseMarkdownTarget(rawTarget);
			let nextUrl = url;

			if (isImage && isLikelyImageUrl(url)) {
				nextUrl = await downloadAsset(url, label || 'image');
				if (nextUrl !== url) stats.imagesRewritten += 1;
			} else if (!isImage) {
				nextUrl = rewriteInternalUrl(url);
			}

			return `${marker}[${label}](${formatMarkdownTarget(nextUrl, title)})`;
		});
	}

	async function rewriteHtmlAttributes(text) {
		let next = text;

		next = await replaceAllAsync(
			next,
			/\b(href|poster|src)=(['"])(https?:\/\/[^'"]+)\2/gi,
			async (match) => {
				const [, attr, quote, url] = match;
				let nextUrl = url;
				if ((attr === 'src' || attr === 'poster') && isLikelyImageUrl(url)) {
					nextUrl = await downloadAsset(url, attr);
					if (nextUrl !== url) stats.imagesRewritten += 1;
				} else if (attr === 'href') {
					nextUrl = rewriteInternalUrl(url);
				}
				return `${attr}=${quote}${nextUrl}${quote}`;
			},
		);

		next = await replaceAllAsync(next, /\bsrcset=(['"])([^'"]+)\1/gi, async (match) => {
			const [, quote, rawSrcset] = match;
			const items = rawSrcset
				.split(',')
				.map((entry) => entry.trim())
				.filter(Boolean);
			const localized = [];

			for (const item of items) {
				const [rawUrl, descriptor] = item.split(/\s+/, 2);
				let nextUrl = rawUrl;
				if (isLikelyImageUrl(rawUrl)) {
					nextUrl = await downloadAsset(rawUrl, 'srcset');
					if (nextUrl !== rawUrl) stats.imagesRewritten += 1;
				}
				localized.push(descriptor ? `${nextUrl} ${descriptor}` : nextUrl);
			}

			return `srcset=${quote}${localized.join(', ')}${quote}`;
		});

		return next;
	}

	async function rewriteTextContent(input) {
		const decoded = countEntityDecodes(input, decodeHtmlEntities(input));
		const linkRewritten = await rewriteMarkdownLinks(decoded);
		return rewriteHtmlAttributes(linkRewritten);
	}

	return {
		downloadAsset,
		isLikelyImageUrl,
		mediaFsBase,
		mediaPublicBase: mediaBase,
		rewriteInternalUrl,
		rewriteTextContent,
		stats,
	};
}

export function readJsonFrontmatterValue(frontmatter, key) {
	const match = frontmatter.match(new RegExp(`^${escapeRegex(key)}:\\s*(.+)\\s*$`, 'm'));
	if (!match) return null;
	try {
		return JSON.parse(match[1]);
	} catch {
		return null;
	}
}

export function replaceJsonFrontmatterValue(frontmatter, key, nextValue) {
	return frontmatter.replace(
		new RegExp(`^${escapeRegex(key)}:\\s*(.+)\\s*$`, 'm'),
		`${key}: ${frontmatterLine(nextValue)}`,
	);
}

export function upsertJsonFrontmatterValue(frontmatter, key, nextValue) {
	const replacement = `${key}: ${frontmatterLine(nextValue)}`;
	if (new RegExp(`^${escapeRegex(key)}:\\s*(.+)\\s*$`, 'm').test(frontmatter)) {
		return frontmatter.replace(new RegExp(`^${escapeRegex(key)}:\\s*(.+)\\s*$`, 'm'), replacement);
	}

	const trimmed = frontmatter.replace(/\s+$/, '');
	return `${trimmed}\n${replacement}`;
}

export function readBooleanFrontmatterValue(frontmatter, key) {
	const match = frontmatter.match(new RegExp(`^${escapeRegex(key)}:\\s*(true|false)\\s*$`, 'mi'));
	if (!match) return null;
	return match[1].toLowerCase() === 'true';
}

export function upsertBooleanFrontmatterValue(frontmatter, key, nextValue) {
	const replacement = `${key}: ${nextValue ? 'true' : 'false'}`;
	if (new RegExp(`^${escapeRegex(key)}:\\s*(true|false)\\s*$`, 'mi').test(frontmatter)) {
		return frontmatter.replace(new RegExp(`^${escapeRegex(key)}:\\s*(true|false)\\s*$`, 'mi'), replacement);
	}

	const trimmed = frontmatter.replace(/\s+$/, '');
	return `${trimmed}\n${replacement}`;
}

export function parseMarkdownDocument(rawContent) {
	const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!match) {
		return null;
	}

	return {
		frontmatter: match[1],
		body: match[2],
	};
}

export function serializeMarkdownDocument(frontmatter, body) {
	const normalizedBody = body.replace(/\r\n?/g, '\n').replace(/\s+$/, '');
	return `---\n${frontmatter}\n---\n\n${normalizedBody}\n`;
}

export function collapseMarkdownSpacing(body) {
	return body
		.replace(/[ \t]+\n/g, '\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

export function saveTextFile(targetPath, content) {
	mkdirSync(dirname(targetPath), { recursive: true });
	writeFileSync(targetPath, content, 'utf8');
}
