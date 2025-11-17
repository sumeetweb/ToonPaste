// Service worker for TOON Paste extension
// Listens for keyboard command and triggers content script

// Inject content script into a tab if not already injected
async function injectContentScript(tabId) {
  try {
    // Try to send a ping message to check if content script is already injected
    await chrome.tabs.sendMessage(tabId, { action: 'ping' });
    return true;
  } catch (e) {
    // Content script not injected, inject it now
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['contentScript.js']
      });
      return true;
    } catch (err) {
      return false;
    }
  }
}

chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'paste-toon') {
    // Get active tab
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tabs[0]) {
      const tabId = tabs[0].id;
      
      // Inject content script if needed
      const injected = await injectContentScript(tabId);
      
      if (injected) {
        // Send message to content script
        chrome.tabs.sendMessage(tabId, { action: 'paste-toon' })
          .catch(() => {});
      }
    }
  }
});

console.log('TOON Paste: Background script loaded');

// Create context menu items
function createContextMenus() {
  // Remove existing menus first
  chrome.contextMenus.removeAll(() => {
    // Create parent menu
    chrome.contextMenus.create({
      id: 'toon-paste-parent',
      title: 'TOON Paste',
      contexts: ['editable', 'selection']
    }, () => {
      if (chrome.runtime.lastError) {
        console.debug('Error creating parent menu:', chrome.runtime.lastError);
      }
    });
    
    // Paste as TOON (for editable fields)
    chrome.contextMenus.create({
      id: 'paste-toon',
      parentId: 'toon-paste-parent',
      title: 'Paste as TOON',
      contexts: ['editable']
    }, () => {
      if (chrome.runtime.lastError) {
        console.debug('Error creating paste menu:', chrome.runtime.lastError);
      }
    });
    
    // Convert selected text to TOON
    chrome.contextMenus.create({
      id: 'convert-selection',
      parentId: 'toon-paste-parent',
      title: 'Convert selected text to TOON',
      contexts: ['selection']
    }, () => {
      if (chrome.runtime.lastError) {
        console.debug('Error creating convert menu:', chrome.runtime.lastError);
      }
    });
    
    // Separator
    chrome.contextMenus.create({
      id: 'separator',
      parentId: 'toon-paste-parent',
      type: 'separator',
      contexts: ['editable', 'selection']
    }, () => {
      if (chrome.runtime.lastError) {
        console.debug('Error creating separator:', chrome.runtime.lastError);
      }
    });
    
    // Built by link
    chrome.contextMenus.create({
      id: 'built-by',
      parentId: 'toon-paste-parent',
      title: 'Built with ❤️ by Sumeet',
      contexts: ['editable', 'selection']
    }, () => {
      if (chrome.runtime.lastError) {
        console.debug('Error creating built-by menu:', chrome.runtime.lastError);
      } else {
        console.debug('TOON Paste: Context menus created successfully');
      }
    });
  });
}

// Create menus on install or update
chrome.runtime.onInstalled.addListener(() => {
  createContextMenus();
});

// Also create menus on startup (in case service worker was restarted)
chrome.runtime.onStartup.addListener(() => {
  createContextMenus();
});

// Create menus immediately
createContextMenus();

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  // Inject content script if needed
  const injected = await injectContentScript(tab.id);
  
  if (!injected) return;
  
  if (info.menuItemId === 'paste-toon') {
    // Same as keyboard shortcut - paste from clipboard
    chrome.tabs.sendMessage(tab.id, { action: 'paste-toon' })
      .catch((err) => console.log('Could not send message:', err));
  } else if (info.menuItemId === 'convert-selection') {
    // Convert selected text to TOON and copy to clipboard
    chrome.tabs.sendMessage(tab.id, { 
      action: 'convert-selection',
      text: info.selectionText 
    })
      .catch((err) => console.log('Could not send message:', err));
  } else if (info.menuItemId === 'built-by') {
    // Open Sumeet's website
    chrome.tabs.create({ url: 'https://sumeetnaik.com' });
  }
});
