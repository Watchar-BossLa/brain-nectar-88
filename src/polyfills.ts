
// Import the Buffer from 'buffer' package
import { Buffer as BufferPolyfill } from 'buffer';

// Polyfills for browser compatibility with Node.js libraries
if (typeof window !== 'undefined') {
  // Define global as window for browser environments
  window.global = window;
  
  // Create a partial process object that TypeScript will accept
  // @ts-ignore - We're intentionally creating a partial Process object
  window.process = window.process || { env: {} };
  
  // Add Buffer if needed
  window.Buffer = window.Buffer || BufferPolyfill;
  
  // Add stream polyfill
  // @ts-ignore
  window.stream = window.stream || {
    Readable: class Readable {},
    PassThrough: class PassThrough {}
  };
  
  // Add URL polyfill
  window.URL = window.URL || self.URL;
}

