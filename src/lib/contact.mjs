export const CRM_ENDPOINT = 'https://mycrm.srinfotech.biz/api/method/erpnext.product_request.doctype.sr_website_leads.sr_website_leads.save_form';
export const CRM_FIELDS = ['name', 'email_id', 'mobile_number', 'organization', 'company_website', 'service', 'message', 'click_location'];

/** Retain legacy fields and a stock summary while supplying structured inventory. */
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
  payload.append('stock_location', value('location'));
  payload.append('approximate_quantity', value('quantity'));
  payload.append('stock_condition', value('condition'));
  payload.append('contact_consent', [true, 1, '1', 'true', 'on', 'yes'].includes(values.consent) ? '1' : '0');
  payload.append('form_version', 'inventory-v1');
  payload.append('fax_number', value('fax_number'));
  payload.append('turnstile_token', value('cf-turnstile-response'));
  return payload;
}

/**
 * A no-CORS opaque response is never evidence that the CRM saved the lead.
 * @param {FormData} payload
 * @param {{ fetcher?: typeof fetch, signal?: AbortSignal }} options
 */
export async function sendLead(payload, { fetcher = fetch, signal } = {}) {
  const response = await fetcher(CRM_ENDPOINT, { method: 'POST', body: payload, mode: 'cors', credentials: 'omit', headers: { Accept: 'application/json' }, signal });
  if (response.type === 'opaque') return { status: 'unconfirmed' };
  if (!response.ok) throw new Error('The enquiry could not be delivered.');
  let result;
  try { result = (await response.json())?.message; } catch { return { status: 'unconfirmed' }; }
  if (result?.status === 'success' && result.saved === true && typeof result.lead_id === 'string' && result.lead_id.length > 0 && result.lead_id.length <= 140) {
    return { status: 'confirmed', leadId: result.lead_id };
  }
  return { status: 'unconfirmed' };
}
