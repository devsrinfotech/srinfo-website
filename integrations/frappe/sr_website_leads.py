# Copyright (c) 2024, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

"""Replace the existing SR Website Leads controller with this complete file.

Retains the original eight arguments. New inventory-v1 requests supply the
additional stock/consent fields. No Discord credential belongs in this file.
"""
import os
import re
from urllib.parse import urlsplit
from uuid import uuid4

import frappe
import requests
from frappe.model.document import Document
from frappe.rate_limiter import rate_limit
from frappe.utils import now_datetime, validate_email_address
from werkzeug.wrappers import Response


WEBSITE_ORIGINS = {"https://srinfotech.biz", "https://www.srinfotech.biz"}
TURNSTILE_HOSTNAMES = {"srinfotech.biz", "www.srinfotech.biz"}
TURNSTILE_ACTION = "inventory_enquiry"
CATEGORIES = {
    "Apparel liquidation", "Home and kitchen liquidation",
    "Electronics liquidation", "Mixed inventory liquidation",
}
CONDITIONS = {
    "Surplus / overstock", "Ecommerce returns", "Damaged labels / packaging",
    "Untested electronics", "Mixed condition",
}


class SRWebsiteLeads(Document):
    pass


class LeadInputError(ValueError):
    pass


class TurnstileUnavailable(Exception):
    pass


def _verify_turnstile(token):
    # Every request needs a single-use token, including legacy argument sets.
    # Do not save tokens on the lead, forward form contents, or log credentials.
    if not isinstance(token, str) or not token.strip() or len(token) > 2048:
        return False
    secret = getattr(frappe.conf, "turnstile_secret", None) or os.environ.get("TURNSTILE_SECRET")
    if not isinstance(secret, str) or not secret.strip():
        raise TurnstileUnavailable()
    try:
        response = requests.post(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            data={"secret": secret.strip(), "response": token}, timeout=10,
            allow_redirects=False,
        )
        if not 200 <= response.status_code < 300:
            raise TurnstileUnavailable()
        result = response.json()
    except (requests.RequestException, ValueError):
        raise TurnstileUnavailable() from None
    return (
        isinstance(result, dict) and result.get("success") is True
        and result.get("action") == TURNSTILE_ACTION
        and isinstance(result.get("hostname"), str)
        and result["hostname"] in TURNSTILE_HOSTNAMES
    )


