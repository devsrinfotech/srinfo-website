"""Isolated handler/template tests; no real CRM, Redis, HTTP or Discord calls."""
import importlib.util
import json
from pathlib import Path
import re
import sys
import types
import unittest
from unittest.mock import MagicMock, patch
from jinja2.sandbox import SandboxedEnvironment

ROOT = Path(__file__).resolve().parents[1]

class Response:
    def __init__(self, response, status=200, mimetype=None, headers=None):
        self.status_code, self.data, self.headers = status, json.loads(response), headers or {}

class BackendTests(unittest.TestCase):
    def setUp(self):
        self.frappe = types.ModuleType('frappe')
        self.frappe.whitelist = lambda **kw: lambda fn: fn
        self.frappe.local = types.SimpleNamespace(request=types.SimpleNamespace(headers={'Origin':'https://srinfotech.biz'},content_length=2000))
        self.frappe.db = MagicMock()
        self.frappe.log_error = MagicMock()
        self.frappe.get_doc = MagicMock()
        self.frappe.get_doc.return_value.name = 'WEBSITE-LEAD-2026-0001'
        self.frappe.TooManyRequestsError = type('TooManyRequestsError',(Exception,),{})
        self.frappe.RateLimitExceededError = type('RateLimitExceededError',(Exception,),{})
        self.frappe.as_json = json.dumps
        self.frappe.conf = types.SimpleNamespace(turnstile_secret='private-test-secret')
        self.requests = types.ModuleType('requests')
        self.requests.RequestException = type('RequestException',(Exception,),{})
        self.requests.post = MagicMock()
        self.requests.post.return_value.status_code = 200
        self.requests.post.return_value.json.return_value = {'success':True,'hostname':'srinfotech.biz','action':'inventory_enquiry'}
        sys.modules['requests'] = self.requests
        docmod = types.ModuleType('frappe.model.document'); docmod.Document = object
        utils = types.ModuleType('frappe.utils')
        utils.now_datetime = lambda: '2026-10-20 18:00:00'
        utils.validate_email_address = lambda email, throw=False: email if re.fullmatch(r'[^@\s]+@[^@\s]+\.[^@\s]+',email) else None
        limiter = types.ModuleType('frappe.rate_limiter'); limiter.rate_limit = lambda **kw: lambda fn: fn
        wrappers = types.ModuleType('werkzeug.wrappers'); wrappers.Response = Response
        sys.modules.update({'frappe':self.frappe,'frappe.model':types.ModuleType('frappe.model'),'frappe.model.document':docmod,'frappe.utils':utils,'frappe.rate_limiter':limiter,'werkzeug':types.ModuleType('werkzeug'),'werkzeug.wrappers':wrappers})
        spec = importlib.util.spec_from_file_location('lead_handler',ROOT/'integrations/frappe/sr_website_leads.py')
        self.module = importlib.util.module_from_spec(spec); spec.loader.exec_module(self.module)
        self.values = dict(name=' Supplier ',email_id='seller@example.com',mobile_number='+91 9999999999',organization='Brand',company_website='example.com',service='Electronics liquidation',message='Quotes " and\nnew lines',click_location='Header',stock_location='Bengaluru',approximate_quantity='20 cartons',stock_condition='Untested electronics',contact_consent='1',form_version='inventory-v1')
        self.values['turnstile_token'] = 'single-use-test-token'

    def test_save_maps_fields_and_confirms_actual_insert(self):
        response = self.module.save_form(**self.values)
        self.assertEqual(response.status_code,201)
        self.assertTrue(response.data['message']['saved'])
        self.frappe.get_doc.return_value.insert.assert_called_once_with(ignore_permissions=True)
        data = self.frappe.get_doc.call_args.args[0]
        self.assertEqual(data['customer_name'],'Supplier')
        self.assertEqual(data['stock_location'],'Bengaluru')
        self.assertEqual(data['approximate_quantity'],'20 cartons')
        self.assertEqual(data['contact_consent'],1)
        self.assertEqual(data['consent_recorded_at'],'2026-10-20 18:00:00')
        self.assertEqual(data['status'],'Unchecked')
        self.assertEqual(response.headers['Access-Control-Allow-Origin'],'https://srinfotech.biz')
        self.assertNotIn('Access-Control-Allow-Credentials',response.headers)

    def test_footwear_category_is_saved_without_losing_pair_quantities(self):
        response = self.module.save_form(**dict(self.values, service='Footwear liquidation',
            approximate_quantity='800 pairs / 24 cartons', stock_condition='Surplus / overstock'))
        self.assertEqual(response.status_code, 201)
        data = self.frappe.get_doc.call_args.args[0]
        self.assertEqual(data['service'], 'Footwear liquidation')
        self.assertEqual(data['approximate_quantity'], '800 pairs / 24 cartons')
        self.requests.post.assert_called_once()

    def test_original_eight_arguments_remain_accepted_without_invented_consent(self):
        values = {k:v for k,v in self.values.items() if k in ['name','email_id','mobile_number','organization','company_website','service','message','click_location','turnstile_token']}
        response = self.module.save_form(**values)
        self.assertEqual(response.status_code,201)
        data = self.frappe.get_doc.call_args.args[0]
        self.assertEqual(data['contact_consent'],0)
        self.assertIsNone(data['consent_recorded_at'])

    def test_bad_input_is_rejected_without_database_writes(self):
        for overrides in [{'contact_consent':'0'},{'contact_consent':'false'},{'stock_location':''},{'email_id':'not-an-email'},{'mobile_number':'abc'},{'stock_condition':'Invented'},{'service':'Invented'},{'message':'x'*5001},{'name':['array']},{'fax_number':'spam'},{'company_website':'javascript:alert(1)'},{'form_version':'unknown'}]:
            with self.subTest(overrides=overrides):
                self.frappe.get_doc.reset_mock()
                response = self.module.save_form(**dict(self.values,**overrides))
                self.assertEqual(response.status_code,422)
                self.frappe.get_doc.assert_not_called()

    def test_origin_and_body_limits(self):
        self.frappe.local.request.headers['Origin']='https://attacker.invalid'
        response=self.module.save_form(**self.values)
        self.assertEqual(response.status_code,403)
        self.assertNotIn('Access-Control-Allow-Origin',response.headers)
        self.frappe.get_doc.assert_not_called()
        self.frappe.local.request.headers={}
        self.frappe.local.request.content_length=30000
        self.assertEqual(self.module.save_form(**self.values).status_code,413)

    def test_database_failure_rolls_back_and_never_confirms_save(self):
        self.frappe.get_doc.return_value.insert.side_effect=RuntimeError('private diagnostic')
        response=self.module.save_form(**self.values)
        self.assertEqual(response.status_code,500)
        self.frappe.db.rollback.assert_called_once()
        self.assertNotIn('private diagnostic',json.dumps(response.data))
        self.assertFalse(response.data['message'].get('saved',False))

    def test_rate_limit_returns_readable_error(self):
        for error in [self.frappe.TooManyRequestsError,self.frappe.RateLimitExceededError]:
            self.module._check_rate_limit=MagicMock(side_effect=error())
            self.assertEqual(self.module.save_form(**self.values).status_code,429)
        self.frappe.get_doc.assert_not_called()

    def test_turnstile_rejects_missing_or_malformed_tokens_even_for_legacy_calls(self):
        for token in [None,'',' '*10,'x'*2049,['token']]:
            with self.subTest(token_type=type(token).__name__):
                response=self.module.save_form(**dict(self.values,turnstile_token=token,form_version=''))
                self.assertEqual(response.status_code,403)
        self.requests.post.assert_not_called()
        self.frappe.get_doc.assert_not_called()

    def test_turnstile_requires_exact_success_action_and_production_hostname(self):
        for result in [None,[],{'success':'true','action':'inventory_enquiry','hostname':'srinfotech.biz'},
                       {'success':False,'error-codes':['timeout-or-duplicate']},
                       {'success':True,'action':'other','hostname':'srinfotech.biz'},
                       {'success':True,'action':'inventory_enquiry','hostname':'localhost'},
                       {'success':True,'action':'inventory_enquiry','hostname':'srinfotech.biz.attacker.invalid'}]:
            with self.subTest(result=result):
                self.requests.post.return_value.json.return_value=result
                self.assertEqual(self.module.save_form(**self.values).status_code,403)
        self.frappe.get_doc.assert_not_called()

    def test_turnstile_provider_and_configuration_failures_are_closed(self):
        self.requests.post.return_value.status_code=503
        self.assertEqual(self.module.save_form(**self.values).status_code,503)
        self.requests.post.return_value.status_code=200
        self.requests.post.return_value.json.side_effect=ValueError('non JSON')
        self.assertEqual(self.module.save_form(**self.values).status_code,503)
        self.requests.post.side_effect=self.requests.RequestException('timeout')
        self.assertEqual(self.module.save_form(**self.values).status_code,503)
        self.frappe.conf.turnstile_secret=''
        with patch.dict(self.module.os.environ, {'TURNSTILE_SECRET':''}):
            self.assertEqual(self.module.save_form(**self.values).status_code,503)
        self.frappe.get_doc.assert_not_called()

    def test_turnstile_redemption_precedes_insert_and_replay_is_rejected(self):
        self.assertEqual(self.module.save_form(**self.values).status_code,201)
        self.requests.post.assert_called_once_with('https://challenges.cloudflare.com/turnstile/v0/siteverify',data={'secret':'private-test-secret','response':'single-use-test-token'},timeout=10,allow_redirects=False)
        self.assertNotIn('turnstile_token',self.frappe.get_doc.call_args.args[0])
        self.frappe.get_doc.reset_mock()
        self.requests.post.return_value.json.return_value={'success':False,'error-codes':['timeout-or-duplicate']}
        self.assertEqual(self.module.save_form(**self.values).status_code,403)
        self.frappe.get_doc.assert_not_called()

