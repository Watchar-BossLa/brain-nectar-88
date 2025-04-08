
/**
 * @fileoverview Hook for managing offline functionality
 */
import { useState, useEffect, useCallback } from 'react';
import localforage from 'localforage';
import { toast } from 'react-toastify';

/**
 * Configuration for localForage instances
 */
const DB_CONFIG = {
  FLASHCARDS: {
    name: 'studybee-flashcards',
    storeName: 'flashcards'
  },
  QUIZ: {
    name: 'studybee-quiz',
    storeName: 'quizData'
  },
  PROGRESS: {
    name: 'studybee-progress',
    storeName: 'progress'
  },
  ANALYTICS: {
    name: 'studybee-analytics',
    storeName: 'events'
  }
};

// Initialize database instances
const flashcardsDB = localforage.createInstance(DB_CONFIG.FLASHCARDS);
const quizDB = localforage.createInstance(DB_CONFIG.QUIZ);
const progressDB = localforage.createInstance(DB_CONFIG.PROGRESS);
const analyticsDB = localforage.createInstance(DB_CONFIG.ANALYTICS);

/**
 * Custom hook for managing offline mode functionality
 * @returns {Object} - Methods and state for offline mode
 */
export function useOfflineMode() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({
    flashcards: 0,
    quiz: 0,
    progress: 0,
    analytics: 0
  });

  /**
   * Updates the pending changes count
   * @private
   */
  const updatePendingChangesCount = useCallback(async () => {
    try {
      const flashcardKeys = await flashcardsDB.keys();
      const quizKeys = await quizDB.keys();
      const progressKeys = await progressDB.keys();
      const analyticsKeys = await analyticsDB.keys();
      
      setPendingChanges({
        flashcards: flashcardKeys.length,
        quiz: quizKeys.length,
        progress: progressKeys.length,
        analytics: analyticsKeys.length
      });
    } catch (error) {
      console.error('Error counting pending changes:', error);
    }
  }, []);

  // Handle online/offline status changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('You are back online!');
      syncData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('You are now offline. Your changes will be saved locally and synced when you reconnect.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    updatePendingChangesCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [updatePendingChangesCount]);

  /**
   * Saves flashcard data to local storage
   * @param {string} id - Unique identifier for the flashcard
   * @param {Object} data - Flashcard data to save
   * @returns {Promise<void>}
   */
  const saveFlashcardData = async (id, data) => {
    try {
      await flashcardsDB.setItem(id, {
        data,
        timestamp: Date.now(),
        synced: isOnline
      });
      await updatePendingChangesCount();
      
      // If online, try to sync immediately
      if (isOnline) {
        await syncFlashcardData(id);
      } else {
        toast.info('Flashcard saved offline. It will sync when connection is restored.');
      }
    } catch (error) {
      console.error('Error saving flashcard data:', error);
      toast.error('Failed to save flashcard data.');
    }
  };

  /**
   * Saves quiz progress to local storage
   * @param {string} sessionId - Quiz session ID
   * @param {Object} data - Quiz progress data
   * @returns {Promise<void>}
   */
  const saveQuizProgress = async (sessionId, data) => {
    try {
      await quizDB.setItem(sessionId, {
        data,
        timestamp: Date.now(),
        synced: isOnline
      });
      await updatePendingChangesCount();
      
      if (isOnline) {
        await syncQuizData(sessionId);
      } else {
        toast.info('Quiz progress saved offline. It will sync when connection is restored.');
      }
    } catch (error) {
      console.error('Error saving quiz progress:', error);
      toast.error('Failed to save quiz progress.');
    }
  };

  /**
   * Saves study progress to local storage
   * @param {string} id - Progress identifier
   * @param {Object} data - Progress data
   * @returns {Promise<void>}
   */
  const saveProgress = async (id, data) => {
    try {
      await progressDB.setItem(id, {
        data,
        timestamp: Date.now(),
        synced: isOnline
      });
      await updatePendingChangesCount();
      
      if (isOnline) {
        await syncProgressData(id);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  /**
   * Records analytics event for offline handling
   * @param {string} eventName - Name of the event
   * @param {Object} eventData - Event data
   * @returns {Promise<void>}
   */
  const trackEvent = async (eventName, eventData) => {
    try {
      const eventId = `${eventName}_${Date.now()}`;
      await analyticsDB.setItem(eventId, {
        eventName,
        eventData,
        timestamp: Date.now(),
        synced: isOnline
      });
      await updatePendingChangesCount();
      
      if (isOnline) {
        await syncAnalyticsEvent(eventId);
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  /**
   * Retrieves all flashcard data from local storage
   * @returns {Promise<Array>} - Array of flashcard objects
   */
  const getFlashcards = async () => {
    try {
      const keys = await flashcardsDB.keys();
      const flashcards = [];
      
      for (const key of keys) {
        const item = await flashcardsDB.getItem(key);
        if (item && item.data) {
          flashcards.push({
            id: key,
            ...item.data,
            _offlineData: {
              synced: item.synced,
              timestamp: item.timestamp
            }
          });
        }
      }
      
      return flashcards;
    } catch (error) {
      console.error('Error retrieving flashcards:', error);
      return [];
    }
  };

  /**
   * Retrieves quiz data from local storage
   * @returns {Promise<Object>} - Quiz data object
   */
  const getQuizData = async () => {
    try {
      const keys = await quizDB.keys();
      const quizzes = {};
      
      for (const key of keys) {
        const item = await quizDB.getItem(key);
        if (item && item.data) {
          quizzes[key] = {
            ...item.data,
            _offlineData: {
              synced: item.synced,
              timestamp: item.timestamp
            }
          };
        }
      }
      
      return quizzes;
    } catch (error) {
      console.error('Error retrieving quiz data:', error);
      return {};
    }
  };

  /**
   * Syncs a specific flashcard to the backend
   * @param {string} id - Flashcard ID to sync
   * @returns {Promise<boolean>} - Success status
   */
  const syncFlashcardData = async (id) => {
    if (!isOnline) return false;
    
    try {
      const item = await flashcardsDB.getItem(id);
      if (!item || item.synced) return true;
      
      // TODO: Replace with actual API call to sync the flashcard
      // const response = await fetch('/api/flashcards', {
      //   method: 'POST',
      //   body: JSON.stringify(item.data)
      // });
      
      // Simulate successful sync
      await flashcardsDB.setItem(id, {
        ...item,
        synced: true
      });
      
      await updatePendingChangesCount();
      return true;
    } catch (error) {
      console.error('Error syncing flashcard:', error);
      return false;
    }
  };

  /**
   * Syncs a specific quiz session to the backend
   * @param {string} sessionId - Quiz session ID to sync
   * @returns {Promise<boolean>} - Success status
   */
  const syncQuizData = async (sessionId) => {
    if (!isOnline) return false;
    
    try {
      const item = await quizDB.getItem(sessionId);
      if (!item || item.synced) return true;
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/quiz-sessions', {
      //   method: 'POST',
      //   body: JSON.stringify(item.data)
      // });
      
      // Simulate successful sync
      await quizDB.setItem(sessionId, {
        ...item,
        synced: true
      });
      
      await updatePendingChangesCount();
      return true;
    } catch (error) {
      console.error('Error syncing quiz data:', error);
      return false;
    }
  };

  /**
   * Syncs a specific progress entry to the backend
   * @param {string} id - Progress ID to sync
   * @returns {Promise<boolean>} - Success status
   */
  const syncProgressData = async (id) => {
    if (!isOnline) return false;
    
    try {
      const item = await progressDB.getItem(id);
      if (!item || item.synced) return true;
      
      // TODO: Replace with actual API call
      
      // Simulate successful sync
      await progressDB.setItem(id, {
        ...item,
        synced: true
      });
      
      await updatePendingChangesCount();
      return true;
    } catch (error) {
      console.error('Error syncing progress data:', error);
      return false;
    }
  };

  /**
   * Syncs a specific analytics event to the backend
   * @param {string} eventId - Event ID to sync
   * @returns {Promise<boolean>} - Success status
   */
  const syncAnalyticsEvent = async (eventId) => {
    if (!isOnline) return false;
    
    try {
      const item = await analyticsDB.getItem(eventId);
      if (!item || item.synced) return true;
      
      // TODO: Replace with actual API call
      
      // Simulate successful sync
      await analyticsDB.setItem(eventId, {
        ...item,
        synced: true
      });
      
      await updatePendingChangesCount();
      return true;
    } catch (error) {
      console.error('Error syncing analytics event:', error);
      return false;
    }
  };

  /**
   * Synchronizes all pending offline data with the backend
   * @returns {Promise<void>}
   */
  const syncData = async () => {
    if (!isOnline) return;
    
    setIsSyncing(true);
    
    try {
      // Sync flashcards
      const flashcardKeys = await flashcardsDB.keys();
      for (const key of flashcardKeys) {
        await syncFlashcardData(key);
      }
      
      // Sync quiz data
      const quizKeys = await quizDB.keys();
      for (const key of quizKeys) {
        await syncQuizData(key);
      }
      
      // Sync progress
      const progressKeys = await progressDB.keys();
      for (const key of progressKeys) {
        await syncProgressData(key);
      }
      
      // Sync analytics
      const analyticsKeys = await analyticsDB.keys();
      for (const key of analyticsKeys) {
        await syncAnalyticsEvent(key);
      }
      
      await updatePendingChangesCount();
      
      if (flashcardKeys.length > 0 || quizKeys.length > 0 || progressKeys.length > 0 || analyticsKeys.length > 0) {
        toast.success('All offline data has been synchronized!');
      }
    } catch (error) {
      console.error('Error during data synchronization:', error);
      toast.error('Some data failed to synchronize. Will retry automatically.');
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isOnline,
    isSyncing,
    pendingChanges,
    saveFlashcardData,
    saveQuizProgress,
    saveProgress,
    trackEvent,
    getFlashcards,
    getQuizData,
    syncData
  };
}
