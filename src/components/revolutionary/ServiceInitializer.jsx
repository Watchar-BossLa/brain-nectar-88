
import { useEffect } from 'react';
import { registerServiceWorker, checkForServiceWorkerUpdates } from '../../registerServiceWorker';
import { useToast } from '@/hooks/use-toast';
import offlineSyncManager from '../../services/offline/OfflineSyncManager';
import { useOfflineSync } from '@/hooks/useOfflineSync';

/**
 * Service initializer component that sets up application services
 * @returns {null} This component doesn't render anything
 */
const ServiceInitializer = () => {
  const { toast } = useToast();
  const { isInitialized } = useOfflineSync();
  
  useEffect(() => {
    // Register service worker
    const initializeServiceWorker = async () => {
      try {
        const registration = await registerServiceWorker();
        
        if (registration) {
          // Set up service worker update listener
          checkForServiceWorkerUpdates(() => {
            toast({
              title: 'Update Available',
              description: 'New content is available. Click here to update.',
              action: {
                label: 'Update Now',
                onClick: () => {
                  // Force reload with new service worker
                  window.location.reload();
                }
              },
              duration: 0, // Don't auto-dismiss
            });
          });
        }
      } catch (error) {
        console.error('Service worker initialization failed:', error);
      }
    };
    
    initializeServiceWorker();
    
    // Check offline mode on startup
    if (!navigator.onLine) {
      toast({
        title: 'Offline Mode',
        description: 'You are offline. Some features may be limited.',
        variant: 'warning',
      });
    }
    
    // Set up online/offline listeners for better UX
    const handleOnline = () => {
      toast({
        title: 'Connected',
        description: 'You are back online!',
        variant: 'default',
      });
      
      // Attempt sync if we have pending items
      if (isInitialized) {
        offlineSyncManager.attemptSync();
      }
    };
    
    const handleOffline = () => {
      toast({
        title: 'Offline Mode',
        description: 'You are offline. Some features may be limited.',
        variant: 'warning',
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast, isInitialized]);
  
  // This component doesn't render anything
  return null;
};

export default ServiceInitializer;
