import {
	getSeoManifestEntry,
	normalizeSeoPath,
	type IndexDecision,
	type MigrationStatus,
	type SeoManifestEntry,
} from '../../config/seo-manifest';

export interface LegacySeoData {
	slug?: string;

	noindex?: boolean;
	canonical?: string;

	indexDecision?: IndexDecision;
	migrationStatus?: MigrationStatus;
	redirectTo?: string;
}

export interface ResolvedIndexability {
	path: string;

	decision: IndexDecision;

	indexable: boolean;
	follow: boolean;

	canonicalPath: string;

	redirectTo?: string;

	migrationStatus: MigrationStatus;

	source:
		| 'manifest'
		| 'frontmatter'
		| 'legacy'
		| 'default';

	reason: string;
}

function getContentPath(data: LegacySeoData): string {
	if (!data.slug) {
		return '/';
	}

	return normalizeSeoPath(data.slug);
}

function getLegacyCanonicalPath(
	path: string,
	data: LegacySeoData,
): string {
	const canonical = data.canonical?.trim();

	if (!canonical) {
		return path;
	}

	return normalizeSeoPath(canonical);
}

function resolveFromManifest(
	entry: SeoManifestEntry,
): ResolvedIndexability {
	const redirectTo = entry.redirectTo
		? normalizeSeoPath(entry.redirectTo)
		: undefined;

	return {
		path: entry.path,
		decision: entry.indexDecision,
		indexable: entry.indexDecision === 'index',
		follow:
			entry.indexDecision !== 'gone',
		canonicalPath:
			entry.indexDecision === 'redirect' && redirectTo
				? redirectTo
				: entry.path,
		redirectTo,
		migrationStatus: entry.migrationStatus,
		source: 'manifest',
		reason: 'Explicit decision from central SEO manifest.',
	};
}

/**
 * Resolve SEO/indexability behavior while preserving legacy behavior.
 *
 * Priority:
 *
 * 1. Central manifest
 * 2. Explicit new frontmatter fields
 * 3. Existing legacy noindex/canonical
 * 4. Safe default
 *
 * IMPORTANT:
 * Step 2 only creates this resolver.
 * Runtime pages are NOT wired to it yet.
 */
export function resolveIndexability(
	data: LegacySeoData,
): ResolvedIndexability {
	const path = getContentPath(data);

	const manifestEntry = getSeoManifestEntry(path);

	if (manifestEntry) {
		return resolveFromManifest(manifestEntry);
	}

	/* =========================================================
	 * New explicit frontmatter decision
	 * ======================================================= */

	if (
		data.indexDecision &&
		data.indexDecision !== 'inherit'
	) {
		const redirectTo = data.redirectTo
			? normalizeSeoPath(data.redirectTo)
			: undefined;

		const canonicalPath =
			data.indexDecision === 'redirect' && redirectTo
				? redirectTo
				: getLegacyCanonicalPath(path, data);

		return {
			path,
			decision: data.indexDecision,
			indexable: data.indexDecision === 'index',
			follow: data.indexDecision !== 'gone',
			canonicalPath,
			redirectTo,
			migrationStatus:
				data.migrationStatus ?? 'unreviewed',
			source: 'frontmatter',
			reason:
				'Explicit indexDecision in content frontmatter.',
		};
	}

	/* =========================================================
	 * Legacy behavior
	 * ======================================================= */

	const legacyCanonical = getLegacyCanonicalPath(path, data);
	const hasAlternateCanonical = legacyCanonical !== path;

	/**
	 * Existing project behavior:
	 *
	 * noindex:true + alternate canonical
	 * was treated as a legacy alias page.
	 *
	 * We classify it as redirect candidate here,
	 * but Step 2 does NOT change HTTP behavior yet.
	 */
	if (data.noindex === true && hasAlternateCanonical) {
		return {
			path,
			decision: 'redirect',
			indexable: false,
			follow: true,
			canonicalPath: legacyCanonical,
			redirectTo: legacyCanonical,
			migrationStatus:
				data.migrationStatus ?? 'unreviewed',
			source: 'legacy',
			reason:
				'Legacy noindex page with alternate canonical; classified as redirect candidate.',
		};
	}

	if (data.noindex === true) {
		return {
			path,
			decision: 'noindex',
			indexable: false,
			follow: true,
			canonicalPath: legacyCanonical,
			migrationStatus:
				data.migrationStatus ?? 'unreviewed',
			source: 'legacy',
			reason:
				'Legacy noindex:true preserved as noindex,follow candidate.',
		};
	}

	/* =========================================================
	 * Safe default
	 * ======================================================= */

	return {
		path,
		decision: 'index',
		indexable: true,
		follow: true,
		canonicalPath: legacyCanonical,
		migrationStatus:
			data.migrationStatus ?? 'unreviewed',
		source: 'default',
		reason:
			'No explicit SEO decision; preserving current indexable behavior.',
	};
}

/**
 * Utility for robots meta.
 *
 * Later BaseLayout can consume this instead of constructing
 * robots directives manually in multiple places.
 */
export function buildRobotsMeta(
	resolved: ResolvedIndexability,
): string {
	if (resolved.indexable) {
		return 'index, follow';
	}

	if (!resolved.follow) {
		return 'noindex, nofollow';
	}

	return 'noindex, follow';
}

/**
 * Utility for sitemap eligibility.
 *
 * Future sitemap generator will use this together with:
 * - HTTP status
 * - self canonical
 * - content quality gate
 */
export function isSitemapEligible(
	resolved: ResolvedIndexability,
): boolean {
	return (
		resolved.indexable &&
		resolved.decision === 'index' &&
		resolved.canonicalPath === resolved.path
	);
}