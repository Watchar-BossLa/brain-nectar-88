
import { supabase } from '@/integrations/supabase/client';
import { INITIAL_EASINESS_FACTOR } from './algorithm';

/**
 * Create a new flashcard
 * @param frontContent Front content of the card
 * @param backContent Back content of the card
 * @param topicId Optional topic ID
 */
export const createFlashcard = async (
  frontContent: string,
  backContent: string,
  topicId?: string | null
) => {
  try {
    // Get current user
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user?.id;
    
    if (!userId) {
      return { data: null, error: new Error('User not authenticated') };
    }

    // Create the flashcard
    const { data: flashcard, error } = await supabase
      .from('flashcards')
      .insert({
        user_id: userId,
        front_content: frontContent,
        back_content: backContent,
        topic_id: topicId || null,
        difficulty: 0,
        repetition_count: 0,
        mastery_level: 0,
        easiness_factor: INITIAL_EASINESS_FACTOR,
        next_review_date: new Date().toISOString()
      })
      .select();
      
    return { data: flashcard, error };
  } catch (error) {
    return { data: null, error };
  }
};

/**
 * Delete a flashcard
 * @param flashcardId ID of the flashcard to delete
 */
export const deleteFlashcard = async (flashcardId: string) => {
  try {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', flashcardId);
      
    return { data: null, error };
  } catch (error) {
    return { data: null, error };
  }
};
