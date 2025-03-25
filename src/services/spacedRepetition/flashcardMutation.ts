
import { supabase } from '@/integrations/supabase/client';
import { INITIAL_EASINESS_FACTOR } from './algorithm';

/**
 * Creates a new flashcard with initial spaced repetition parameters
 */
export const createFlashcard = async (
  frontContent: string,
  backContent: string,
  topicId?: string
) => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    // Default next review date is today (cards are due immediately after creation)
    const nextReviewDate = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('flashcards')
      .insert({
        user_id: user.id,
        front_content: frontContent,
        back_content: backContent,
        topic_id: topicId || null,
        difficulty: INITIAL_EASINESS_FACTOR,
        repetition_count: 0,
        next_review_date: nextReviewDate,
        mastery_level: 0, // Start with zero mastery
      })
      .select();
      
    if (error) {
      console.error('Error creating flashcard:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in createFlashcard:', error);
    return { data: null, error };
  }
};

/**
 * Delete a flashcard
 */
export const deleteFlashcard = async (flashcardId: string) => {
  try {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', flashcardId);
      
    if (error) {
      console.error('Error deleting flashcard:', error);
      return { error };
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error in deleteFlashcard:', error);
    return { error };
  }
};
