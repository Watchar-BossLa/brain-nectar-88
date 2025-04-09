/**
 * Offline Sync Service
 * Handles synchronization of offline data with the server
 */

class OfflineSyncService {
  constructor() {
    this.dbName = 'StudyBeeOfflineDB';
    this.dbVersion = 1;
    this.db = null;
    this.isInitialized = false;
    this.isSyncing = false;
  }

  /**
   * Initialize the IndexedDB database
   * @returns {Promise<IDBDatabase>} The database instance
   */
  async init() {
    if (this.isInitialized) {
      return this.db;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains('pendingActions')) {
          const pendingActionsStore = db.createObjectStore('pendingActions', { keyPath: 'id', autoIncrement: true });
          pendingActionsStore.createIndex('type', 'type', { unique: false });
          pendingActionsStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        this.isInitialized = true;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('Error opening IndexedDB:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  /**
   * Queue an action to be performed when online
   * @param {string} type - The type of action (e.g., 'create', 'update', 'delete')
   * @param {string} endpoint - The API endpoint
   * @param {Object} data - The data for the action
   * @param {string} method - The HTTP method (default: 'POST')
   * @returns {Promise<number>} The ID of the queued action
   */
  async queueAction(type, endpoint, data, method = 'POST') {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['pendingActions'], 'readwrite');
      const store = transaction.objectStore('pendingActions');

      const action = {
        type,
        endpoint,
        data,
        method,
        createdAt: new Date().toISOString(),
        attempts: 0
      };

      const request = store.add(action);

      request.onsuccess = (event) => {
        const id = event.target.result;
        
        // Register for sync if supported
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          navigator.serviceWorker.ready
            .then(registration => registration.sync.register('sync-study-data'))
            .catch(err => console.error('Sync registration failed:', err));
        }
        
        resolve(id);
      };

      request.onerror = (event) => reject(event.target.error);
    });
  }

  /**
   * Get all pending actions
   * @returns {Promise<Array<Object>>} Array of pending actions
   */
  async getPendingActions() {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['pendingActions'], 'readonly');
      const store = transaction.objectStore('pendingActions');
      const request = store.getAll();

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  }

  /**
   * Remove a pending action
   * @param {number} id - The ID of the action to remove
   * @returns {Promise<void>}
   */
  async removePendingAction(id) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['pendingActions'], 'readwrite');
      const store = transaction.objectStore('pendingActions');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  }

  /**
   * Update a pending action's attempt count
   * @param {number} id - The ID of the action
   * @param {number} attempts - The new attempt count
   * @returns {Promise<void>}
   */
  async updateActionAttempts(id, attempts) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['pendingActions'], 'readwrite');
      const store = transaction.objectStore('pendingActions');
      const getRequest = store.get(id);

      getRequest.onsuccess = (event) => {
        const action = event.target.result;
        if (action) {
          action.attempts = attempts;
          const updateRequest = store.put(action);
          
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = (event) => reject(event.target.error);
        } else {
          reject(new Error(`Action with ID ${id} not found`));
        }
      };

      getRequest.onerror = (event) => reject(event.target.error);
    });
  }

  /**
   * Synchronize pending actions with the server
   * @param {Function} fetchFn - The fetch function to use for API calls
   * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
   * @returns {Promise<Object>} Result of the sync operation
   */
  async syncPendingActions(fetchFn, maxRetries = 3) {
    // Check if already syncing
    if (this.isSyncing) {
      return { status: 'already_syncing' };
    }

    // Check if online
    if (!navigator.onLine) {
      return { status: 'offline' };
    }

    this.isSyncing = true;

    try {
      const pendingActions = await this.getPendingActions();
      
      if (pendingActions.length === 0) {
        this.isSyncing = false;
        return { status: 'success', synced: 0, failed: 0, pending: 0 };
      }

      let synced = 0;
      let failed = 0;

      for (const action of pendingActions) {
        try {
          // Skip actions that have exceeded max retries
          if (action.attempts >= maxRetries) {
            failed++;
            continue;
          }

          // Perform the API call
          const response = await fetchFn(action.endpoint, {
            method: action.method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(action.data)
          });

          if (response.ok) {
            // Action succeeded, remove it from the queue
            await this.removePendingAction(action.id);
            synced++;
          } else {
            // Action failed, increment attempt count
            await this.updateActionAttempts(action.id, action.attempts + 1);
            failed++;
          }
        } catch (error) {
          console.error('Error syncing action:', action, error);
          await this.updateActionAttempts(action.id, action.attempts + 1);
          failed++;
        }
      }

      // Get updated count of pending actions
      const remainingActions = await this.getPendingActions();
      const pending = remainingActions.length;

      this.isSyncing = false;
      return { status: 'success', synced, failed, pending };
    } catch (error) {
      console.error('Error during sync:', error);
      this.isSyncing = false;
      return { status: 'error', error: error.message };
    }
  }

  /**
   * Check if there are pending actions
   * @returns {Promise<boolean>} True if there are pending actions
   */
  async hasPendingActions() {
    const actions = await this.getPendingActions();
    return actions.length > 0;
  }

  /**
   * Get the count of pending actions
   * @returns {Promise<number>} The number of pending actions
   */
  async getPendingActionCount() {
    const actions = await this.getPendingActions();
    return actions.length;
  }
}

export default new OfflineSyncService();
