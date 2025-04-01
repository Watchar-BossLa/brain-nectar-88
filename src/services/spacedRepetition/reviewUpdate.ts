
import { supabase } from '@/integrations/supabase/client';
import { calculateNextReviewDate, INITIAL_EASINESS_FACTOR, MIN_EASINESS_FACTOR } from './algorithm';

/**
 * Update a flashcard's spaced repetition data after review
 */
export const updateFlashcardAfterReview = async (flashcardId: string, difficulty: number): Promise<boolean> => {
  try {
    // Get current flashcard data
    const { data: flashcard, error: fetchError } = await supabase
      .from('flashcards')
      .select('repetition_count, easiness_factor')
      .eq('id', flashcardId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching flashcard:', fetchError);
      return false;
    }
    
    // Calculate next review date
    const { nextReviewDate, newRepetitionCount, newEasinessFactor } = calculateNextReviewDate(
      difficulty,
      flashcard?.repetition_count || 0,
      flashcard?.easiness_factor || INITIAL_EASINESS_FACTOR
    );
    
    // Update flashcard with new review data
    const { error: updateError } = await supabase
      .from('flashcards')
      .update({
        difficulty,
        repetition_count: newRepetitionCount,
        easiness_factor: newEasinessFactor,
        next_review_date: nextReviewDate.toISOString(),
        last_reviewed_at: new Date().toISOString()
      })
      .eq('id', flashcardId);
      
    if (updateError) {
      console.error('Error updating flashcard:', updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error recording flashcard review:', error);
    return false;
  }
};
