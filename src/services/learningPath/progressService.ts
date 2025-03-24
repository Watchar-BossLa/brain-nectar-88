
import { supabase } from '@/integrations/supabase/client';

/**
 * Updates the user's learning path based on new progress
 */
export const updateLearningPath = async (userId: string, contentId: string, progressPercentage: number) => {
  try {
    // Update or create progress record
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        content_id: contentId,
        progress_percentage: progressPercentage,
        status: progressPercentage >= 100 ? 'completed' : 'in_progress',
        last_accessed_at: new Date().toISOString()
      })
      .select();
    
    if (error) {
      console.error('Error updating progress:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in updateLearningPath:', error);
    return { data: null, error };
  }
};
