
import { supabase } from '@/integrations/supabase/client';

// Constants for spaced repetition algorithm
export const INITIAL_EASINESS_FACTOR = 2.5;
export const MIN_EASINESS_FACTOR = 1.3;

/**
 * Update flashcard after review
 * @param flashcardId ID of the flashcard being reviewed
 * @param difficulty The difficulty rating (0-5 scale, 0 = hardest, 5 = easiest)
 */
export const updateFlashcardAfterReview = async (flashcardId: string, difficulty: number) => {
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
    
    // Calculate new spaced repetition values
    const easinessFactor = Math.max(MIN_EASINESS_FACTOR, 
      (flashcard.easiness_factor || INITIAL_EASINESS_FACTOR) + 
      (0.1 - (5 - difficulty) * (0.08 + (5 - difficulty) * 0.02)));
    
    let repetitions = (flashcard.repetition_count || 0);
    if (difficulty < 3) {
      repetitions = 0;
    } else {
      repetitions += 1;
    }
    
    // Calculate next review interval
    let interval: number;
    if (repetitions <= 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round((flashcard.repetition_count || repetitions) * easinessFactor);
    }
    
    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);
    
    // Calculate mastery level - simple formula based on repetitions
    const masteryLevel = Math.min(1.0, (repetitions / 10) + (easinessFactor - 1.3) / 2.5 * 0.5);
    
    // Update the flashcard
    const { data, error } = await supabase
      .from('flashcards')
      .update({
        easiness_factor: easinessFactor,
        repetition_count: repetitions,
        interval: interval,
        last_reviewed_at: new Date().toISOString(),
        next_review_date: nextReviewDate.toISOString(),
        mastery_level: masteryLevel,
        difficulty: difficulty
      })
      .eq('id', flashcardId)
      .select();
      
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};
