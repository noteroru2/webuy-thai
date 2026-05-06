import { getSiteOrigin } from './site';

/**
 * WebPage + BreadcrumbList สำหรับหน้า landing / บริการ — ผูกกับ WebSite หลัก (#website)
 */
export function buildWebPageBreadcrumbsJsonLd(options: {
	path: string;
	name: string;
	description: string;
	breadcrumbs: Array<{ name: string; path: string }>;
}): Array<Record<string, unknown>> {
	const site = getSiteOrigin();
	const fullUrl = `${site}${options.path.startsWith('/') ? options.path : `/${options.path}`}`;
	const websiteId = `${site}/#website`;

	return [
		{
			'@context': 'https://schema.org',
			'@type': 'WebPage',
			'@id': `${fullUrl}#webpage`,
			url: fullUrl,
			name: options.name,
			description: options.description,
			inLanguage: 'th-TH',
			isPartOf: { '@id': websiteId },
		},
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: options.breadcrumbs.map((c, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				name: c.name,
				item: `${site}${c.path.startsWith('/') ? c.path : `/${c.path}`}`,
			})),
		},
	];
}
