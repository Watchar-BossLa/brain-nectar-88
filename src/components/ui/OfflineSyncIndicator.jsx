
import React, { useState } from 'react';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { Database, CloudSync, AlertTriangle, Check, Loader } from 'lucide-react';
import { toast } from 'react-toastify';

/**
 * Offline sync indicator component
 * Shows sync status and pending operations
 */
const OfflineSyncIndicator = () => {
  const { pendingCount, isSyncing, syncNow, retryFailedOperations } = useOfflineSync();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Handle manual sync button click
  const handleSyncClick = async () => {
    if (isSyncing) return;
    
    if (!navigator.onLine) {
      toast.warning('You are offline. Cannot sync now.');
      return;
    }
    
    try {
      const result = await syncNow();
      if (result.success) {
        if (result.synced > 0) {
          toast.success(`Successfully synced ${result.synced} items.`);
        } else {
          toast.info('No items to sync.');
        }
      } else {
        toast.error(`Sync failed: ${result.message}`);
      }
    } catch (error) {
      toast.error(`Sync error: ${error.message}`);
    }
  };
  
  // Handle retry button click
  const handleRetryClick = async () => {
    if (isSyncing) return;
    
    try {
      const count = await retryFailedOperations();
      if (count > 0) {
        toast.info(`Retrying ${count} failed operations.`);
      } else {
        toast.info('No failed operations to retry.');
      }
    } catch (error) {
      toast.error(`Retry error: ${error.message}`);
    }
  };
  
  // If no pending operations and not syncing, don't show anything
  if (pendingCount === 0 && !isSyncing) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className={`flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 cursor-pointer transition-all duration-200 ${
          isExpanded ? 'w-auto' : 'w-auto'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isSyncing ? (
          <div className="flex items-center text-blue-600">
            <Loader className="h-5 w-5 animate-spin mr-2" />
            <span className="text-sm font-medium">Syncing...</span>
          </div>
        ) : pendingCount > 0 ? (
          <div className="flex items-center text-amber-600">
            <Database className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">{pendingCount} pending</span>
          </div>
        ) : (
          <div className="flex items-center text-green-600">
            <Check className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">All synced</span>
          </div>
        )}
        
        {isExpanded && (
          <div className="ml-4 flex items-center space-x-2">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-2 py-1 text-xs flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                handleSyncClick();
              }}
              disabled={isSyncing || !navigator.onLine}
            >
              <CloudSync className="h-3 w-3 mr-1" />
              Sync Now
            </button>
            
            <button 
              className="bg-amber-600 hover:bg-amber-700 text-white rounded-md px-2 py-1 text-xs flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                handleRetryClick();
              }}
              disabled={isSyncing || !navigator.onLine}
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              Retry Failed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineSyncIndicator;
