
import { LearningHistoryItem } from '../types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Service for retrieving user learning history
 */
export class LearningHistoryService {
  /**
   * Fetch learning history for a user
   */
  static async getLearningHistory(userId: string): Promise<LearningHistoryItem[]> {
    try {
      // Fetch progress data from Supabase
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*, content(*)')
        .eq('user_id', userId);
        
      if (progressError) {
        console.error('Error fetching user progress:', progressError);
        return [];
      }
      
      // Convert to learning history items
      return progressData.map(item => ({
        contentId: item.content?.id,
        topicId: item.content?.topic_id,
        moduleId: item.content?.module_id,
        status: item.status,
        progressPercentage: item.progress_percentage,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        content: {
          id: item.content?.id,
          topicId: item.content?.topic_id,
          moduleId: item.content?.module_id,
          contentType: item.content?.content_type,
          contentData: item.content?.content_data,
          title: item.content?.title
        }
      }));
    } catch (error) {
      console.error('Error in getLearningHistory:', error);
      return [];
    }
  }
  
  /**
   * Alternative name for the same function (for backward compatibility)
   */
  static async fetchUserLearningHistory(userId: string): Promise<LearningHistoryItem[]> {
    return this.getLearningHistory(userId);
  }
}
