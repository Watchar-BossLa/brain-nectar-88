
import { supabase } from '@/integrations/supabase/client';
import { QuizResults } from '@/types/quiz';
import { analyzeQuizPerformance } from './quizPerformanceAnalyzer';
import { submitTask } from '../agents/taskQueue';

/**
 * Update learning paths based on quiz results
 */
export const updateLearningPathFromQuizResults = async (
  userId: string,
  results: QuizResults
): Promise<void> => {
  try {
    if (!userId || !results) return;
    
    // Analyze quiz results to find weak topics
    const weakTopics = analyzeQuizPerformance(results);
    
    console.log('Weak topics identified from quiz:', weakTopics);
    
    // If there are weak topics, submit a task to update the learning path
    if (weakTopics.length > 0) {
      await submitTask(
        userId,
        'LEARNING_PATH_UPDATE',
        'Update learning path based on quiz results',
        {
          weakTopics,
          quizResults: results,
          timestamp: new Date().toISOString()
        },
        'MEDIUM'
      );
      
      console.log('Learning path update task submitted based on quiz results');
    }
  } catch (error) {
    console.error('Error updating learning path from quiz results:', error);
  }
};

/**
 * Get recommended topics for a user based on quiz performance
 */
export const getRecommendedTopics = async (userId: string): Promise<string[]> => {
  try {
    // Get recent quiz sessions to analyze performance
    const { data, error } = await supabase
      .from('quiz_sessions')
      .select('*, topics')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (error || !data || data.length === 0) {
      console.log('No quiz sessions found for user');
      return [];
    }
    
    // Combine topic performance from all sessions
    const combinedTopicPerformance: Record<string, { correct: number; total: number }> = {};
    
    data.forEach(session => {
      if (session.topics) {
        Object.entries(session.topics).forEach(([topic, performance]) => {
          if (!combinedTopicPerformance[topic]) {
            combinedTopicPerformance[topic] = { correct: 0, total: 0 };
          }
          
          combinedTopicPerformance[topic].correct += performance.correct;
          combinedTopicPerformance[topic].total += performance.total;
        });
      }
    });
    
    // Find topics with less than 70% accuracy
    const recommendedTopics = Object.entries(combinedTopicPerformance)
      .filter(([_, { correct, total }]) => (correct / total) < 0.7 && total >= 3)
      .map(([topic]) => topic);
      
    return recommendedTopics;
  } catch (error) {
    console.error('Error getting recommended topics:', error);
    return [];
  }
};
