
import { supabase } from '@/integrations/supabase/client';

/**
 * Get user quiz performance statistics
 * @param userId The user ID
 */
export const getUserPerformance = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching user performance:', error);
    return [];
  }
};

/**
 * Get topic performance for a user
 * @param userId The user ID
 */
export const getTopicPerformance = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('quiz_sessions')
      .select('*, quiz_answered_questions(*)')
      .eq('user_id', userId);
      
    if (error) throw error;

    // Calculate performance by topic
    const topicStats: Record<string, { total: number; correct: number }> = {};
    
    data?.forEach(session => {
      const questions = session.quiz_answered_questions || [];
      
      questions.forEach((q: any) => {
        if (!q.topic) return;
        
        if (!topicStats[q.topic]) {
          topicStats[q.topic] = { total: 0, correct: 0 };
        }
        
        topicStats[q.topic].total += 1;
        if (q.is_correct) {
          topicStats[q.topic].correct += 1;
        }
      });
    });
    
    return topicStats;
  } catch (error) {
    console.error('Error fetching topic performance:', error);
    return {};
  }
};

/**
 * Get difficulty level performance for a user
 * @param userId The user ID
 */
export const getDifficultyPerformance = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('quiz_sessions')
      .select('*, quiz_answered_questions(*)')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    // Calculate performance by difficulty
    const difficultyStats: Record<number, { total: number; correct: number }> = {};
    
    for (let i = 1; i <= 5; i++) {
      difficultyStats[i] = { total: 0, correct: 0 };
    }
    
    data?.forEach(session => {
      const questions = session.quiz_answered_questions || [];
      
      questions.forEach((q: any) => {
        const difficulty = q.difficulty || 1;
        
        difficultyStats[difficulty].total += 1;
        if (q.is_correct) {
          difficultyStats[difficulty].correct += 1;
        }
      });
    });
    
    return difficultyStats;
  } catch (error) {
    console.error('Error fetching difficulty performance:', error);
    return {};
  }
};
