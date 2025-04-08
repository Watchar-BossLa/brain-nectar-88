
/**
 * @fileoverview Service worker registration
 */
import { Workbox } from 'workbox-window';

/**
 * Registers the service worker
 * @returns {Promise<ServiceWorkerRegistration|null>} The service worker registration or null if unable to register
 */
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const wb = new Workbox('/service-worker.js');
      
      // Add event listeners
      wb.addEventListener('installed', (event) => {
        if (event.isUpdate) {
          // If it's an update, show the user a notification
          if (confirm('New content is available! Click OK to refresh.')) {
            window.location.reload();
          }
        }
      });
      
      wb.addEventListener('controlling', () => {
        window.location.reload();
      });
      
      // Listen for messages from the service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          console.log('Cache was updated', event.data);
        }
      });
      
      // Register the service worker
      const registration = await wb.register();
      console.log('Service Worker registered successfully', registration);
      
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  } else {
    console.log('Service Workers are not supported in this browser.');
    return null;
  }
}

/**
 * Updates the service worker
 */
export function updateServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.update();
    });
  }
}

/**
 * Sends a message to the service worker
 * @param {Object} message - Message to send
 * @returns {Promise<Object|null>} Response from the service worker or null
 */
export async function sendMessageToServiceWorker(message) {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    return null;
  }
  
  try {
    const messageChannel = new MessageChannel();
    
    return new Promise((resolve) => {
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };
      
      navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
    });
  } catch (error) {
    console.error('Error sending message to Service Worker:', error);
    return null;
  }
}

/**
 * Tells the service worker to cache flashcards for offline use
 * @param {Array} flashcards - Array of flashcard objects
 */
export function cacheFlashcardsForOffline(flashcards) {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_FLASHCARDS',
      flashcards
    });
  }
}

/**
 * Tells the service worker to cache quiz data for offline use
 * @param {Object} quizData - Quiz data object
 */
export function cacheQuizDataForOffline(quizData) {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_QUIZ_DATA',
      quizData
    });
  }
}
