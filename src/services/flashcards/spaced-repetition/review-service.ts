
/**
 * Service for handling flashcard reviews
 */
import { supabase } from '@/integrations/supabase/client';
import { calculateNextReview } from './algorithm';

/**
 * Records a review for a flashcard
 * @param flashcardId The ID of the flashcard being reviewed
 * @param difficulty The difficulty rating (1-5)
 * @returns True if successful, false otherwise
 */
export const recordReview = async (flashcardId: string, difficulty: number): Promise<boolean> => {
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
    const {
      easinessFactor: newEasinessFactor,
      interval,
      repetitionCount,
      nextReviewDate
    } = calculateNextReview(flashcard, difficulty);
    
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
};

// Create a class for ReviewService to be consistent with other services
export class ReviewService {
  public recordReview = recordReview;
}

// Export a singleton instance
export const reviewService = new ReviewService();
