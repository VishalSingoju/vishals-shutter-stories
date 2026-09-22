document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("form-status");
  const submitButton = document.getElementById("submit-button");

  function setError(field, message) {
    const error = form.querySelector(`[data-error-for="${field.name}"]`);
    if (error) error.textContent = message;
    field.setAttribute("aria-invalid", "true");
  }

  function clearError(field) {
    const error = form.querySelector(`[data-error-for="${field.name}"]`);
    if (error) error.textContent = "";
    field.removeAttribute("aria-invalid");
  }

  function validate() {
    let valid = true;
    const required = form.querySelectorAll("[required]");

    required.forEach(field => {
      clearError(field);
      if (!field.value.trim()) {
        setError(field, "This field is required.");
        valid = false;
      }
    });

    const email = form.elements.email;
    if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      setError(email, "Enter a valid email address.");
      valid = false;
    }

    return valid;
  }

  form.querySelectorAll("input, select, textarea").forEach(field => {
    field.addEventListener("input", () => clearError(field));
    field.addEventListener("change", () => clearError(field));
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    if (!validate()) {
      status.classList.add("error");
      status.textContent = "Please check the highlighted fields.";
      return;
    }

    const accessKey = form.elements.access_key.value;
    if (!accessKey || accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
      status.classList.add("error");
      status.textContent = "Contact form setup is incomplete. Add your Web3Forms access key first.";
      return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = "Sending…";

    try {
      const formData = new FormData(form);
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        form.reset();
        status.classList.add("success");
        status.textContent = "Thanks. Your inquiry has been sent successfully.";
      } else {
        throw new Error(result.message || "Submission failed.");
      }
    } catch (error) {
      status.classList.add("error");
      status.textContent = "Something went wrong while sending the inquiry. Please try again or email directly.";
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Send Inquiry <span>↗</span>';
    }
  });
});
