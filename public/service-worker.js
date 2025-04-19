
// Import the contents of src/service-worker.js
importScripts('/src/service-worker.js');

// Add additional logging for debugging
console.log('Service worker loaded from public directory');

// This file acts as a bridge between the public service worker file
// and our actual implementation in src/service-worker.js
