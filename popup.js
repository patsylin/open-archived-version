async function getCurrentTabUrl() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.url || "";
}

document.addEventListener("DOMContentLoaded", () => {
  const sel = document.getElementById("provider");
  chrome.storage.sync.get({ provider: "wayback" }, ({ provider }) => {
    sel.value = provider;
  });
  sel.addEventListener("change", () => {
    chrome.storage.sync.set({ provider: sel.value });
  });

  document.getElementById("openCurrent").addEventListener("click", async () => {
    const url = await getCurrentTabUrl();
    chrome.runtime.sendMessage({ type: "OPEN_ARCHIVE_FOR_TAB", url });
  });
});
document.getElementById("openArchive").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const archivedUrl = `https://web.archive.org/web/*/${tab.url}`;
  chrome.tabs.create({ url: archivedUrl });
});
