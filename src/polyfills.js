
// Import the Buffer from 'buffer' package
import { Buffer as BufferPolyfill } from 'buffer';

// Polyfills for browser compatibility with Node.js libraries
if (typeof window !== 'undefined') {
  // Define global as window for browser environments
  window.global = window;
  
  // Create a partial process object
  window.process = window.process || { env: {} };
  
  // Add Buffer if needed
  window.Buffer = window.Buffer || BufferPolyfill;
  
  // Add stream polyfill
  window.stream = window.stream || {
    Readable: class Readable {},
    PassThrough: class PassThrough {}
  };
  
  // Add URL polyfill
  window.URL = window.URL || self.URL;
}
