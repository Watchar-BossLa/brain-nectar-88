// Polyfills for browser compatibility with Node.js libraries
if (typeof window !== 'undefined') {
  // Define global as window for browser environments
  window.global = window;
  
  // Other potential polyfills if needed
  window.process = window.process || { env: {} };
  window.Buffer = window.Buffer || require('buffer').Buffer;
}
