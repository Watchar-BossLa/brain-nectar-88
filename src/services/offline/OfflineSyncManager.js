
/**
 * Offline Sync Manager
 * Handles the synchronization of offline data when the app comes back online
 */

import localforage from 'localforage';

class OfflineSyncManager {
  constructor() {
    this.queue = [];
    this.isSyncing = false;
    this.eventListeners = {
      'queue-updated': [],
      'sync-started': [],
      'sync-completed': [],
      'sync-error': [],
      'operation-success': [],
      'operation-error': []
    };
    this.offlineStorage = localforage.createInstance({
      name: 'studyBeeOfflineSync',
      storeName: 'syncOperations'
    });
    this.failedOperationsStorage = localforage.createInstance({
      name: 'studyBeeOfflineSync',
      storeName: 'failedOperations'
    });
  }
  
  async initialize() {
    console.log('Initializing offline sync manager');
    window.addEventListener('online', this.handleOnline.bind(this));
    
    // Listen for messages from the service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SYNC_DATA') {
          this.syncNow();
        }
      });
    }

    // Try to sync on initialization if we're online
    if (navigator.onLine) {
      this.attemptSync();
    }
    
    // Load queue from persistent storage
    await this.loadQueueFromStorage();
  }
  
  async loadQueueFromStorage() {
    try {
      const storedQueue = await this.offlineStorage.getItem('syncQueue');
      if (storedQueue && Array.isArray(storedQueue)) {
        this.queue = storedQueue;
        this.emitEvent('queue-updated');
        console.log(`Loaded ${this.queue.length} operations from storage`);
      }
    } catch (error) {
      console.error('Failed to load queue from storage:', error);
    }
  }
  
  async saveQueueToStorage() {
    try {
      await this.offlineStorage.setItem('syncQueue', this.queue);
    } catch (error) {
      console.error('Failed to save queue to storage:', error);
    }
  }
  
  handleOnline = async () => {
    console.log('App is online, attempting to sync');
    this.attemptSync();
  }
  
  addListener(eventName, callback) {
    if (!this.eventListeners[eventName]) {
      this.eventListeners[eventName] = [];
    }
    
    this.eventListeners[eventName].push(callback);
    return callback; // Return the callback for removal later
  }
  
  removeListener(eventName, callback) {
    if (this.eventListeners[eventName]) {
      this.eventListeners[eventName] = this.eventListeners[eventName]
        .filter(cb => cb !== callback);
    }
  }
  
  emitEvent(eventName, data) {
    if (this.eventListeners[eventName]) {
      this.eventListeners[eventName].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${eventName} event listener:`, error);
        }
      });
    }
  }
  
  async queueOperation(entityType, operation, data, options = {}) {
    const operationId = options.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    console.log(`Queuing offline operation: ${entityType}/${operation}`, data);
    
    const syncItem = {
      id: operationId,
      entityType,
      operation,
      data,
      timestamp: Date.now(),
      retries: 0,
      maxRetries: options.maxRetries || 5,
      priority: options.priority || 1, // 1 = normal, 2 = high, 0 = low
      status: 'pending'
    };
    
    this.queue.push(syncItem);
    await this.saveQueueToStorage();
    
    this.emitEvent('queue-updated');
    
    if (navigator.onLine && !this.isSyncing && options.syncImmediately !== false) {
      this.attemptSync();
    }
    
    // Register for background sync if available
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      try {
        await registration.sync.register('sync-data');
        console.log('Background sync registered');
      } catch (error) {
        console.error('Background sync registration failed:', error);
      }
    }
    
    return operationId;
  }
  
  attemptSync = async () => {
    if (navigator.onLine && this.queue.length > 0 && !this.isSyncing) {
      await this.syncNow();
    }
  }
  
  async syncNow() {
    if (this.isSyncing) {
      console.log('Sync already in progress, skipping');
      return { success: false, message: 'Sync already in progress' };
    }
    
    if (this.queue.length === 0) {
      console.log('No operations to sync');
      return { success: true, message: 'No operations to sync' };
    }
    
    if (!navigator.onLine) {
      console.log('Device is offline, cannot sync');
      return { success: false, message: 'Device is offline' };
    }
    
    console.log('Starting sync process with', this.queue.length, 'operations');
    this.isSyncing = true;
    this.emitEvent('sync-started');
    
    try {
      // Sort by priority (higher first) and then by timestamp (older first)
      const pendingOperations = [...this.queue].sort((a, b) => {
        if (b.priority !== a.priority) return b.priority - a.priority;
        return a.timestamp - b.timestamp;
      });
      
      let successCount = 0;
      let failureCount = 0;
      
      for (const operation of pendingOperations) {
        try {
          console.log(`Processing operation ${operation.id}: ${operation.entityType}/${operation.operation}`);
          
          // Process the operation based on type
          const result = await this.processOperation(operation);
          
          if (result.success) {
            // Remove from queue if successful
            this.queue = this.queue.filter(op => op.id !== operation.id);
            successCount++;
            this.emitEvent('operation-success', { operation, result });
          } else {
            // Increment retry count
            const updatedOperation = {
              ...operation,
              retries: operation.retries + 1,
              lastError: result.error,
              lastAttempt: Date.now()
            };
            
            // Move to failed operations if max retries exceeded
            if (updatedOperation.retries >= updatedOperation.maxRetries) {
              await this.moveToFailedOperations(updatedOperation);
              this.queue = this.queue.filter(op => op.id !== operation.id);
            } else {
              // Update in queue
              this.queue = this.queue.map(op => 
                op.id === operation.id ? updatedOperation : op
              );
            }
            
            failureCount++;
            this.emitEvent('operation-error', { operation: updatedOperation, result });
          }
        } catch (error) {
          console.error(`Error processing operation ${operation.id}:`, error);
          failureCount++;
          
          const updatedOperation = {
            ...operation,
            retries: operation.retries + 1,
            lastError: error.message || 'Unknown error',
            lastAttempt: Date.now()
          };
          
          if (updatedOperation.retries >= updatedOperation.maxRetries) {
            await this.moveToFailedOperations(updatedOperation);
            this.queue = this.queue.filter(op => op.id !== operation.id);
          } else {
            this.queue = this.queue.map(op => 
              op.id === operation.id ? updatedOperation : op
            );
          }
          
          this.emitEvent('operation-error', { operation: updatedOperation, error });
        }
      }
      
      // Save queue after all operations
      await this.saveQueueToStorage();
      
      console.log(`Sync completed. ${successCount} succeeded, ${failureCount} failed`);
      
      const result = {
        success: true,
        successCount,
        failureCount,
        timestamp: Date.now()
      };
      
      this.emitEvent('sync-completed', result);
      return result;
    } catch (error) {
      console.error('Sync process failed:', error);
      
      const result = {
        success: false,
        error: error.message || 'Unknown error',
        timestamp: Date.now()
      };
      
      this.emitEvent('sync-error', result);
      return result;
    } finally {
      this.isSyncing = false;
      this.emitEvent('queue-updated');
    }
  }
  
  async processOperation(operation) {
    // In a real implementation, this would process different operation types
    // Here's a simplified example:
    
    switch (operation.entityType) {
      case 'flashcard':
        return this.processFlashcardOperation(operation);
      
      case 'quiz':
        return this.processQuizOperation(operation);
        
      case 'note':
        return this.processNoteOperation(operation);
        
      case 'studySession':
        return this.processStudySessionOperation(operation);
        
      default:
        console.warn(`Unknown operation type: ${operation.entityType}`);
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }
  }
  
  async processFlashcardOperation(operation) {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Processed flashcard operation: ${operation.operation}`, operation.data);
    return { success: true };
  }
  
  async processQuizOperation(operation) {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Processed quiz operation: ${operation.operation}`, operation.data);
    return { success: true };
  }
  
  async processNoteOperation(operation) {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Processed note operation: ${operation.operation}`, operation.data);
    return { success: true };
  }
  
  async processStudySessionOperation(operation) {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Processed study session operation: ${operation.operation}`, operation.data);
    return { success: true };
  }
  
  async moveToFailedOperations(operation) {
    try {
      const failedOps = await this.failedOperationsStorage.getItem('failedOperations') || [];
      failedOps.push({
        ...operation,
        movedToFailedAt: Date.now(),
        status: 'failed'
      });
      await this.failedOperationsStorage.setItem('failedOperations', failedOps);
    } catch (error) {
      console.error('Failed to save to failed operations:', error);
    }
  }
  
  async getPendingOperationsCount() {
    return this.queue.length;
  }
  
  async getFailedOperationsCount() {
    try {
      const failedOps = await this.failedOperationsStorage.getItem('failedOperations') || [];
      return failedOps.length;
    } catch (error) {
      console.error('Failed to get failed operations count:', error);
      return 0;
    }
  }
  
  async getFailedOperations() {
    try {
      return await this.failedOperationsStorage.getItem('failedOperations') || [];
    } catch (error) {
      console.error('Failed to get failed operations:', error);
      return [];
    }
  }
  
  async retryFailedOperations() {
    try {
      const failedOps = await this.failedOperationsStorage.getItem('failedOperations') || [];
      if (failedOps.length === 0) return { success: true, message: 'No failed operations to retry' };
      
      // Restore failed operations to the main queue with reset retry count
      for (const operation of failedOps) {
        this.queue.push({
          ...operation,
          retries: 0,
          status: 'pending',
          retriedAt: Date.now()
        });
      }
      
      // Clear the failed operations
      await this.failedOperationsStorage.setItem('failedOperations', []);
      
      // Save updated queue
      await this.saveQueueToStorage();
      
      this.emitEvent('queue-updated');
      
      // Attempt to sync if online
      if (navigator.onLine) {
        return this.syncNow();
      }
      
      return { success: true, message: 'Operations queued for sync' };
    } catch (error) {
      console.error('Failed to retry failed operations:', error);
      return { success: false, error: error.message || 'Unknown error' };
    }
  }
  
  async clearFailedOperations() {
    try {
      await this.failedOperationsStorage.setItem('failedOperations', []);
      return { success: true };
    } catch (error) {
      console.error('Failed to clear failed operations:', error);
      return { success: false, error: error.message || 'Unknown error' };
    }
  }
  
  async clearQueue() {
    this.queue = [];
    await this.saveQueueToStorage();
    this.emitEvent('queue-updated');
    return { success: true };
  }
}

// Create singleton instance
const offlineSyncManager = new OfflineSyncManager();

export default offlineSyncManager;
