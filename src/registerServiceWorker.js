
/**
 * Service Worker Registration
 * This file handles the registration and updates of the service worker.
 */

/**
 * Register the service worker and return the registration
 * @returns {Promise<ServiceWorkerRegistration|null>} The registration object or null if not supported
 */
export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers are not supported in this browser');
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none' // Don't use cached service worker script
    });
    
    console.log('Service worker registered successfully:', registration);
    
    // Check for updates immediately
    await registration.update();
    
    return registration;
  } catch (error) {
    console.error('Service worker registration failed:', error);
    // Don't throw, just return null - the app can still function without SW
    return null;
  }
};

/**
 * Check for service worker updates and provide a callback when updates are found
 * @param {Function} callback - Function to call when an update is found
 */
export const checkForServiceWorkerUpdates = (callback) => {
  if (!('serviceWorker' in navigator)) return;

  // Set up the update found event handler
  const setupUpdateFoundHandler = (registration) => {
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      newWorker.addEventListener('statechange', () => {
        // New service worker is installed, but waiting to activate
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          console.log('[Service Worker] Update found and ready to be used');
          if (callback && typeof callback === 'function') {
            callback(registration);
          }
        }
      });
    });
  };

  navigator.serviceWorker.ready
    .then((registration) => {
      // Set up periodic updates (every 6 hours)
      setInterval(() => {
        registration.update().catch(err => {
          console.warn('[Service Worker] Failed to check for updates:', err);
        });
      }, 6 * 60 * 60 * 1000);
      
      // Set up update handler
      setupUpdateFoundHandler(registration);
    })
    .catch(err => {
      console.warn('[Service Worker] Failed to register update checker:', err);
    });
};

/**
 * Force reload the service worker and refresh the page
 * @returns {Promise<void>}
 */
export const forceServiceWorkerUpdate = async () => {
  if (!('serviceWorker' in navigator)) return;
  
  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Send message to skip waiting
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    
    // Wait for the new service worker to control the page
    await new Promise((resolve) => {
      if (!navigator.serviceWorker.controller) {
        // If we don't have a controller, resolve immediately
        resolve();
        return;
      }
      
      // Listen for controllerchange event
      const onControllerChange = () => {
        navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
        resolve();
      };
      
      navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
      
      // Timeout after 3 seconds to prevent waiting indefinitely
      setTimeout(resolve, 3000);
    });
    
    // Reload the page
    window.location.reload();
  } catch (error) {
    console.error('[Service Worker] Force update failed:', error);
  }
};

/**
 * Send a message to the service worker
 * @param {Object} message - Message to send
 * @returns {Promise<any>} Response from the service worker, or undefined if no response
 */
export const sendMessageToServiceWorker = async (message) => {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    return undefined;
  }
  
  try {
    const messageChannel = new MessageChannel();
    
    // Return a promise that resolves when we get a message back
    const messagePromise = new Promise((resolve) => {
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };
    });
    
    // Send the message
    navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
    
    // Wait for response with timeout
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => resolve(undefined), 1000);
    });
    
    return Promise.race([messagePromise, timeoutPromise]);
  } catch (error) {
    console.error('[Service Worker] Send message failed:', error);
    return undefined;
  }
};
