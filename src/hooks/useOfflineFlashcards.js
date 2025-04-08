/**
 * @fileoverview Hook for managing flashcards with offline support
 */
import { useState, useEffect, useCallback } from 'react';
import { useOfflineMode } from './useOfflineMode';
import { useOfflineAnalytics } from '@/utils/offlineAnalytics';
import { getUserFlashcards, createFlashcard, deleteFlashcard } from '@/services/spacedRepetition';
import { cacheFlashcardsForOffline } from '@/registerServiceWorker';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/auth';

/**
 * Hook for managing flashcards with offline support
 * @returns {Object} Flashcard methods and state
 */
export function useOfflineFlashcards() {
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { isOnline, saveFlashcardData, getFlashcards } = useOfflineMode();
  const { trackEvent } = useOfflineAnalytics();
  
  /**
   * Fetches flashcards from server or local storage
   */
  const fetchFlashcards = useCallback(async () => {
    setIsLoading(true);
    
    try {
      if (isOnline && user) {
        // Online mode: get from server
        const { data, error } = await getUserFlashcards(user.id);
        
        if (error) throw error;
        
        if (data) {
          setFlashcards(data);
          
          // Cache flashcards for offline use
          cacheFlashcardsForOffline(data);
          
          // Also save to local storage
          for (const card of data) {
            await saveFlashcardData(card.id, card);
          }
          
          trackEvent('flashcards_fetched', { count: data.length });
        }
      } else {
        // Offline mode: get from local storage
        const offlineFlashcards = await getFlashcards();
        setFlashcards(offlineFlashcards);
      }
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      toast.error('Failed to load flashcards');
      
      // Try to load from local storage as fallback
      const offlineFlashcards = await getFlashcards();
      setFlashcards(offlineFlashcards);
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, user, saveFlashcardData, getFlashcards, trackEvent]);
  
  // Load flashcards on component mount
  useEffect(() => {
    if (user) {
      fetchFlashcards();
    }
  }, [user, fetchFlashcards]);
  
  /**
   * Creates a new flashcard with offline support
   * @param {Object} flashcardData - Flashcard data
   * @returns {Promise<Object>} Created flashcard
   */
  const createOfflineFlashcard = async (flashcardData) => {
    try {
      if (isOnline && user) {
        // Online mode: create on server
        const { data, error } = await createFlashcard(
          user.id,
          flashcardData.frontContent || flashcardData.front_content,
          flashcardData.backContent || flashcardData.back_content,
          flashcardData.topicId || flashcardData.topic_id
        );
        
        if (error) throw error;
        
        if (data) {
          // Save to local storage too
          await saveFlashcardData(data.id, data);
          
          setFlashcards(prev => [data, ...prev]);
          trackEvent('flashcard_created', { id: data.id });
          
          return data;
        }
      } else {
        // Offline mode: create locally
        const tempId = `temp_${Date.now()}`;
        const now = new Date().toISOString();
        
        const newFlashcard = {
          id: tempId,
          user_id: user?.id,
          front_content: flashcardData.frontContent || flashcardData.front_content,
          back_content: flashcardData.backContent || flashcardData.back_content,
          topic_id: flashcardData.topicId || flashcardData.topic_id,
          next_review_date: now,
          repetition_count: 0,
          difficulty: 3,
          mastery_level: 0,
          easiness_factor: 2.5,
          created_at: now,
          updated_at: now
        };
        
        await saveFlashcardData(tempId, newFlashcard);
        
        setFlashcards(prev => [newFlashcard, ...prev]);
        toast.success('Flashcard created offline. It will sync when you reconnect.');
        
        trackEvent('flashcard_created_offline', { id: tempId });
        return newFlashcard;
      }
    } catch (error) {
      console.error('Error creating flashcard:', error);
      toast.error('Failed to create flashcard');
      throw error;
    }
  };
  
  /**
   * Deletes a flashcard with offline support
   * @param {string} id - Flashcard ID
   * @returns {Promise<boolean>} Success status
   */
  const deleteOfflineFlashcard = async (id) => {
    try {
      if (isOnline) {
        // Online mode: delete from server
        const { error } = await deleteFlashcard(id);
        
        if (error) throw error;
        
        // Remove from local state
        setFlashcards(prev => prev.filter(card => card.id !== id));
        trackEvent('flashcard_deleted', { id });
        
        return true;
      } else {
        // Offline mode: mark for deletion when back online
        // We keep the card but mark it for deletion
        // When we go back online, we'll actually delete it
        const updatedFlashcards = flashcards.filter(card => card.id !== id);
        setFlashcards(updatedFlashcards);
        
        await saveFlashcardData(`delete_${id}`, { id, deleteRequested: true });
        
        toast.success('Flashcard marked for deletion. It will be removed when you reconnect.');
        trackEvent('flashcard_marked_for_deletion', { id });
        
        return true;
      }
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      toast.error('Failed to delete flashcard');
      return false;
    }
  };
  
  return {
    flashcards,
    isLoading,
    fetchFlashcards,
    createFlashcard: createOfflineFlashcard,
    deleteFlashcard: deleteOfflineFlashcard,
  };
}
