// Options page script for TOON Paste
// Manages TOON encoding options in chrome.storage.sync

import { encode } from '@toon-format/toon';

const DEFAULT_OPTIONS = {
  indent: 2,
  delimiter: ',',
  keyFolding: 'off',
  flattenDepth: Infinity
};

// Load saved options or defaults
function loadSettings() {
  chrome.storage.sync.get(['toonOptions'], (result) => {
    const options = result.toonOptions || DEFAULT_OPTIONS;
    
    document.getElementById('indent').value = options.indent;
    document.getElementById('delimiter').value = options.delimiter;
    document.getElementById('keyFolding').value = options.keyFolding;
    document.getElementById('flattenDepth').value = options.flattenDepth === Infinity ? 0 : options.flattenDepth;
  });
}

// Save options
function saveSettings() {
  const indent = parseInt(document.getElementById('indent').value, 10);
  const flattenDepth = parseInt(document.getElementById('flattenDepth').value, 10);
  
  const options = {
    indent: indent,
    delimiter: document.getElementById('delimiter').value,
    keyFolding: document.getElementById('keyFolding').value,
    flattenDepth: flattenDepth === 0 ? Infinity : flattenDepth
  };
  
  // Validate indent
  if (isNaN(options.indent) || options.indent < 0 || options.indent > 8) {
    showStatus('Invalid indentation value (must be 0-8)', 'error');
    return;
  }
  
  // Validate flattenDepth
  if (isNaN(flattenDepth) || flattenDepth < 0 || flattenDepth > 10) {
    showStatus('Invalid flatten depth value (must be 0-10)', 'error');
    return;
  }
  
  // Save to storage
  chrome.storage.sync.set({ toonOptions: options }, () => {
    showStatus('TOON options saved successfully!', 'success');
  });
}

// Reset to defaults
function resetSettings() {
  document.getElementById('indent').value = DEFAULT_OPTIONS.indent;
  document.getElementById('delimiter').value = DEFAULT_OPTIONS.delimiter;
  document.getElementById('keyFolding').value = DEFAULT_OPTIONS.keyFolding;
  document.getElementById('flattenDepth').value = 0;
  
  chrome.storage.sync.set({ toonOptions: DEFAULT_OPTIONS }, () => {
    showStatus('Reset to default TOON options', 'success');
  });
}

// Show status message
function showStatus(message, type) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = 'status ' + type;
  statusEl.style.display = 'block';
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    statusEl.className = 'status';
    statusEl.style.display = 'none';
  }, 3000);
}

// Event listeners
document.getElementById('saveBtn').addEventListener('click', saveSettings);
document.getElementById('resetBtn').addEventListener('click', resetSettings);
document.getElementById('openShortcuts').addEventListener('click', () => {
  chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
});

// Add change listeners for live preview
document.getElementById('indent').addEventListener('change', updatePreview);
document.getElementById('delimiter').addEventListener('change', updatePreview);
document.getElementById('keyFolding').addEventListener('change', updatePreview);
document.getElementById('flattenDepth').addEventListener('change', updatePreview);

// Sample data for preview
const sampleData = {
  users: [
    { id: 1, name: 'Alice', role: 'admin', active: true },
    { id: 2, name: 'Bob', role: 'user', active: true }
  ],
  config: {
    database: {
      host: 'localhost',
      port: 5432
    }
  }
};

// Update preview with current settings
function updatePreview() {
  const indent = parseInt(document.getElementById('indent').value, 10);
  const delimiter = document.getElementById('delimiter').value;
  const keyFolding = document.getElementById('keyFolding').value;
  const flattenDepth = parseInt(document.getElementById('flattenDepth').value, 10);
  
  const options = {
    indent: indent,
    delimiter: delimiter,
    keyFolding: keyFolding,
    flattenDepth: flattenDepth === 0 ? Infinity : flattenDepth
  };
  
  try {
    // Use actual TOON encode function with current options
    const toonOutput = encode(sampleData, options);
    const preview = document.getElementById('preview');
    preview.value = toonOutput;
  } catch (e) {
    document.getElementById('preview').value = 'Preview error: ' + e.message;
  }
}

// Load settings on page load
loadSettings();
updatePreview();
