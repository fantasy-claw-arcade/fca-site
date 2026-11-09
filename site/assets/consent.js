/* Cookie consent: Accept or Reject non-essential (analytics/marketing) cookies.
   Nothing non-essential loads until a visitor accepts. Global Privacy Control is honored as Reject.
   To turn on tracking at launch, fill in the IDs below (public IDs, safe to commit). */
(function () {
  var TRACKING = {
    ga4: "G-DDHMTRKQR1", // Google Analytics 4 measurement ID (existing property, also used by the Wix site)
    hubspot: "245740388" // HubSpot tracking (loads js-na2.hs-scripts.com/245740388.js)
  };
  // Track only on the live site (or a preview with ?fca_track_test=1 once, for testing).
  var LIVE = /(^|\.)fantasyclawarcade\.com$/.test(location.hostname);
  try { if (/[?&]fca_track_test=1/.test(location.search)) sessionStorage.setItem("fcaTrackTest", "1"); if (sessionStorage.getItem("fcaTrackTest") === "1") LIVE = true; } catch (e) {}
  var KEY = "fcaCookieConsent";

  function read() { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, JSON.stringify({ choice: v, date: new Date().toISOString() })); } catch (e) {} }

  var loaded = false;
  function loadTracking() {
    if (loaded || !LIVE) return; loaded = true;
    if (TRACKING.ga4) {
      var g = document.createElement("script"); g.async = true;
      g.src = "https://www.googletagmanager.com/gtag/js?id=" + TRACKING.ga4; document.head.appendChild(g);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date()); window.gtag("config", TRACKING.ga4);
      trackEvents();
    }
    if (TRACKING.hubspot) {
      var h = document.createElement("script"); h.async = true; h.defer = true; h.id = "hs-script-loader";
      h.src = "https://js-na2.hs-scripts.com/" + TRACKING.hubspot + ".js"; document.body.appendChild(h);
    }
  }


  /* Key actions sent to Google Analytics as events (only after Accept, only on the live site). */
  var FORMS = {
    "6e593274-ec53-4c02-a072-43a20a602fbf": "franchise",
    "401b04a9-8969-442f-a9e0-b6223b49d55d": "party",
    "e5bd755a-82f6-4c87-9a23-5e920b8b61e6": "contact",
    "daaa4941-dc07-4440-b545-da42ddf91c57": "collaboration",
    "abc80c98-4b2e-444a-b978-485510931960": "employment"
  };
  var tracked = false;
  function ev(name, params) { if (window.gtag) window.gtag("event", name, params || {}); }
  function trackEvents() {
    if (tracked) return; tracked = true;
    function lead(id) { var kind = FORMS[id] || "other"; ev(kind === "employment" ? "job_application" : "generate_lead", { form_type: kind, form_id: id || "" }); }
    window.addEventListener("hs-form-event:on-submission:success", function (e) {
      var d = e.detail || {}; lead(d.formId || (d.form && d.form.id) || "");
    });
    window.addEventListener("message", function (e) {
      var d = e.data; if (d && d.type === "hsFormCallback" && d.eventName === "onFormSubmitted") lead(d.id);
    });
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a, button"); if (!a) return;
      var href = a.getAttribute("href") || "";
      if (href.indexOf("tel:") === 0) ev("phone_call_click", { phone: href.slice(4), page: location.pathname });
      else if (/google\.[a-z.]+\/maps|maps\.apple\.com|goo\.gl\/maps|maps\.app\.goo\.gl/.test(href)) ev("get_directions_click", { page: location.pathname, label: (a.textContent || "").trim().slice(0, 60) });
      else if (a.hasAttribute("data-book")) ev("party_book_click", { package: (a.closest("[data-pkg]") || {}).getAttribute ? a.closest("[data-pkg]").getAttribute("data-pkg") : "", square: href.indexOf("http") === 0 });
      else if (a.hasAttribute("data-custom")) ev("party_custom_click");
      else if (a.hasAttribute("data-open-form")) ev("franchise_info_open", { page: location.pathname });
      else if (href.indexOf("/job-openings/") === 0) ev("job_view_click", { job: href.split("/").pop() });
      else if (/squareup\.com|square\.site/.test(href)) ev("square_link_click", { page: location.pathname });
    });
  }

  var banner;
  function build() {
    banner = document.createElement("div");
    banner.className = "cookie-banner"; banner.setAttribute("role", "region"); banner.setAttribute("aria-label", "Cookie choices");
    banner.innerHTML =
      '<p><b>Cookies on our site.</b> We use essential cookies to keep the site working. With your OK, we also use ' +
      'analytics and marketing cookies, including Google Analytics and HubSpot, to see how people use the site and ' +
      'measure our marketing and advertising. Accept to allow them, or Reject to keep essential cookies only. ' +
      'You can change your choice anytime under Cookie settings. See our <a href="/privacy-policy">Privacy Policy</a>.</p>' +
      '<div class="cookie-actions"><button type="button" class="btn ghost" data-cookie="reject">Reject</button>' +
      '<button type="button" class="btn ghost" data-cookie="accept">Accept</button></div>';
    banner.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cookie]"); if (!b) return;
      var v = b.getAttribute("data-cookie"); save(v === "accept" ? "accepted" : "rejected");
      hide(); if (v === "accept") loadTracking(); else if (loaded) location.reload();
    });
    document.body.appendChild(banner);
  }
  function show() { if (!banner) build(); banner.hidden = false; document.documentElement.classList.add("cookie-open"); }
  function hide() { if (banner) banner.hidden = true; document.documentElement.classList.remove("cookie-open"); }

  function init() {
    document.querySelectorAll("[data-cookie-settings]").forEach(function (b) {
      b.addEventListener("click", function () { show(); var f = banner.querySelector("button"); if (f) f.focus(); });
    });
    var c = read();
    if (navigator.globalPrivacyControl === true && !c) { save("rejected"); return; }
    if (!c) { show(); return; }
    if (c.choice === "accepted") loadTracking();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
