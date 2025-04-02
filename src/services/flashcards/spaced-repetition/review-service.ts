
import { supabase } from '@/integrations/supabase/client';
import { calculateNextReview } from './algorithm';
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
        .select('repetition_count')
        .eq('id', reviewResult.flashcardId)
        .single();
        
      if (fetchError) {
        console.error('Error fetching flashcard:', fetchError);
        return false;
      }
      
      // Calculate next review date
      const { nextReviewDate, newRepetitionCount } = calculateNextReview(
        reviewResult.difficulty,
        flashcard?.repetition_count || 0
      );
      
      // Update flashcard with new review data
      const { error: updateError } = await supabase
        .from('flashcards')
        .update({
          difficulty: reviewResult.difficulty,
          repetition_count: newRepetitionCount,
          next_review_date: nextReviewDate.toISOString(),
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
}

export const reviewService = new ReviewService();
