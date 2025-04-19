
/**
 * Service Worker Registration
 * This file handles the registration and updates of the service worker.
 */

// Check if service workers are supported
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      
      console.log('Service worker registered successfully:', registration);
      
      // Return the registration for later use
      return registration;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      throw error;
    }
  } else {
    console.warn('Service workers are not supported in this browser');
    return null;
  }
};

// Function to check for service worker updates
export const checkForServiceWorkerUpdates = (callback) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      // Check for updates every hour
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);

      // Set up update found listener
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content is available, callback to notify user
            if (callback && typeof callback === 'function') {
              callback();
            }
          }
        });
      });
    });
  }
};
