# Verification — 20 October 2026

## Passed
- `npm run verify`: Astro/TypeScript check with zero errors and warnings; seven Node tests; production build; generated-site audit.
- Production output: 16 content pages plus a custom 404, RSS, sitemap and three legacy navigation aliases.
- Generated-site audit: one H1 per content page, descriptions, canonical URLs, social metadata, parseable JSON-LD and working internal asset/page links. Old business archive excluded.
- `PREVIEW_URL=http://127.0.0.1:4323 npx playwright test`: all four browser tests passed against the production build.
- Nine key routes checked at 320, 390, 768, 1024 and 1440px with no horizontal overflow.
- axe WCAG 2 A/AA and WCAG 2.1 AA checks: no violations on homepage, contact, insights index and a full article at desktop size.
- Mobile navigation, Escape-to-close, FAQs, category filtering, search and empty-state reset verified.
- Contact required fields and phone validation verified. Mocked submission confirms original endpoint, POST/multipart and eight-field payload, stock context, query attribution, duplicate-submit prevention, unconfirmed response and network-error feedback.
- Legacy `/contact.html?cl=Legacy` preserves attribution on the new form.
- Desktop and mobile screenshots visually inspected. Generated screenshots are in ignored `artifacts/`.

## Limits
- No real lead was sent to the CRM. Category-value acceptance and actual record creation require a CRM-side check.
- No production deployment, DNS change or Search Console submission was performed. Analytics restoration is covered in the follow-up below.
- Accessibility automation covers the listed routes and rules; it is not a full assistive-technology audit.
- Browser tests ran in installed Chrome. Other browser engines were not tested.
- GitHub workflow is prepared but not executed.

## Analytics and local-context follow-up
- Created four owner/agent context files in `local-context/`; `git check-ignore -v` confirms each is ignored, and none is tracked.
- Added the original GA4 ID to the shared layout with production-build and exact-host checks.
- Updated the privacy notice to disclose Analytics.
- Preserved `/sitemap.xml` as an exact copy of Astro's generated sitemap index after every build.
- `npm run verify` passed with zero type errors/warnings, all seven unit tests, the production build and expanded sitemap/analytics/archive checks.
- Two additional Playwright tests passed using locally intercepted HTML and a no-op Google script. They verified localhost/preview suppression, exact production-host matching, one GA4 configuration per page, retained campaign parameters and omission of arbitrary enquiry URL values.
- No request reached the live website or Google during those tests. Actual GA4 report receipt still needs verification after deployment with account access.

## SEO/GEO/AEO follow-up
- Final verification passed with seven logic tests and eight browser tests.
- Homepage and a full article each scored 100 in mobile Lighthouse SEO, accessibility and best practices, with zero failed checks.
- The build now checks exact sitemap coverage, meaningful article dates, unique metadata, entity relationships, image attributes and crawlable reachability.
- See `docs/seo-audit.md` for the full scope, evidence and production limitations, and git-ignored `local-context/organic-growth-plan.md` for the ongoing plan.
