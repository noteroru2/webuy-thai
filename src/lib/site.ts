export function getSiteOrigin(): string {
  const env = import.meta.env as Record<string, unknown>;
  const siteUrl = typeof env.SITE_URL === 'string' ? env.SITE_URL : undefined;
  if (siteUrl) return siteUrl.replace(/\/+$/, '');
  const publicSiteUrl = typeof env.PUBLIC_SITE_URL === 'string' ? env.PUBLIC_SITE_URL : undefined;
  if (publicSiteUrl) return publicSiteUrl.replace(/\/+$/, '');

  const fqdn = typeof env.COOLIFY_FQDN === 'string' ? env.COOLIFY_FQDN : undefined;
  if (fqdn) return `https://${fqdn}`.replace(/\/+$/, '');

  const coolifyUrl = typeof env.COOLIFY_URL === 'string' ? env.COOLIFY_URL : undefined;
  if (coolifyUrl) return coolifyUrl.replace(/\/+$/, '');

  return 'https://example.com';
}

export function getSiteUrl(pathname: string): string {
  const base = getSiteOrigin();
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${base}${path}`;
}

const TITLE_BRAND = 'WE BUY';
const TITLE_SUFFIX = ` | ${TITLE_BRAND}`;
const TITLE_MAX_LEN = 60;

/** Suffix for HTML `<title>` tags (keeps titles shorter than full org name). */
export function formatPageTitle(pageTitle: string): string {
  const brand =
    (typeof import.meta.env.PUBLIC_TITLE_BRAND === 'string' &&
      import.meta.env.PUBLIC_TITLE_BRAND.trim()) ||
    TITLE_BRAND;
  const suffix = ` | ${brand}`;
  let base = pageTitle
    .replace(/\s*\|\s*WE BUY\s*(\|\s*เรารับซื้อ)?\s*$/i, '')
    .replace(/\s*\|\s*เรารับซื้อ\.com\s*$/i, '')
    .trim();
  const maxBase = TITLE_MAX_LEN - suffix.length;
  if (base.length > maxBase) {
    const cut = base.slice(0, maxBase + 1);
    const lastSpace = cut.lastIndexOf(' ');
    base = (lastSpace > maxBase * 0.45 ? cut.slice(0, lastSpace) : base.slice(0, maxBase)).trim();
  }
  return `${base}${suffix}`;
}

export function getSocialLinks(): string[] {
  const env = import.meta.env as Record<string, unknown>;
  const socialRaw = typeof env.PUBLIC_ORG_SAME_AS === 'string' ? env.PUBLIC_ORG_SAME_AS : 'https://line.me/R/ti/p/@webuy';
  return socialRaw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}
