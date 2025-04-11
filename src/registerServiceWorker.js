
/**
 * Registers the service worker for offline capabilities
 * @returns {Promise<void>}
 */
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      // Use the Workbox service worker
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('ServiceWorker registration successful: ', registration);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New content is available; please refresh.');
            }
          });
        }
      });
      
      // Add function to cache flashcards for offline use
      window.cacheFlashcardsForOffline = (flashcards) => {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'CACHE_FLASHCARDS',
            flashcards
          });
        }
      };
      
      // Add function to cache quiz data for offline use
      window.cacheQuizDataForOffline = (quizData) => {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'CACHE_QUIZ_DATA',
            quizData
          });
        }
      };
      
    } catch (error) {
      console.error('ServiceWorker registration failed: ', error);
    }
  }
};

/**
 * Unregisters all service workers
 * @returns {Promise<void>}
 */
export const unregisterServiceWorkers = async () => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    console.log('All service workers unregistered');
  }
};

/**
 * Checks if there's a new version of the service worker
 * @param {Function} callback - Callback to run when new content is available
 */
export const checkForServiceWorkerUpdates = (callback) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      callback();
    });
  }
};

/**
 * Cache flashcards for offline use
 * @param {Array} flashcards - Flashcard data to cache
 */
export const cacheFlashcardsForOffline = (flashcards) => {
  if (window.cacheFlashcardsForOffline) {
    window.cacheFlashcardsForOffline(flashcards);
  }
};

/**
 * Cache quiz data for offline use
 * @param {Object} quizData - Quiz data to cache
 */
export const cacheQuizDataForOffline = (quizData) => {
  if (window.cacheQuizDataForOffline) {
    window.cacheQuizDataForOffline(quizData);
  }
};
