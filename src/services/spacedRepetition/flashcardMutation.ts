
import { supabase } from '@/integrations/supabase/client';

/**
 * Create a new flashcard
 * 
 * @param userId User ID
 * @param frontContent Front side content
 * @param backContent Back side content
 * @param topicId Optional topic ID
 * @returns Object with data or error
 */
export const createFlashcard = async (
  userId: string,
  frontContent: string,
  backContent: string,
  topicId?: string
) => {
  try {
    const now = new Date().toISOString();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const { data, error } = await supabase
      .from('flashcards')
      .insert({
        user_id: userId,
        front_content: frontContent,
        back_content: backContent,
        topic_id: topicId,
        next_review_date: tomorrow.toISOString(),
        repetition_count: 0,
        difficulty: 3, // Medium difficulty by default
        mastery_level: 0,
        easiness_factor: 2.5, // Default easiness factor
        created_at: now,
        updated_at: now
      })
      .select()
      .single();
      
    if (error) {
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating flashcard:', error);
    return { data: null, error };
  }
};

/**
 * Delete a flashcard
 * 
 * @param flashcardId The ID of the flashcard to delete
 * @returns Object with data or error
 */
export const deleteFlashcard = async (flashcardId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', flashcardId)
      .select()
      .single();
      
    if (error) {
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    return { data: null, error };
  }
};
