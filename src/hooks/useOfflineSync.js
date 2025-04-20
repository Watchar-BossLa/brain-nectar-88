
/**
 * Hook for using the OfflineSyncManager service
 * Provides access to offline synchronization capabilities
 */

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import offlineSyncManager from '../services/offline/OfflineSyncManager';

/**
 * Hook for offline sync functionality
 * @returns {Object} Offline sync methods and state
 */
export function useOfflineSync() {
  const [pendingCount, setPendingCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Initialize the sync manager and set up listeners
  useEffect(() => {
    const init = async () => {
      if (!isInitialized) {
        // Initialize the manager
        await offlineSyncManager.initialize();
        
        // Get initial counts
        const pendingCount = await offlineSyncManager.getPendingOperationsCount();
        const failedCount = await offlineSyncManager.getFailedOperationsCount();
        
        setPendingCount(pendingCount);
        setFailedCount(failedCount);
        setIsInitialized(true);
      }
    };
    
    init();
  }, [isInitialized]);

  // Set up event listeners
  useEffect(() => {
    if (!isInitialized) return;
    
    // Listen for queue updates
    const queueUpdateListener = offlineSyncManager.addListener('queue-updated', async () => {
      const count = await offlineSyncManager.getPendingOperationsCount();
      setPendingCount(count);
    });
    
    // Listen for sync start
    const syncStartListener = offlineSyncManager.addListener('sync-started', () => {
      setIsSyncing(true);
    });
    
    // Listen for sync completion
    const syncCompleteListener = offlineSyncManager.addListener('sync-completed', (result) => {
      setIsSyncing(false);
      setLastSyncResult(result);
      
      if (result.successCount > 0) {
        toast({
          title: 'Sync completed',
          description: `${result.successCount} changes synchronized successfully${result.failureCount > 0 ? `, ${result.failureCount} failed` : ''}`,
          variant: 'default',
        });
      }
    });
    
    // Listen for sync errors
    const syncErrorListener = offlineSyncManager.addListener('sync-error', (error) => {
      setIsSyncing(false);
      setLastSyncResult({ success: false, error, timestamp: Date.now() });
      
      toast({
        title: 'Sync failed',
        description: error.message || 'Failed to synchronize data',
        variant: 'destructive',
      });
    });
    
    // Listen for operation errors
    const operationErrorListener = offlineSyncManager.addListener('operation-error', async ({ operation, error }) => {
      console.warn(`Operation ${operation.id} failed:`, error);
      
      // Update failed count if needed
      if (operation.retries >= operation.maxRetries) {
        const failedCount = await offlineSyncManager.getFailedOperationsCount();
        setFailedCount(failedCount);
      }
    });
    
    // Cleanup
    return () => {
      offlineSyncManager.removeListener('queue-updated', queueUpdateListener);
      offlineSyncManager.removeListener('sync-started', syncStartListener);
      offlineSyncManager.removeListener('sync-completed', syncCompleteListener);
      offlineSyncManager.removeListener('sync-error', syncErrorListener);
      offlineSyncManager.removeListener('operation-error', operationErrorListener);
    };
  }, [isInitialized, toast]);

  /**
   * Queue an operation to be synced when online
   * @param {string} entityType - Type of entity (e.g., 'flashcard', 'quiz')
   * @param {string} operation - Operation to perform (e.g., 'create', 'update', 'delete')
   * @param {Object} data - Data for the operation
   * @param {Object} options - Additional options
   * @returns {Promise<string>} Operation ID
   */
  const queueOperation = useCallback(async (entityType, operation, data, options = {}) => {
    if (!isInitialized) {
      await offlineSyncManager.initialize();
      setIsInitialized(true);
    }
    
    return await offlineSyncManager.queueOperation(entityType, operation, data, options);
  }, [isInitialized]);

  /**
   * Manually trigger synchronization
   * @returns {Promise<Object>} Sync result
   */
  const syncNow = useCallback(async () => {
    if (!isInitialized) {
      await offlineSyncManager.initialize();
      setIsInitialized(true);
    }
    
    if (isSyncing) {
      toast({
        title: 'Sync in progress',
        description: 'Please wait for the current sync to complete',
        variant: 'default',
      });
      return { success: false, message: 'Already syncing' };
    }
    
    if (!navigator.onLine) {
      toast({
        title: 'Offline',
        description: 'Cannot sync while offline',
        variant: 'default',
      });
      return { success: false, message: 'No internet connection' };
    }
    
    return await offlineSyncManager.syncNow();
  }, [isSyncing, isInitialized, toast]);

  /**
   * Retry failed operations
   * @returns {Promise<Object>} Retry result
   */
  const retryFailedOperations = useCallback(async () => {
    if (!isInitialized) {
      await offlineSyncManager.initialize();
      setIsInitialized(true);
    }
    
    const result = await offlineSyncManager.retryFailedOperations();
    
    if (result.success) {
      toast({
        title: 'Retry initiated',
        description: result.message || 'Failed operations have been queued for retry',
        variant: 'default',
      });
      
      // Update counts
      const failedCount = await offlineSyncManager.getFailedOperationsCount();
      setFailedCount(failedCount);
    } else {
      toast({
        title: 'Retry failed',
        description: result.error || 'Could not retry operations',
        variant: 'destructive',
      });
    }
    
    return result;
  }, [isInitialized, toast]);

  /**
   * Clear failed operations
   * @returns {Promise<Object>} Clear result
   */
  const clearFailedOperations = useCallback(async () => {
    if (!isInitialized) {
      await offlineSyncManager.initialize();
      setIsInitialized(true);
    }
    
    const result = await offlineSyncManager.clearFailedOperations();
    
    if (result.success) {
      toast({
        title: 'Cleared',
        description: 'Failed operations have been cleared',
        variant: 'default',
      });
      setFailedCount(0);
    } else {
      toast({
        title: 'Clear failed',
        description: result.error || 'Could not clear failed operations',
        variant: 'destructive',
      });
    }
    
    return result;
  }, [isInitialized, toast]);

  /**
   * Get list of failed operations
   * @returns {Promise<Array>} List of failed operations
   */
  const getFailedOperations = useCallback(async () => {
    if (!isInitialized) {
      await offlineSyncManager.initialize();
      setIsInitialized(true);
    }
    
    return await offlineSyncManager.getFailedOperations();
  }, [isInitialized]);

  return {
    pendingCount,
    failedCount,
    isSyncing,
    lastSyncResult,
    isInitialized,
    queueOperation,
    syncNow,
    retryFailedOperations,
    clearFailedOperations,
    getFailedOperations
  };
}
