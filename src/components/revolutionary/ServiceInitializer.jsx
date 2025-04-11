
import { useEffect } from 'react';
import { checkForServiceWorkerUpdates } from '../../registerServiceWorker';
import { toast } from 'react-toastify';

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
    
    // Check offline mode on startup
    if (!navigator.onLine) {
      toast.warning('You are offline. Some features may be limited.', {
        autoClose: 5000,
      });
    }
    
    // Initialize any other services here
    console.log('Services initialized');
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default ServiceInitializer;
