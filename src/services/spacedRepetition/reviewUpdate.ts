
import { supabase } from '@/integrations/supabase/client';
import { INITIAL_EASINESS_FACTOR, MIN_EASINESS_FACTOR, calculateNextReviewDate, calculateMasteryLevel } from './algorithm';

/**
 * Update flashcard after review
 * @param flashcardId ID of the flashcard being reviewed
 * @param difficulty The difficulty rating (0-5 scale, 0 = hardest, 5 = easiest)
 * @param userId ID of the user reviewing the flashcard
 */
export const updateFlashcardAfterReview = async (flashcardId: string, difficulty: number, userId: string) => {
  try {
    // Get current flashcard data
    const { data: flashcard, error: fetchError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('id', flashcardId)
      .single();
      
    if (fetchError) {
      return { data: null, error: fetchError };
    }
    
    if (!flashcard) {
      return { data: null, error: new Error('Flashcard not found') };
    }
    
    // Calculate new spaced repetition values using the algorithm
    const { 
      nextReviewDate, 
      newRepetitionCount, 
      newEasinessFactor 
    } = calculateNextReviewDate(
      flashcard.repetition_count || 0,
      flashcard.easiness_factor || INITIAL_EASINESS_FACTOR,
      difficulty
    );
    
    // Calculate mastery level
    const masteryLevel = calculateMasteryLevel(newRepetitionCount, newEasinessFactor);
    
    // Update the flashcard
    const { data, error } = await supabase
      .from('flashcards')
      .update({
        easiness_factor: newEasinessFactor,
        repetition_count: newRepetitionCount,
        interval: Math.round((nextReviewDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)), // interval in days
        last_reviewed_at: new Date().toISOString(),
        next_review_date: nextReviewDate.toISOString(),
        mastery_level: masteryLevel,
        difficulty: difficulty
      })
      .eq('id', flashcardId)
      .select();

    // Record the review in the flashcard_reviews table
    await supabase.from('flashcard_reviews').insert({
      flashcard_id: flashcardId,
      user_id: userId,
      difficulty_rating: difficulty,
      retention_estimate: masteryLevel
    });
      
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};
