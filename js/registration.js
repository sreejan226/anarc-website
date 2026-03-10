// ── Configuration ──
// Change this to your Railway production URL after deployment
const API_BASE_URL = "http://localhost:3000";

const form = document.getElementById("registrationForm");
const submitBtn = document.getElementById("submitBtn");
const btnText = submitBtn.querySelector(".btn-text");
const btnSpinner = submitBtn.querySelector(".btn-spinner");
const formMessage = document.getElementById("formMessage");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Clear previous state
  formMessage.style.display = "none";
  formMessage.className = "form-message";
  document.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));

  // Collect values
  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    rollNumber: form.rollNumber.value.trim(),
    department: form.department.value,
    year: form.year.value,
    eventName: form.eventName.value,
  };

  // Client-side validation
  const errors = [];
  if (!data.name) errors.push("name");
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push("email");
  if (!data.phone || !/^\d{10}$/.test(data.phone)) errors.push("phone");
  if (!data.rollNumber) errors.push("rollNumber");
  if (!data.department) errors.push("department");
  if (!data.year) errors.push("year");

  if (errors.length) {
    errors.forEach((id) => document.getElementById(id).classList.add("invalid"));
    showMessage("error", "Please fill in all required fields correctly. Phone must be 10 digits.");
    return;
  }

  // Disable button, show spinner
  submitBtn.disabled = true;
  btnText.style.display = "none";
  btnSpinner.style.display = "inline";

  try {
    const res = await fetch(API_BASE_URL + "/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      showMessage(
        "success",
        "Registration successful! Your Registration ID is <strong>" +
          result.registrationId +
          "</strong>. An admit card has been sent to <strong>" +
          data.email +
          "</strong>."
      );
      form.reset();
    } else {
      showMessage("error", result.message || "Registration failed. Please try again.");
    }
  } catch (err) {
    showMessage("error", "Could not connect to the server. Please try again later.");
  } finally {
    submitBtn.disabled = false;
    btnText.style.display = "inline";
    btnSpinner.style.display = "none";
  }
});

function showMessage(type, html) {
  formMessage.className = "form-message " + type;
  formMessage.innerHTML = html;
  formMessage.style.display = "block";
  formMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
