import test from 'node:test';
import assert from 'node:assert/strict';
import { createLeadPayload, sendLead, CRM_ENDPOINT } from '../src/lib/contact.mjs';

test('new inventory enquiries retain the exact eight-field legacy CRM contract', () => {
  const payload = createLeadPayload({
    name: '  Test Supplier  ', email_id: 'test@example.com', mobile_number: '+919999999999',
    organization: 'Example Brand', company_website: 'example.com', service: 'Electronics liquidation',
    message: 'We have a stock list.', quantity: '100 units', location: 'Bengaluru', condition: 'Untested electronics',
    consent: 'on', fax_number: '',
  }, 'Category electronics');
  assert.deepEqual([...payload.keys()], ['name', 'email_id', 'mobile_number', 'organization', 'company_website', 'service', 'message', 'click_location']);
  assert.equal(payload.get('name'), 'Test Supplier');
  assert.equal(payload.get('email_id'), 'test@example.com');
  assert.equal(payload.get('click_location'), 'Category electronics');
  assert.match(payload.get('message'), /Stock location: Bengaluru/);
  assert.match(payload.get('message'), /Stock condition: Untested electronics/);
  assert.equal(payload.has('consent'), false);
});

test('opaque responses never claim CRM success', async () => {
  let request;
  const payload = createLeadPayload({});
  const result = await sendLead(payload, { fetcher: async (url, init) => {
    request = { url, ...init };
    return { type: 'opaque', ok: false, status: 0 };
  } });
  assert.equal(request.url, CRM_ENDPOINT);
  assert.equal(request.mode, 'no-cors');
  assert.equal(request.method, 'POST');
  assert.equal(request.body, payload);
  assert.deepEqual(result, { status: 'unconfirmed' });
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
