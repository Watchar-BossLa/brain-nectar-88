
/**
 * Service for managing flashcard reviews and updating their scheduling
 */
import { supabase } from '@/integrations/supabase/client';
import { calculateNextReviewSchedule, INITIAL_EASINESS_FACTOR } from './algorithm';

/**
 * @typedef {Object} FlashcardReviewResult
 * @property {string} flashcardId - ID of the flashcard
 * @property {number} difficulty - Difficulty rating (1-5)
 * @property {string} reviewedAt - ISO timestamp of the review
 */

/**
 * Record a flashcard review and update its scheduling
 * 
 * @param {FlashcardReviewResult} reviewData - Review data
 * @returns {Promise<boolean>} Success indicator
 */
export const recordFlashcardReview = async (reviewData) => {
  try {
    // Create review record
    const { error: reviewError } = await supabase
      .from('flashcard_reviews')
      .insert({
        flashcard_id: reviewData.flashcardId,
        difficulty_rating: reviewData.difficulty,
        reviewed_at: reviewData.reviewedAt || new Date().toISOString(),
        user_id: (await supabase.auth.getUser()).data.user?.id
      });

    if (reviewError) {
      console.error('Error recording flashcard review:', reviewError);
      return false;
    }
    
    // Update flashcard scheduling
    const updated = await updateFlashcardAfterReview(
      reviewData.flashcardId, 
      reviewData.difficulty
    );
    
    return !updated.error;
  } catch (error) {
    console.error('Error in recordFlashcardReview:', error);
    return false;
  }
};

/**
 * Update flashcard after review with new scheduling information
 * 
 * @param {string} flashcardId - Flashcard ID
 * @param {number} difficulty - Difficulty rating (1-5)
 * @returns {Promise<{data?: any, error?: Error}>} Result with data or error
 */
export const updateFlashcardAfterReview = async (flashcardId, difficulty) => {
  try {
    // Get current flashcard data
    const { data: flashcard, error: fetchError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('id', flashcardId)
      .single();
      
    if (fetchError) {
      return { error: fetchError };
    }
    
    // Calculate next review schedule
    const repeatCount = flashcard.repetition_count || 0;
    const easeFactor = flashcard.easiness_factor || INITIAL_EASINESS_FACTOR;
    const previousInterval = repeatCount > 0 ? 
      Math.ceil((new Date().getTime() - new Date(flashcard.last_reviewed_at || flashcard.created_at).getTime()) 
      / (1000 * 60 * 60 * 24)) : 1;
    
    const schedule = calculateNextReviewSchedule(
      repeatCount,
      easeFactor,
      difficulty,
      previousInterval
    );
    
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
      .select();
      
    if (updateError) {
      return { error: updateError };
    }
    
    return { data };
  } catch (error) {
    return { error };
  }
};

/**
 * Update specific review data for a flashcard
 * 
 * @param {string} flashcardId - Flashcard ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<{data?: any, error?: Error}>} Result object
 */
export const updateFlashcardReviewData = async (flashcardId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .update(updateData)
      .eq('id', flashcardId)
      .select();
      
    if (error) {
      return { error };
    }
    
    return { data };
  } catch (error) {
    return { error };
  }
};
