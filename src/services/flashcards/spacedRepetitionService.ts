
import { supabase } from '@/integrations/supabase/client';
import { Flashcard } from '@/types/flashcards';
import { spacedRepetitionService as newSpacedRepetitionService } from './spaced-repetition';

/**
 * Service for handling spaced repetition functionality for flashcards
 * This file now re-exports the functionality from the refactored modules
 * to maintain backward compatibility
 */
export const spacedRepetitionService = {
  /**
   * Records a review for a flashcard
   * @param flashcardId The ID of the flashcard being reviewed
   * @param difficulty The difficulty rating (1-5)
   * @returns True if successful, false otherwise
   */
  recordReview: async (flashcardId: string, difficulty: number): Promise<boolean> => {
    return newSpacedRepetitionService.recordReview(flashcardId, difficulty);
  },
  
  /**
   * Get due flashcards for a user
   * @param userId The user ID
   * @returns Array of flashcards due for review
   */
  getDueFlashcards: async (userId: string): Promise<Flashcard[]> => {
    return newSpacedRepetitionService.getDueFlashcards(userId);
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
    return newSpacedRepetitionService.calculateReviewInterval(easinessFactor, masteryLevel, repetitionCount);
  },
  
  /**
   * Get statistics for a user's flashcards
   * @param userId The user ID
   * @returns Object with flashcard statistics
   */
  getFlashcardStats: async (userId: string) => {
    return newSpacedRepetitionService.getFlashcardStats(userId);
  }
};
