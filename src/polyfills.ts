
// Polyfills for browser compatibility with Node.js libraries
if (typeof window !== 'undefined') {
  // Define global as window for browser environments
  // @ts-ignore - We're intentionally creating globals
  window.global = window;
  
  // Create a partial process object that TypeScript will accept
  // @ts-ignore - We're intentionally creating a partial Process object
  window.process = window.process || { env: {} };
  
  // Add Buffer and stream polyfill placeholders to prevent errors
  // These won't be functional but will prevent runtime errors
  // @ts-ignore
  window.Buffer = window.Buffer || { isBuffer: () => false };
  
  // Add stream polyfill
  // @ts-ignore
  window.stream = window.stream || {
    Readable: class Readable {},
    PassThrough: class PassThrough {}
  };
  
  // Add URL polyfill
  window.URL = window.URL || self.URL;
}
