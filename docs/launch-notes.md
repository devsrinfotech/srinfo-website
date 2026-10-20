# Launch and migration

## Current state
- The new Astro site builds to `dist/` with production URLs under `https://srinfotech.biz`.
- Original logo assets, email, primary phone, address and social URLs are retained.
- The old contact page contained one visible `+91 9945649161` alongside links to `+91 9606846445`. The new site consistently uses the latter, matching the header, footer and WhatsApp.
- The original LinkedIn URL contains `/mycompany/` and the social handles include `saas`. They are deliberately preserved; an account owner can update profile branding separately.
- Old website files were already moved/deleted in the worktree before this build. They have not been restored or deleted by this implementation.

## CRM contract and remaining verification
Endpoint:

```text
https://mycrm.srinfotech.biz/api/method/erpnext.product_request.doctype.sr_website_leads.sr_website_leads.save_form
```

Same POST multipart fields as the original: `name`, `email_id`, `mobile_number`, `organization`, `company_website`, `service`, `message`, `click_location`.

Quantity, stock condition and location are folded into `message`. Category is sent in `service` using the new liquidation category labels. The frontend uses `mode: no-cors`, matching the old integration, so an opaque result cannot confirm CRM storage. It retains input and gives a truthful unconfirmed-delivery message with direct contact options. It never reports guaranteed success from an unreadable response.

Browser tests intercept all CRM traffic. **No test lead has been sent to production.** Before launch, a CRM owner should:

1. Confirm that `service` accepts the new category strings, or supply the allowed values to map centrally.
2. Submit one authorised real enquiry and check that all eight fields reach the CRM.
3. Ideally return a documented success/error response and allow the production origin through CORS, after which the frontend can display confirmed success.

The public frontend cannot add server-side validation, anti-spam enforcement or retention controls to this external endpoint. The honeypot and native validation are usability/light spam measures, not backend security.

## Existing-domain deployment
Use the existing repository and domain. Do not deploy the archive. The hosting document root must be `dist/`.

The manual `.github/workflows/deploy-pages.yml` builds, verifies and deploys through GitHub Pages. In repository settings, choose GitHub Actions as the Pages source and retain the custom domain `srinfotech.biz`. The workflow is manual-only so preparing the code does not publish it. The generated output includes `CNAME` and `.nojekyll`.

Workflow references: [Astro's GitHub deployment guide](https://docs.astro.build/en/guides/deploy/github/) and [GitHub's custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). The workflow is prepared but has not been run on GitHub.

The checked-in `_redirects` file supplies real 301 redirects on hosts that support that format. GitHub Pages does not read `_redirects`; lightweight HTML aliases for `contact.html`, `blogs.html` and `privacy-policy.html` preserve old navigation there, with canonical destinations and `noindex`. The contact alias preserves query attribution with JavaScript.

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
