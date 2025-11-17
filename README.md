<p align="center">
  <img src="assets/logo.png" alt="TOON Paste Logo" width="250"/>
</p>

# TOON Paste

A lightweight Chrome extension that converts clipboard JSON into [TOON format](https://github.com/toon-format/toon) with a simple user-defined keyboard shortcut.

## 🎯 What is TOON?

TOON is a structured text format optimized for LLM token efficiency. It uses 40-60% fewer tokens than JSON for structured data:

**JSON (65 tokens):**
```json
{"items": [{"sku": "A1", "qty": 2, "price": 9.99}, {"sku": "B2", "qty": 1, "price": 14.5}]}
```

**TOON (32 tokens):**
```toon
items[2]{sku,qty,price}:
  A1,2,9.99
  B2,1,14.5
```

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Build extension
npm run build

# Load the dist/ folder as unpacked extension in chrome://extensions/
```

See [INSTALL.md](INSTALL.md) for detailed installation and usage instructions.

## ✨ Features

- 🔑 **Keyboard Shortcut**: Ctrl+Alt+V (Windows/Linux) or Cmd+Alt+V (macOS)
- 📋 **Smart Paste**: Automatically detects JSON and converts to TOON
- 🎛️ **Customizable**: Configure indentation, delimiters (`,` `\t` `|`), and key folding
- 🚀 **Token Efficient**: Tab delimiter option for optimal LLM tokenization
- 💪 **Robust**: Falls back to clipboard copy with toast notification if paste fails
- 🔒 **Privacy-First**: No external calls, minimal permissions, all processing local

## 🛠️ Configuration Options

| Option | Values | Description |
|--------|--------|-------------|
| **Indentation** | 0-8 spaces | Spaces per indent level (default: 2) |
| **Delimiter** | `,` `\t` `\|` | Array separator (tab recommended for LLMs) |
| **Key Folding** | off / safe | Collapse single-key chains into dotted paths |

## 📚 Learn More

- [INSTALL.md](INSTALL.md) - Complete installation guide
- [TOON Format](https://github.com/toon-format/toon) - Official TOON specification

## ⚠️ Known Issues

- **IFrame Support**: Pasting inside iframes (embedded content) is currently not supported due to browser security restrictions
- **Google Docs**: Not compatible with Google Docs due to its custom editor implementation. Use the fallback: extension will copy to clipboard, then paste manually with Ctrl/Cmd+V
- **Text Formatting**: In some contenteditable fields, whitespace formatting may not be fully preserved. Use textarea fields for best results with formatted TOON output

## 📄 License

See [LICENSE](LICENSE) file.

---

<p align="center">
  Built with ❤️ by <a href="https://sumeetnaik.com">Sumeet</a>
</p>
