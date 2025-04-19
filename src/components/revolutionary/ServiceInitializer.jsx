
import { useEffect } from 'react';
import { checkForServiceWorkerUpdates } from '../../registerServiceWorker';
import { toast } from 'react-toastify';
import offlineSyncManager from '@/services/offline/OfflineSyncManager';

/**
 * Service initializer component that sets up application services
 * @returns {null} This component doesn't render anything
 */
const ServiceInitializer = () => {
  useEffect(() => {
    // Set up service worker update listener
    checkForServiceWorkerUpdates(() => {
      toast.info('New content is available! Please refresh the page.', {
        autoClose: false,
        closeButton: true,
        closeOnClick: false,
        draggable: false,
      });
    });
    
    // Initialize offline sync manager
    offlineSyncManager.initialize();
    
    // Listen for service worker messages
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SYNC_DATA') {
        // Triggered by background sync
        offlineSyncManager.syncData();
      }
    });
    
    // Check offline mode on startup
    if (!navigator.onLine) {
      toast.warning('You are offline. Some features may be limited.', {
        autoClose: 5000,
      });
    }
    
    // Set up online/offline listeners for better UX
    const handleOnline = () => {
      toast.success('You are back online!');
      // Try to sync pending data
      setTimeout(() => offlineSyncManager.syncData(), 1000);
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
