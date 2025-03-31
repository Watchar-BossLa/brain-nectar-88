
import { supabase } from '@/integrations/supabase/client';

interface Topic {
  id: string;
  title: string;
  strengths: number;
  weaknesses: number;
}

interface QuizHistory {
  sessionId: string;
  score: number;
  date: string;
  topics: string[];
}

interface QuizLearningData {
  userId: string;
  strongTopics: Topic[];
  weakTopics: Topic[];
  history: QuizHistory[];
  recommendedTopics: string[];
  recommendedDifficulty: number;
}

/**
 * Get quiz-based learning data for a user
 */
export const getQuizLearningData = async (userId: string): Promise<QuizLearningData> => {
  try {
    // Get quiz sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (sessionsError) {
      throw sessionsError;
    }
    
    // Get performance metrics
    const { data: metrics, error: metricsError } = await supabase
      .from('quiz_performance_metrics')
      .select('*')
      .eq('user_id', userId);
      
    if (metricsError) {
      throw metricsError;
    }
    
    // Process topics
    const topicsMap: Record<string, Topic> = {};
    
    metrics?.forEach((metric: any) => {
      const topicId = metric.topic;
      const accuracy = metric.correct_count / Math.max(metric.total_count, 1);
      
      if (!topicsMap[topicId]) {
        topicsMap[topicId] = {
          id: topicId,
          title: topicId, // Ideally would get real title from topics table
          strengths: 0,
          weaknesses: 0
        };
      }
      
      // Classify as strength or weakness based on accuracy
      if (accuracy >= 0.7) {
        topicsMap[topicId].strengths++;
      } else {
        topicsMap[topicId].weaknesses++;
      }
    });
    
    // Convert to arrays and sort
    const allTopics = Object.values(topicsMap);
    const strongTopics = [...allTopics].sort((a, b) => b.strengths - a.strengths).slice(0, 3);
    const weakTopics = [...allTopics].sort((a, b) => b.weaknesses - a.weaknesses).slice(0, 3);
    
    // Format history
    const history: QuizHistory[] = (sessions || []).map((session: any) => ({
      sessionId: session.id,
      score: session.score_percentage,
      date: session.created_at,
      topics: session.selected_topics || []
    }));
    
    // Determine recommended topics (focus on weak areas)
    const recommendedTopics = weakTopics.map(topic => topic.id);
    
    // Calculate recommended difficulty based on recent performance
    let recommendedDifficulty = 2; // Default to medium
    
    if (history.length > 0) {
      const recentScores = history.slice(0, 3).map(h => h.score);
      const avgScore = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
      
      if (avgScore >= 90) recommendedDifficulty = 3;
      else if (avgScore >= 70) recommendedDifficulty = 2;
      else recommendedDifficulty = 1;
    }
    
    return {
      userId,
      strongTopics,
      weakTopics,
      history,
      recommendedTopics,
      recommendedDifficulty
    };
  } catch (error) {
    console.error('Error getting quiz learning data:', error);
    return {
      userId,
      strongTopics: [],
      weakTopics: [],
      history: [],
      recommendedTopics: [],
      recommendedDifficulty: 2
    };
  }
};

/**
 * Get performance data for a specific topic
 */
export const getTopicPerformanceData = async (userId: string, topicId: string) => {
  try {
    // Get all quiz questions about this topic
    const { data: answeredQuestions, error } = await supabase
      .from('quiz_answered_questions')
      .select('*, questions(*)')
      .eq('user_id', userId)
      .eq('topic', topicId);
      
    if (error) {
      throw error;
    }
    
    // Calculate metrics
    const totalQuestions = answeredQuestions?.length || 0;
    const correctAnswers = answeredQuestions?.filter((q: any) => q.is_correct).length || 0;
    const accuracyRate = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    
    // Calculate difficulty breakdown
    const byDifficulty = {
      easy: { correct: 0, total: 0 },
      medium: { correct: 0, total: 0 },
      hard: { correct: 0, total: 0 }
    };
    
    answeredQuestions?.forEach((q: any) => {
      const difficulty = q.difficulty <= 1 ? 'easy' : q.difficulty >= 3 ? 'hard' : 'medium';
      byDifficulty[difficulty].total++;
      if (q.is_correct) byDifficulty[difficulty].correct++;
    });
    
    return {
      topicId,
      totalQuestions,
      correctAnswers,
      accuracyRate,
      byDifficulty
    };
  } catch (error) {
    console.error('Error getting topic performance:', error);
    return {
      topicId,
      totalQuestions: 0,
      correctAnswers: 0,
      accuracyRate: 0,
      byDifficulty: {
        easy: { correct: 0, total: 0 },
        medium: { correct: 0, total: 0 },
        hard: { correct: 0, total: 0 }
      }
    };
  }
};
