
import { supabase } from '@/integrations/supabase/client';

/**
 * Get all flashcards for a user
 * @param userId User ID
 */
export const getUserFlashcards = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);
      
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

/**
 * Get flashcards due for review
 * @param userId User ID
 * @param topicId Optional topic ID to filter by
 */
export const getDueFlashcards = async (userId: string, topicId?: string) => {
  try {
    let query = supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review_date', new Date().toISOString());
      
    if (topicId) {
      query = query.eq('topic_id', topicId);
    }
    
    const { data, error } = await query;
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

/**
 * Get flashcards for a specific topic
 * @param userId User ID
 * @param topicId Topic ID
 */
export const getFlashcardsByTopic = async (userId: string, topicId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId);
      
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};
