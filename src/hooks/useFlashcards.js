import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { spacedRepetitionService } from '@/services/flashcards/spacedRepetitionService';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for managing flashcards
 * @returns {Object} Flashcard methods and state
 * @returns {Array} returns.flashcards - All flashcards
 * @returns {Array} returns.dueFlashcards - Flashcards due for review
 * @returns {Object} returns.stats - Flashcard statistics
 * @returns {boolean} returns.isLoading - Loading state
 * @returns {Function} returns.fetchFlashcards - Function to fetch all flashcards
 * @returns {Function} returns.fetchDueFlashcards - Function to fetch due flashcards
 * @returns {Function} returns.fetchStats - Function to fetch flashcard stats
 * @returns {Function} returns.createFlashcard - Function to create a flashcard
 * @returns {Function} returns.deleteFlashcard - Function to delete a flashcard
 * @returns {Function} returns.updateFlashcard - Function to update a flashcard
 * @returns {Function} returns.recordReview - Function to record a flashcard review
 */
export const useFlashcards = () => {
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState([]);
  const [dueFlashcards, setDueFlashcards] = useState([]);
  const [stats, setStats] = useState({
    totalCards: 0,
    masteredCards: 0,
    dueCards: 0,
    averageDifficulty: 0,
    reviewsToday: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFlashcards();
      fetchDueFlashcards();
      fetchStats();
    }
  }, [user]);

  /**
   * Fetch all flashcards for the current user
   * @returns {Promise<void>}
   */
  const fetchFlashcards = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setFlashcards(data || []);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch flashcards due for review
   * @returns {Promise<void>}
   */
  const fetchDueFlashcards = async () => {
    if (!user) return;
    
    try {
      const dueCards = await spacedRepetitionService.getDueFlashcards(user.id);
      setDueFlashcards(dueCards);
    } catch (error) {
      console.error('Error fetching due flashcards:', error);
    }
  };
  
  /**
   * Fetch flashcard statistics
   * @returns {Promise<void>}
   */
  const fetchStats = async () => {
    if (!user) return;
    
    try {
      const flashcardStats = await spacedRepetitionService.getFlashcardStats(user.id);
      setStats(flashcardStats);
    } catch (error) {
      console.error('Error fetching flashcard stats:', error);
    }
  };
  
  /**
   * Create a new flashcard
   * @param {Object} flashcardData - Flashcard data
   * @param {string} flashcardData.front_content - Front content
   * @param {string} flashcardData.back_content - Back content
   * @param {string} [flashcardData.topic_id] - Topic ID
   * @returns {Promise<Object|null>} Created flashcard or null
   */
  const createFlashcard = async (flashcardData) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .insert({
          ...flashcardData,
          user_id: user.id,
          difficulty: 0,
          repetition_count: 0,
          next_review_date: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      
      await fetchFlashcards();
      await fetchDueFlashcards();
      await fetchStats();
      
      return data;
    } catch (error) {
      console.error('Error creating flashcard:', error);
      return null;
    }
  };
  
  /**
   * Delete a flashcard
   * @param {string} flashcardId - Flashcard ID
   * @returns {Promise<boolean>} Success status
   */
  const deleteFlashcard = async (flashcardId) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', flashcardId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      await fetchFlashcards();
      await fetchDueFlashcards();
      await fetchStats();
      
      return true;
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      return false;
    }
  };
  
  /**
   * Update a flashcard
   * @param {string} flashcardId - Flashcard ID
   * @param {Object} updates - Updates to apply
   * @param {string} [updates.front_content] - Front content
   * @param {string} [updates.back_content] - Back content
   * @param {string} [updates.topic_id] - Topic ID
   * @returns {Promise<Object|null>} Updated flashcard or null
   */
  const updateFlashcard = async (flashcardId, updates) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .update(updates)
        .eq('id', flashcardId)
        .eq('user_id', user.id)
        .select()
        .single();
        
      if (error) throw error;
      
      await fetchFlashcards();
      
      return data;
    } catch (error) {
      console.error('Error updating flashcard:', error);
      return null;
    }
  };
  
  /**
   * Record a flashcard review
   * @param {string} flashcardId - Flashcard ID
   * @param {number} difficulty - Difficulty rating
   * @returns {Promise<boolean>} Success status
   */
  const recordReview = async (flashcardId, difficulty) => {
    try {
      const success = await spacedRepetitionService.recordReview({
        flashcardId,
        difficulty,
        reviewedAt: new Date().toISOString()
      });
      
      if (success) {
        await fetchStats();
        await fetchDueFlashcards();
      }
      
      return success;
    } catch (error) {
      console.error('Error recording review:', error);
      return false;
    }
  };

  return {
    flashcards,
    dueFlashcards,
    stats,
    isLoading,
    fetchFlashcards,
    fetchDueFlashcards,
    fetchStats,
    createFlashcard,
    deleteFlashcard,
    updateFlashcard,
    recordReview
  };
};
