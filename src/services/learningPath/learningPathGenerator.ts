
import { supabase } from '@/integrations/supabase/client';
import { UserProgress, Content } from '@/types/supabase';
import { calculateTopicMasteryLevels, prioritizeTopics } from './quizPerformanceAnalyzer';
import { calculateTopicMastery } from './topicMasteryUtils';
import { QuizSession } from '@/types/quiz-session';

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
    
    // Calculate mastery for each topic based on progress data
    const topicMasteryMap = calculateTopicMastery(userProgress, allTopics);
    
    // Get recent quiz performance to incorporate into the learning path
    const quizPerformance = await getRecentQuizPerformance(userId);
    
    // Adjust topic mastery levels based on quiz performance
    if (quizPerformance.masteryLevels) {
      Object.entries(quizPerformance.masteryLevels).forEach(([topicId, masteryLevel]) => {
        // If we have quiz performance data for a topic, give it 70% weight compared to progress data
        if (topicMasteryMap[topicId] !== undefined) {
          const progressMastery = topicMasteryMap[topicId] || 0;
          topicMasteryMap[topicId] = Math.round((progressMastery * 0.3) + (masteryLevel * 0.7));
        } else {
          topicMasteryMap[topicId] = masteryLevel;
        }
      });
    }
    
    // Generate learning path based on topic mastery
    const learningPath = modules.map(module => {
      return {
        ...module,
        topics: module.topics.map(topic => {
          const mastery = topicMasteryMap[topic.id] || 0;
          const isWeakTopic = quizPerformance.weakTopics.includes(topic.id);
          
          return {
            ...topic,
            mastery: mastery,
            recommended: isWeakTopic || mastery < 70 // Recommend weak topics or those with less than 70% mastery
          };
        }).sort((a, b) => {
          // Sort topics by priority based on quiz performance, then by mastery (ascending)
          const aIsWeak = quizPerformance.weakTopics.includes(a.id);
          const bIsWeak = quizPerformance.weakTopics.includes(b.id);
          
          if (aIsWeak && !bIsWeak) return -1;
          if (!aIsWeak && bIsWeak) return 1;
          
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

/**
 * Get recent quiz performance data to use for learning path generation
 */
async function getRecentQuizPerformance(userId: string) {
  try {
    // Get the user's recent quiz sessions
    const { data: sessionData, error: sessionError } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (sessionError) {
      console.error('Error fetching quiz sessions:', sessionError);
      return { masteryLevels: {}, weakTopics: [] };
    }
    
    if (!sessionData || sessionData.length === 0) {
      return { masteryLevels: {}, weakTopics: [] };
    }
    
    // Get all answered questions for these sessions
    const sessionIds = sessionData.map(session => session.id);
    const { data: answeredData, error: answeredError } = await supabase
      .from('quiz_answered_questions')
      .select('*')
      .in('session_id', sessionIds);
    
    if (answeredError) {
      console.error('Error fetching answered questions:', answeredError);
      return { masteryLevels: {}, weakTopics: [] };
    }
    
    if (!answeredData || answeredData.length === 0) {
      return { masteryLevels: {}, weakTopics: [] };
    }
    
    // Create an array of answered questions compatible with our analyzer
    const answeredQuestions = answeredData.map(question => ({
      id: question.question_id,
      isCorrect: question.is_correct,
      userAnswer: question.user_answer,
      timeTaken: question.time_taken,
      confidenceLevel: question.confidence_level,
      topic: question.topic,
      difficulty: question.difficulty
    }));
    
    // Calculate topic mastery levels
    const masteryLevels = calculateTopicMasteryLevels(answeredQuestions);
    
    // Identify weak topics (below 60% mastery)
    const weakTopics = Object.entries(masteryLevels)
      .filter(([_, mastery]) => mastery < 60)
      .map(([topic]) => topic);
    
    return { masteryLevels, weakTopics };
  } catch (error) {
    console.error('Error in getRecentQuizPerformance:', error);
    return { masteryLevels: {}, weakTopics: [] };
  }
}
