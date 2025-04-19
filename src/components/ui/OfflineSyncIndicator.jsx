
import React from 'react';
import { useOfflineSync } from '../../hooks/useOfflineSync';
import { RefreshCw } from 'lucide-react';

/**
 * Component that shows pending sync operations and allows manual sync
 * @returns {React.ReactElement|null} The component or null when no pending operations
 */
const OfflineSyncIndicator = () => {
  const { pendingCount, isSyncing, syncNow } = useOfflineSync();
  
  // Don't show anything if no pending operations
  if (pendingCount === 0) return null;
  
  return (
    <div className="fixed bottom-16 right-4 z-50 rounded-lg shadow-lg p-3 bg-amber-100 dark:bg-amber-900 flex items-center gap-2">
      <div>
        <span className="text-sm font-medium">
          {pendingCount} {pendingCount === 1 ? 'change' : 'changes'} pending
        </span>
      </div>
      
      {navigator.onLine && (
        <button
          onClick={syncNow}
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

export default OfflineSyncIndicator;
