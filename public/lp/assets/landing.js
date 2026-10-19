/* Wavefront Studio ad landing pages: sends each lead to the Wavefront Studio CRM
   (captureLandingPageLead) and runs the mobile CTA bar. No libraries, no third-party requests. */
(function () {
  "use strict";

  var MAIL_TO = "info@wavefrontstudiollc.com";
  var PHONE = "(941) 415-2595";
  var TIMEOUT_MS = 15000;

  var body = document.body;
  var ad = body.getAttribute("data-ad") || "";
  var offer = body.getAttribute("data-offer") || "";
  var form = document.getElementById("lead-form");
  var card = document.getElementById("form");
  if (!form || !card) return;

  var kind = form.getAttribute("data-kind") || "scorecard";
  var errorBox = document.getElementById("form-error");
  var thanksTitle = document.getElementById("thanks-title");
  var thanksText = document.getElementById("thanks-text");
  var submitBtn = form.querySelector("button[type=submit]");
  var submitLabel = submitBtn ? submitBtn.textContent : "";
  var sticky = document.getElementById("sticky");
  var page = window.location.pathname.split("/").filter(Boolean).pop() || "";

  // Tracking hook. Does nothing until a Meta pixel or Google tag is added to the page.
  window.wfTrack = function (name, data) {
    try {
      if (typeof window.fbq === "function") window.fbq("track", name, data || {});
      if (typeof window.gtag === "function") window.gtag("event", name.toLowerCase(), data || {});
    } catch (e) {
      /* tracking must never break the form */
    }
  };

  // Hidden fields: which ad and offer this lead came from, plus any utm_ values in the URL.
  function setHidden(name, value) {
    var el = form.elements[name];
    if (el && value) el.value = String(value).slice(0, 200);
  }
  var params = new URLSearchParams(window.location.search);
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(function (k) {
    setHidden(k, params.get(k));
  });
  setHidden("ad", ad);
  setHidden("offer", offer);
  setHidden("page", page);

  function showError(message) {
    if (!errorBox) return;
    errorBox.textContent = message;
    errorBox.setAttribute("data-show", "");
  }
  function hideError() {
    if (!errorBox) return;
    errorBox.removeAttribute("data-show");
    errorBox.textContent = "";
    var phoneField = form.elements.phone;
    if (phoneField) {
      phoneField.removeAttribute("aria-invalid");
      phoneField.removeAttribute("aria-describedby");
    }
  }
  function busy(on) {
    if (!submitBtn) return;
    submitBtn.setAttribute("aria-busy", on ? "true" : "false");
    submitBtn.disabled = !!on;
    submitBtn.textContent = on ? "Sending…" : submitLabel;
  }
  function done(mode) {
    card.setAttribute("data-state", "done");
    if (sticky) sticky.hidden = true;
    if (mode === "email") {
      // Not a confirmed lead until the visitor presses send, so no tracking event here.
      if (thanksTitle) thanksTitle.textContent = "One more step.";
      if (thanksText) {
        thanksText.textContent =
          "Your email app should open with your details filled in. Press send and we have them. If it doesn’t open, call " +
          PHONE +
          ".";
      }
    } else if (mode === "sent") {
      window.wfTrack("Lead", { ad: ad, offer: offer });
    }
    if (thanksTitle) {
      thanksTitle.focus();
      card.scrollIntoView({ block: "center" });
    }
  }

  function field(data, name) {
    return String(data.get(name) || "").trim();
  }

  // Scorecard-style forms don't ask for a business name, so the CRM's business name comes
  // from the website box. A plain address ("https://www.Example.com/about") becomes its
  // domain. Anything else is kept as typed ("Joe's Roofing"), and so is a link to a social
  // or review profile, so unrelated businesses are never filed under "facebook.com".
  var PROFILE_HOSTS = /(^|\.)(facebook|fb|instagram|linkedin|x|twitter|tiktok|youtube|google|goo|g|yelp|nextdoor|thumbtack|angi|homeadvisor)\.(com|page|gl|co)$/i;
  var ADDRESS = /^(?:[a-z][a-z0-9+.-]*:\/\/)?(?:www\.)?([a-z0-9-]+(?:\.[a-z0-9-]+)+)(?:[\/?#:].*)?$/i;
  function companyFrom(value) {
    var v = value.trim();
    var m = /\s/.test(v) ? null : v.match(ADDRESS);
    if (!m) return v;
    var host = m[1].toLowerCase();
    return PROFILE_HOSTS.test(host) ? v : host;
  }

  // Builds the JSON the CRM's captureLandingPageLead function expects. Everything extra
  // (website, trade, city, ad, offer, page, utm_*) lands in the lead's notes.
  function buildPayload(data) {
    var now = new Date().toISOString();
    var smsOn = !!data.get("sms_consent");
    var consentLabel = form.querySelector("label[for=sms]");
    var payload = {
      email: field(data, "email"),
      message: "Ad " + ad + " landing page (" + page + "). Offer: " + offer + ".",
      ad: ad,
      offer: offer,
      page: page,
    };
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(function (k) {
      if (field(data, k)) payload[k] = field(data, k);
    });

    if (kind === "audit") {
      payload.name = field(data, "name");
      payload.company = field(data, "business");
      payload.phone = field(data, "phone");
    } else {
      var website = field(data, "website");
      payload.website = website;
      payload.company = companyFrom(website);
      payload.trade = field(data, "trade");
      payload.city = field(data, "city");
      // The mobile box is for texts. Without the text consent ticked the form promises
      // "we'll only email you", so the number is not sent.
      if (smsOn) payload.phone = field(data, "phone");
    }

    payload.consent = {
      sms_consent: smsOn,
      email_marketing_consent: false,
      terms_accepted: false,
      consent_text_shown: consentLabel ? consentLabel.textContent.replace(/\s+/g, " ").trim() : "",
      consent_url: window.location.href.split("#")[0],
      consent_captured_at: now,
    };
    if (smsOn) payload.consent.sms_consent_at = now;
    return payload;
  }

  function mailFallback(payload) {
    var lines = [];
    Object.keys(payload).forEach(function (key) {
      var value = payload[key];
      if (key === "consent" || !value) return;
      lines.push(key.replace(/_/g, " ") + ": " + value);
    });
    if (payload.consent && payload.consent.sms_consent) lines.push("sms consent: yes");
    var subject = "Landing page lead (ad " + ad + ")";
    window.location.href =
      "mailto:" + MAIL_TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
    done("email");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    hideError();
    var data = new FormData(form);

    // Honeypot: a person never sees this field. A bot that fills it gets a thank-you
    // and nothing is sent to the CRM.
    if (field(data, "hp_check")) {
      done("bot");
      return;
    }

    // Ticking the text box without a number would record text consent with nothing to text.
    if (kind !== "audit" && data.get("sms_consent") && !field(data, "phone")) {
      showError("Add your mobile number to get texts, or untick the text box.");
      form.elements.phone.setAttribute("aria-invalid", "true");
      form.elements.phone.setAttribute("aria-describedby", "form-error");
      form.elements.phone.focus();
      return;
    }

    var payload = buildPayload(data);
    var endpoint = form.getAttribute("action") || "";

    // Safety net if the form is ever copied without its endpoint: send an email instead.
    if (!endpoint || endpoint.indexOf("__FORM_ENDPOINT__") !== -1) {
      mailFallback(payload);
      return;
    }

    busy(true);
    var controller = "AbortController" in window ? new AbortController() : null;
    var timer = window.setTimeout(function () {
      if (controller) controller.abort();
    }, TIMEOUT_MS);

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined,
    })
      .then(function (response) {
        if (response.status === 429) throw new Error("rate");
        if (!response.ok) throw new Error("rejected");
        return response.json();
      })
      .then(function (result) {
        // Only the CRM's own success flag counts. A 200 from a proxy or error page does not.
        if (!result || result.ok !== true) throw new Error("rejected");
        window.clearTimeout(timer);
        done("sent");
      })
      .catch(function (err) {
        window.clearTimeout(timer);
        busy(false);
        showError(
          err && err.message === "rate"
            ? "Lots of submissions just now. Please wait a minute and try again, or call us on " + PHONE + "."
            : "That didn’t go through. Please try again, or call us on " + PHONE + "."
        );
        if (submitBtn) submitBtn.focus();
      });
  });

  // Mobile CTA bar: show it once the hero copy and the form have both scrolled out of view,
  // and never after the form has been sent.
  var heroCopy = document.getElementById("hero-copy");
  if (sticky && heroCopy && "IntersectionObserver" in window) {
    var copyVisible = true;
    var formVisible = true;
    var update = function () {
      sticky.hidden = copyVisible || formVisible || card.getAttribute("data-state") === "done";
    };
    new IntersectionObserver(function (entries) {
      copyVisible = entries[0].isIntersecting;
      update();
    }).observe(heroCopy);
    new IntersectionObserver(function (entries) {
      formVisible = entries[0].isIntersecting;
      update();
    }).observe(card);
    var stickyLink = sticky.querySelector("a");
    if (stickyLink) {
      stickyLink.addEventListener("click", function () {
        var first = form.querySelector("input:not([type=hidden]), select");
        if (first) window.setTimeout(function () { first.focus({ preventScroll: true }); }, 450);
      });
    }
  }
})();
