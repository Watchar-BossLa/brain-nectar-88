/**
 * Offline Data Service
 * Handles storing and retrieving data for offline use
 */

class OfflineDataService {
  constructor() {
    this.dbName = 'StudyBeeOfflineDB';
    this.dbVersion = 1;
    this.db = null;
    this.isInitialized = false;
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
        if (!db.objectStoreNames.contains('offlineData')) {
          const offlineDataStore = db.createObjectStore('offlineData', { keyPath: 'id' });
          offlineDataStore.createIndex('type', 'type', { unique: false });
          offlineDataStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('pendingActions')) {
          const pendingActionsStore = db.createObjectStore('pendingActions', { keyPath: 'id', autoIncrement: true });
          pendingActionsStore.createIndex('type', 'type', { unique: false });
          pendingActionsStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('userSettings')) {
          db.createObjectStore('userSettings', { keyPath: 'id' });
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
   * Store data for offline use
   * @param {string} type - The type of data (e.g., 'flashcards', 'courses')
   * @param {string} id - The unique identifier for the data
   * @param {Object} data - The data to store
   * @returns {Promise<void>}
   */
  async storeData(type, id, data) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');

      const item = {
        id: `${type}_${id}`,
        type,
        data,
        updatedAt: new Date().toISOString()
      };

      const request = store.put(item);

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  }

  /**
   * Store multiple data items for offline use
   * @param {string} type - The type of data (e.g., 'flashcards', 'courses')
   * @param {Array<Object>} items - Array of items to store, each with id and data
   * @returns {Promise<void>}
   */
  async storeMultipleData(type, items) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      const now = new Date().toISOString();

      let completed = 0;
      let errors = [];

      items.forEach(item => {
        const storeItem = {
          id: `${type}_${item.id}`,
          type,
          data: item.data || item,
          updatedAt: now
        };

        const request = store.put(storeItem);

        request.onsuccess = () => {
          completed++;
          if (completed === items.length) {
            if (errors.length > 0) {
              reject(new Error(`Failed to store ${errors.length} items`));
            } else {
              resolve();
            }
          }
        };

        request.onerror = (event) => {
          completed++;
          errors.push(item.id);
          console.error('Error storing item:', item.id, event.target.error);
          
          if (completed === items.length) {
            reject(new Error(`Failed to store ${errors.length} items`));
          }
        };
      });

      // Handle empty array case
      if (items.length === 0) {
        resolve();
      }
    });
  }

  /**
   * Retrieve data by ID
   * @param {string} type - The type of data
   * @param {string} id - The unique identifier
   * @returns {Promise<Object|null>} The retrieved data or null if not found
   */
  async getData(type, id) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['offlineData'], 'readonly');
      const store = transaction.objectStore('offlineData');
      const request = store.get(`${type}_${id}`);

      request.onsuccess = (event) => {
        const result = event.target.result;
        resolve(result ? result.data : null);
      };

      request.onerror = (event) => reject(event.target.error);
    });
  }

  /**
   * Retrieve all data of a specific type
   * @param {string} type - The type of data to retrieve
   * @returns {Promise<Array<Object>>} Array of data items
   */
  async getAllData(type) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['offlineData'], 'readonly');
      const store = transaction.objectStore('offlineData');
      const index = store.index('type');
      const request = index.getAll(type);

      request.onsuccess = (event) => {
        const results = event.target.result.map(item => item.data);
        resolve(results);
      };

      request.onerror = (event) => reject(event.target.error);
    });
  }

  /**
   * Delete data by ID
   * @param {string} type - The type of data
   * @param {string} id - The unique identifier
   * @returns {Promise<void>}
   */
  async deleteData(type, id) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      const request = store.delete(`${type}_${id}`);

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  }

  /**
   * Delete all data of a specific type
   * @param {string} type - The type of data to delete
   * @returns {Promise<void>}
   */
  async deleteAllData(type) {
    await this.init();

    const allItems = await this.getAllData(type);
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      
      let completed = 0;
      let errors = [];

      allItems.forEach(item => {
        const request = store.delete(`${type}_${item.id}`);

        request.onsuccess = () => {
          completed++;
          if (completed === allItems.length) {
            if (errors.length > 0) {
              reject(new Error(`Failed to delete ${errors.length} items`));
            } else {
              resolve();
            }
          }
        };

        request.onerror = (event) => {
          completed++;
          errors.push(item.id);
          console.error('Error deleting item:', item.id, event.target.error);
          
          if (completed === allItems.length) {
            reject(new Error(`Failed to delete ${errors.length} items`));
          }
        };
      });

      // Handle empty array case
      if (allItems.length === 0) {
        resolve();
      }
    });
  }

  /**
   * Store user settings
   * @param {Object} settings - User settings to store
   * @returns {Promise<void>}
   */
  async storeUserSettings(settings) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['userSettings'], 'readwrite');
      const store = transaction.objectStore('userSettings');

      const request = store.put({
        id: 'userSettings',
        ...settings,
        updatedAt: new Date().toISOString()
      });

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  }

  /**
   * Retrieve user settings
   * @returns {Promise<Object|null>} User settings or null if not found
   */
  async getUserSettings() {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['userSettings'], 'readonly');
      const store = transaction.objectStore('userSettings');
      const request = store.get('userSettings');

      request.onsuccess = (event) => {
        const result = event.target.result;
        if (result) {
          // Remove internal properties
          const { id, updatedAt, ...settings } = result;
          resolve(settings);
        } else {
          resolve(null);
        }
      };

      request.onerror = (event) => reject(event.target.error);
    });
  }

  /**
   * Check if the database is available
   * @returns {Promise<boolean>} True if the database is available
   */
  async isAvailable() {
    try {
      await this.init();
      return true;
    } catch (error) {
      console.error('IndexedDB is not available:', error);
      return false;
    }
  }
}

export default new OfflineDataService();
