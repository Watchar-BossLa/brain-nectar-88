
import { supabase } from '@/integrations/supabase/client';
import { Flashcard } from '@/types/flashcards';

/**
 * Service for handling spaced repetition functionality for flashcards
 */
export const spacedRepetitionService = {
  /**
   * Records a review for a flashcard
   * @param flashcardId The ID of the flashcard being reviewed
   * @param difficulty The difficulty rating (1-5)
   * @returns True if successful, false otherwise
   */
  recordReview: async (flashcardId: string, difficulty: number): Promise<boolean> => {
    try {
      // Get the current flashcard data
      const { data: flashcard, error: fetchError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('id', flashcardId)
        .single();
        
      if (fetchError || !flashcard) {
        console.error('Error fetching flashcard for review:', fetchError);
        return false;
      }
      
      // Calculate new values based on the SM-2 algorithm
      const repetitionCount = (flashcard.repetition_count || 0) + 1;
      const oldEasinessFactor = flashcard.easiness_factor || 2.5;
      
      // Convert difficulty rating (1-5) to SM-2 quality (0-5)
      // In SM-2, 5 is perfect response, 0 is complete blackout
      // In our app, 1 is very hard, 5 is very easy
      const quality = difficulty - 1;
      
      // Calculate new easiness factor using SM-2 formula
      let newEasinessFactor = oldEasinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      newEasinessFactor = Math.max(1.3, newEasinessFactor); // Minimum 1.3
      
      // Calculate interval
      let interval;
      if (repetitionCount === 1) {
        interval = 1; // 1 day
      } else if (repetitionCount === 2) {
        interval = 6; // 6 days
      } else {
        // Calculate the interval using the helper method rather than accessing a property
        const currentInterval = spacedRepetitionService.calculateReviewInterval(
          oldEasinessFactor,
          flashcard.mastery_level || 0,
          repetitionCount - 1
        );
        interval = Math.round(currentInterval * newEasinessFactor);
      }
      
      // Calculate next review date
      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + interval);
      
      // Update the flashcard
      const { error: updateError } = await supabase
        .from('flashcards')
        .update({
          difficulty: difficulty,
          repetition_count: repetitionCount,
          easiness_factor: newEasinessFactor,
          interval: interval,
          next_review_date: nextReviewDate.toISOString(),
          last_reviewed_at: new Date().toISOString()
        })
        .eq('id', flashcardId);
        
      if (updateError) {
        console.error('Error updating flashcard after review:', updateError);
        return false;
      }
      
      // Record the review
      const { error: reviewError } = await supabase
        .from('flashcard_reviews')
        .insert({
          flashcard_id: flashcardId,
          user_id: flashcard.user_id,
          difficulty_rating: difficulty,
          reviewed_at: new Date().toISOString()
        });
        
      if (reviewError) {
        console.error('Error recording flashcard review:', reviewError);
        // Continue anyway since the flashcard was updated
      }
      
      return true;
    } catch (error) {
      console.error('Error in recordReview:', error);
      return false;
    }
  },
  
  /**
   * Get due flashcards for a user
   * @param userId The user ID
   * @returns Array of flashcards due for review
   */
  getDueFlashcards: async (userId: string): Promise<Flashcard[]> => {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId)
        .lte('next_review_date', now)
        .order('next_review_date', { ascending: true });
        
      if (error) {
        console.error('Error fetching due flashcards:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getDueFlashcards:', error);
      return [];
    }
  },
  
  /**
   * Calculate the review interval in days based on easiness factor and mastery level
   * using a modified version of the SM-2 algorithm
   * @param easinessFactor The easiness factor
   * @param masteryLevel The mastery level
   * @param repetitionCount The number of times the card has been reviewed
   * @returns The number of days until the next review
   */
  calculateReviewInterval: (easinessFactor: number, masteryLevel: number, repetitionCount: number): number => {
    // Default values if undefined
    const ef = easinessFactor || 2.5;
    const level = masteryLevel || 0;
    const repCount = repetitionCount || 0;
    
    if (repCount === 0) return 1; // First review after 1 day
    if (repCount === 1) return 3; // Second review after 3 days
    
    // For subsequent reviews, use exponential backoff with easiness factor
    return Math.round(Math.pow(ef, repCount - 1) * 3);
  },
  
  /**
   * Get statistics for a user's flashcards
   * @param userId The user ID
   * @returns Object with flashcard statistics
   */
  getFlashcardStats: async (userId: string) => {
    try {
      // Get all flashcards for the user
      const { data: flashcards, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId);
        
      if (error) {
        throw error;
      }
      
      // Get flashcards due today
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      
      const { data: dueCards, error: dueError } = await supabase
        .from('flashcards')
        .select('id')
        .eq('user_id', userId)
        .lte('next_review_date', endOfDay.toISOString());
        
      if (dueError) {
        throw dueError;
      }
      
      // Get reviews done today
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      
      const { data: reviewsToday, error: reviewError } = await supabase
        .from('flashcard_reviews')
        .select('id')
        .eq('user_id', userId)
        .gte('reviewed_at', startOfDay.toISOString());
        
      if (reviewError) {
        throw reviewError;
      }
      
      // Calculate statistics
      const totalCards = flashcards?.length || 0;
      const masteredCards = flashcards?.filter(card => (card.mastery_level || 0) >= 0.8).length || 0;
      const dueCount = dueCards?.length || 0;
      const reviewCount = reviewsToday?.length || 0;
      
      // Calculate average difficulty
      let totalDifficulty = 0;
      flashcards?.forEach(card => {
        totalDifficulty += card.difficulty || 3;
      });
      const averageDifficulty = totalCards > 0 ? totalDifficulty / totalCards : 0;
      
      return {
        totalCards,
        masteredCards,
        dueCards: dueCount,
        averageDifficulty,
        reviewsToday: reviewCount
      };
    } catch (error) {
      console.error('Error getting flashcard stats:', error);
      return {
        totalCards: 0,
        masteredCards: 0,
        dueCards: 0,
        averageDifficulty: 0,
        reviewsToday: 0
      };
    }
  }
};
