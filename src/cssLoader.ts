/**
 * CSS Loader Content Script
 * Injects stylesheets at document_start
 */

/**
 * Load a CSS file from the extension
 */
function loadCSS(path: string): void {
  const link = document.createElement('link');
  link.href = chrome.runtime.getURL(path);
  link.rel = 'stylesheet';
  document.documentElement.insertBefore(link, null);
}

// Load required stylesheets
loadCSS('main.css');
loadCSS('jQuery/jquery-ui.structure.css');
loadCSS('jQuery/jquery-ui.theme.css');
