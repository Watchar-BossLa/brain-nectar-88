
import { supabase } from '@/integrations/supabase/client';
import { calculateNextReviewDate, INITIAL_EASINESS_FACTOR } from './algorithm';
import { Flashcard } from '@/types/supabase';

/**
 * Updates a flashcard after review based on user's difficulty rating
 */
export const updateFlashcardAfterReview = async (
  flashcardId: string,
  difficulty: number
) => {
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
    
    // Calculate new review date and repetition count
    const nextReviewDate = calculateNextReviewDate(
      flashcardData.repetition_count,
      flashcardData.difficulty || INITIAL_EASINESS_FACTOR,
      difficulty
    );
    
    let newRepetitionCount = flashcardData.repetition_count;
    if (difficulty <= 3) {
      // Reset for difficult cards
      newRepetitionCount = 0;
    } else {
      // Increment for easy cards
      newRepetitionCount += 1;
    }
    
    // Update the flashcard
    const { data, error } = await supabase
      .from('flashcards')
      .update({
        difficulty: difficulty,
        repetition_count: newRepetitionCount,
        next_review_date: nextReviewDate.toISOString(),
      })
      .eq('id', flashcardId)
      .select();
      
    if (error) {
      console.error('Error updating flashcard:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in updateFlashcardAfterReview:', error);
    return { data: null, error };
  }
};