def _text(value, label, limit, required=False):
    if value is None:
        value = ""
    if not isinstance(value, str):
        raise LeadInputError("Please check the {} field.".format(label))
    value = value.strip()
    if (required and not value) or len(value) > limit:
        raise LeadInputError("Please check the {} field.".format(label))
    if re.search(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", value):
        raise LeadInputError("Please check the {} field.".format(label))
    return value


def _consented(value):
    # Never use bool(value): the string "false" is truthy in Python.
    if value is None:
        return False
    if not isinstance(value, (str, bool, int)):
        raise LeadInputError("Please check the contact consent field.")
    value = str(value).strip().lower()
    if value not in {"", "0", "false", "off", "no", "1", "true", "on", "yes"}:
        raise LeadInputError("Please check the contact consent field.")
    return value in {"1", "true", "on", "yes"}


def _reply(http_status, **payload):
    # An endpoint-local response avoids opening CORS across the entire CRM.
    # Multipart FormData + Accept: application/json needs no custom preflight.
    headers = {"Cache-Control": "no-store", "Vary": "Origin"}
    origin = frappe.local.request.headers.get("Origin")
    if origin in WEBSITE_ORIGINS:
        headers["Access-Control-Allow-Origin"] = origin
    return Response(
        frappe.as_json({"message": payload}), status=http_status,
        mimetype="application/json", headers=headers,
    )


@rate_limit(limit=10, seconds=600, methods=["POST"])
def _check_rate_limit():
    # Some Frappe releases call decorated functions with the HTTP form_dict.
    # Keep this guard argument-free; never decorate a helper taking `data`.
    pass


def _insert_lead(data):
    # Only this fixed DocType/allowlisted field dictionary can be created.
    lead = frappe.get_doc(data)
    lead.insert(ignore_permissions=True)
    return lead


@frappe.whitelist(allow_guest=True, methods=["POST"])
def save_form(
    name=None, email_id=None, mobile_number=None, organization=None,
    company_website=None, service=None, message=None, click_location=None,
    stock_location=None, approximate_quantity=None, stock_condition=None,
    contact_consent=None, form_version=None, fax_number=None, turnstile_token=None,
):
    request = frappe.local.request
    origin = request.headers.get("Origin")
    if origin and origin not in WEBSITE_ORIGINS | {"https://mycrm.srinfotech.biz"}:
        return _reply(403, status="error", code="origin_not_allowed",
                      message="Please submit this enquiry through the SR Infotech website.")
    if request.content_length and request.content_length > 20000:
        return _reply(413, status="error", code="request_too_large",
                      message="Please shorten the enquiry and try again.")

    try:
        version = _text(form_version, "form version", 30)
        if version not in {"", "inventory-v1"}:
            raise LeadInputError("Please refresh the contact page and try again.")
        if _text(fax_number, "verification", 200):
            raise LeadInputError("This enquiry could not be accepted.")
        consent = _consented(contact_consent)
        if version == "inventory-v1" and not consent:
            raise LeadInputError("Please agree to be contacted about this enquiry.")

        data = {
            "doctype": "SR Website Leads",
            "customer_name": _text(name, "name", 100, required=True),
            "email": _text(email_id, "email", 254, required=True),
            "mobile_number": _text(mobile_number, "phone number", 25, required=True),
            "organization_name": _text(organization, "company name", 160, required=True),
            "website_url": _text(company_website, "company website", 300),
            "service": _text(service, "inventory category", 140, required=True),
            # Includes the compatibility stock summary added by the website.
            "message": _text(message, "message", 5000),
            "click_location": _text(click_location, "enquiry source", 200) or "Contact Page",
            "stock_location": _text(stock_location, "stock location", 200, required=version == "inventory-v1"),
            "approximate_quantity": _text(approximate_quantity, "quantity", 100),
            "stock_condition": _text(stock_condition, "stock condition", 140),
            "contact_consent": int(consent),
            "consent_recorded_at": now_datetime() if consent else None,
            "status": "Unchecked",
        }
        if "," in data["email"] or ";" in data["email"] or not validate_email_address(data["email"], throw=False):
            raise LeadInputError("Please enter one valid email address.")
        phone = data["mobile_number"]
        if not re.fullmatch(r"[+0-9 ()-]{7,25}", phone) or not 7 <= len(re.sub(r"\D", "", phone)) <= 15:
            raise LeadInputError("Please enter a valid phone number.")
        if data["service"] not in CATEGORIES:
            raise LeadInputError("Please select an inventory category.")
        if data["stock_condition"] and data["stock_condition"] not in CONDITIONS:
            raise LeadInputError("Please select a stock condition from the list.")
        if data["website_url"]:
            website = data["website_url"]
            try:
                parsed = urlsplit(website if "://" in website else "https://" + website)
            except ValueError:
                raise LeadInputError("Please enter a valid company website.")
            if parsed.scheme not in {"http", "https"} or not parsed.hostname or "." not in parsed.hostname or parsed.username or parsed.password:
                raise LeadInputError("Please enter a valid company website.")

        _check_rate_limit()
        if not _verify_turnstile(turnstile_token):
            return _reply(403, status="error", code="verification_failed",
                          message="Please complete the security check again and resubmit.")
        lead = _insert_lead(data)
        # Frappe commits a successful POST transaction before sending this
        # response. The existing after_insert webhook remains asynchronous.
        return _reply(201, status="success", saved=True, lead_id=lead.name)
    except LeadInputError as error:
        return _reply(422, status="error", code="validation_error", message=str(error))
    except TurnstileUnavailable:
        return _reply(503, status="error", code="verification_unavailable",
                      message="The security check is temporarily unavailable. Please try again or contact us directly.")
    except (frappe.RateLimitExceededError, frappe.TooManyRequestsError):
        frappe.db.rollback()
        return _reply(429, status="error", code="rate_limited",
                      message="Too many enquiries. Please wait before trying again, or contact us directly.")
    except Exception as error:
        # Returning an error instead of raising requires an explicit rollback.
        frappe.db.rollback()
        reference = uuid4().hex[:12]
        # Do not print submitted contacts, inventory details or SQL values.
        frappe.log_error(title="Website inventory enquiry failed",
                         message="Reference: {}\nException type: {}".format(reference, type(error).__name__))
        return _reply(500, status="error", code="save_failed", reference=reference,
                      message="We could not save the enquiry. Please contact us directly.")
