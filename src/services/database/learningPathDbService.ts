
import { supabase } from '@/integrations/supabase/client';

/**
 * Database service for learning path operations
 * Connects to Supabase to manage learning paths
 */
export const learningPathDbService = {
  /**
   * Fetch learning paths for a specific user
   * @param userId The user ID to fetch learning paths for
   * @returns The learning paths or error
   */
  getUserLearningPaths: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('modules')
        .select(`
          id,
          title,
          description,
          order_index,
          topics(
            id,
            title,
            description,
            order_index
          )
        `)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching learning paths:', error);
        return { data: null, error };
      }

      // Calculate mastery for each topic based on user progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      if (progressError) {
        console.error('Error fetching user progress:', progressError);
        return { data, error: null }; // Return modules without progress data
      }

      // Map topics to include mastery data
      const modulesWithMastery = data.map(module => ({
        ...module,
        topics: module.topics.map((topic: any) => {
          // Find progress entries for this topic's content
          const topicProgress = progressData?.filter(
            (p: any) => p.content_id === topic.id
          );
          
          // Calculate average mastery for this topic
          const mastery = topicProgress?.length
            ? topicProgress.reduce((sum: number, p: any) => sum + p.progress_percentage, 0) / 
              topicProgress.length
            : 0;
          
          return {
            ...topic,
            mastery,
            recommended: mastery < 70 // Recommend topics with less than 70% mastery
          };
        })
      }));

      return { data: modulesWithMastery, error: null };
    } catch (error) {
      console.error('Error in getUserLearningPaths:', error);
      return { data: null, error };
    }
  },

  /**
   * Generate a new learning path for a user
   * @param userId User ID
   * @param qualificationId Qualification ID
   * @returns Success status and error if any
   */
  generateLearningPath: async (userId: string, qualificationId: string) => {
    try {
      // For now, we'll just update the user's active qualification
      // In a real implementation, this would generate a personalized learning path
      const { data, error } = await supabase
        .from('profiles')
        .update({ active_qualification_id: qualificationId })
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Error generating learning path:', error);
        return { success: false, error };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Error in generateLearningPath:', error);
      return { success: false, error };
    }
  },

  /**
   * Update topic progress for a user
   * @param userId User ID
   * @param topicId Topic ID
   * @param progressPercentage Progress percentage
   * @returns Updated progress data or error
   */
  updateTopicProgress: async (userId: string, topicId: string, progressPercentage: number) => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          content_id: topicId,
          progress_percentage: progressPercentage,
          status: progressPercentage >= 100 ? 'completed' : 'in_progress'
        })
        .select();

      if (error) {
        console.error('Error updating topic progress:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in updateTopicProgress:', error);
      return { data: null, error };
    }
  },

  /**
   * Get learning path statistics for a user
   * @param userId User ID
   * @returns Statistics object
   */
  getLearningPathStats: async (userId: string) => {
    try {
      // Get all user progress entries
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      if (progressError) {
        console.error('Error fetching user progress stats:', progressError);
        return null;
      }

      // Get total topics count
      const { count: totalTopics, error: topicsError } = await supabase
        .from('topics')
        .select('*', { count: 'exact', head: true });

      if (topicsError) {
        console.error('Error counting topics:', topicsError);
        return null;
      }

      // Calculate statistics
      const completedTopics = progressData?.filter(p => p.status === 'completed').length || 0;
      const masteredTopics = progressData?.filter(p => p.progress_percentage >= 90).length || 0;
      const totalProgress = progressData?.reduce((sum, p) => sum + p.progress_percentage, 0) || 0;
      const averageMastery = progressData?.length 
        ? Math.round(totalProgress / progressData.length) 
        : 0;

      return {
        totalTopics,
        completedTopics,
        masteredTopics,
        averageMastery,
        estimatedCompletionDays: Math.ceil((totalTopics - completedTopics) / 2), // Assuming 2 topics per day
        streak: 5 // Placeholder, would be calculated from study sessions
      };
    } catch (error) {
      console.error('Error getting learning path stats:', error);
      return null;
    }
  }
};
