
// Polyfills for browser compatibility with Node.js libraries
if (typeof window !== 'undefined') {
  // Define global as window for browser environments
  window.global = window;
  
  // Create a partial process object that TypeScript will accept
  // @ts-ignore - We're intentionally creating a partial Process object
  window.process = window.process || { env: {} };
  
  // Add Buffer if needed
  window.Buffer = window.Buffer || require('buffer').Buffer;
}
