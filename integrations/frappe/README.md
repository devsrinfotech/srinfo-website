# Paste-in Frappe controller and Discord template

## Files and release order

1. Replace the existing Python controller exposing `erpnext.product_request.doctype.sr_website_leads.sr_website_leads.save_form` with the **complete** contents of [`sr_website_leads.py`](./sr_website_leads.py). This is an app controller file, not a Frappe Server Script record. Keep a backup of the current server file. The matching DocType fields are already saved on the current CRM (Version `45751`); preserve that DocType JSON in the backend source/deployment too.
2. Configure the matching Turnstile secret on **Frappe**, then reload/restart web and worker processes using the server's normal deployment procedure. Use the private site configuration key `turnstile_secret` (in the actual Bench site's `site_config.json`) or the web processes' `TURNSTILE_SECRET` environment setting. Copy the secret directly from the Cloudflare dashboard into your server's normal private configuration; never paste it into chat, this repository, Pages variables or public JavaScript. The widget is **SR Infotech inventory enquiries**, public site key `0x4AAAAAAFeqlPwMHfzuemxA`. The existing authenticated Cloudflare dashboard was used to create it; its secret was not retrieved or saved locally. Keep the private configuration outside version control and set appropriate file permissions. In a standard Bench installation, clear that site's cache and run the usual Bench restart. A cache clear alone does not reload Python already imported by production workers. Use the actual Bench site name; do not assume it equals the public hostname.
3. The existing Discord webhook `HOOK-0008` was updated through Desk on 20 October 2026 (Version `45752`). [`discord-webhook.json.jinja`](./discord-webhook.json.jinja) is the saved JSON Request Body. Keep its existing destination URL, POST/JSON settings, `after_insert` event and `doc.status=="Unchecked"` condition. No secret webhook URL is included in these files.
4. Verify the handler in the Frappe environment and perform one owner-authorised real enquiry check through the website, checking the saved CRM record and notification. Local/browser tests intercept requests and never create production enquiries. The Python unit suite uses Frappe/HTTP/Redis stand-ins; it is not a live Frappe installation test.
5. Deploy the prepared website changes only after the new Python handler is running. Production currently still uses the earlier deployed eight-field/no-CORS frontend. The local frontend now sends the structured fields and checks a readable acknowledgement. No website commit/push/deployment was performed during this work.

## Request and response

The original eight multipart fields remain: `name`, `email_id`, `mobile_number`, `organization`, `company_website`, `service`, `message`, `click_location`. Additional arguments: `stock_location`, `approximate_quantity`, `stock_condition`, `contact_consent`, `form_version`, `fax_number`, `turnstile_token`. The token is mandatory for acceptance, never stored on a lead, and never included in Discord or analytics.

The new frontend always supplies `form_version=inventory-v1`; this requires explicit contact consent and stock location. Consent is `1` or `0`; the server sets its timestamp. Legacy field sets retain their mapping but **also require a valid Turnstile token**, even when `form_version` is omitted; the old deployed frontend cannot submit after enforcement until the matching website is released. Plan the backend-first change and website release together in a short maintenance window. Do not add a legacy-token bypass. Historical records are not changed and no historical consent is invented. The old retired digital-marketing category values are not valid new inventory enquiries. The compatibility stock summary remains in `message` alongside the dedicated fields.

## Turnstile configuration and validation

The managed widget was created on 21 October 2026 in the existing Cloudflare account with `srinfotech.biz`, `www.srinfotech.biz`, `localhost` and `127.0.0.1`; pre-clearance remains off. Production uses the public key in `src/data/turnstile.ts`. Local `astro dev` uses Cloudflare's official dummy key. The static build uses the real key; no extra Pages environment variable, Worker or DNS change is required.

The existing Frappe endpoint POSTs only the secret and token to `https://challenges.cloudflare.com/turnstile/v0/siteverify` with a ten-second timeout and redirects disabled. It requires JSON `success` to be exactly `true`, `action=inventory_enquiry`, and an exact hostname in `{srinfotech.biz,www.srinfotech.biz}`. Localhost and preview hostnames are never accepted by the production backend. Missing/invalid/expired/duplicate or mismatched tokens return 403 before insert; missing secret, network errors, non-JSON and non-2xx provider responses return 503. No form-version path bypasses verification. The existing IP guard runs before Siteverify to bound verification requests.

