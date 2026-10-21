import test from 'node:test';
import assert from 'node:assert/strict';
import { createLeadPayload, sendLead, CRM_ENDPOINT } from '../src/lib/contact.mjs';

test('inventory enquiries retain legacy keys and add structured stock and explicit consent', () => {
  const payload = createLeadPayload({
    name: '  Test Supplier  ', email_id: 'test@example.com', mobile_number: '+919999999999',
    organization: 'Example Brand', company_website: 'example.com', service: 'Electronics liquidation',
    message: 'We have a stock list.', quantity: '100 units', location: 'Bengaluru', condition: 'Untested electronics',
    consent: 'on', fax_number: '', 'cf-turnstile-response': 'single-use-token',
  }, 'Category electronics');
  assert.deepEqual([...payload.keys()], ['name', 'email_id', 'mobile_number', 'organization', 'company_website', 'service', 'message', 'click_location', 'stock_location', 'approximate_quantity', 'stock_condition', 'contact_consent', 'form_version', 'fax_number', 'turnstile_token']);
  assert.equal(payload.get('turnstile_token'), 'single-use-token');
  assert.doesNotMatch(payload.get('message'), /single-use-token/);
  assert.equal(payload.get('name'), 'Test Supplier');
  assert.equal(payload.get('email_id'), 'test@example.com');
  assert.equal(payload.get('click_location'), 'Category electronics');
  assert.match(payload.get('message'), /Stock location: Bengaluru/);
  assert.match(payload.get('message'), /Stock condition: Untested electronics/);
  assert.equal(payload.get('stock_location'), 'Bengaluru');
  assert.equal(payload.get('approximate_quantity'), '100 units');
  assert.equal(payload.get('stock_condition'), 'Untested electronics');
  assert.equal(payload.get('contact_consent'), '1');
  assert.equal(createLeadPayload({consent: 'false'}).get('contact_consent'), '0');
  assert.equal(payload.get('form_version'), 'inventory-v1');
  assert.equal(payload.get('fax_number'), '');
});

test('opaque responses never claim CRM success', async () => {
  let request;
  const payload = createLeadPayload({});
  const result = await sendLead(payload, { fetcher: async (url, init) => {
    request = { url, ...init };
    return { type: 'opaque', ok: false, status: 0 };
  } });
  assert.equal(request.url, CRM_ENDPOINT);
  assert.equal(request.mode, 'cors');
  assert.equal(request.credentials, 'omit');
  assert.equal(request.method, 'POST');
  assert.equal(request.body, payload);
  assert.deepEqual(result, { status: 'unconfirmed' });
});

test('only a documented successful save with a lead reference confirms delivery', async () => {
  const fetcher = body => async () => ({ type: 'cors', ok: true, json: async () => body });
  assert.deepEqual(await sendLead(createLeadPayload({}), {fetcher:fetcher({message:{status:'success',saved:true,lead_id:'WEBSITE-LEAD-2026-0001'}})}), {status:'confirmed',leadId:'WEBSITE-LEAD-2026-0001'});
  for (const body of [{}, {message:'ok'}, {message:{status:'success'}}, {message:{status:'success',saved:true}}, {message:{status:'error'}}]) {
    assert.deepEqual(await sendLead(createLeadPayload({}),{fetcher:fetcher(body)}),{status:'unconfirmed'});
  }
  assert.deepEqual(await sendLead(createLeadPayload({}),{fetcher:async()=>({ok:true,json:async()=>{throw new SyntaxError('HTML');}})}),{status:'unconfirmed'});
});

test('HTTP errors and connection failures are surfaced rather than treated as success', async () => {
  const payload = createLeadPayload({});
  await assert.rejects(sendLead(payload, { fetcher: async () => ({ type: 'basic', ok: false, status: 500 }) }));
  await assert.rejects(sendLead(payload, { fetcher: async () => { throw new TypeError('Network unavailable'); } }));
});

test('submission passes through cancellation and retains a default attribution source', async () => {
  const controller = new AbortController();
  const payload = createLeadPayload({ message: 'Stock enquiry' });
  assert.equal(payload.get('click_location'), 'Contact Page');
  assert.equal(payload.get('message'), 'Stock enquiry');
  await sendLead(payload, { signal: controller.signal, fetcher: async (_url, options) => {
    assert.equal(options.signal, controller.signal);
    return { type: 'opaque' };
  } });
});
