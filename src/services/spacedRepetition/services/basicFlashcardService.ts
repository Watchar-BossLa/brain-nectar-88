
import { supabase } from '@/integrations/supabase/client';

/**
 * Get all flashcards for a user
 * 
 * @param userId The user ID to get flashcards for
 * @returns Object with data or error
 */
export const getUserFlashcards = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user flashcards:', error);
    return { data: null, error };
  }
};

/**
 * Get flashcards for a specific topic
 * 
 * @param userId The user ID to get flashcards for
 * @param topicId The topic ID to get flashcards for
 * @returns Object with data or error
 */
export const getFlashcardsByTopic = async (userId: string, topicId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .order('created_at', { ascending: false });
      
    if (error) {
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching topic flashcards:', error);
    return { data: null, error };
  }
};

/**
 * Create a new flashcard
 * 
 * @param userId User ID for the flashcard owner
 * @param frontContent Content for the front of the flashcard
 * @param backContent Content for the back of the flashcard
 * @param topicId Optional topic ID for categorization
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
    
    const flashcard = {
      user_id: userId,
      front_content: frontContent,
      back_content: backContent,
      topic_id: topicId || null,
      difficulty: 0,
      next_review_date: now,
      repetition_count: 0,
      mastery_level: 0,
      easiness_factor: 2.5,
      created_at: now,
      updated_at: now
    };
    
    const { data, error } = await supabase
      .from('flashcards')
      .insert(flashcard)
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
 * @param flashcardId ID of the flashcard to delete
 * @returns Object with success or error
 */
export const deleteFlashcard = async (flashcardId: string) => {
  try {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', flashcardId);
      
    if (error) {
      return { success: false, error };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    return { success: false, error };
  }
};
