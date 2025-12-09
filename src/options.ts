/**
 * Options Page Script
 * Handles saving and restoring user preferences
 */

import { DEFAULT_OPTIONS, ExtensionOptions } from './types';

// DOM Elements
let leftWidthInput: HTMLInputElement | null;
let calendarLeftInput: HTMLInputElement | null;
let widthValueDisplay: HTMLElement | null;
let previewLeft: HTMLElement | null;
let previewRight: HTMLElement | null;
let status: HTMLElement | null;
let saveButton: HTMLElement | null;

/**
 * Update the live preview based on current settings
 */
function updatePreview(): void {
  if (
    !leftWidthInput ||
    !calendarLeftInput ||
    !previewLeft ||
    !previewRight ||
    !widthValueDisplay
  ) {
    return;
  }

  const width = leftWidthInput.value;
  const calendarOnLeft = calendarLeftInput.checked;

  // Update width display
  widthValueDisplay.textContent = `${width}%`;

  // Update preview
  previewLeft.style.width = `${width}%`;

  if (calendarOnLeft) {
    previewLeft.textContent = 'CAL';
    previewLeft.style.background = '#4285f4';
    previewRight.textContent = 'TODO';
    previewRight.style.background = '#e44332';
  } else {
    previewLeft.textContent = 'TODO';
    previewLeft.style.background = '#e44332';
    previewRight.textContent = 'CAL';
    previewRight.style.background = '#4285f4';
  }
}

/**
 * Save options to chrome.storage.sync
 */
async function saveOptions(): Promise<void> {
  if (!leftWidthInput || !calendarLeftInput) {
    console.error('Could not find option inputs');
    return;
  }

  const options: ExtensionOptions = {
    leftWidth: leftWidthInput.value,
    calendarLeft: calendarLeftInput.checked ? 'true' : 'false',
  };

  await chrome.storage.sync.set(options);

  // Show success message
  if (status) {
    status.classList.add('show');
    const statusEl = status;
    setTimeout(() => {
      statusEl.classList.remove('show');
    }, 2000);
  }
}

/**
 * Restore options from chrome.storage.sync
 */
function restoreOptions(options: ExtensionOptions): void {
  if (leftWidthInput) {
    leftWidthInput.value = options.leftWidth;
  }

  if (calendarLeftInput) {
    calendarLeftInput.checked = options.calendarLeft === 'true';
  }

  updatePreview();
}

/**
 * Initialize the options page
 */
function init(): void {
  // Get DOM elements
  leftWidthInput = document.getElementById('leftWidth') as HTMLInputElement | null;
  calendarLeftInput = document.getElementById('calendarLeft') as HTMLInputElement | null;
  widthValueDisplay = document.getElementById('widthValue');
  previewLeft = document.getElementById('previewLeft');
  previewRight = document.getElementById('previewRight');
  status = document.getElementById('status');
  saveButton = document.getElementById('save');

  // Load saved options
  chrome.runtime.sendMessage({ method: 'load' }, (response: ExtensionOptions) => {
    if (chrome.runtime.lastError) {
      console.error('Failed to load options:', chrome.runtime.lastError);
      restoreOptions(DEFAULT_OPTIONS);
    } else {
      restoreOptions(response);
    }
  });

  // Live preview updates
  leftWidthInput?.addEventListener('input', updatePreview);
  calendarLeftInput?.addEventListener('change', updatePreview);

  // Save button
  saveButton?.addEventListener('click', () => {
    saveOptions().catch((err) => {
      console.error('Failed to save options:', err);
    });
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
