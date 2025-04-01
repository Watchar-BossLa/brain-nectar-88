
import { supabase } from '@/integrations/supabase/client';
import { calculateNextReviewDate } from './algorithm';
import { FlashcardReviewResult } from './types';

/**
 * Service for handling flashcard reviews
 */
export class ReviewService {
  /**
   * Record a flashcard review result and update the next review date
   */
  public async recordReview(reviewResult: FlashcardReviewResult): Promise<boolean> {
    try {
      // Get current flashcard data
      const { data: flashcard, error: fetchError } = await supabase
        .from('flashcards')
        .select('repetition_count, easiness_factor')
        .eq('id', reviewResult.flashcardId)
        .single();
        
      if (fetchError) {
        console.error('Error fetching flashcard:', fetchError);
        return false;
      }
      
      // Calculate next review date
      const { nextReviewDate, newRepetitionCount, newEasinessFactor } = calculateNextReviewDate(
        reviewResult.difficulty,
        flashcard?.repetition_count || 0,
        flashcard?.easiness_factor || 2.5
      );
      
      // Update flashcard with new review data
      const { error: updateError } = await supabase
        .from('flashcards')
        .update({
          difficulty: reviewResult.difficulty,
          repetition_count: newRepetitionCount,
          easiness_factor: newEasinessFactor,
          next_review_date: nextReviewDate.toISOString(),
          last_reviewed_at: new Date().toISOString()
        })
        .eq('id', reviewResult.flashcardId);
        
      if (updateError) {
        console.error('Error updating flashcard:', updateError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error recording flashcard review:', error);
      return false;
    }
  }
  
  /**
   * Get learning statistics for a flashcard
   */
  public async getFlashcardLearningStats(flashcardId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('repetition_count, easiness_factor, next_review_date, last_reviewed_at, mastery_level')
        .eq('id', flashcardId)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error getting flashcard learning stats:', error);
      return null;
    }
  }
}

export const reviewService = new ReviewService();

// Add these exported functions to fix import errors
export const getFlashcardLearningStats = async (flashcardId: string): Promise<any> => {
  return reviewService.getFlashcardLearningStats(flashcardId);
};

export const updateFlashcardAfterReview = async (
  flashcardId: string, 
  difficulty: number
): Promise<boolean> => {
  try {
    return await reviewService.recordReview({
      flashcardId,
      difficulty,
      reviewedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating flashcard after review:', error);
    return false;
  }
};
