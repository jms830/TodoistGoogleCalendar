/**
 * Background Service Worker (Manifest V3)
 * Handles message passing and storage operations
 */

import { DEFAULT_OPTIONS, ExtensionMessage, ExtensionOptions } from './types';

/**
 * Get options from chrome.storage.sync, falling back to defaults
 */
async function getOptions(): Promise<ExtensionOptions> {
  const result = await chrome.storage.sync.get(DEFAULT_OPTIONS);
  return result as ExtensionOptions;
}

/**
 * Initialize default options on install
 */
chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.sync.get(null);
  if (Object.keys(existing).length === 0) {
    await chrome.storage.sync.set(DEFAULT_OPTIONS);
  }
});

/**
 * Handle messages from content scripts and options page
 */
chrome.runtime.onMessage.addListener(
  (
    request: ExtensionMessage,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: ExtensionOptions) => void
  ) => {
    if (request.method === 'load') {
      getOptions()
        .then(sendResponse)
        .catch((err) => {
          console.error('Failed to load options:', err);
          sendResponse(DEFAULT_OPTIONS);
        });
      return true; // Keep channel open for async response
    }
    return false;
  }
);
