# Working on SR Infotech

This is the **new inventory liquidation buying business**. The audience is brands and ecommerce businesses selling stock to us, not consumers looking for bargains.

## Read only what you need
- Business/contact facts: `src/data/site.ts`, `src/data/business.ts`.
- Page shell and SEO: `src/layouts/BaseLayout.astro`.
- Design tokens/responsive rules: `src/styles/global.css`.
- Blog schema: `src/content.config.ts`; content in `src/content/blog/*.md`.
- Publishing instructions: `docs/content-playbook.md`.
- Backend integration: `src/lib/contact.mjs` and `docs/launch-notes.md`.
- Local owner/agent context, when available: `local-context/README.md`. This folder is git-ignored and must remain outside the build. Never force-add it.
- Analytics: `src/components/Analytics.astro` reuses the original GA4 ID and activates only on production hosts. Do not send form contents or unconfirmed leads as analytics conversions.
- The owner requested deletion of `old business website data/` and the spilled legacy root files. They have been removed; do not restore or import the retired marketing website into the new app.

## Confirmed operating facts
- SR Infotech buys bulk surplus, ecommerce returns, damaged labels/packaging stock.
- Categories: apparel, home and kitchen, electronics.
- Its own logistics collects goods across India.
- Untested electronics are considered when commercially viable.
- The user wants minimums, pricing, payment terms and registration details kept off public pages. Invite direct contact.
- No verified customer logos, operating history, volume metrics, certifications, reviews or response SLAs are available. Do not invent them.
- Keep the existing navy/azure logo and current contact/social details.

## Content workflow
Run `npm run new-post -- "A descriptive article title"`; edit the resulting draft. The filename becomes its URL. Schema validation is mandatory. Publish only after checking facts, links and dates and setting `draft: false`. Do not backdate, fabricate a human author, or promise rankings. A future date is excluded until a build on or after that India calendar date.

## Implementation and checks
Use shared layouts/components and static HTML. Prefer existing CSS tokens. Keep client JS small. Preserve the eight CRM field names and original endpoint; add stock context inside `message`. Never treat an opaque response as confirmed CRM acceptance.

Run `npm run verify` after code/content changes. For interactive/layout changes, run `npm run test:browser` against a local preview and inspect desktop/mobile screenshots. Browser tests intercept CRM requests; never send fake live leads.

Build output is `dist/`. The repository root contains development files and is not a deployable document root. Review `docs/launch-notes.md` before releasing. Do not alter DNS, deploy, push, or change the CRM without a task authorising that action.
