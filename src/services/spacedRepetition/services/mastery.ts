
import { supabase } from '@/integrations/supabase/client';

/**
 * Get struggling flashcards (low mastery level, high difficulty)
 * 
 * @param userId The user ID to get flashcards for
 * @returns Object with data or error
 */
export const getStrugglingFlashcards = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lt('mastery_level', 0.4)
      .gt('repetition_count', 2)
      .order('mastery_level', { ascending: true });
      
    if (error) {
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching struggling flashcards:', error);
    return { data: null, error };
  }
};

/**
 * Get mastered flashcards (high mastery level)
 * 
 * @param userId The user ID to get flashcards for
 * @returns Object with data or error
 */
export const getMasteredFlashcards = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .gte('mastery_level', 0.8)
      .gt('repetition_count', 3)
      .order('mastery_level', { ascending: false });
      
    if (error) {
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching mastered flashcards:', error);
    return { data: null, error };
  }
};
