# SR Infotech: liquidation business website

## Objective
Convert ecommerce operators and retail brands with excess inventory into qualified supplier enquiries. SR Infotech is the inventory buyer. Categories: apparel, home and kitchen, electronics. Coverage: India. Retain the existing phone, address, social profiles and CRM form contract.

## Design and scope
Modern technology-forward corporate direction, using the existing navy/azure logo, airy white layouts and a custom 3D inventory illustration. Homepage, three category pages, three buying-solution pages, process, about, contact, searchable/filterable insights, article template, privacy notice and useful 404. No fictitious customers, testimonials, operating volumes, response SLAs, or certifications.

User-confirmed: own pickup logistics across India; untested electronics considered where commercially viable. Keep quantities, pricing, payment terms and registration details off public pages; discuss directly with suppliers.

## Architecture
Astro static HTML, TypeScript and plain CSS. Markdown articles have validated frontmatter, draft and future-date filtering, RSS, sitemap and shared SEO metadata. Minimal browser JavaScript for navigation, blog filters and form handling. Build output contains only the new website; the old business archive was deleted at the owner's request.

## Commands
`npm run dev`, `npm run check`, `npm test`, `npm run build`, `npm run verify`, `npm run new-post -- "Article title"`.

## Structure and style
`src/data/` for business and service data; `src/components/` for shared UI; `src/pages/` for routes; `src/content/blog/` for Markdown; `src/lib/` for testable business rules; `public/` for assets. Descriptive names, shared semantic CSS tokens, standard HTML controls.

```ts
export const site = {
  name: 'SR Infotech',
  url: 'https://srinfotech.biz',
};
```

## Verification
Type check and production build; unit tests for form payload/response and article visibility; built-page route/metadata/link checks; desktop/mobile browser inspection and accessibility checks; mocked submission tests with no real CRM lead created.

## Operating boundaries
The old archive and spilled legacy root files were removed at the owner's request. Keep backend endpoint and eight multipart field names. Opaque no-CORS responses cannot prove CRM acceptance: communicate an unconfirmed outcome and offer direct contact. No upload field without backend support. Do not publish new operational promises until verified. Production migrated to Cloudflare Pages on 20 October 2026; pushes to main automatically build and deploy. See docs/launch-notes.md for settings and remaining verification.
