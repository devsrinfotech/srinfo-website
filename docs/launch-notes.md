# Launch and migration

## Current state
- The new Astro site builds to `dist/` with production URLs under `https://srinfotech.biz`.
- Original logo assets, email, primary phone, address and social URLs are retained.
- The old contact page contained one visible `+91 9945649161` alongside links to `+91 9606846445`. The new site consistently uses the latter, matching the header, footer and WhatsApp.
- The original LinkedIn URL contains `/mycompany/` and the social handles include `saas`. They are deliberately preserved; an account owner can update profile branding separately.
- The owner requested deletion of the old website archive and spilled legacy root files; cleanup is complete.
- Production migrated to Cloudflare Pages on 20 October 2026 from commit `028149b` (`NEW BUSINESS`). Both `srinfotech.biz` and `www.srinfotech.biz` are active with SSL.
- The CRM/Turnstile release `a497a8b` deployed successfully on 21 October 2026. After the owner corrected the private backend secret and restarted Frappe, the live form confirmed the labelled test was saved; the owner confirmed Discord receipt. The post-success UI now ends the attempt without launching another CAPTCHA and blocks a duplicate submission on the same page.

## CRM contract and remaining verification

The footwear category update has a backend-first dependency: the installed controller must allow `Footwear liquidation` before the matching frontend is released. The website, prepared controller and local checks include it; see [footwear launch notes](./footwear-launch.md) for the targeted server edit. The CRM Data field and Discord payload already support the value without schema changes.
The owner confirmed installing this category and restarting Frappe on 22 October 2026. No live footwear test enquiry has been submitted.
Endpoint:

```text
https://mycrm.srinfotech.biz/api/method/erpnext.product_request.doctype.sr_website_leads.sr_website_leads.save_form
```

The original POST multipart fields remain: `name`, `email_id`, `mobile_number`, `organization`, `company_website`, `service`, `message`, `click_location`.

The deployed CRM integration supplies dedicated stock/consent fields and uses credential-free CORS to read the handler's acknowledgement. The compatibility stock summary also remains in `message`. It confirms delivery only on the documented saved-lead response and preserves input on success, unknown responses and failure. Category remains in `service` using the liquidation category labels. The earlier `028149b` eight-field/no-CORS frontend has been superseded.

Browser tests intercept all CRM traffic. Separately, one labelled internal test was explicitly approved by the owner and successfully submitted through production. Its saved-lead acknowledgement and owner-confirmed Discord delivery are recorded in the integration README. For future backend releases:

1. Update the controller from `integrations/frappe/sr_website_leads.py` while retaining the owner's private server-only Turnstile secret, then reload the web/worker processes. The committed template supports private configuration/environment too, but the owner chose a literal secret in the untracked server copy; never copy that value into this repository. Its allowlisted fields, endpoint-local production CORS, input validation, Turnstile Siteverify and explicit responses are documented in that directory's README. It includes an IP guard of ten validated enquiry attempts per ten minutes. All submissions require a token; keep backend and frontend contracts coordinated.
2. Verify the controller in the real Frappe environment and perform one authorised real enquiry check, including structured stock, consent and Discord delivery.
3. Release the matching website change after the new handler is running. The current matching frontend is already deployed; do not restore the historical no-CORS integration.

The public frontend cannot add server-side validation, anti-spam enforcement or retention controls to this external endpoint. The honeypot and native validation are usability/light spam measures, not backend security.

Dedicated stock location, quantity, condition and consent fields were saved in ERPNext (Version `45751`). The Discord payload in `HOOK-0008` was updated and reloaded (Version `45752`); its destination and trigger are unchanged. Frappe successfully rendered the saved template against an existing lead through the Preview tool without sending a notification. Local Jinja tests cover quotes, line breaks, empty legacy fields, mention suppression and Discord Unicode length limits. See [CRM field mapping](./crm-field-mapping.md) for field names and [integration release notes](../integrations/frappe/README.md) for the backend-first release order.

## Existing-domain deployment
Cloudflare Pages is the production host. Use the existing repository and domain. The hosting document root must be `dist/`.

