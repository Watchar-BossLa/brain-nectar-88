
import { supabase } from '@/integrations/supabase/client';
import { calculateNextReviewDate, INITIAL_EASINESS_FACTOR, MIN_EASINESS_FACTOR } from './algorithm';

/**
 * Update a flashcard after review
 * @param flashcardId - ID of the flashcard
 * @param difficulty - Rating from 1 (hard) to 5 (easy)
 * @param userId - User ID for security verification
 */
export const updateFlashcardAfterReview = async (
  flashcardId: string, 
  difficulty: number,
  userId?: string
) => {
  try {
    // Get current flashcard data
    const { data: flashcard, error: fetchError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('id', flashcardId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching flashcard:', fetchError);
      return false;
    }
    
    if (!flashcard) {
      console.error('Flashcard not found');
      return false;
    }
    
    // If userId is provided, check if the flashcard belongs to the user
    if (userId && flashcard.user_id !== userId) {
      console.error('Unauthorized: Flashcard does not belong to user');
      return false;
    }
    
    // Calculate new review parameters
    const currentEasinessFactor = flashcard.easiness_factor || INITIAL_EASINESS_FACTOR;
    const currentRepetitionCount = flashcard.repetition_count || 0;
    
    const { 
      nextReviewDate, 
      newRepetitionCount, 
      newEasinessFactor 
    } = calculateNextReviewDate(difficulty, currentRepetitionCount, currentEasinessFactor);
    
    // Calculate mastery level (simple formula based on repetitions)
    const masteryLevel = Math.min(1.0, (newRepetitionCount / 10) + (newEasinessFactor - 1.3) / 2.5 * 0.5);
    
    // Record the review
    const { error: reviewError } = await supabase
      .from('flashcard_reviews')
      .insert({
        flashcard_id: flashcardId,
        difficulty_rating: difficulty,
        user_id: userId || flashcard.user_id,
        retention_estimate: flashcard.last_retention || 0.85,
      });
      
    if (reviewError) {
      console.error('Error recording review:', reviewError);
    }
    
    // Update the flashcard
    const { error: updateError } = await supabase
      .from('flashcards')
      .update({
        easiness_factor: newEasinessFactor,
        repetition_count: newRepetitionCount,
        last_reviewed_at: new Date().toISOString(),
        next_review_date: nextReviewDate.toISOString(),
        mastery_level: masteryLevel,
        difficulty: difficulty
      })
      .eq('id', flashcardId);
      
    if (updateError) {
      console.error('Error updating flashcard:', updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateFlashcardAfterReview:', error);
    return false;
  }
};
