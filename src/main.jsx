
// Import polyfills first
import './polyfills';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { registerServiceWorker } from './registerServiceWorker';

// Initialize the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker
if ('serviceWorker' in navigator) {
  // Wait for window load to ensure everything is ready
  window.addEventListener('load', () => {
    registerServiceWorker().catch(error => {
      console.error('Service worker registration failed:', error);
    });
  });
}

// Add an event listener for beforeinstallprompt to enhance PWA experience
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-info bar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Update UI to notify the user they can install the PWA
  console.log('App can be installed - showing install prompt');
  
  // Dispatch event so components can show install button
  window.dispatchEvent(new CustomEvent('pwaInstallable'));
});

// Expose the install prompt globally so it can be triggered from any component
window.installApp = async () => {
  if (deferredPrompt) {
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // We no longer need the prompt. Clear it up.
    deferredPrompt = null;
    // Dispatch event that install prompt was handled
    window.dispatchEvent(new CustomEvent('pwaInstallHandled', { detail: { outcome } }));
    return outcome;
  }
  return null;
};

// Listen for app updates from the service worker
navigator.serviceWorker?.addEventListener('controllerchange', () => {
  console.log('Service worker controller changed - refreshing page');
  window.location.reload();
});
