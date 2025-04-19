
import { useEffect } from 'react';
import { registerServiceWorker, checkForServiceWorkerUpdates } from '../../registerServiceWorker';
import { toast } from 'react-toastify';
import offlineSyncManager from '../../services/offline/OfflineSyncManager';

/**
 * Service initializer component that sets up application services
 * @returns {null} This component doesn't render anything
 */
const ServiceInitializer = () => {
  useEffect(() => {
    // Register service worker
    const initializeServiceWorker = async () => {
      try {
        await registerServiceWorker();
        
        // Set up service worker update listener
        checkForServiceWorkerUpdates(() => {
          toast.info('New content is available! Please refresh the page.', {
            autoClose: false,
            closeButton: true,
            closeOnClick: false,
            draggable: false,
          });
        });
      } catch (error) {
        console.error('Service worker initialization failed:', error);
      }
    };
    
    initializeServiceWorker();
    
    // Initialize offline sync manager
    offlineSyncManager.initialize();
    
    // Check offline mode on startup
    if (!navigator.onLine) {
      toast.warning('You are offline. Some features may be limited.', {
        autoClose: 5000,
      });
    }
    
    // Set up online/offline listeners for better UX
    const handleOnline = () => {
      toast.success('You are back online!');
    };
    
    const handleOffline = () => {
      toast.warning('You are offline. Some features may be limited.');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default ServiceInitializer;
