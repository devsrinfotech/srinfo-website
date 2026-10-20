export const CRM_ENDPOINT = 'https://mycrm.srinfotech.biz/api/method/erpnext.product_request.doctype.sr_website_leads.sr_website_leads.save_form';
export const CRM_FIELDS = ['name', 'email_id', 'mobile_number', 'organization', 'company_website', 'service', 'message', 'click_location'];

/** Preserve the existing CRM contract. Extra inventory details stay inside message. */
export function createLeadPayload(values, source = 'Contact Page') {
  const payload = new FormData();
  const value = key => String(values[key] ?? '').trim();
  const message = [
    value('message'),
    value('quantity') && `Approximate quantity: ${value('quantity')}`,
    value('location') && `Stock location: ${value('location')}`,
    value('condition') && `Stock condition: ${value('condition')}`,
  ].filter(Boolean).join('\n');
  for (const key of CRM_FIELDS) {
    payload.append(key, key === 'message' ? message : key === 'click_location' ? String(source).slice(0, 200) : value(key));
  }
  return payload;
}

/**
 * A no-CORS opaque response is never evidence that the CRM saved the lead.
 * @param {FormData} payload
 * @param {{ fetcher?: typeof fetch, signal?: AbortSignal }} options
 */
export async function sendLead(payload, { fetcher = fetch, signal } = {}) {
  const response = await fetcher(CRM_ENDPOINT, { method: 'POST', body: payload, mode: 'no-cors', signal });
  if (response.type === 'opaque') return { status: 'unconfirmed' };
  if (!response.ok) throw new Error('The enquiry could not be delivered.');
  // No documented application-level confirmation shape exists in the old integration.
  return { status: 'unconfirmed' };
}
