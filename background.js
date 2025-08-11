// Set defaults on install/update and create a context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({ provider: "wayback" }, (data) => {
    if (!data.provider) chrome.storage.sync.set({ provider: "wayback" });
  });

  // Context menu for pages and links
  chrome.contextMenus.create({
    id: "open-archived-version",
    title: "Open archived version",
    contexts: ["page", "link"],
  });
});

// Build target archive URL for a given provider
function buildArchiveUrl(url, provider = "wayback") {
  const encoded = encodeURIComponent(url);
  switch (provider) {
    case "archive_today":
    case "archive.ph":
    case "archive_today_latest":
      // "latest" snapshot on Archive.ph
      return `https://archive.ph/latest/${encodeURI(url)}`;
    case "wayback":
    default:
      // "0" = most recent snapshot on Wayback
      return `https://web.archive.org/web/0/${encoded}`;
  }
}

// Open in a new tab (next to current if we know the index)
async function openArchiveForUrl(url, provider, index) {
  try {
    const target = buildArchiveUrl(url, provider);
    await chrome.tabs.create(
      typeof index === "number"
        ? { url: target, index: index + 1 }
        : { url: target }
    );
  } catch (e) {
    console.error("Failed to open archive:", e);
  }
}

// Helper: is this a URL we can archive?
function isHttpUrl(u) {
  try {
    const p = new URL(u).protocol;
    return p === "http:" || p === "https:";
  } catch {
    return false;
  }
}

/* === Message API (from popup or content script) ===
   Expect: { type: "OPEN_ARCHIVE_FOR_TAB", url?: string }
*/
chrome.runtime.onMessage.addListener((msg, _sender) => {
  if (msg?.type === "OPEN_ARCHIVE_FOR_TAB") {
    chrome.storage.sync.get({ provider: "wayback" }, async ({ provider }) => {
      if (msg.url && isHttpUrl(msg.url)) {
        // Open for explicit URL (e.g., link in popup)
        await openArchiveForUrl(msg.url, provider);
        return;
      }
      // Fallback: current active tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab?.url && isHttpUrl(tab.url)) {
        await openArchiveForUrl(tab.url, provider, tab.index);
      }
    });
  }
});

/* === Toolbar icon click ===
   Note: This fires only if you DON'T have a default_popup in manifest.
   If you keep a popup, trigger OPEN_ARCHIVE_FOR_TAB from the popup instead.
*/
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab?.url || !isHttpUrl(tab.url)) return;
  chrome.storage.sync.get({ provider: "wayback" }, async ({ provider }) => {
    await openArchiveForUrl(tab.url, provider, tab.index);
  });
});

/* === Context menu click === */
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "open-archived-version") return;

  const targetUrl =
    info.linkUrl && isHttpUrl(info.linkUrl)
      ? info.linkUrl
      : tab?.url && isHttpUrl(tab.url)
      ? tab.url
      : null;

  if (!targetUrl) return;

  chrome.storage.sync.get({ provider: "wayback" }, async ({ provider }) => {
    await openArchiveForUrl(targetUrl, provider, tab?.index);
  });
});
