
import { supabase } from '@/integrations/supabase/client';
import { UserProgress, Content } from '@/types/supabase';
import { calculateTopicMastery } from './topicMasteryUtils';

/**
 * Generates a personalized learning path based on user performance
 */
export const generateLearningPath = async (userId: string, qualificationId: string) => {
  try {
    // Get user's progress for this qualification
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select(`
        *,
        content:content_id(*)
      `)
      .eq('user_id', userId);
    
    if (progressError) {
      console.error('Error fetching user progress:', progressError);
      return { data: null, error: progressError };
    }
    
    // Cast the progress data to make TypeScript happy
    const userProgress = progressData as unknown as UserProgress[];
    
    // Get all modules for this qualification
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('*, topics(*)')
      .eq('qualification_id', qualificationId)
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    
    if (modulesError) {
      console.error('Error fetching modules:', modulesError);
      return { data: null, error: modulesError };
    }
    
    // Extract all topics from modules
    const allTopics = modules.flatMap(module => module.topics || []);
    
    // Calculate mastery for each topic, passing both required arguments
    const topicMasteryMap = calculateTopicMastery(userProgress, allTopics);
    
    // Generate learning path based on topic mastery
    const learningPath = modules.map(module => {
      return {
        ...module,
        topics: module.topics.map(topic => {
          const mastery = topicMasteryMap[topic.id] || 0;
          return {
            ...topic,
            mastery: mastery,
            recommended: mastery < 70 // Recommend topics with less than 70% mastery
          };
        }).sort((a, b) => {
          // Sort topics by mastery (ascending) and then by order_index
          if (a.mastery === b.mastery) {
            return a.order_index - b.order_index;
          }
          return a.mastery - b.mastery;
        })
      };
    });
    
    return { data: learningPath, error: null };
  } catch (error) {
    console.error('Error in generateLearningPath:', error);
    return { data: null, error };
  }
};
