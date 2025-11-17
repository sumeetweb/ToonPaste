// Content script for TOON Paste using @toon-format/toon library
import { encode } from '@toon-format/toon';

// Default TOON encoding options
const DEFAULT_OPTIONS = {
  indent: 2,
  delimiter: ',',
  keyFolding: 'off',
  flattenDepth: Infinity
};

// Current encoding options (loaded from storage)
let encodingOptions = { ...DEFAULT_OPTIONS };

// Format text using TOON library
function formatText(text) {
  try {
    // Try to parse as JSON
    const parsed = JSON.parse(text);
    
    // Use TOON library to encode
    return encode(parsed, encodingOptions);
  } catch (e) {
    // Not valid JSON, return original text unchanged
    if (e instanceof SyntaxError) {
      console.log('TOON Paste: Not valid JSON, using original text');
    } else {
      console.error('TOON Paste: TOON encoding error', e);
      showToast('⚠️ TOON conversion failed, using original text');
    }
    return text;
  }
}

// Load encoding options from storage
function loadOptions() {
  chrome.storage.sync.get(['toonOptions'], (result) => {
    if (result.toonOptions) {
      encodingOptions = { ...DEFAULT_OPTIONS, ...result.toonOptions };
    }
  });
}

// Load options on script init
loadOptions();

// Listen for option updates
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.toonOptions) {
    loadOptions();
  }
});

// Paste text into focused element
function pasteIntoElement(text) {
  const el = document.activeElement;
  
  if (!el || el === document.body) {
    console.log('TOON Paste: No focused element');
    return false;
  }

  // Handle input and textarea
  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
    // Check if field is readonly or disabled
    if (el.readOnly || el.disabled) {
      console.log('TOON Paste: Element is readonly or disabled');
      return false;
    }
    
    // For INPUT elements that are single-line, we need to handle multiline text differently
    if (el.tagName === 'INPUT' && text.includes('\n')) {
      console.log('TOON Paste: Cannot paste multiline text into single-line input');
      return false; // Fall back to clipboard copy
    }
    
    try {
      // Use document.execCommand as fallback for better browser compatibility
      const start = el.selectionStart || 0;
      const end = el.selectionEnd || 0;
      
      // Set the selection range first
      el.setSelectionRange(start, end);
      el.focus();
      
      // Try to use execCommand for better compatibility
      const success = document.execCommand('insertText', false, text);
      
      if (success) {
        console.log('TOON Paste: Successfully pasted using execCommand into', el.tagName);
        return true;
      }
      
      // Fallback to manual value setting if execCommand doesn't work
      const before = el.value.substring(0, start);
      const after = el.value.substring(end);
      
      el.value = before + text + after;
      el.selectionStart = el.selectionEnd = start + text.length;
      
      // Dispatch events
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      
      console.log('TOON Paste: Successfully pasted using value setting into', el.tagName);
      return true;
    } catch (e) {
      console.error('TOON Paste: Error pasting into input/textarea:', e);
      return false;
    }
  }
  
  // Handle contenteditable
  if (el.isContentEditable) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      // Check if text has indentation/formatting that needs preservation
      const hasFormatting = text.includes('\n') || /^[ \t]+/m.test(text);
      
      if (hasFormatting) {
        // Create a pre element to preserve all whitespace
        const pre = document.createElement('pre');
        pre.style.cssText = 'display: inline; margin: 0; padding: 0; font-family: inherit; white-space: pre-wrap; word-wrap: break-word;';
        pre.textContent = text;
        range.insertNode(pre);
        
        // Move cursor to end
        range.setStartAfter(pre);
        range.setEndAfter(pre);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        // Simple text without formatting
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      // Dispatch input event
      el.dispatchEvent(new Event('input', { bubbles: true }));
      console.log('TOON Paste: Successfully pasted into contenteditable');
      return true;
    }
  }
  
  // Try to find any editable element on the page as fallback
  const editableElements = document.querySelectorAll('input:not([type=hidden]):not([disabled]):not([readonly]), textarea:not([disabled]):not([readonly]), [contenteditable="true"]');
  if (editableElements.length > 0) {
    console.log('TOON Paste: Found editable elements but none focused');
  }
  
  return false;
}

// Show toast notification
function showToast(message, duration = 3000) {
  // Remove existing toast if any
  const existing = document.getElementById('toon-paste-toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.id = 'toon-paste-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #333;
    color: #fff;
    padding: 12px 20px;
    border-radius: 4px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 14px;
    z-index: 2147483647;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    opacity: 0;
    transition: opacity 0.2s;
    max-width: 400px;
  `;
  
  if (document.body) {
    document.body.appendChild(toast);
    
    // Fade in
    setTimeout(() => toast.style.opacity = '1', 10);
    
    // Auto-remove after specified duration
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 200);
    }, duration);
  }
}

// Main handler for paste-toon command
async function handlePasteToon() {
  console.log('TOON Paste: handlePasteToon called');
  
  try {
    // Read clipboard
    let clipboardText = '';
    
    try {
      clipboardText = await navigator.clipboard.readText();
      console.log('TOON Paste: Clipboard text:', clipboardText);
    } catch (e) {
      console.log('TOON Paste: Clipboard read failed:', e);
      showToast('✗ Cannot read clipboard. Please grant clipboard permission in browser settings.');
      return;
    }
    
    // Check if clipboard is empty
    if (!clipboardText || clipboardText.trim() === '') {
      showToast('⚠️ Clipboard is empty');
      return;
    }
    
    // Format the text using TOON library
    const formattedText = formatText(clipboardText);
    console.log('TOON Paste: Formatted text:', formattedText);
    
    // Copy formatted text to clipboard
    try {
      await navigator.clipboard.writeText(formattedText);
      console.log('TOON Paste: Formatted text copied to clipboard');
      showToast('✓ TOON text copied to clipboard - paste with Ctrl/Cmd+V', 3000);
    } catch (e) {
      console.log('TOON Paste: Could not copy to clipboard:', e);
      showToast('✗ Could not copy to clipboard');
    }
  } catch (err) {
    console.error('TOON Paste error:', err);
    showToast('✗ Error processing clipboard');
  }
}

// Handle converting selected text to TOON
async function handleConvertSelection(text) {
  console.log('TOON Paste: Converting selection:', text);
  
  try {
    // Check if text is empty
    if (!text || text.trim() === '') {
      showToast('⚠️ No text selected');
      return;
    }
    
    // Format the selected text
    const formattedText = formatText(text);
    console.log('TOON Paste: Formatted selection:', formattedText);
    
    // Check if formatting actually changed anything (indicates success)
    if (formattedText === text) {
      // Could be non-JSON text (which is valid) or an error
      console.log('TOON Paste: Text unchanged (possibly non-JSON)');
    }
    
    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(formattedText);
      showToast('✓ Converted to TOON and copied to clipboard');
    } catch (e) {
      showToast('✗ Could not copy to clipboard');
    }
  } catch (err) {
    console.error('TOON Paste error:', err);
    showToast('✗ Error converting selection');
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('TOON Paste: Message received:', message);
  
  // Respond to ping messages to check if script is injected
  if (message.action === 'ping') {
    sendResponse({ status: 'ok' });
    return true;
  }
  
  if (message.action === 'paste-toon') {
    handlePasteToon();
  } else if (message.action === 'convert-selection') {
    handleConvertSelection(message.text);
  }
});

console.log('TOON Paste: Content script loaded');
