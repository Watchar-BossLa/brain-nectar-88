
/**
 * Hook for using the OfflineSyncManager service
 * Provides access to offline synchronization capabilities
 */

import { useState, useEffect, useCallback } from 'react';
import offlineSyncManager from '@/services/offline/OfflineSyncManager';

/**
 * Hook for offline sync functionality
 * @returns {Object} Offline sync methods and state
 */
export function useOfflineSync() {
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState(null);

  useEffect(() => {
    // Initialize manager
    offlineSyncManager.initialize();
    
    // Load initial pending count
    const loadPendingCount = async () => {
      const count = await offlineSyncManager.getPendingOperationsCount();
      setPendingCount(count);
    };
    loadPendingCount();
    
    // Set up listeners
    const queueUpdateListener = offlineSyncManager.addListener('queue-updated', async () => {
      const count = await offlineSyncManager.getPendingOperationsCount();
      setPendingCount(count);
    });
    
    const syncStartListener = offlineSyncManager.addListener('sync-started', () => {
      setIsSyncing(true);
    });
    
    const syncCompleteListener = offlineSyncManager.addListener('sync-completed', (result) => {
      setIsSyncing(false);
      setLastSyncResult(result);
    });
    
    const syncErrorListener = offlineSyncManager.addListener('sync-error', () => {
      setIsSyncing(false);
    });
    
    // Cleanup
    return () => {
      offlineSyncManager.removeListener('queue-updated', queueUpdateListener);
      offlineSyncManager.removeListener('sync-started', syncStartListener);
      offlineSyncManager.removeListener('sync-completed', syncCompleteListener);
      offlineSyncManager.removeListener('sync-error', syncErrorListener);
    };
  }, []);

  /**
   * Queue an operation to be synced when online
   * @param {string} entityType - Type of entity (e.g., 'flashcard', 'quiz')
   * @param {string} operation - Type of operation ('create', 'update', 'delete')
   * @param {Object} data - Data for the operation
   * @param {Object} options - Additional options
   * @returns {Promise<string>} - ID of the queued operation
   */
  const queueOperation = useCallback(async (entityType, operation, data, options = {}) => {
    return await offlineSyncManager.queueOperation(entityType, operation, data, options);
  }, []);

  /**
   * Manually trigger synchronization
   * @returns {Promise<Object>} - Sync results
   */
  const syncNow = useCallback(async () => {
    if (isSyncing) return { success: false, message: 'Already syncing' };
    if (!navigator.onLine) return { success: false, message: 'No internet connection' };
    
    const result = await offlineSyncManager.syncData();
    return result;
  }, [isSyncing]);

  /**
   * Retry failed operations
   * @returns {Promise<number>} - Number of retried operations
   */
  const retryFailedOperations = useCallback(async () => {
    return await offlineSyncManager.retryFailedOperations();
  }, []);

  /**
   * Clear failed operations
   * @returns {Promise<number>} - Number of cleared operations
   */
  const clearFailedOperations = useCallback(async () => {
    return await offlineSyncManager.clearFailedOperations();
  }, []);

  return {
    pendingCount,
    isSyncing,
    lastSyncResult,
    queueOperation,
    syncNow,
    retryFailedOperations,
    clearFailedOperations
  };
}
