
import './polyfills'; // Import polyfills first
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { registerServiceWorker } from './registerServiceWorker';
import 'localforage';

// Initialize the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for offline support
registerServiceWorker().catch(error => {
  console.error('Failed to register service worker:', error);
});

// Add an event listener for beforeinstallprompt to enhance PWA experience
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-info bar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Update UI to notify the user they can install the PWA
  console.log('App can be installed - showing install prompt');
});

// Expose the install prompt globally so it can be triggered from any component
window.installApp = async () => {
  if (deferredPrompt) {
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // We no longer need the prompt.  Clear it up.
    deferredPrompt = null;
    return outcome;
  }
  return null;
};
