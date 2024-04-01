async function submitPopUpForm() {
    console.log("pop up submit called");


    var formdata = await new FormData();
    formdata.append("name", document.getElementById('popup_name').value,);
    formdata.append("email_id", document.getElementById('popup_email').value);
    formdata.append("mobile_number", document.getElementById('popup_mobile_number').value);
    formdata.append("click_location", "Email Campaign Popup Form");
    formdata.append("organization", "");
    formdata.append("company_website", "");
    formdata.append("service", "");
    formdata.append("message", "");


    await fetch('https://mycrm.srinfotech.biz/api/method/erpnext.product_request.doctype.sr_website_leads.sr_website_leads.save_form', {
        method: 'POST',
        body: formdata,
        mode: 'no-cors',
    });

    // var form = document.getElementById('smm-form');
    // form.reset();
    alert('Thank you for Reaching out to us. Your Broacher Will Download Now.');
    window.open('assets/brochers/SR_Infotech_Services.pdf', '_blank');
    silverBox({ removeSilverBox: "all" });
}