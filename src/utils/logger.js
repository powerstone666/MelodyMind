/**
 * Enhanced logger for MelodyMind
 * Provides better console logging with highlighting for important messages
 */

const DEBUG = true; // Set to false in production

const logger = {
  info: (message, data) => {
    if (!DEBUG) return;
    console.log(
      '%c MelodyMind Info ',
      'background: #2d1e37; color: #ee1080; padding: 2px 4px; border-radius: 3px;',
      message,
      data || ''
    );
  },
  
  error: (message, error) => {
    console.error(
      '%c MelodyMind Error ',
      'background: #ee1080; color: white; padding: 2px 4px; border-radius: 3px;',
      message,
      error || ''
    );
  },
  
  warn: (message, data) => {
    if (!DEBUG) return;
    console.warn(
      '%c MelodyMind Warning ',
      'background: #ff7700; color: white; padding: 2px 4px; border-radius: 3px;',
      message,
      data || ''
    );
  },
  
  success: (message, data) => {
    if (!DEBUG) return;
    console.log(
      '%c MelodyMind Success ',
      'background: #00cc88; color: white; padding: 2px 4px; border-radius: 3px;',
      message,
      data || ''
    );
  },
  
  apiRequest: (endpoint, params) => {
    if (!DEBUG) return;
    console.log(
      '%c API Request ',
      'background: #0e9eef; color: white; padding: 2px 4px; border-radius: 3px;',
      `Endpoint: ${endpoint}`,
      params || ''
    );
  },
  
  apiResponse: (endpoint, data) => {
    if (!DEBUG) return;
    console.log(
      '%c API Response ',
      'background: #2d1e37; color: #0e9eef; padding: 2px 4px; border-radius: 3px;',
      `Endpoint: ${endpoint}`,
      data || ''
    );
  }
};

export default logger;
