
import { supabase } from '@/integrations/supabase/client';

/**
 * Gets active learning paths for a user
 */
export const getUserLearningPaths = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('study_plans')
      .select('*, qualification:qualification_id(*)')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching learning paths:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in getUserLearningPaths:', error);
    return { data: null, error };
  }
};
