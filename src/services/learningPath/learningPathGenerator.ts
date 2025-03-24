
import { supabase } from '@/integrations/supabase/client';
import { Module, Topic, UserProgress } from '@/types/supabase';
import { calculateTopicMastery } from './topicMasteryUtils';
import { createAdaptivePath } from './pathCreationUtils';

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
