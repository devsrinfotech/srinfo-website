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
- Categories: apparel, footwear, home and kitchen, electronics.
- Its own logistics collects goods across India.
- Untested electronics are considered when commercially viable.
- The user wants minimums, pricing, payment terms and registration details kept off public pages. Invite direct contact.
- No verified customer logos, operating history, volume metrics, certifications, reviews or response SLAs are available. Do not invent them.
- Keep the existing navy/azure logo and current contact/social details.

## Content workflow
Run `npm run new-post -- "A descriptive article title"`; edit the resulting draft. The filename becomes its URL. Schema validation is mandatory. Publish only after checking facts, links and dates and setting `draft: false`. Do not backdate, fabricate a human author, or promise rankings. A future date is excluded until a build on or after that India calendar date.

## Implementation and checks
Use shared layouts/components and static HTML. Prefer existing CSS tokens. Keep client JS small. Preserve the eight legacy CRM field names and original endpoint, plus the documented structured stock/consent fields in `docs/crm-field-mapping.md`. Keep the compatibility stock summary in `message`. Follow `integrations/frappe/README.md` for backend-first release order. Only the documented readable success acknowledgement confirms CRM acceptance; opaque responses remain unconfirmed.

Run `npm run verify` after code/content changes. For interactive/layout changes, run `npm run test:browser` against a local preview and inspect desktop/mobile screenshots. Browser tests intercept CRM requests; never send fake live leads.

Contact spam protection uses Cloudflare Turnstile: public config in `src/data/turnstile.ts`, transient `turnstile_token` multipart field, action `inventory_enquiry`. The existing Frappe handler must verify every token before insert, including legacy field sets. Its secret belongs only in private Frappe configuration/environment, never the static site, repository, analytics or Discord. Production accepts only the two production frontend hostnames. Local browser tests mock the widget and CRM; live validation requires the owner-installed backend and secret.

Build output is `dist/`. Production runs on Cloudflare Pages project `srinfo-website`; pushes to `main` automatically run `npm run verify` and deploy `dist/`. GitHub Pages and the historical manual GitHub deployment workflow are disabled. The repository root contains development files and is not a deployable document root. Review `docs/launch-notes.md` before releasing. Do not alter DNS, deploy, push, or change the CRM without a task authorising that action.
