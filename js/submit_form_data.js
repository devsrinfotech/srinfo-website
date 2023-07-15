const form = document
  .getElementById("contact_form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = await grecaptcha.execute(
      "6LeLyiEnAAAAAGKq4oVVHOun-sJABia4uWbj4Lcv",
      { action: "submit" }
    );
    console.log(token);

    const f_name = document.getElementById("f_name").value;
    const f_email = document.getElementById("f_email").value;
    const f_subject = document.getElementById("f_subject").value;
    const f_phoen = document.getElementById("f_phoen").value;
    const f_message = document.getElementById("f_message").value;

    console.log(f_name);
    console.log(f_message);
    const body = {
      name: f_name,
      email: f_email,
      subject: f_subject,
      phone: f_phoen,
      message: f_message,
      token: token,
    };

    const params = new URLSearchParams();
    Object.keys(body).forEach((key) => params.append(key, body[key]));

    formData = params.toString();
    console.log(formData);
    await fetch("https://certificate.srinfotech.biz/srinfotechformMail", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    }).then(response => response.json()).then(data =>{console.log(data);});
  });
