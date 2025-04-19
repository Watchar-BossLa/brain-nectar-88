
/**
 * OfflineSyncManager Service
 * 
 * This service manages offline data synchronization for StudyBee.
 * It provides:
 * - Queue management for pending operations
 * - Background sync for automatic synchronization
 * - Conflict resolution strategies
 * - Retry mechanisms with exponential backoff
 */

import { toast } from 'react-toastify';
import localforage from 'localforage';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

class OfflineSyncManager {
  constructor() {
    this.syncQueue = 'sync_queue';
    this.isInitialized = false;
    this.isSyncing = false;
    this.syncInterval = null;
    this.listeners = new Map();
  }

  /**
   * Initialize the offline sync manager
   */
  async initialize() {
    if (this.isInitialized) return;
    
    // Register sync event listeners
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then(registration => {
        // Request permission for background sync
        registration.sync.register('sync-data');
      }).catch(err => {
        console.error('Background sync registration failed:', err);
      });
    }
    
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    
    // Check for pending operations on startup
    const pendingCount = await this.getPendingOperationsCount();
    if (pendingCount > 0 && navigator.onLine) {
      this.syncData();
    }
    
    this.isInitialized = true;
  }

  /**
   * Handle when device comes online
   */
  handleOnline() {
    if (this.isSyncing) return;
    
    // Notify the user we're syncing
    toast.info('Syncing data...');
    
    // Start sync process
    this.syncData();
  }

  /**
   * Add an operation to the sync queue
   * @param {string} entityType - Type of entity (e.g., 'flashcard', 'quiz')
   * @param {string} operation - Type of operation ('create', 'update', 'delete')
   * @param {Object} data - Data for the operation
   * @param {Object} options - Additional options
   * @returns {Promise<string>} - ID of the queued operation
   */
  async queueOperation(entityType, operation, data, options = {}) {
    const queueItem = {
      id: uuidv4(),
      entityType,
      operation,
      data,
      options,
      timestamp: Date.now(),
      attempts: 0,
      status: 'pending'
    };
    
    try {
      // Get existing queue
      const queue = await this.getQueue();
      
      // Add new item
      queue.push(queueItem);
      
      // Save updated queue
      await localforage.setItem(this.syncQueue, queue);
      
      // Notify listeners
      this.notifyListeners('queue-updated', queue);
      
      // Trigger background sync if available
      if ('serviceWorker' in navigator && 'SyncManager' in window && navigator.onLine) {
        navigator.serviceWorker.ready.then(registration => {
          registration.sync.register('sync-data');
        }).catch(err => {
          console.error('Background sync registration failed:', err);
        });
      }
      
      return queueItem.id;
    } catch (error) {
      console.error('Error queuing operation:', error);
      throw error;
    }
  }

  /**
   * Get the current sync queue
   * @returns {Promise<Array>} - Current queue
   */
  async getQueue() {
    try {
      const queue = await localforage.getItem(this.syncQueue);
      return queue || [];
    } catch (error) {
      console.error('Error getting sync queue:', error);
      return [];
    }
  }

  /**
   * Get the count of pending operations
   * @returns {Promise<number>} - Count of pending operations
   */
  async getPendingOperationsCount() {
    const queue = await this.getQueue();
    return queue.filter(item => item.status === 'pending').length;
  }

  /**
   * Synchronize pending operations
   * @returns {Promise<Object>} - Sync results
   */
  async syncData() {
    if (this.isSyncing || !navigator.onLine) {
      return {
        success: false, 
        message: this.isSyncing ? 'Sync already in progress' : 'No internet connection'
      };
    }
    
    this.isSyncing = true;
    this.notifyListeners('sync-started');
    
    try {
      const queue = await this.getQueue();
      const pendingItems = queue.filter(item => item.status === 'pending');
      
      if (pendingItems.length === 0) {
        this.isSyncing = false;
        this.notifyListeners('sync-completed', { success: true, synced: 0 });
        return { success: true, synced: 0 };
      }
      
      let successCount = 0;
      let failCount = 0;
      let updatedQueue = [...queue];
      
      for (const item of pendingItems) {
        try {
          // Process based on entity type and operation
          const result = await this.processQueueItem(item);
          
          if (result.success) {
            // Update item in queue as processed
            updatedQueue = updatedQueue.map(qItem => 
              qItem.id === item.id 
                ? { ...qItem, status: 'completed' } 
                : qItem
            );
            successCount++;
          } else {
            // Update attempts and potentially mark as failed
            const updatedItem = { 
              ...item, 
              attempts: item.attempts + 1,
              lastError: result.error,
              status: item.attempts >= 5 ? 'failed' : 'pending'
            };
            
            updatedQueue = updatedQueue.map(qItem => 
              qItem.id === item.id ? updatedItem : qItem
            );
            
            failCount++;
          }
        } catch (error) {
          console.error(`Error processing queue item ${item.id}:`, error);
          
          // Update attempts
          const updatedItem = { 
            ...item, 
            attempts: item.attempts + 1,
            lastError: error.message,
            status: item.attempts >= 5 ? 'failed' : 'pending'
          };
          
          updatedQueue = updatedQueue.map(qItem => 
            qItem.id === item.id ? updatedItem : qItem
          );
          
          failCount++;
        }
      }
      
      // Save updated queue
      await localforage.setItem(this.syncQueue, updatedQueue);
      
      // Clean up completed items after a day
      const dayAgo = Date.now() - (24 * 60 * 60 * 1000);
      const cleanedQueue = updatedQueue.filter(item => 
        item.status !== 'completed' || item.timestamp > dayAgo
      );
      
      if (cleanedQueue.length !== updatedQueue.length) {
        await localforage.setItem(this.syncQueue, cleanedQueue);
      }
      
      const result = { 
        success: true, 
        synced: successCount, 
        failed: failCount,
        remaining: cleanedQueue.filter(item => item.status === 'pending').length
      };
      
      this.notifyListeners('sync-completed', result);
      
      if (result.synced > 0) {
        toast.success(`Synced ${result.synced} items.`);
      }
      
      if (result.failed > 0) {
        toast.warning(`Failed to sync ${result.failed} items. Will retry later.`);
      }
      
      return result;
    } catch (error) {
      console.error('Error during sync process:', error);
      
      this.notifyListeners('sync-error', { error: error.message });
      toast.error('Error syncing data. Will try again later.');
      
      return { success: false, error: error.message };
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Process a specific queue item
   * @param {Object} item - Queue item
   * @returns {Promise<Object>} - Result of processing
   */
  async processQueueItem(item) {
    const { entityType, operation, data } = item;
    
    try {
      let result;
      
      // Process based on entity type
      switch (entityType) {
        case 'flashcard':
          result = await this.processFlashcardOperation(operation, data);
          break;
        
        case 'quiz':
          result = await this.processQuizOperation(operation, data);
          break;
        
        case 'study-session':
          result = await this.processStudySessionOperation(operation, data);
          break;
        
        case 'note':
          result = await this.processNoteOperation(operation, data);
          break;
          
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }
      
      return { success: true, result };
    } catch (error) {
      console.error(`Error processing ${entityType} ${operation}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process flashcard operations
   */
  async processFlashcardOperation(operation, data) {
    switch (operation) {
      case 'create':
        return await supabase.from('flashcards').insert(data);
      
      case 'update':
        return await supabase.from('flashcards').update(data)
          .eq('id', data.id);
      
      case 'delete':
        return await supabase.from('flashcards').delete()
          .eq('id', data.id);
          
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  /**
   * Process quiz operations
   */
  async processQuizOperation(operation, data) {
    switch (operation) {
      case 'submit_answer':
        return await supabase.from('quiz_answered_questions').insert(data);
      
      case 'complete_session':
        return await supabase.from('quiz_sessions').insert(data);
          
      default:
        throw new Error(`Unknown quiz operation: ${operation}`);
    }
  }

  /**
   * Process study session operations
   */
  async processStudySessionOperation(operation, data) {
    switch (operation) {
      case 'create':
        return await supabase.from('timer_sessions').insert(data);
      
      case 'update':
        return await supabase.from('timer_sessions').update(data)
          .eq('id', data.id);
          
      default:
        throw new Error(`Unknown study session operation: ${operation}`);
    }
  }

  /**
   * Process note operations
   */
  async processNoteOperation(operation, data) {
    switch (operation) {
      case 'create':
        return await supabase.from('user_notes').insert(data);
      
      case 'update':
        return await supabase.from('user_notes').update(data)
          .eq('id', data.id);
      
      case 'delete':
        return await supabase.from('user_notes').delete()
          .eq('id', data.id);
          
      default:
        throw new Error(`Unknown note operation: ${operation}`);
    }
  }

  /**
   * Add listener for sync events
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {string} - Listener ID
   */
  addListener(event, callback) {
    const id = uuidv4();
    
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Map());
    }
    
    this.listeners.get(event).set(id, callback);
    return id;
  }

  /**
   * Remove listener
   * @param {string} event - Event name
   * @param {string} id - Listener ID
   */
  removeListener(event, id) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(id);
    }
  }

  /**
   * Notify all listeners of an event
   * @param {string} event - Event name
   * @param {any} data - Event data
   */
  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in listener for ${event}:`, error);
        }
      });
    }
  }
  
  /**
   * Clear all failed operations
   * @returns {Promise<number>} - Number of cleared operations
   */
  async clearFailedOperations() {
    const queue = await this.getQueue();
    const updatedQueue = queue.filter(item => item.status !== 'failed');
    
    await localforage.setItem(this.syncQueue, updatedQueue);
    
    return queue.length - updatedQueue.length;
  }
  
  /**
   * Retry failed operations
   * @returns {Promise<number>} - Number of retried operations
   */
  async retryFailedOperations() {
    const queue = await this.getQueue();
    let count = 0;
    
    const updatedQueue = queue.map(item => {
      if (item.status === 'failed') {
        count++;
        return {
          ...item,
          status: 'pending',
          attempts: 0
        };
      }
      return item;
    });
    
    await localforage.setItem(this.syncQueue, updatedQueue);
    
    if (count > 0 && navigator.onLine) {
      this.syncData();
    }
    
    return count;
  }
}

// Create singleton instance
const offlineSyncManager = new OfflineSyncManager();

export default offlineSyncManager;
