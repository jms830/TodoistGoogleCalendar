/**
 * Options Page Script
 * Handles saving and restoring user preferences
 */

import { DEFAULT_OPTIONS, ExtensionOptions } from './types';

/**
 * Save options to chrome.storage.sync
 */
async function saveOptions(): Promise<void> {
  const leftWidthInput = document.getElementById('leftWidth') as HTMLInputElement | null;
  const calendarLeftInput = document.getElementById('calendarLeft') as HTMLInputElement | null;
  const status = document.getElementById('status');

  if (!leftWidthInput || !calendarLeftInput) {
    console.error('Could not find option inputs');
    return;
  }

  const options: ExtensionOptions = {
    leftWidth: leftWidthInput.value,
    calendarLeft: calendarLeftInput.checked ? 'true' : 'false',
  };

  await chrome.storage.sync.set(options);

  if (status) {
    status.textContent = 'Options saved.';
    setTimeout(() => {
      status.textContent = '';
    }, 750);
  }
}

/**
 * Restore options from chrome.storage.sync
 */
function restoreOptions(options: ExtensionOptions): void {
  const leftWidthInput = document.getElementById('leftWidth') as HTMLInputElement | null;
  const calendarLeftInput = document.getElementById('calendarLeft') as HTMLInputElement | null;

  if (leftWidthInput) {
    leftWidthInput.value = options.leftWidth;
  }

  if (calendarLeftInput) {
    calendarLeftInput.checked = options.calendarLeft === 'true';
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage({ method: 'load' }, (response: ExtensionOptions) => {
    if (chrome.runtime.lastError) {
      console.error('Failed to load options:', chrome.runtime.lastError);
      restoreOptions(DEFAULT_OPTIONS);
    } else {
      restoreOptions(response);
    }
  });
});

// Save on any click (matches original behavior)
document.addEventListener('click', () => {
  saveOptions().catch((err) => {
    console.error('Failed to save options:', err);
  });
});
