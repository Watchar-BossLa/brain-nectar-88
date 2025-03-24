
import { supabase } from '@/integrations/supabase/client';
import { Module, Topic, UserProgress, Qualification } from '@/types/supabase';

/**
 * Generates an adaptive learning path based on user's progress, assessments, and learning preferences
 */
export const generateLearningPath = async (userId: string, qualificationId: string) => {
  try {
    // Get user's learning history and progress
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('*, content:content_id(*)')
      .eq('user_id', userId);
    
    if (progressError) {
      console.error('Error fetching user progress:', progressError);
      return { data: null, error: progressError };
    }
    
    // Convert the data to match our UserProgress type
    const userProgress: UserProgress[] = progressData?.map(progress => ({
      ...progress,
      content_id: progress.content_id,
      status: progress.status as "not_started" | "in_progress" | "completed"
    })) || [];

    // Get all modules for the selected qualification
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('*')
      .eq('qualification_id', qualificationId)
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    
    if (modulesError) {
      console.error('Error fetching modules:', modulesError);
      return { data: null, error: modulesError };
    }

    // Get all topics for these modules
    const moduleIds = modules?.map(module => module.id) || [];
    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('*')
      .in('module_id', moduleIds)
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    
    if (topicsError) {
      console.error('Error fetching topics:', topicsError);
      return { data: null, error: topicsError };
    }

    // Calculate mastery for each topic based on user progress
    const topicMastery = calculateTopicMastery(topics, userProgress);
    
    // Generate a personalized learning path
    const learningPath = createAdaptivePath(modules, topics, topicMastery);
    
    // Save the generated learning path
    const { data: savedPath, error: saveError } = await supabase
      .from('study_plans')
      .insert({
        user_id: userId,
        qualification_id: qualificationId,
        title: 'Personalized Learning Path',
        description: 'Automatically generated based on your progress',
        start_date: new Date().toISOString(),
        is_active: true
      })
      .select()
      .single();
    
    if (saveError) {
      console.error('Error saving learning path:', saveError);
      return { data: null, error: saveError };
    }

    return { data: { path: learningPath, plan: savedPath }, error: null };
  } catch (error) {
    console.error('Error in generateLearningPath:', error);
    return { data: null, error };
  }
};

/**
 * Calculates the mastery level for each topic based on user progress
 */
const calculateTopicMastery = (
  topics: Topic[] | null,
  userProgress: UserProgress[] | null
): Record<string, number> => {
  const mastery: Record<string, number> = {};
  
  if (!topics || !userProgress) return mastery;
  
  topics.forEach(topic => {
    // Default mastery is 0
    mastery[topic.id] = 0;
    
    // Find all progress entries related to this topic's content
    const relatedProgress = userProgress.filter(progress => {
      // Access content_id directly instead of through content property
      const progressData = progress as unknown as { content: { topic_id: string } };
      return progressData.content?.topic_id === topic.id;
    });
    
    if (relatedProgress.length > 0) {
      // Calculate average progress percentage
      const totalPercentage = relatedProgress.reduce(
        (sum, progress) => sum + progress.progress_percentage, 
        0
      );
      mastery[topic.id] = Math.round(totalPercentage / relatedProgress.length);
    }
  });
  
  return mastery;
};

/**
 * Creates an adaptive learning path based on modules, topics and mastery levels
 */
const createAdaptivePath = (
  modules: Module[] | null,
  topics: Topic[] | null,
  topicMastery: Record<string, number>
) => {
  if (!modules || !topics) return [];
  
  const result = [];
  
  // Group topics by module
  const topicsByModule: Record<string, Topic[]> = {};
  topics.forEach(topic => {
    if (!topicsByModule[topic.module_id]) {
      topicsByModule[topic.module_id] = [];
    }
    topicsByModule[topic.module_id].push(topic);
  });
  
  // Create learning path with modules and their topics
  modules.forEach(module => {
    const moduleTopics = topicsByModule[module.id] || [];
    
    // Sort topics by mastery (less mastery first)
    const sortedTopics = [...moduleTopics].sort((a, b) => {
      return (topicMastery[a.id] || 0) - (topicMastery[b.id] || 0);
    });
    
    result.push({
      module,
      topics: sortedTopics.map(topic => ({
        topic,
        mastery: topicMastery[topic.id] || 0
      }))
    });
  });
  
  return result;
};

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