The submit button stays disabled until the widget succeeds. Error/expiry callbacks disable it again, retries are explicit, and every completed submission attempt resets the widget because tokens are single-use. A compact widget fits narrow phones. If the script is blocked, contact links remain available. No CAPTCHA tokens are persisted in the CRM or sent to GA4/Discord. The Discord template requires no CAPTCHA-specific change: it only fires after an accepted lead is inserted.

**Live validation remains pending:** install the controller and secret, restart Frappe, release the matching frontend, then use an owner-authorised genuine enquiry to verify a saved lead and notification. Also verify that submitting its redeemed token a second time returns 403 with no additional record/notification. A fresh production token must have the production action and hostname; local dummy tokens intentionally fail against the live endpoint. Local tests mock the provider and CRM; they do not validate the real secret, Redis, live SDK or server deployment.

Turnstile checks on 21 October 2026: `npm run verify` passed (42 checked files, eight Node tests, build and SEO assertions), all ten browser tests passed against the built preview, and eleven isolated Python/template tests passed. Desktop and 320px screenshots were inspected. Coverage includes missing/malformed tokens, exact success/action/hostname checks, provider failure, mocked duplicate-token rejection, blocked SDK, expiry, retry/reset after all submission outcomes and responsive resizing. See Cloudflare's [server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) and [testing guidance](https://developers.cloudflare.com/turnstile/troubleshooting/testing/).

Successful creation returns HTTP 201:

```json
{"message":{"status":"success","saved":true,"lead_id":"WEBSITE-LEAD-2026-00001"}}
```

Validation, forbidden origins, oversized requests, rate limiting and database errors return non-2xx responses with `message.status=error`. Failed insert transactions roll back. Only the documented success shape confirms receipt in the frontend; a 200 response, HTML error page or unreadable/opaque response cannot confirm a stored lead. No automatic retry is made. A lost response after a successful commit can still leave delivery uncertain; check the CRM before manually resubmitting to avoid duplicates.

The endpoint returns CORS response headers only for `https://srinfotech.biz` and `https://www.srinfotech.biz`. The browser uses multipart FormData, safelisted Accept headers and `credentials: omit`, so it needs no custom-header preflight or credentialed CORS. No global `allow_cors`/CSRF/authentication setting needs changing. Localhost and Pages preview origins are intentionally not permitted against the live CRM. Requests from the CRM's own origin or server clients without an Origin header remain possible; Origin checks are not bot authentication.

The paste-in handler includes a Frappe IP-based guard of **10 validated enquiry attempts per 10 minutes**, plus the existing honeypot and bounded allowlisted input. This is an endpoint guard, not a bot-proof system; shared corporate IPs share the quota. The real Redis limiter, database transaction lifecycle, web worker reload and asynchronous notification delivery must be checked in the deployed Frappe environment. Error logs contain an opaque support reference and exception type, not submitted contact or inventory values.

## Discord rendering

The template JSON-encodes the entire payload using Jinja `tojson`, disables mention parsing, gives empty legacy fields honest fallbacks, and bounds values below Discord's embed limits, including Unicode surrogate pairs. Notes are a preview; the linked CRM record retains the full message. Notification success is separate from CRM save success. The handler does not synchronously call Discord, and the website never receives its credential.

## Local checks

```powershell
npm run verify
npm run test:browser
python -m pip install -r tests/requirements-crm.txt
python -m unittest discover -s tests -p test_crm_backend.py -v
```

The Python dependency is only needed for isolated template tests. Neither the Python controller nor test dependencies are part of the static Pages build.

Verification on 20 October 2026: `npm run verify` passed (40 checked Astro files, eight Node tests, production build and rendered SEO assertions); seven isolated Python/template tests passed; all eight browser tests passed against the built static preview on port 4323. Python compilation and `git diff --check` also passed. The saved webhook successfully rendered through Frappe's own Preview tool against an existing lead without sending a notification. The new controller still requires installation and a real Frappe/Redis/database/notification check before frontend release.

References checked against primary sources: [Frappe Response handling](https://github.com/frappe/frappe/blob/version-14/frappe/handler.py), [POST transaction lifecycle](https://github.com/frappe/frappe/blob/version-14/frappe/app.py), [rate-limit decorator](https://github.com/frappe/frappe/blob/version-14/frappe/rate_limiter.py), [webhook template rendering](https://github.com/frappe/frappe/blob/version-15/frappe/integrations/doctype/webhook/webhook.py), and [Discord webhook parameters](https://docs.discord.com/developers/resources/webhook#execute-webhook).
