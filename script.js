// Dr Ajay Homeopathic Clinic — shared behaviour

// --- WhatsApp number (international format, digits only) ---
const CLINIC_WA = "918435106565";
const CLINIC_EMAIL = "dr.kuajay@gmail.com";

// --- mobile nav ---
document.addEventListener("click", (e) => {
  const toggle = e.target.closest("[data-nav-toggle]");
  if (toggle) {
    const head = document.querySelector(".site-head");
    head.classList.toggle("open");
    const open = head.classList.contains("open");
    toggle.setAttribute("aria-expanded", String(open));
  }
  // close menu when a nav link is tapped
  if (e.target.closest(".site-head.open .nav a")) {
    document.querySelector(".site-head").classList.remove("open");
  }
});

// --- scroll reveal ---
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// --- booking form ---
function buildMessage(f) {
  const g = (id) => (document.getElementById(id)?.value || "").trim();
  const name = g("f-name");
  const age = g("f-age");
  const phone = g("f-phone");
  const when = g("f-when");
  const kind = g("f-kind");
  const concern = g("f-concern");

  const lines = [
    "Namaste Dr Ajay, I would like to book an appointment.",
    "",
    name ? `• Name: ${name}` : "",
    age ? `• Age: ${age}` : "",
    phone ? `• Phone: ${phone}` : "",
    kind ? `• Visit: ${kind}` : "",
    when ? `• Preferred day/time: ${when}` : "",
    concern ? `• Reason / complaint: ${concern}` : "",
  ].filter(Boolean);

  return lines.join("\n");
}

function initBookingForm() {
  const form = document.getElementById("booking-form");
  if (!form) return;

  const nameEl = document.getElementById("f-name");
  const phoneEl = document.getElementById("f-phone");

  function markError(el, on) {
    if (!el) return;
    el.setAttribute("aria-invalid", on ? "true" : "false");
    const msg = el.parentElement.querySelector(".err-msg");
    if (msg) msg.classList.toggle("show", on);
  }

  // clear the error as soon as the user starts fixing it
  nameEl.addEventListener("input", () => { if (nameEl.value.trim()) markError(nameEl, false); });
  if (phoneEl) phoneEl.addEventListener("input", () => markError(phoneEl, false));

  function validate() {
    let ok = true;
    if (!nameEl.value.trim()) { markError(nameEl, true); if (ok) nameEl.focus(); ok = false; }
    // phone optional, but if given should have at least 7 digits
    if (phoneEl && phoneEl.value.trim()) {
      const digits = phoneEl.value.replace(/\D/g, "");
      if (digits.length < 7) { markError(phoneEl, true); if (ok) phoneEl.focus(); ok = false; }
    }
    return ok;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) return;
    const msg = encodeURIComponent(buildMessage());
    window.open(`https://wa.me/${CLINIC_WA}?text=${msg}`, "_blank", "noopener");
    showSent();
  });

  const emailBtn = document.getElementById("email-instead");
  if (emailBtn) {
    emailBtn.addEventListener("click", () => {
      if (!validate()) return;
      const body = encodeURIComponent(buildMessage());
      const subject = encodeURIComponent("Appointment request — Dr Ajay Homeopathic Clinic");
      window.location.href = `mailto:${CLINIC_EMAIL}?subject=${subject}&body=${body}`;
      showSent();
    });
  }

  function showSent() {
    const note = document.getElementById("form-sent");
    if (note) { note.hidden = false; note.scrollIntoView({ behavior: "smooth", block: "center" }); }
  }
}
initBookingForm();

// --- inject floating WhatsApp button + mobile action bar on every page ---
(function injectActions() {
  const waIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.25.7-1.44 1.33-1.98 1.38-.53.05-.53.44-3.34-.7-2.8-1.14-4.6-4-4.74-4.19-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.35a1.04 1.04 0 0 1 .75-.35c.19 0 .37 0 .53.01.17.01.4-.06.62.48.25.6.85 2.08.92 2.23.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.37-.42.49-.14.14-.28.29-.12.56.16.28.71 1.17 1.53 1.9 1.05.93 1.94 1.22 2.22 1.36.28.14.44.12.6-.07.16-.19.69-.8.87-1.08.18-.28.37-.23.62-.14.25.09 1.6.76 1.87.9.28.14.46.21.53.32.07.12.07.65-.18 1.35Z"/></svg>';
  const phoneIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>';

  const onContact = /contact\.html$/.test(location.pathname) || location.pathname.endsWith("/contact");
  const bookHref = onContact ? "#booking-form" : "contact.html";
  const waPrefill = encodeURIComponent("Namaste Dr Ajay, I would like to book an appointment.");

  // floating button -> booking form (or WA directly on contact page's own form is nicer, but keep consistent: go to form)
  const fab = document.createElement("a");
  fab.className = "wa-fab";
  fab.href = `https://wa.me/${CLINIC_WA}?text=${waPrefill}`;
  fab.target = "_blank"; fab.rel = "noopener";
  fab.setAttribute("aria-label", "Chat with the clinic on WhatsApp");
  fab.innerHTML = waIcon;
  document.body.appendChild(fab);

  // mobile bar: call + book
  const bar = document.createElement("div");
  bar.className = "action-bar";
  bar.innerHTML =
    `<a class="btn btn--ghost" href="tel:+91${CLINIC_WA.slice(2)}">${phoneIcon} Call</a>` +
    `<a class="btn btn--wa" href="${bookHref}">${waIcon} Book appointment</a>`;
  document.body.appendChild(bar);
})();

// keep footer year current
document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
