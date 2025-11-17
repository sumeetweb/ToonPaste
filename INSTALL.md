# TOON Paste - Chrome Extension

A lightweight Chrome extension (Manifest V3) that converts clipboard JSON into TOON-formatted text with a keyboard shortcut. Uses the official [@toon-format/toon](https://github.com/toon-format/toon) library for optimal token efficiency.

## What is TOON?

TOON is a structured text format optimized for LLM token efficiency. It represents JSON data in a compact, human-readable format that uses fewer tokens than standard JSON:

**Standard JSON (65 tokens):**
```json
{
  "items": [
    {"sku": "A1", "qty": 2, "price": 9.99},
    {"sku": "B2", "qty": 1, "price": 14.5}
  ]
}
```

**TOON Format (32 tokens - 51% reduction):**
```toon
items[2]{sku,qty,price}:
  A1,2,9.99
  B2,1,14.5
```

## Installation

### Prerequisites
- Node.js (v14 or higher) and npm

### Build Steps

1. **Clone or download this repository** to your local machine.

2. **Install dependencies:**
   ```bash
   cd ToonPaste
   npm install
   ```

3. **Build the extension:**
   ```bash
   npm run build
   ```
   This bundles the TOON library and creates the extension in the `./dist/` folder.

4. **Open Chrome** and navigate to `chrome://extensions/`

5. **Enable Developer Mode** (toggle in the top-right corner)

6. **Click "Load unpacked"** and select the `dist` folder inside ToonPaste

7. The extension is now installed! You should see "TOON Paste" in your extensions list.

## Usage

### Basic Paste
1. Copy JSON text to your clipboard (e.g., `{"name":"John","age":30}`)
2. Focus on any input field, textarea, or contenteditable element
3. Press the configured keyboard shortcut (default is customizable via `chrome://extensions/shortcuts`)
4. The JSON is converted to TOON format and copied to your clipboard
5. If an editable field is focused, it will also attempt to paste directly:
   ```toon
   name:John
   age:30
   ```

### Working with Arrays
Copy this JSON:
```json
{
  "users": [
    {"id": 1, "name": "Alice", "role": "admin"},
    {"id": 2, "name": "Bob", "role": "user"}
  ]
}
```

Paste result (default comma delimiter):
```toon
users[2]{id,name,role}:
  1,Alice,admin
  2,Bob,user
```

### Tab Delimiter for LLMs
Using tab delimiters reduces token count further - perfect for LLM prompts. Configure in Options.

### Clipboard-First Behavior
The extension always copies the TOON-formatted text to your clipboard first:
- Allows you to paste multiple times without converting again
- Works even when direct paste fails (e.g., Google Docs, complex editors)
- A toast notification confirms the conversion
- Simply press Ctrl/Cmd+V to paste manually when needed

### Non-JSON Content
If clipboard content is not valid JSON, it will be pasted unchanged.

## Customization

### Keyboard Shortcut
The extension doesn't set a default keyboard shortcut. To configure one:
1. Go to `chrome://extensions/shortcuts`
2. Find "TOON Paste"
3. Click the pencil icon and set your preferred shortcut (e.g., Ctrl+Shift+T)

**Recommended shortcuts:**
- `Ctrl+Q` (Windows/Linux) or `Cmd+Q` (macOS)

### TOON Encoding Options
To customize how JSON is encoded to TOON:
1. Right-click the extension icon and select "Options"
2. Adjust the following settings:

   **Indentation (0-8 spaces)**
   - Controls spaces per indentation level
   - Default: 2
   - Set to 0 for compact output

   **Array Delimiter**
   - **Comma (,)** - Standard, widely compatible
   - **Tab (\\t)** - Recommended for LLM prompts, better tokenization
   - **Pipe (|)** - Alternative visual separator
   
   **Key Folding**
   - **Off** - Standard nested structure
   - **Safe** - Collapse single-key wrapper chains into dotted paths
     - Example: `{user: {profile: {name: "Alice"}}}` becomes `user.profile.name:Alice`

   **Flatten Depth (0-10)**
   - Controls how many levels deep to flatten nested arrays
   - 0 (default): Unlimited flattening
   - Higher values: Limit flattening depth

3. **Live Preview**: See how your sample data will be formatted as you adjust settings
4. Click "Save" to apply changes
5. Click "Reset to Default" to restore original settings

### Example Configurations

**For LLM Prompts (Maximum Token Efficiency):**
- Indentation: 2
- Delimiter: Tab (\\t)
- Key Folding: Safe

**For Human Readability:**
- Indentation: 2
- Delimiter: Comma (,)
- Key Folding: Off

**Ultra-Compact:**
- Indentation: 0
- Delimiter: Comma (,)
- Key Folding: Safe

## Permissions Explained

- **clipboardRead**: Read clipboard content when shortcut is pressed
- **clipboardWrite**: Write TOON-formatted text to clipboard
- **storage**: Save custom TOON encoding preferences
- **activeTab**: Communicate with the active tab for paste functionality
- **scripting**: Inject content script for direct paste into editable fields
- **contextMenus**: Add "TOON Paste" to right-click menu
- **host_permissions (<all_urls>)**: Work on all websites

## Context Menu

The extension also adds a right-click context menu:
1. Select JSON text on any webpage
2. Right-click and choose "TOON Paste" → "Convert Selection to TOON"
3. The selected text is replaced with TOON format (if valid JSON)

## Files Structure

```
ToonPaste/
├── src/
│   ├── contentScript.js    # Content script with TOON library import
│   ├── background.js       # Service worker (keyboard & context menu)
│   ├── options.html        # Settings page UI
│   └── options.js          # Settings page logic with live preview
├── assets/
│   ├── icon16.png          # Extension icons
│   ├── icon48.png
│   └── icon128.png
├── scripts/
│   └── build.js            # Build script (bundles with esbuild)
├── dist/                   # Built extension (generated by npm run build)
│   ├── manifest.json
│   ├── background.js
│   ├── contentScript.js    # Bundled with TOON library
│   ├── options.html
│   ├── options.js          # Bundled with TOON library
│   └── assets/
├── manifest.json           # Extension configuration (MV3)
├── package.json            # Dependencies and scripts
└── INSTALL.md             # This file
```

## Development

To modify the extension:

1. Edit source files in `src/` folder (`contentScript.js`, `options.js`, etc.)
2. Run `npm run build` to regenerate the `dist/` folder
3. Reload the extension in `chrome://extensions/` (click the refresh icon)

**Note**: Both `contentScript.js` and `options.js` are bundled with esbuild to include the `@toon-format/toon` library.

## Why TOON?

TOON format offers significant advantages for LLM interactions:

- **Token Efficiency**: 40-60% fewer tokens than JSON for structured data
- **Self-Documenting**: Array headers show length and field names
- **Tabular Data**: Optimized for uniform arrays (databases, CSVs)
- **Visual Clarity**: Easy to scan and validate data structure
- **Error Reduction**: Models generate TOON with fewer hallucinations due to reduced repetition

Learn more at the [official TOON repository](https://github.com/toon-format/toon).

## Known Issues

⚠️ **IFrame Support**: Cannot paste into content inside iframes due to browser security restrictions (cross-origin policies).

⚠️ **Google Docs**: Direct paste may not work in Google Docs due to its custom editor implementation. The TOON text is always copied to clipboard - use Ctrl/Cmd+V to paste manually.

⚠️ **Text Formatting**: In some contenteditable fields, whitespace and indentation may not be perfectly preserved. Textarea elements work perfectly.

## Troubleshooting

**Extension doesn't respond to shortcut:**
- Ensure you've configured a keyboard shortcut at `chrome://extensions/shortcuts`
- Check if the extension is enabled at `chrome://extensions/`
- Verify the shortcut isn't conflicting with system or browser shortcuts
- Refresh the page and try again

**Cannot read clipboard:**
- Grant clipboard permissions when prompted
- Some browsers require user interaction before clipboard access

**Direct paste doesn't work:**
- Don't worry! The TOON text is always copied to your clipboard first
- Simply use Ctrl/Cmd+V to paste manually
- Check the toast notification for status

## License

See LICENSE file in the repository.
