function stripTrailingSlash(value) {
	return value.replace(/\/+$/, '');
}

const DEFAULT_SITE_URL = 'https://xn--c3c3a0aa6cvaf8b9dze.com';

function normalizeUrl(value) {
	if (typeof value !== 'string') return null;
	const trimmed = value.trim();
	if (!trimmed) return null;

	try {
		const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
		return stripTrailingSlash(url.toString());
	} catch {
		return null;
	}
}

function inferPrimarySiteFromWordpressUrl(value) {
	const normalized = normalizeUrl(value);
	if (!normalized) return null;

	try {
		const url = new URL(normalized);
		if (url.hostname.startsWith('wp.')) {
			url.hostname = url.hostname.slice(3);
		}
		url.pathname = '';
		url.search = '';
		url.hash = '';
		return stripTrailingSlash(url.toString());
	} catch {
		return null;
	}
}

export function resolveSiteUrl(env, options = {}) {
	const candidates = [
		env.SITE_URL,
		env.PUBLIC_SITE_URL,
		env.PUBLIC_WORDPRESS_SITE_URL,
		inferPrimarySiteFromWordpressUrl(env.PUBLIC_WORDPRESS_URL),
		env.COOLIFY_FQDN ? `https://${env.COOLIFY_FQDN}` : null,
		env.COOLIFY_URL,
		DEFAULT_SITE_URL,
	];

	for (const candidate of candidates) {
		const normalized = normalizeUrl(candidate);
		if (normalized) return normalized;
	}

	if (options.allowFallback === true) {
		return DEFAULT_SITE_URL;
	}

	throw new Error(
		[
			'Missing site URL for Astro build.',
			'Set SITE_URL in .env or your deployment environment before building.',
		].join(' '),
	);
}

export function isPlaceholderSiteUrl(url) {
	return stripTrailingSlash(url) === 'https://example.com';
}
