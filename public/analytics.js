(function () {
  const script = document.currentScript;
  const measurementId = script && script.dataset.measurementId;
  const storageKey = "spark.analytics-consent.v1";
  const banner = document.querySelector("[data-analytics-consent]");
  const accept = document.querySelector("[data-analytics-accept]");
  const decline = document.querySelector("[data-analytics-decline]");
  const settings = document.querySelector("[data-analytics-settings]");
  let googleTagLoaded = false;
  let consentState = readConsent();
  const pending = [];

  function readConsent() {
    try {
      const value = window.localStorage.getItem(storageKey);
      return value === "granted" || value === "denied" ? value : null;
    } catch {
      return null;
    }
  }

  function persistConsent(value) {
    try {
      window.localStorage.setItem(storageKey, value);
    } catch {
      // The banner remains functional when storage is unavailable.
    }
  }

  // Google's tag only runs queued commands that are an `arguments` object.
  // A rest-parameter array is ignored, so consent, page views, and clicks never send.
  function gtag() {
    window.dataLayer.push(arguments);
  }

  function loadGoogleAnalytics() {
    if (googleTagLoaded || !measurementId) return;
    googleTagLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = gtag;
    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    gtag("consent", "update", { analytics_storage: "granted" });
    gtag("js", new Date());
    gtag("config", measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    const tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
    tag.dataset.sparkAnalytics = "true";
    document.head.append(tag);

    const queued = pending.splice(0);
    queued.forEach(function (item) {
      gtag("event", item.name, item.parameters);
    });
    document.dispatchEvent(new CustomEvent("spark-analytics-ready"));
  }

  window.trackSparkEvent = function (eventName, parameters) {
    if (consentState !== "granted") return false;
    const payload = Object.assign({ transport_type: "beacon" }, parameters || {});
    if (!googleTagLoaded) {
      pending.push({ name: eventName, parameters: payload });
      return true;
    }
    gtag("event", eventName, payload);
    return true;
  };

  function applyConsent(value) {
    consentState = value;
    persistConsent(value);
    if (banner) banner.hidden = true;
    if (value === "granted") {
      loadGoogleAnalytics();
      window.trackSparkEvent("analytics_choice", { choice: "granted" });
    }
  }

  if (consentState === "granted") {
    loadGoogleAnalytics();
  } else if (!consentState && banner) {
    banner.hidden = false;
  }

  if (accept) accept.addEventListener("click", function () { applyConsent("granted"); });
  if (decline) decline.addEventListener("click", function () { applyConsent("denied"); });
  if (settings) {
    settings.addEventListener("click", function () {
      if (banner) banner.hidden = false;
    });
  }

  function placementOf(node) {
    if (node.closest("header")) return "header";
    if (node.closest("footer")) return "footer";
    if (node.closest("[data-analytics-consent]")) return "consent";
    return "main";
  }

  function linkKind(href) {
    if (!href) return "button";
    if (href.indexOf("mailto:") === 0) return "mailto";
    if (href.indexOf("apps.apple.com") !== -1) return "app_store";
    if (href.indexOf("play.google.com") !== -1 || href.indexOf("/news/play-store-review") !== -1) {
      return "play_store";
    }
    try {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return "outbound";
    } catch {
      return "content";
    }
    return "content";
  }

  function linkUrl(href) {
    if (!href) return window.location.pathname;
    try {
      const url = new URL(href, window.location.href);
      if (url.origin === window.location.origin) return (url.pathname + url.search + url.hash).slice(0, 100);
      return url.href.slice(0, 100);
    } catch {
      return href.slice(0, 100);
    }
  }

  document.addEventListener("click", function (event) {
    if (event.button !== 0) return;
    const node = event.target && event.target.closest && event.target.closest("a[href], button");
    if (!node || node.closest("[data-analytics-consent]")) return;
    const href = node.getAttribute("href") || "";
    const text = (node.getAttribute("aria-label") || node.innerText || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80);
    const kind = linkKind(href);
    const where = placementOf(node);
    window.trackSparkEvent("site_click", {
      link_kind: kind,
      link_url: linkUrl(href),
      link_text: text,
      placement: where,
      click_page: window.location.pathname,
    });
    if (kind === "app_store") {
      window.trackSparkEvent("app_store_click", {
        placement: where,
        link_text: text,
        click_page: window.location.pathname,
      });
    }
  }, true);
})();
