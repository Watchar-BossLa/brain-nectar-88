
import { supabase } from '@/integrations/supabase/client';
import { MultiAgentSystem, TaskTypes } from '@/services/agents';

/**
 * Service to manage user learning paths
 */
export const userLearningPathService = {
  /**
   * Initialize the learning path for a new user
   */
  initializeForUser: async (userId: string, qualificationId: string): Promise<void> => {
    try {
      // Check if learning path already exists for this user and qualification
      const { data: existingPath } = await supabase
        .from('learning_paths')
        .select('id')
        .eq('user_id', userId)
        .eq('qualification_id', qualificationId)
        .maybeSingle();
      
      if (existingPath) {
        console.log('Learning path already exists for this user and qualification');
        return;
      }
      
      // Generate initial learning path using the agent system
      await MultiAgentSystem.submitTask(
        userId,
        TaskTypes.LEARNING_PATH_GENERATION,
        'Generate initial learning path for user',
        {
          qualificationId,
          isInitial: true
        },
        'HIGH'
      );
      
      console.log('Learning path generation task submitted successfully');
    } catch (error) {
      console.error('Error initializing learning path:', error);
      throw error;
    }
  },
  
  /**
   * Get the current learning path for a user
   */
  getUserLearningPath: async (userId: string, qualificationId: string) => {
    try {
      const { data, error } = await supabase
        .from('learning_paths')
        .select(`
          id,
          created_at,
          updated_at,
          status,
          path_data,
          modules:learning_path_modules(
            id,
            title,
            description,
            position,
            status,
            topics:learning_path_topics(
              id,
              title,
              description,
              position,
              status,
              mastery_level
            )
          )
        `)
        .eq('user_id', userId)
        .eq('qualification_id', qualificationId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching learning path:', error);
      throw error;
    }
  },
  
  /**
   * Update the user's progress on a specific topic
   */
  updateTopicProgress: async (
    userId: string, 
    topicId: string, 
    status: 'not_started' | 'in_progress' | 'completed',
    masteryLevel: number
  ) => {
    try {
      const { error } = await supabase
        .from('learning_path_topics')
        .update({
          status,
          mastery_level: masteryLevel,
          updated_at: new Date().toISOString()
        })
        .eq('id', topicId)
        .eq('user_id', userId);
        
      if (error) {
        throw error;
      }
      
      // Notify the agent system about the progress update
      await MultiAgentSystem.submitTask(
        userId,
        TaskTypes.LEARNING_PATH_GENERATION,
        'Update learning path based on topic progress',
        {
          topicId,
          status,
          masteryLevel
        },
        'MEDIUM'
      );
    } catch (error) {
      console.error('Error updating topic progress:', error);
      throw error;
    }
  }
};