- Project: `srinfo-website`, connected to `devsrinfotech/srinfo-website`; the approved GitHub app is scoped to this repository.
- Production branch: `main`; automatic deployments enabled. Pushing a new published article triggers a build.
- Preset: Astro; build command: `npm run verify`; output directory: `dist`; root: repository root; build system: version 3.
- Build variables: `NODE_VERSION=22`, `ASTRO_TELEMETRY_DISABLED=1`. The initial successful build used Node 22.22.0. No CRM or Analytics secret is required in this static build.
- Apex and www DNS are proxied CNAME records targeting `srinfo-website.pages.dev`. Email, CRM subdomain and verification records were preserved.
- Cloudflare Single Redirect `Canonical www to HTTPS apex` matches only `www.srinfotech.biz`, uses status 301, retains the original path and query string, and sends traffic to `https://srinfotech.biz`.
- GitHub Pages publishing source is `None`. The historical `.github/workflows/deploy-pages.yml` workflow is disabled in GitHub; do not re-enable or run it for routine publishing. Repository history is retained.
- `CNAME` and `.nojekyll` remain harmless compatibility files in the build; they do not configure Cloudflare routing.

References: [Cloudflare's Astro guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/), [GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/), and [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).

Cloudflare Pages reads the checked-in `_redirects` file and supplies real 301 redirects for relevant legacy URLs. `/contact.html?cl=...` was verified to retain attribution while redirecting to `/contact/`. Lightweight HTML aliases remain as a compatibility fallback.

Retired digital marketing/SaaS pages have no relevant liquidation replacement. Keep them absent and let the host return the custom 404. Do not redirect all retired URLs to the homepage. Update any paid campaigns or external profile links deliberately.

## After release
1. Confirm HTTPS and one canonical host; configure host-level www/apex redirects as needed.
2. Check robots, `/sitemap-index.xml`, the compatible `/sitemap.xml` alias, `/rss.xml`, key category pages and a sample article.
3. Submit the sitemap through the domain owner's Search Console and Bing Webmaster Tools accounts.
4. Inspect existing indexed URLs/backlinks and review migration behaviour using real traffic data.
5. Confirm the privacy notice against actual CRM/hosting data practices and update it if the owner supplies further details.
6. Verify the restored GA4 tag `G-MVWQDQYKX9` with Tag Assistant/Realtime after deployment. It activates only in production builds on `srinfotech.biz` and `www.srinfotech.biz`, excluding local and other preview hosts. The shared initializer preserves recognised campaign parameters, omits arbitrary query strings and does not send inventory form contents. Google signals and advertising personalisation are disabled in the tag configuration.
7. In the GA4 account, review retained enhanced-measurement and key-event settings from the previous business. Do not count an unconfirmed CRM form response as a confirmed lead. Check the property's existing consent/data settings for the intended audience and annotate the business-transition date.

There are no automatic ranking, rich-result or AI-citation guarantees. Technical readiness is the foundation; useful original content, verifiable business information and relevant industry references support ongoing growth.

## Direct brand acquisition release — 27 October 2026

- Owner authorised website/content changes and pushing the completed release to `main`, triggering the existing Cloudflare Pages pipeline. LinkedIn work remains phase 2.
- Homepage, category/service introductions, about/process pages, shared CTAs and contact prompts now prioritise the stock-owning brand or retailer and its inventory, warehouse, returns and commercial teams. Apparel, footwear and electronics lead the homepage category order; home and kitchen remains available.
- `/for-brands/` provides a linked buying overview with role-specific guidance, ownership/release context, third-party warehouse guidance and visible FAQs. Shared Organization descriptions and the page's Service description match the public offer.
- Three guides dated 27 October cover apparel stock-release planning, footwear returns reconciliation and electronics handover coordination. Examples are labelled hypothetical; the electronics guide links to checked manufacturer guidance. Existing URLs and older publication dates are preserved.
- Contact changes are copy and placeholder changes only. The existing `message` field asks for role and stock context. WhatsApp opens an editable generic introduction; it does not send anything automatically. No backend rollout, new form fields or analytics changes are required.
- `npm run verify` passed: Astro diagnostics, eight unit tests, build, metadata, dates, internal links, sitemap/RSS and crawlable reachability. All 11 browser tests passed against the local production preview with CRM and Turnstile mocked. New pages were included in JavaScript-disabled and responsive checks; widths 320, 390, 768, 1000, 1024, 1151 and 1440 passed. Desktop/mobile screenshots were inspected in ignored `artifacts/brand-release/`.
- Independent review found no blocking content or code issues. No live lead was submitted. Production deployment still needs to be confirmed after the push; local checks do not establish live deployment or indexing.
- Clear audience language is intended to improve enquiry fit, not exclude brokers through a search-engine rule. [Google's AI search guidance](https://developers.google.com/search/docs/appearance/ai-features), checked 27 October, recommends the existing SEO foundations, useful text, internal links and schema consistent with visible content; no special AI file or ranking guarantee was added.

## Migration verification — 20 October 2026

- The initial Cloudflare build passed type checks, all seven unit tests, production build and rendered-site SEO verification. Homepage, contact, category and article content were inspected on the deployed site.
- HTTPS apex works. HTTPS www redirects with 301 to the apex, preserving path and query; HTTP www also reaches the HTTPS apex. A brief www certificate error during propagation resolved without bypassing certificate validation. Cloudflare shows active Universal SSL covering apex and wildcard.
- `/search-engine-optimization.html` returns the new custom 404 with HTTP status 404. Robots, XML sitemap and RSS content are served. Article JSON-LD includes connected Organization, WebSite, WebPage, BlogPosting and BreadcrumbList entities.
- GA4 `G-MVWQDQYKX9` matches the existing stream. Live tag loading returned HTTP 200 and page-view collection HTTP 204; Analytics Realtime displayed the new homepage/contact titles. QA visits are testing traffic, not evidence of new organic acquisition.
- GA4 industry was corrected to `Business & industrial`; existing India time zone and INR currency were retained. Enhanced-measurement form interactions are off, so generic form events are not used as proof of CRM delivery. The only existing key event was the default purchase event without stream data; no confirmed-lead conversion was invented.
- Search Console domain ownership is verified, its Analytics association is present, and manual-action/security reports show no issues. Its live homepage test reports that the URL is available to Google and can be indexed.
- The existing `/sitemap.xml` alias was resubmitted and read successfully as a sitemap index. Direct submission of `/sitemap-0.xml` succeeded with **16 discovered URLs**. The separate `/sitemap-index.xml` submission initially reported a fetch error and was retried; consult the live dashboard for its later processing status. All three endpoints remain valid parts of the same sitemap system.
- A manual homepage indexing request failed because Google's reCAPTCHA service could not connect. Sitemap discovery succeeded separately; retry manual indexing from Search Console when that service is available. No CAPTCHA was bypassed.
- Cloudflare's crawler-block switches are off for Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot and Perplexity; public robots allows crawling. This is access readiness, not a guarantee of indexing or AI citations.
- Search Console reports one unused ownership verification token. Confirm its former owner before revoking it or editing verification DNS. Preserve legitimate owner access.
- Screenshots and detailed rollback records are stored locally in ignored `artifacts/migration/` and `local-context/cloudflare-migration.md`. No real enquiry was sent to the CRM during migration checks.

## Search Console follow-up — 20 October 2026

- `/sitemap.xml` and its child `/sitemap-0.xml` both report **Success, 16 discovered pages**. These are discovered URLs, not a claim that every page is indexed.
- The separate `/sitemap-index.xml` entry still reports `Couldn't fetch` after resubmission. Google's own live URL test at 17:11 IST successfully fetched it, with crawling and indexing allowed. Its public HTTP response is 200 with `application/xml`; it is byte-identical to the successfully processed `/sitemap.xml` index. Retain the report entry for diagnosis rather than deleting it to disguise the status. Google still needs to refresh that sitemap processing result.
- A read-only production audit passed **32 HTTP checks**, including all 16 sitemap URLs (200, self-canonical, no noindex), all three sitemap endpoints, robots.txt, legacy redirects and representative retired marketing/PDF URLs (404). Results: ignored `artifacts/search-console/live-seo-audit.json`; reusable local checker: ignored `local-context/verify-live-seo.mjs`.
- Page indexing's aggregate report was last updated **12 October 2026**, before the business/hosting migration. Its 43 exclusions were reviewed across all five reasons: five duplicate URLs (four old main-site variants plus a separate subdomain login), three private CRM 403 URLs, two www redirects, 28 old contact query variants/retired documents/articles discovered but not indexed, and five crawled-but-not-indexed URLs (two CRM pages, two retired articles, one old contact query variant). Private CRM access restrictions and canonical redirects should remain in place.
- Inspection of `/insights/prepare-surplus-stock-list/` already shows discovery through both successful sitemaps. Its live Google test at 17:15 IST reports **URL is available to Google / Page can be indexed**, and one valid Breadcrumbs item. Google has not yet crawled/indexed that new article in its stored index report.
- The manual homepage recrawl request again failed with Google's submission error and `Could not connect to the reCAPTCHA service`; it was not accepted. No CAPTCHA was solved or bypassed. This does not prevent the successfully processed sitemaps from supplying the new URLs.
- Chrome briefly returned `ERR_QUIC_PROTOCOL_ERROR` for the public site during the checks; normal HTTPS homepage and sitemap navigation subsequently recovered without changing security, TLS or transport settings. Independent public HTTP checks and Google's live fetch succeeded.
- No production source, DNS, robots rules, private CRM permissions or deployment settings were changed during this follow-up. Evidence is saved in ignored `artifacts/search-console/`. Recheck the alternate sitemap status and the updated page report after Google processes the migration; do not try to force every historical/domain-wide exclusion to zero.