class WebhookTests(unittest.TestCase):
    def test_template_handles_legacy_quotes_mentions_and_discord_limits(self):
        template=SandboxedEnvironment().from_string((ROOT/'integrations/frappe/discord-webhook.json.jinja').read_text(encoding='utf-8'))
        for doc in [{'name':'WEBSITE-LEAD-2026-0001'},dict.fromkeys(['customer_name','email','organization_name','mobile_number','website_url','service','stock_location','approximate_quantity','stock_condition','message','click_location'],'😀'*6000),{'name':'QA / #','customer_name':'Quotes " <@123> @everyone','message':'Line 1\nLine 2\\path','contact_consent':1,'consent_recorded_at':'2026-10-20 18:00:00'}]:
            doc.setdefault('name','WEBSITE-LEAD-2026-0001')
            payload=json.loads(template.render(doc=doc))
            self.assertEqual(payload['allowed_mentions'],{'parse':[]})
            embed=payload['embeds'][0]
            size=lambda s: len(s.encode('utf-16-le'))//2
            for field in embed['fields']:
                self.assertTrue(field['value'])
                self.assertLessEqual(size(field['value']),1024)
            total=sum(size(f['name'])+size(f['value']) for f in embed['fields'])+size(embed['title'])+size(embed.get('description',''))+size(embed['footer']['text'])
            self.assertLessEqual(total,6000)
            self.assertNotIn(' ',embed['url'])

if __name__=='__main__': unittest.main()
