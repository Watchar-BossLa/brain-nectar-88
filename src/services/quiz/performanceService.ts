
import { supabase } from '@/integrations/supabase/client';

/**
 * Get quiz performance metrics for a user
 */
export const getQuizPerformanceMetrics = async (userId: string) => {
  try {
    // Use the quiz_sessions table which should exist
    const { data: sessions, error } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Calculate metrics
    const totalQuizzes = sessions?.length || 0;
    let totalScore = 0;
    let totalQuestions = 0;
    let totalCorrect = 0;
    
    sessions?.forEach(session => {
      totalScore += session.score_percentage || 0;
      totalQuestions += session.total_questions || 0;
      totalCorrect += session.correct_answers || 0;
    });
    
    const averageScore = totalQuizzes > 0 ? totalScore / totalQuizzes : 0;
    const completionRate = totalQuizzes > 0 ? 100 : 0; // Assuming all sessions are complete
    
    // Calculate improvement (comparing the latest session with the average of previous sessions)
    let improvementRate = 0;
    if (totalQuizzes > 1 && sessions) {
      const latestSession = sessions[0];
      const previousSessions = sessions.slice(1);
      const previousAverage = previousSessions.reduce((sum, session) => sum + (session.score_percentage || 0), 0) / previousSessions.length;
      improvementRate = latestSession.score_percentage - previousAverage;
    }
    
    return {
      totalQuizzes,
      averageScore,
      completionRate,
      improvementRate,
      totalQuestions,
      correctAnswers: totalCorrect
    };
  } catch (error) {
    console.error('Error getting performance metrics:', error);
    return {
      totalQuizzes: 0,
      averageScore: 0,
      completionRate: 0,
      improvementRate: 0,
      totalQuestions: 0,
      correctAnswers: 0
    };
  }
};

/**
 * Get performance by topic
 */
export const getPerformanceByTopic = async (userId: string) => {
  try {
    // Use answered questions which joins to topics
    const { data: answeredQuestions, error } = await supabase
      .from('quiz_answered_questions')
      .select('*, questions(topic)')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    // Group questions by topic
    const topicStats: Record<string, { total: number; correct: number }> = {};
    
    answeredQuestions?.forEach(answer => {
      const topic = answer.questions?.topic || 'Unknown';
      
      if (!topicStats[topic]) {
        topicStats[topic] = { total: 0, correct: 0 };
      }
      
      topicStats[topic].total++;
      if (answer.is_correct) {
        topicStats[topic].correct++;
      }
    });
    
    return topicStats;
  } catch (error) {
    console.error('Error getting performance by topic:', error);
    return {};
  }
};

/**
 * Get performance by difficulty level
 */
export const getPerformanceByDifficulty = async (userId: string) => {
  try {
    // Get all answered questions with their difficulty
    const { data: answeredQuestions, error } = await supabase
      .from('quiz_answered_questions')
      .select('*, questions(difficulty)')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    // Group by difficulty
    const difficultyStats: Record<number, { total: number; correct: number }> = {};
    
    answeredQuestions?.forEach(answer => {
      const difficulty = answer.questions?.difficulty || 0;
      
      if (!difficultyStats[difficulty]) {
        difficultyStats[difficulty] = { total: 0, correct: 0 };
      }
      
      difficultyStats[difficulty].total++;
      if (answer.is_correct) {
        difficultyStats[difficulty].correct++;
      }
    });
    
    return difficultyStats;
  } catch (error) {
    console.error('Error getting performance by difficulty:', error);
    return {};
  }
};
