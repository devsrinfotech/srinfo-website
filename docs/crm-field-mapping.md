# Inventory enquiry → ERPNext field mapping

## Saved CRM schema, 20 October 2026

The owner authorised changes to the existing **SR Website Leads** DocType through its ERPNext Desk editor. Save and reload were verified; Version `45751` records the changes. Its Product Request module is running in developer mode, so these changes also update the server app's DocType source. Preserve that JSON in the backend app's version control/deployment process when updating the Python handler.

No existing fields, leads, permissions, naming series or status values were removed. `Service` was relabelled **Inventory Category** while retaining its internal `service` name and Data type so historical values and the old handler remain compatible.

| Website input | Existing CRM field | Status |
| --- | --- | --- |
| `name` | `customer_name` | Existing mapping to preserve in Python |
| `email_id` | `email` | Data capacity expanded to 254 |
| `mobile_number` | `mobile_number` | Unchanged |
| `organization` | `organization_name` | Data capacity expanded to 160 |
| `company_website` | `website_url` | Data capacity expanded to 300 |
| `service` | `service` | Data, relabelled Inventory Category |
| `message` | `message` | Text, unchanged |
| `click_location` | `click_location` | Data capacity expanded to 200 |

New fields are grouped under `inventory_details_section` (Inventory Details, Section Break):

| Intended source | New CRM field | Type / settings |
| --- | --- | --- |
| Website `location` | `stock_location` | Data, length 200, optional |
| Website `quantity` | `approximate_quantity` | Data, length 100, optional; supports units/cartons rather than a misleading numeric-only count |
| Website `condition` | `stock_condition` | Select, optional, empty choice supported |
| Explicit website consent | `contact_consent` | Check, default 0, read-only in Desk, optional |
| Server time when explicit consent is accepted | `consent_recorded_at` | Datetime, no default, read-only in Desk, optional |

Stock condition choices match the website exactly:

```text
Surplus / overstock
Ecommerce returns
Damaged labels / packaging
Untested electronics
Mixed condition
```

Existing/new legacy submissions must not be retroactively marked as consented. Zero with no timestamp means consent was not recorded by this integration; it is not evidence of an explicit refusal. Desk read-only is a UI safeguard, not API authorisation or server-side validation.

## Current compatibility boundary

**The schema, Discord template, backend and matching frontend are now released.** Cloudflare successfully deployed `a497a8b` on 21 October 2026. After the owner installed the controller, corrected its private Turnstile secret and restarted Frappe, the labelled internal test `SR-WEB-20261021-01` received the documented saved-lead acknowledgement. The owner confirmed the notification arrived in Discord. Desk authentication had expired, so the record was not separately opened there. The frontend retains the legacy keys and compatibility summary while supplying structured stock/consent fields; confirmed receipt ends the form attempt and prevents another submission on the same page.

The owner supplied the existing controller. The replacement is `integrations/frappe/sr_website_leads.py`; deployment and contract details are in that directory's README. Additional keys are `stock_location`, `approximate_quantity`, `stock_condition`, `contact_consent`, `form_version=inventory-v1`, `fax_number` and `turnstile_token`. The server sets the consent timestamp and the existing Unchecked status, validates inputs and returns a structured acknowledgement. It retains the original eight field mappings for current inventory categories, but every new request also requires a verified Turnstile token, including requests without `form_version`. The token is transient: do not add a DocType field for it or send it in notifications.

The prepared handler provides HTTP 201 plus `message.status=success`, `saved=true` and a nonempty `lead_id` only on a successful insert. Its endpoint-local CORS headers permit the two production website origins; no global CRM CORS changes are needed. The frontend omits credentials. Do not put server credentials or the Discord webhook URL in the static website.

## Existing Discord webhook

`HOOK-0008` was updated and reloaded on 20 October 2026 (Version `45752`). It remains enabled for `SR Website Leads`, event `after_insert`, condition `doc.status=="Unchecked"`, method POST and JSON structure. Its existing Discord destination is unchanged. The saved template is `integrations/frappe/discord-webhook.json.jinja`; it includes inventory fields, consent state, a notes preview and a direct CRM record link.

When updating the template, safely JSON-encode user text, bound Discord field lengths, provide fallbacks for legacy empty inventory fields, and suppress unsolicited mention parsing. Test a rendered payload locally before any authorised live notification. A failed Discord notification must not be confused with failure to save the lead or cause duplicate enquiries on retry.

Screenshots and the verified added-field metadata are stored in ignored `artifacts/crm/`. No webhook credential is stored in this document or the website repository.
