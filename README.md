# webuy-thai

## Content migration

Import published posts from WordPress and download remote media into the repo:

```bash
npm run export:wp
```

Clean the existing Markdown collection in place without re-exporting:

```bash
npm run localize:content
```

Curate imported content by removing remaining broken remote images and auto-noindexing obviously off-topic posts:

```bash
npm run curate:content
```

Run a quality pass over the remaining post collection, then move low-confidence content into the quarantine collection:

```bash
npm run quality:content
npm run quarantine:content
```

Supported environment variables:

- `PUBLIC_WORDPRESS_URL`: source WordPress origin for `export:wp`
- `EXPORT_WP_TIMEOUT_MS`: request timeout in milliseconds
- `EXPORT_WP_MAX_PAGES`: limit fetched REST pages, `0` means all pages
- `EXPORT_WP_DOWNLOAD_MEDIA`: set to `false` to skip downloading remote images
- `EXPORT_WP_MEDIA_PUBLIC_BASE`: public URL prefix for imported media, default `/media/imported`
- `EXPORT_WP_REWRITE_HOSTS`: comma-separated legacy hosts to rewrite as internal links
