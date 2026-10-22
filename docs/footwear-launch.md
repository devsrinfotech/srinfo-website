# Footwear category

Footwear is an owner-confirmed buying category as of 22 October 2026. The website adds `/categories/footwear/`, a footwear stocklot preparation guide, a matching illustrative warehouse image, homepage/footer links, service-page links, related content and a preselected enquiry path. Category metadata and form values live together in `src/data/business.ts`; the footer and enquiry options render that shared list.

## Required before website release

In the **installed** Frappe controller, add the following string to the existing `CATEGORIES` set:

```python
"Footwear liquidation",
```

The complete set should then be:

```python
CATEGORIES = {
    "Apparel liquidation", "Footwear liquidation", "Home and kitchen liquidation",
    "Electronics liquidation", "Mixed inventory liquidation",
}
```

Reload/restart the web processes using the normal Bench procedure. Keep all existing private Turnstile configuration and the endpoint's verification logic intact. This change must precede pushing the matching website to `main`; the previous handler rejects the new category with HTTP 422. The repository controller has been updated, but this does not install it on the live CRM.

On 22 October 2026, the owner confirmed adding `Footwear liquidation` to the installed Frappe categories and restarting the server. This completes the owner-managed release prerequisite; it is not a live footwear enquiry verification.

No DocType schema change is required because `service` is a Data field. The existing Discord payload already reads `doc.service`; it will display Footwear liquidation without a payload edit. No live CRM changes or test enquiries are part of the local implementation.

The legacy eight field names, structured stock fields and `inventory-v1` contract stay the same. Footwear uses the `service` value `Footwear liquidation`; approximate quantity remains text, such as `800 pairs / 24 cartons`, and is retained in both the dedicated field and compatibility message. The form changes its quantity example to pairs for footwear and returns to units for other categories.

Use `npm run verify`, `npm run test:browser` against a built local preview and `python -m unittest discover -s tests -p test_crm_backend.py -v`. Browser and Python checks mock the CRM/provider; live acceptance requires the owner-installed controller. Do not send a fabricated live lead.
