
/**
 * Offline Sync Manager
 * Handles the synchronization of offline data when the app comes back online
 */

// Simplified version to avoid potential issues
const offlineSyncManager = {
  queue: [],
  isSyncing: false,
  
  initialize() {
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
  },
  
  handleOnline() {
    console.log('App is online, attempting to sync');
    this.attemptSync();
  },
  
  queueOperation(operation) {
    console.log('Queuing offline operation', operation);
    this.queue.push({
      id: operation.id || Date.now().toString(),
      operation,
      timestamp: Date.now()
    });
    return true;
  },
  
  attemptSync() {
    if (navigator.onLine && this.queue.length > 0 && !this.isSyncing) {
      this.syncNow();
    }
  },
  
  async syncNow() {
    if (this.isSyncing || this.queue.length === 0) return;
    
    console.log('Starting sync process');
    this.isSyncing = true;
    
    try {
      // Process each operation in the queue
      const pendingOperations = [...this.queue];
      let successCount = 0;
      
      for (const item of pendingOperations) {
        try {
          console.log(`Syncing operation ${item.id}`);
          // In a real implementation, this would process the actual operation
          await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network request
          
          // Remove from queue if successful
          this.queue = this.queue.filter(op => op.id !== item.id);
          successCount++;
        } catch (error) {
          console.error(`Failed to sync operation ${item.id}:`, error);
        }
      }
      
      console.log(`Sync completed. ${successCount}/${pendingOperations.length} operations synced`);
    } catch (error) {
      console.error('Sync process failed:', error);
    } finally {
      this.isSyncing = false;
    }
  },
  
  getPendingCount() {
    return this.queue.length;
  }
};

export default offlineSyncManager;
