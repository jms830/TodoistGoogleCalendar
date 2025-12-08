/**
 * Content Script - Loader
 * Injects the Todoist iframe alongside Google Calendar
 */

import { DEFAULT_OPTIONS, ExtensionOptions } from './types';

declare const $: JQueryStatic;

/**
 * Set up the split view with Todoist and Google Calendar
 */
function setup(options: ExtensionOptions = DEFAULT_OPTIONS): void {
  const calendarLeft = options.calendarLeft;
  const leftWidth = options.leftWidth;

  // Create container elements
  const container = document.createElement('div');
  container.className = 'resizeableContainer';

  const rightDiv = document.createElement('div');
  rightDiv.className = 'rightDiv';

  const leftDiv = document.createElement('div');
  leftDiv.className = 'leftDiv';

  const body = document.body;

  // Create Todoist iframe
  const iFrame = document.createElement('iframe');
  iFrame.id = 'todoExtraIFrame';
  iFrame.src = 'https://todoist.com';

  if (calendarLeft === 'true') {
    // Calendar on left, Todoist on right
    rightDiv.appendChild(iFrame);

    // Move all body children to leftDiv
    while (body.firstChild) {
      leftDiv.appendChild(body.firstChild);
    }
  } else {
    // Todoist on left, Calendar on right
    leftDiv.appendChild(iFrame);

    // Move all body children to rightDiv
    while (body.firstChild) {
      rightDiv.appendChild(body.firstChild);
    }
  }

  container.appendChild(leftDiv);
  container.appendChild(rightDiv);
  body.appendChild(container);

  // Set width and make resizable using jQuery UI
  $(leftDiv).width(`${leftWidth}%`);
  $(leftDiv).resizable({ handles: 'e, w' });
}

// Request options from background and initialize
chrome.runtime.sendMessage({ method: 'load' }, (response: ExtensionOptions) => {
  if (chrome.runtime.lastError) {
    console.error('Failed to load options:', chrome.runtime.lastError);
    setup(DEFAULT_OPTIONS);
  } else {
    setup(response);
  }
});
