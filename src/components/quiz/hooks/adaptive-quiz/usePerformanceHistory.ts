
import { useState, useCallback } from 'react';
import { AnsweredQuestion } from '../../types';

export function usePerformanceHistory() {
  const [history, setHistory] = useState<AnsweredQuestion[]>([]);
  
  const recordPerformance = useCallback((question: AnsweredQuestion) => {
    setHistory(prev => [...prev, question]);
  }, []);
  
  const getTopicPerformance = useCallback(() => {
    const topicPerformance: Record<string, { correct: number; total: number }> = {};
    
    history.forEach(question => {
      const topic = question.topic || 'unknown';
      
      if (!topicPerformance[topic]) {
        topicPerformance[topic] = { correct: 0, total: 0 };
      }
      
      topicPerformance[topic].total += 1;
      if (question.isCorrect) {
        topicPerformance[topic].correct += 1;
      }
    });
    
    return topicPerformance;
  }, [history]);
  
  const getDifficultyPerformance = useCallback(() => {
    const difficultyPerformance: Record<string, { correct: number; total: number }> = {
      '1': { correct: 0, total: 0 },
      '2': { correct: 0, total: 0 },
      '3': { correct: 0, total: 0 }
    };
    
    history.forEach(question => {
      if (question.difficulty) {
        const diffKey = question.difficulty.toString();
        difficultyPerformance[diffKey].total += 1;
        if (question.isCorrect) {
          difficultyPerformance[diffKey].correct += 1;
        }
      }
    });
    
    return difficultyPerformance;
  }, [history]);
  
  const getRecommendedDifficulty = useCallback((currentDifficulty: 1 | 2 | 3): 1 | 2 | 3 => {
    // Get only the recent performance (last 5 questions)
    const recentHistory = history.slice(-5);
    
    if (recentHistory.length < 3) {
      return currentDifficulty; // Not enough data to make adjustments
    }
    
    const correctRate = recentHistory.filter(q => q.isCorrect).length / recentHistory.length;
    
    // Increase difficulty if performing well
    if (correctRate > 0.8 && currentDifficulty < 3) {
      return (currentDifficulty + 1) as 1 | 2 | 3;
    }
    
    // Decrease difficulty if struggling
    if (correctRate < 0.4 && currentDifficulty > 1) {
      return (currentDifficulty - 1) as 1 | 2 | 3;
    }
    
    return currentDifficulty;
  }, [history]);
  
  return {
    recordPerformance,
    getTopicPerformance,
    getDifficultyPerformance,
    getRecommendedDifficulty
  };
}
