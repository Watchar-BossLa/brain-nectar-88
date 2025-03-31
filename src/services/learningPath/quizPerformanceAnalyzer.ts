
import { QuizResults, AnsweredQuestion } from '@/types/quiz';

/**
 * Analyzes quiz performance to identify topics that need improvement
 */
export const analyzeQuizPerformance = (results: QuizResults): string[] => {
  if (!results || !results.performanceByTopic) return [];
  
  // Find topics with performance below 70%
  const weakTopics = Object.entries(results.performanceByTopic)
    .filter(([_, data]) => (data.correct / data.total) < 0.7)
    .map(([topic]) => topic);
    
  return weakTopics;
};

/**
 * Calculate mastery level for each topic based on quiz performance
 */
export const calculateTopicMasteryLevels = (
  answeredQuestions: AnsweredQuestion[]
): Record<string, number> => {
  const topicData: Record<string, { correct: number; total: number }> = {};
  
  // Group questions by topic and calculate correct/total counts
  answeredQuestions.forEach(question => {
    if (!question.topic) return;
    
    if (!topicData[question.topic]) {
      topicData[question.topic] = { correct: 0, total: 0 };
    }
    
    topicData[question.topic].total += 1;
    if (question.isCorrect) {
      topicData[question.topic].correct += 1;
    }
  });
  
  // Calculate mastery percentage for each topic
  const masteryLevels: Record<string, number> = {};
  Object.entries(topicData).forEach(([topic, data]) => {
    masteryLevels[topic] = Math.round((data.correct / data.total) * 100);
  });
  
  return masteryLevels;
};

/**
 * Prioritize topics for learning based on quiz performance
 */
export const prioritizeTopics = (
  masteryLevels: Record<string, number>
): string[] => {
  return Object.entries(masteryLevels)
    .sort(([, masteryA], [, masteryB]) => masteryA - masteryB)
    .map(([topic]) => topic);
};
