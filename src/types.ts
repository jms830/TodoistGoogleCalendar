/**
 * Extension options stored in chrome.storage
 */
export interface ExtensionOptions {
  leftWidth: string;
  calendarLeft: string;
}

/**
 * Default options for the extension
 */
export const DEFAULT_OPTIONS: ExtensionOptions = {
  leftWidth: '60',
  calendarLeft: 'true',
};

/**
 * Message types for communication between content scripts and background
 */
export interface LoadMessage {
  method: 'load';
}

export type ExtensionMessage = LoadMessage;
