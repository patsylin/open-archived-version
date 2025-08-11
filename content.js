(function () {
  const PAYWALL_HINTS = [
    "subscribe",
    "sign in to continue",
    "you have reached your limit",
    "to keep reading",
    "become a subscriber",
    "disable your ad blocker",
    "purchase a subscription",
    "subscribe to read",
  ];

  function likelyPaywall() {
    const bodyText = document.body.innerText.toLowerCase();
    const hit = PAYWALL_HINTS.some((h) => bodyText.includes(h));
    const overlays = document.querySelectorAll(
      '[class*="paywall"], [id*="paywall"], .meteredBar, .subscription, .adblock-modal'
    );
    return hit || overlays.length > 0;
  }

  let prompted = false;
  const run = () => {
    if (prompted) return;
    if (!likelyPaywall()) return;
    prompted = true;

    const banner = document.createElement("div");
    banner.setAttribute(
      "style",
      `
      position: fixed; z-index: 2147483647; left: 50%; transform: translateX(-50%);
      bottom: 16px; background: #111; color: #fff; padding: 10px 14px; border-radius: 999px;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; font-size: 13px;
      box-shadow: 0 8px 20px rgba(0,0,0,.25);
      display: flex; align-items: center; gap: 10px;
    `
    );

    const text = document.createElement("span");
    text.textContent =
      "Having trouble viewing? Open the newest archived version.";

    const btn = document.createElement("button");
    btn.textContent = "Open";
    btn.setAttribute(
      "style",
      `
      appearance: none; border: 0; padding: 6px 10px; border-radius: 999px;
      background: #fff; color: #111; cursor: pointer; font-weight: 600;
    `
    );

    btn.addEventListener("click", () => {
      chrome.runtime.sendMessage({
        type: "OPEN_ARCHIVE_FOR_TAB",
        url: location.href,
      });
    });

    const close = document.createElement("button");
    close.textContent = "×";
    close.setAttribute("aria-label", "Dismiss");
    close.setAttribute(
      "style",
      `
      appearance: none; border: 0; background: transparent; color: #aaa;
      cursor: pointer; font-size: 16px; line-height: 1; margin-left: 4px;
    `
    );
    close.addEventListener("click", () => banner.remove());

    banner.append(text, btn, close);
    document.documentElement.appendChild(banner);

    setTimeout(() => banner.remove(), 20000);
  };

  document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete") setTimeout(run, 500);
  });
  const obs = new MutationObserver(() => setTimeout(run, 300));
  obs.observe(document.documentElement, { subtree: true, childList: true });
})();
