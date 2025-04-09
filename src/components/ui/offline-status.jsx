import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { OfflineSyncService } from '@/services/offline';
import { toast } from '@/components/ui/use-toast';

/**
 * Offline Status Component
 * Shows the current online/offline status and pending sync actions
 * 
 * @returns {React.ReactElement} Offline status component
 */
const OfflineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Update online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: 'You are back online',
        description: 'Your changes will be synchronized',
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: 'You are offline',
        description: 'Changes will be saved locally and synced when you reconnect',
        variant: 'destructive',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check for pending actions
  useEffect(() => {
    const checkPendingActions = async () => {
      try {
        const count = await OfflineSyncService.getPendingActionCount();
        setPendingActions(count);
      } catch (error) {
        console.error('Error checking pending actions:', error);
      }
    };

    checkPendingActions();

    // Set up interval to check periodically
    const interval = setInterval(checkPendingActions, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle manual sync
  const handleSync = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    
    try {
      const result = await OfflineSyncService.syncPendingActions(fetch);
      
      if (result.status === 'success') {
        setPendingActions(result.pending);
        
        if (result.synced > 0) {
          toast({
            title: 'Sync Complete',
            description: `Synchronized ${result.synced} changes`,
          });
        }
      } else {
        toast({
          title: 'Sync Failed',
          description: result.error || 'Failed to synchronize changes',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error syncing:', error);
      toast({
        title: 'Sync Error',
        description: error.message || 'An error occurred during synchronization',
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Don't show anything if online and no pending actions
  if (isOnline && pendingActions === 0) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 rounded-lg shadow-lg p-3 flex items-center gap-2 ${
      isOnline ? 'bg-amber-100 dark:bg-amber-900' : 'bg-red-100 dark:bg-red-900'
    }`}>
      {isOnline ? (
        <Wifi className="h-5 w-5 text-amber-600 dark:text-amber-300" />
      ) : (
        <WifiOff className="h-5 w-5 text-red-600 dark:text-red-300" />
      )}
      
      <div>
        <div className="text-sm font-medium">
          {isOnline ? 'Online' : 'Offline'}
        </div>
        {pendingActions > 0 && (
          <div className="text-xs">
            {pendingActions} {pendingActions === 1 ? 'change' : 'changes'} pending
          </div>
        )}
      </div>
      
      {isOnline && pendingActions > 0 && (
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="ml-2 p-1 rounded-full bg-amber-200 dark:bg-amber-800 hover:bg-amber-300 dark:hover:bg-amber-700"
          aria-label="Sync changes"
        >
          <RefreshCw className={`h-4 w-4 text-amber-700 dark:text-amber-200 ${
            isSyncing ? 'animate-spin' : ''
          }`} />
        </button>
      )}
    </div>
  );
};

export default OfflineStatus;
