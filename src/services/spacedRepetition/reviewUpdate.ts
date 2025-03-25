
import { supabase } from '@/integrations/supabase/client';
import { 
  calculateNextReviewSchedule, 
  INITIAL_EASINESS_FACTOR 
} from './algorithm';

/**
 * Update a flashcard after review based on the difficulty rating
 * Implements the enhanced SM-2 algorithm with adaptive learning
 * 
 * @param flashcardId The ID of the flashcard to update
 * @param difficulty Difficulty rating (1-5, where 5 is most difficult)
 * @returns Object with data (success) or error
 */
export const updateFlashcardAfterReview = async (
  flashcardId: string, 
  difficulty: number
): Promise<{ data?: any; error?: Error }> => {
  try {
    // Validate input
    if (difficulty < 1 || difficulty > 5) {
      return { error: new Error('Difficulty must be between 1 and 5') };
    }
    
    // Get current flashcard data
    const { data: flashcard, error: fetchError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('id', flashcardId)
      .single();
      
    if (fetchError) {
      return { error: fetchError };
    }
    
    if (!flashcard) {
      return { error: new Error('Flashcard not found') };
    }
    
    // Calculate next review schedule
    const repeatCount = flashcard.repetition_count || 0;
    const easeFactor = flashcard.easiness_factor || INITIAL_EASINESS_FACTOR;
    const previousInterval = repeatCount > 0 ? 
      Math.ceil((new Date().getTime() - new Date(flashcard.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 1;
    
    // Default to target retention of 0.85 if not specified
    const actualRetention = flashcard.last_retention || 0.85;
    
    const schedule = calculateNextReviewSchedule(
      repeatCount,
      easeFactor,
      difficulty,
      previousInterval,
      actualRetention
    );
    
    // Create review record
    const { error: reviewError } = await supabase
      .from('flashcard_reviews')
      .insert({
        flashcard_id: flashcardId,
        difficulty_rating: difficulty,
        reviewed_at: new Date().toISOString(),
        retention_estimate: schedule.estimatedRetention,
        user_id: flashcard.user_id // Make sure to include the user_id
      })
      .single();
      
    if (reviewError) {
      console.warn('Error recording flashcard review:', reviewError);
      // Continue anyway - the main flashcard update is more important
    }
    
    // Update flashcard with new schedule
    const { data, error: updateError } = await supabase
      .from('flashcards')
      .update({
        repetition_count: repeatCount + 1,
        easiness_factor: schedule.easinessFactor,
        difficulty: difficulty,
        next_review_date: schedule.nextReviewDate.toISOString(),
        last_reviewed_at: new Date().toISOString(),
        last_retention: schedule.estimatedRetention,
        mastery_level: schedule.masteryLevel
      })
      .eq('id', flashcardId)
      .select()
      .single();
      
    if (updateError) {
      return { error: updateError };
    }
    
    return { data };
  } catch (error) {
    console.error('Error updating flashcard after review:', error);
    return { error: error instanceof Error ? error : new Error('Unknown error updating flashcard') };
  }
};
