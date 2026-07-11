# Blog Sitemap Investigation

## Findings

The audit noted: **"754 posts exist, but sitemap-blog.xml contains only 1 URL"**.

We investigated the code and build behavior and confirmed that **this is intentional and correct** based on the website's URL architecture:

1. **Flat URL Structure (`/[slug]/`)**: All posts from the `posts` collection are generated at the root level `/[slug]/` rather than `/blog/[slug]/`. This flat URL structure is designed to preserve legacy SEO rankings and backlinks from the original WordPress site.
2. **Sitemap Categorization Logic (`determineCategory` in `generate-sitemaps.mjs`)**:
   - The sitemap generator categorizes paths based on their URL segments and keywords.
   - Any path starting with `/blog/` goes into `sitemap-blog.xml`.
   - The only URL that starts with `/blog/` is the blog listing page (`/blog/`).
   - All other posts (such as `รับซื้อ-macbook`, `รับซื้อไอโฟน-ขอนแก่น`, etc.) fall into other categories:
     - If the URL contains local keywords (`อุบล`, `กรุงเทพ`, `ขอนแก่น`, etc.) -> Categorized as **`local`** (`sitemap-local.xml`).
     - If the URL contains service keywords (`รับซื้อ`, `บริการ`, `ซ่อม`) -> Categorized as **`services`** (`sitemap-services.xml`).
     - Otherwise -> Categorized as **`pages`** (`sitemap-pages.xml`).

## Counts by Content Type (After Batch 8 Quarantine)

- **Total Posts in collection**: 654 active posts (17 off-topic posts quarantined in Batch 8).
- **Indexable posts in `sitemap-services.xml`**: 464 URLs (contains IT buyback/service posts at root level).
- **Indexable posts in `sitemap-local.xml`**: 41 URLs (contains localized IT buyback posts).
- **Indexable pages in `sitemap-pages.xml`**: 13 URLs (contains static pages and non-service posts).
- **Indexable paths in `sitemap-blog.xml`**: 1 URL (`/blog/` landing page).

## Conclusion & Action

**KEEP AS IS.** No change is required. The sitemap index properly links all sub-sitemaps, and search engines will discover all indexable posts through `sitemap-services.xml`, `sitemap-local.xml`, and `sitemap-pages.xml`.
