# Privacy Policy for TOON Paste

**Last Updated:** November 17, 2025

## Overview

TOON Paste is a Chrome extension that converts JSON data from your clipboard into TOON format (a token-efficient structured text format). We are committed to protecting your privacy and being transparent about our data practices.

## Data Collection and Usage

### What We Collect

**Personal Communications (Optional):**
- Email addresses are collected only when users voluntarily provide them for future communications about updates
- This information is collected outside the extension (e.g., through a contact form or subscription)
- Email collection is entirely optional and not required to use the extension

### What We Do NOT Collect

The TOON Paste extension itself does NOT collect, transmit, store, or process:
- ❌ Clipboard content
- ❌ Browsing history
- ❌ Personal information
- ❌ User identifiers
- ❌ Website data
- ❌ Form data
- ❌ Authentication credentials
- ❌ Usage analytics
- ❌ Any other user data

## How the Extension Works

### Local Processing Only

1. **Clipboard Access:** When you trigger the keyboard shortcut or context menu, the extension reads your clipboard content locally
2. **Conversion:** JSON data is converted to TOON format entirely within your browser
3. **Output:** The converted text is either pasted directly or copied back to your clipboard
4. **Settings Storage:** Your formatting preferences (indentation, delimiter, etc.) are stored locally using Chrome's sync storage

### No External Communication

- All data processing happens locally in your browser
- No data is sent to external servers
- No network requests are made
- No third-party services or analytics are used

## Permissions Explained

The extension requests the following permissions:

| Permission | Purpose | Data Handling |
|------------|---------|---------------|
| **clipboardRead** | Read JSON from clipboard when you trigger the shortcut | Data is only read when you explicitly trigger the conversion. Not stored or transmitted. |
| **clipboardWrite** | Write converted TOON text back to clipboard | Data is only written locally to your clipboard. Not stored or transmitted. |
| **storage** | Save your formatting preferences (indent, delimiter, etc.) | Preferences are stored locally using Chrome's sync storage. No external transmission. |
| **contextMenus** | Add right-click menu option for converting selected text | Only creates the menu item. No data collection. |
| **host_permissions (<all_urls>)** | Enable pasting into editable fields on any website | Required to detect and paste into input fields. No data is collected from websites. |

## Third-Party Libraries

The extension uses the open-source `@toon-format/toon` library for JSON to TOON conversion. This library:
- Is bundled directly into the extension during build time
- Runs entirely locally in your browser
- Does not collect or transmit any data
- Source code: https://github.com/toon-format/toon

## Data Storage

### Local Storage Only

- **User Preferences:** Your formatting settings are stored locally using `chrome.storage.sync`
- **Sync Across Devices:** If you're signed into Chrome, your preferences may sync to your other devices through Chrome's built-in sync feature (managed by Google, not by us)
- **No External Database:** We do not maintain any external databases or servers

## Your Rights

You have the right to:
- Use the extension without providing any personal information
- Configure or disable any extension features
- Delete the extension and all associated data at any time
- Request information about data practices by contacting us

## Children's Privacy

This extension does not knowingly collect any information from children under 13 years of age.

## Changes to Privacy Policy

We may update this privacy policy from time to time. Any changes will be reflected with an updated "Last Updated" date. Continued use of the extension after changes constitutes acceptance of the updated policy.

## Contact

For privacy-related questions or concerns, please contact:
- Email: jsontoon@gmail.com
- GitHub Repository: https://github.com/sumeetweb/ToonPaste
- Create an issue or discussion on GitHub for any privacy concerns

## Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies
- General Data Protection Regulation (GDPR) principles
- California Consumer Privacy Act (CCPA) principles

## Data Retention

- **Extension Data:** All data processing is ephemeral (clipboard reads are processed and immediately discarded)
- **User Preferences:** Stored locally until you uninstall the extension or clear Chrome's storage
- **Email Addresses (if provided):** Retained until you request deletion or unsubscribe

## Security

- All code runs locally in your browser
- No data transmission to external servers
- Extension uses Chrome's built-in security features
- Source code is available for review on GitHub
