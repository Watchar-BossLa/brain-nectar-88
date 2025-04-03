
import { supabase } from '@/integrations/supabase/client';

/**
 * Get flashcards that are due for review
 * 
 * @param userId The user ID to get flashcards for
 * @returns Object with data or error
 */
export const getDueFlashcards = async (userId: string) => {
  try {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review_date', now)
      .order('next_review_date', { ascending: true });
      
    if (error) {
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching due flashcards:', error);
    return { data: null, error };
  }
};
