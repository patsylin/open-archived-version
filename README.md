# Archive Reader

_Open the newest archived version of any page with one click — Wayback Machine & Archive.ph._

<!-- Badges (add once live) -->
<!-- [![Chrome Web Store](https://img.shields.io/chrome-web-store/v/XXXXXXXX)](STORE_LINK) -->

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Why

Paywalls break sharing, links rot, and pages change. Archive Reader opens the **latest archived snapshot** of the current page so you can keep reading and keep references stable.

## Features

- One-click open in **Wayback Machine** (default) or **Archive.ph**
- **Toolbar button** + **right-click menu** (page or link)
- Remembers your preferred provider
- Minimal permissions, **no data collection**

## Install

### Chrome Web Store (recommended)

> Link coming soon

<!-- Replace after publish:
**Install from the Chrome Web Store:** [Archive Reader](STORE_LINK)
-->

### Load Unpacked (dev/now)

1. Clone or download this repo.
2. Chrome → `chrome://extensions`
3. Toggle **Developer mode** (top right).
4. Click **Load unpacked** → select the project folder.

## Usage

- Click the toolbar icon → opens the latest archive next to your tab.
- Or right-click any page/link → **Open archived version**.
- Choose provider (Wayback / Archive.ph) in the popup; it’s remembered.

## Permissions & Privacy

- **Permissions:** `activeTab`, `storage`, and `contextMenus` (for the right-click menu).
- **Why:**
  - `activeTab` — read current tab URL after you click.
  - `storage` — remember your chosen provider.
  - `contextMenus` — show the right-click action.
- **Privacy:** Archive Reader **does not collect, store, or transmit** any personal data.

## Screenshots

![Popup screenshot](screenshots/banner.png)

![Popup screenshot](screenshots/popup.png)

<br><br>

![Popup screenshot](screenshots/success.png)

## Roadmap

- Keyboard shortcut (e.g., Alt+A)
- Firefox port (MV3)
- Auto-fallback between providers

## Development

- Edit `manifest.json`, `background.js`, `popup.html`, `popup.js`.
- Zip for store:
  ```bash
  zip -r archive-reader-0.1.0.zip manifest.json background.js popup.html popup.js icons/ -x "*/.*"
  ```
