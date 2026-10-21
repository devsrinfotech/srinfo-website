# Publishing useful inventory content

## Audience and purpose
Write for heads of inventory, ecommerce, retail operations, reverse logistics and brand teams who need to sell surplus stock. SR Infotech is the buyer. The conversion is a relevant supplier enquiry, not a consumer shopping visit.

## One file publishes an article

Run:

```sh
npm run new-post -- "A useful supplier question as an article title"
```

The file is created safely with `draft: true`. Existing files are never overwritten. Edit its Markdown and frontmatter:

```yaml
title: "How to prepare a surplus inventory lot for review"
description: "A practical 60–180 character summary of what the supplier will learn, using natural language and no unsupported promises."
pubDate: 2026-10-20
category: "Supplier guides"
relatedCategories: ["apparel", "home-kitchen", "electronics"]
image: "warehouse"
imageAlt: "Illustrative warehouse inventory"
readingTime: 4
author: "SR Infotech"
draft: false
```

Categories: `Inventory strategy`, `Supplier guides`, `Electronics`, `Apparel`. Add a new enum deliberately in `src/content.config.ts` if the content strategy warrants it. Available images: `warehouse`, `apparel`, `home-kitchen`, `electronics`, `hero`, `apparel-stocklots`, `electronics-grading`, `stock-conditions`. See [image library](./image-library.md) for the best use of each scene and responsive export sizes. Add new optimised images plus schema options when needed.

`relatedCategories` controls relevant guide recommendations on buying pages. Use only the categories the article genuinely covers (`apparel`, `home-kitchen`, `electronics`). A focused apparel guide should use `["apparel"]`; leave an empty array if none applies. Related articles also use these associations.

The filename becomes `/insights/<filename>/`. Use a unique, descriptive lowercase slug. Changing it after publication requires a relevant redirect.

Drafts and future posts are excluded from routes, index cards, related articles, RSS and sitemap. Future-date publishing uses India calendar dates **at build time**. A new build/deployment is necessary when the date arrives; there is no background scheduler.

## Article structure
1. Give the direct answer in the opening paragraph.
2. Explain what the supplier needs to know with concrete examples.
3. Use meaningful H2 headings; the template generates a table of contents.
4. Link to a relevant buying category or service and another useful article.
5. Cite primary sources for externally sourced facts. Check they still support the claim.
6. Finish with a relevant inventory enquiry CTA.

Use the organisation as author unless a real author has agreed to attribution. Publication dates must reflect actual publication; add `updatedDate` only after a substantive update. Do not create artificial freshness.

## Publication check
- Accurate, original, useful content with a clear supplier intent.
- No fake statistics, partners, customer quotes, author biographies or guarantees.
- No confidential buying prices, minimums, payment details or registration data.
- Source links and internal links work.
- Description and title fit the schema; image alt text is meaningful.
- No top-level H1 in Markdown; the template supplies it.
- Run `npm run verify`, review the article locally, then deploy using the chosen release process.

The verifier rejects duplicate titles/descriptions, incorrect canonical/entity relationships, invalid article chronology, sitemap omissions, broken links and orphan pages. Sitemap article `lastmod` comes from `updatedDate` or `pubDate`, never the current build time.

Do not treat a technically valid draft as automatically useful. Add business-specific knowledge, an original example or a practical resource when possible. A human familiar with the operation should verify any claim about SR Infotech before publication.

## Next content opportunities

| Topic | Commercial page |
| --- | --- |
| Preparing multi-location stock for a buyer conversation | `/how-it-works/` |
| What to ask an inventory buyer before agreeing a sale | `/sell-excess-inventory/` |
| Describing mixed-condition ecommerce return lots | `/ecommerce-returns/` |
| Damaged labels versus damaged products | `/damaged-label-stock/` |
| Organising incomplete home and kitchen sets | `/categories/home-kitchen/` |
| Preparing a recurring surplus stock programme | `/contact/` |

Publish when there is something useful to say. Build original authority with permissioned operational photos, real team information and verified case studies when these become available. Avoid mass-produced city pages, scraped articles and repetitive keyword pages.
