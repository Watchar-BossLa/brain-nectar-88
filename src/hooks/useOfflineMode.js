
import { useState, useEffect, useCallback } from 'react';
import localforage from 'localforage';

/**
 * Hook for handling offline mode functionality
 * @returns {Object} Offline mode state and utilities
 */
export function useOfflineMode() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState({});
  
  // Set up online/offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Load offline data from localForage on init
  useEffect(() => {
    const loadOfflineData = async () => {
      try {
        const storedData = await localforage.getItem('offlineData');
        if (storedData) {
          setOfflineData(storedData);
        }
      } catch (error) {
        console.error('Error loading offline data:', error);
      }
    };
    
    loadOfflineData();
  }, []);
  
  /**
   * Save data to local storage for offline use
   * @param {string} key - Data key
   * @param {any} data - Data to save
   */
  const saveData = useCallback(async (key, data) => {
    try {
      const newOfflineData = { ...offlineData, [key]: data };
      setOfflineData(newOfflineData);
      await localforage.setItem('offlineData', newOfflineData);
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  }, [offlineData]);
  
  /**
   * Get stored offline data
   * @param {string} key - Data key
   * @returns {any} Stored data for the key
   */
  const getData = useCallback((key) => {
    return offlineData[key];
  }, [offlineData]);
  
  /**
   * Save flashcard data for offline use
   * @param {string} id - Flashcard ID
   * @param {Object} flashcard - Flashcard data
   */
  const saveFlashcardData = useCallback(async (id, flashcard) => {
    try {
      const flashcards = await localforage.getItem('flashcards') || {};
      flashcards[id] = flashcard;
      await localforage.setItem('flashcards', flashcards);
    } catch (error) {
      console.error('Error saving flashcard data:', error);
    }
  }, []);
  
  /**
   * Get all stored flashcards
   * @returns {Promise<Array>} Array of flashcards
   */
  const getFlashcards = useCallback(async () => {
    try {
      const flashcards = await localforage.getItem('flashcards') || {};
      return Object.values(flashcards).filter(card => !card.deleteRequested);
    } catch (error) {
      console.error('Error getting flashcards:', error);
      return [];
    }
  }, []);
  
  /**
   * Save quiz data for offline use
   * @param {string} id - Quiz ID
   * @param {Object} quizData - Quiz data
   */
  const saveQuizData = useCallback(async (id, quizData) => {
    try {
      const quizzes = await localforage.getItem('quizzes') || {};
      quizzes[id] = quizData;
      await localforage.setItem('quizzes', quizzes);
    } catch (error) {
      console.error('Error saving quiz data:', error);
    }
  }, []);
  
  /**
   * Get all stored quizzes
   * @returns {Promise<Array>} Array of quizzes
   */
  const getQuizzes = useCallback(async () => {
    try {
      const quizzes = await localforage.getItem('quizzes') || {};
      return Object.values(quizzes);
    } catch (error) {
      console.error('Error getting quizzes:', error);
      return [];
    }
  }, []);
  
  return {
    isOnline,
    saveData,
    getData,
    saveFlashcardData,
    getFlashcards,
    saveQuizData,
    getQuizzes
  };
}
