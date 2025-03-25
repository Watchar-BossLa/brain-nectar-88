
import { supabase } from '@/integrations/supabase/client';
import { 
  calculateNextReviewSchedule, 
  INITIAL_EASINESS_FACTOR
} from './algorithm';
import { UpdateResult } from './reviewTypes';

/**
 * Updates a flashcard after review based on user's difficulty rating
 * using the enhanced spaced repetition algorithm
 */
export const updateFlashcardAfterReview = async (
  flashcardId: string,
  difficulty: number
): Promise<UpdateResult> => {
  try {
    // Get the current flashcard data
    const { data: flashcardData, error: fetchError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('id', flashcardId)
      .single();
      
    if (fetchError || !flashcardData) {
      console.error('Error fetching flashcard for update:', fetchError);
      return { data: null, error: fetchError };
    }
    
    // Determine previous interval if available
    let previousInterval = 1;
    if (flashcardData.next_review_date) {
      const lastReviewDate = new Date(flashcardData.updated_at);
      const nextReviewDate = new Date(flashcardData.next_review_date);
      const dayDiff = Math.round((nextReviewDate.getTime() - lastReviewDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff > 0) {
        previousInterval = dayDiff;
      }
    }
    
    // Get actual retention if available
    let actualRetention = 0.85; // Default to target retention
    // In a real implementation, this would be calculated from historical data
    
    // Calculate new review schedule
    const schedule = calculateNextReviewSchedule(
      flashcardData.repetition_count,
      flashcardData.difficulty || INITIAL_EASINESS_FACTOR,
      difficulty,
      previousInterval,
      actualRetention
    );
    
    // Calculate mastery level
    const newRepetitionCount = difficulty <= 3 ? 0 : flashcardData.repetition_count + 1;
    const mastery = schedule.masteryLevel;
    
    // Prepare update data
    const updateData = {
      difficulty: schedule.easinessFactor,
      repetition_count: newRepetitionCount,
      next_review_date: schedule.nextReviewDate.toISOString(),
      mastery_level: mastery,
    };
    
    // Update the flashcard
    const { data, error } = await supabase
      .from('flashcards')
      .update(updateData)
      .eq('id', flashcardId)
      .select();
      
    if (error) {
      console.error('Error updating flashcard:', error);
      return { data: null, error };
    }
    
    // Log the review to flashcard_reviews table
    try {
      await supabase
        .from('flashcard_reviews')
        .insert({
          flashcard_id: flashcardId,
          user_id: flashcardData.user_id,
          difficulty_rating: difficulty,
          reviewed_at: new Date().toISOString(),
          retention_estimate: schedule.estimatedRetention
        });
    } catch (logError) {
      // Soft error - we'll continue even if review logging fails
      console.warn('Could not log flashcard review:', logError);
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in updateFlashcardAfterReview:', error);
    return { data: null, error };
  }
};
