chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({ provider: "wayback" }, (data) => {
    if (!data.provider) chrome.storage.sync.set({ provider: "wayback" });
  });
});

async function openArchiveForUrl(url, provider) {
  try {
    const encoded = encodeURIComponent(url);
    let target = "";
    switch (provider) {
      case "archive_today":
        // Newest snapshot via Archive.ph
        target = `https://archive.ph/latest/${encodeURI(url)}`;
        break;
      case "wayback":
      default:
        // Newest snapshot via Wayback Machine
        target = `https://web.archive.org/web/0/${encoded}`;
        break;
    }
    await chrome.tabs.create({ url: target });
  } catch (e) {
    console.error("Failed to open archive:", e);
  }
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "OPEN_ARCHIVE_FOR_TAB") {
    chrome.storage.sync.get({ provider: "wayback" }, ({ provider }) => {
      openArchiveForUrl(msg.url, provider);
    });
  }
});
