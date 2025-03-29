
import { supabase } from '@/integrations/supabase/client';
import { Flashcard } from '@/types/flashcard';
import { calculateMasteryLevel, calculateRetention, calculateNextReviewDate } from './algorithm';
import { FlashcardRetentionResult, FlashcardLearningStats } from './reviewTypes';

// Re-export functions from reviewStats.ts for backward compatibility
export { calculateFlashcardRetention, getFlashcardLearningStats } from './reviewStats';

/**
 * Update a flashcard after it has been reviewed
 * 
 * @param flashcardId The ID of the flashcard to update
 * @param difficultyRating The user's difficulty rating (1-5)
 * @returns The updated flashcard or null if error
 */
export const updateFlashcardAfterReview = async (
  flashcardId: string,
  difficultyRating: number
): Promise<any | null> => {
  try {
    // Get current flashcard data
    const { data: flashcard, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('id', flashcardId)
      .single();
      
    if (error || !flashcard) {
      console.error('Error fetching flashcard:', error);
      return null;
    }
    
    // Calculate retention and updated parameters
    const retention = calculateRetention(
      flashcard.difficulty || 3, 
      flashcard.easiness_factor || 2.5
    );
    
    // Update easiness factor based on difficulty rating
    const diffModifier = (5 - difficultyRating) / 5;
    const easinessFactor = Math.max(1.3, (flashcard.easiness_factor || 2.5) + (0.1 - (5 - difficultyRating) * 0.08 + diffModifier * 0.02));
    
    // Calculate new mastery level
    const masteryLevel = calculateMasteryLevel(
      flashcard.mastery_level || 0, 
      retention,
      difficultyRating // Pass the third argument (difficulty rating)
    );
    
    // Calculate next review date
    const now = new Date();
    const daysUntilNextReview = calculateNextReview(easinessFactor, (flashcard.repetition_count || 0) + 1);
    const nextReviewDate = new Date(now);
    nextReviewDate.setDate(now.getDate() + daysUntilNextReview);
    
    // Update the flashcard
    const { data, error: updateError } = await supabase
      .from('flashcards')
      .update({
        difficulty: difficultyRating,
        easiness_factor: easinessFactor,
        last_retention: retention,
        mastery_level: masteryLevel,
        repetition_count: (flashcard.repetition_count || 0) + 1,
        last_reviewed_at: now.toISOString(),
        next_review_date: nextReviewDate.toISOString()
      })
      .eq('id', flashcardId)
      .select('*')
      .single();
      
    if (updateError) {
      console.error('Error updating flashcard:', updateError);
      return null;
    }
    
    // Record the review
    const { error: reviewError } = await supabase
      .from('flashcard_reviews')
      .insert({
        user_id: flashcard.user_id,
        flashcard_id: flashcardId,
        difficulty_rating: difficultyRating,
        retention_estimate: retention
      });
      
    if (reviewError) {
      console.error('Error recording flashcard review:', reviewError);
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateFlashcardAfterReview:', error);
    return null;
  }
};

/**
 * Calculate days until next review using the SM-2 algorithm
 * 
 * @param easinessFactor The easiness factor
 * @param repetitionCount The number of times the card has been reviewed
 * @returns Number of days until next review
 */
const calculateNextReview = (easinessFactor: number, repetitionCount: number): number => {
  if (repetitionCount <= 1) {
    return 1; // First review: 1 day
  } else if (repetitionCount === 2) {
    return 3; // Second review: 3 days
  } else {
    // For subsequent reviews, use the formula: previousInterval * easinessFactor
    const previousInterval = calculateNextReview(easinessFactor, repetitionCount - 1);
    return Math.ceil(previousInterval * easinessFactor);
  }
};
