'use strict';

const log = (message, type) => {
  switch (type?.toLowerCase()) {
    case 'info':
      console.info(`[${type.toUpperCase()}][${new Date().toISOString()}] ${message}`);
      break;
    case 'warn':
      console.warn(`[${type.toUpperCase()}][${new Date().toISOString()}] ${message}`);
      break;
    case 'error':
      console.error(`[${type.toUpperCase()}][${new Date().toISOString()}] ${message}`);
      break;
    case 'log':
    default:
      console.log(`[LOG][${new Date().toISOString()}] ${message}`);
      break;
  }
};

module.exports = {
  Log: (message) => log(message),
  Info: (message) => log(message, 'info'),
  Warning: (message) => log(message, 'warn'),
  Error: (message) => log(message, 'error'),
};
