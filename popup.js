// Read current tab + saved provider, update UI, and wire actions.
(async function init() {
  const openBtn = document.getElementById("openCurrent");
  const providerSelect = document.getElementById("provider");
  const hostEl = document.getElementById("host");

  // Show current tab's host
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const url = tab?.url || "";
    let host = "chrome/internal";
    try {
      host = new URL(url).host || host;
    } catch {}
    hostEl.textContent = host;
  } catch {
    hostEl.textContent = "unknown";
  }

  // Load provider from sync storage
  chrome.storage.sync.get({ provider: "wayback" }, ({ provider }) => {
    providerSelect.value = provider || "wayback";
  });

  // Persist provider changes
  providerSelect.addEventListener("change", () => {
    chrome.storage.sync.set({ provider: providerSelect.value });
  });

  // Open archive for the active tab (background decides URL/provider)
  openBtn.addEventListener("click", async () => {
    try {
      await chrome.runtime.sendMessage({ type: "OPEN_ARCHIVE_FOR_TAB" });
      window.close(); // neat UX: close popup after action
    } catch (e) {
      console.error("Failed to send OPEN_ARCHIVE_FOR_TAB", e);
    }
  });
})();
