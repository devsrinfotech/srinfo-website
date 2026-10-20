# SEO, GEO and AEO audit — 20 October 2026

## Scope and result

Audited the local production build for SR Infotech's new inventory-buying website. Search-account access, production hosting behaviour and actual search visibility were not part of the local audit. No production deployment or index-submission request was made.

The current build passed all automated checks described below. These are technical readiness results, not ranking or traffic guarantees.

## Changes made

- Clearer descriptions of the buying entity, categories and India-wide pickup in the homepage and commercial-page introductions.
- Category-specific and inventory-type questions with direct, visible answers.
- Relevant supplier-guide recommendations on category and solution pages. Article frontmatter now supports `relatedCategories`.
- One shared breadcrumb component creates both the visible trail and matching JSON-LD. Article breadcrumbs now use the actual article title.
- WebPage entities connected to the WebSite, Organization and BlogPosting entities.
- Article publication/modification Open Graph metadata and image-specific sharing descriptions.
- Actual article dates written into sitemap `lastmod`; builds do not manufacture freshness.
- A white-padded version of the original logo for Organization structured data, meeting minimum image dimensions without changing the artwork.
- Corrected accessible names on “Read the insight” links.
- Stronger publication gates for duplicate metadata, orphan pages, canonical relationships, article dates, images and sitemap coverage.

## Final mobile Lighthouse results

| Page | Technical SEO | Accessibility | Best practices | Failed checks |
| --- | ---: | ---: | ---: | ---: |
| Homepage | 100 | 100 | 100 | 0 |
| Stock-list article | 100 | 100 | 100 | 0 |

The tool also reported 100 for its Agentic Browsing category on both pages. That is a browser-interaction audit category, not an AI search ranking or citation score.

Saved local reports:
- `artifacts/seo-audit/home-mobile.html` and `.json`
- `artifacts/seo-audit/article-mobile.html` and `.json`

The reports are ignored build artifacts. These Lighthouse calls did not include a performance score.

## Loading baseline

A separate cold-load trace of the local homepage observed LCP of 354ms and CLS of 0.00, with 1× CPU and no network throttling. This is a local lab observation, not production Core Web Vitals. No field/CrUX data was available. Production latency, device mix, caching and the live Analytics script must be assessed after release.

## Regression checks

`npm run verify` passed:
- Zero Astro/TypeScript errors or warnings.
- Seven logic tests covering CRM payload/outcomes and draft/date publication.
- Production build of 16 content pages plus the custom 404.
- Unique titles and descriptions.
- Consistent canonical, social and WebPage metadata.
- One matching breadcrumb trail where displayed.
- Consistent article dates, author identity and entity relationships.
- Image alt/dimension attributes and eligible logo dimensions.
- Correct internal URLs and crawlable reachability from the homepage.
- Exact sitemap coverage of indexable pages, accurate article `lastmod`, compatible `/sitemap.xml` and RSS.
- Archive and local-context exclusion from the build.

Eight Playwright tests passed against the production preview, covering:
- Readable commercial pages and articles without JavaScript.
- Canonical handling of query variants.
- True 404/noindex responses for retired, private and missing paths.
- Responsive layout checks across 320–1440px.
- Navigation, filtering, FAQs and form interactions.
- Mocked CRM submission states and mocked Analytics behaviour.

## What still happens after launch

1. Verify live HTTPS, canonical-host redirects, caching, robots, sitemaps and response codes.
2. Verify the actual CRM lead path and GA4 receipt.
3. Use the existing Google Search Console and Bing Webmaster accounts to submit/inspect the new pages.
4. Check available search/AI visibility settings and reports for those accounts.
5. Build original business evidence, permissioned case studies and useful supplier resources.
6. Review relevant search queries and qualified enquiries, then refine content around demonstrated demand.

The owner/agent plan lives in git-ignored `local-context/organic-growth-plan.md`.

## Primary guidance used

- [Google's guidance for generative AI search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide): foundational SEO and useful original content remain relevant; special AI text files are not a Google ranking mechanism.
- [Google Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article): accurate article identity, author, image and dates.
- [Google Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization): factual business identity and logo guidance.
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap): canonical discovery and meaningful modification dates.
- [Bing's AI Performance announcement](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/): account-level visibility into cited pages and grounding queries.

No fabricated customer evidence, paid ranking links, doorway city pages, keyword stuffing or artificial update dates were introduced.
