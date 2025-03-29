import { useState, useCallback } from 'react';
import { AnsweredQuestion } from '../../types';

interface PerformanceMetrics {
  accuracy: number;
  averageConfidence: number;
  confidenceAccuracy: number;
  averageTimePerQuestion: number;
  topicPerformance: Record<string, { correct: number; total: number }>;
}

export function usePerformanceHistory() {
  const [history, setHistory] = useState<AnsweredQuestion[]>([]);
  
  // Add a new performance record to history
  const recordPerformance = useCallback((question: AnsweredQuestion) => {
    setHistory(prev => [...prev, question]);
  }, []);
  
  // Calculate current performance metrics
  const calculateMetrics = useCallback((): PerformanceMetrics => {
    if (history.length === 0) {
      return {
        accuracy: 0,
        averageConfidence: 0,
        confidenceAccuracy: 0,
        averageTimePerQuestion: 0,
        topicPerformance: {}
      };
    }
    
    const correctCount = history.filter(q => q.isCorrect).length;
    const accuracy = correctCount / history.length;
    
    const confidenceSum = history.reduce((sum, q) => sum + (q.confidenceLevel || 0.5), 0);
    const averageConfidence = confidenceSum / history.length;
    
    // Confidence accuracy measures how well confidence predicts correctness
    let confidenceAccuracy = 0;
    history.forEach(q => {
      const expectedOutcome = q.confidenceLevel || 0.5; // Expected probability of being correct
      const actualOutcome = q.isCorrect ? 1 : 0;
      confidenceAccuracy += 1 - Math.abs(expectedOutcome - actualOutcome);
    });
    confidenceAccuracy /= history.length;
    
    const totalTime = history.reduce((sum, q) => sum + q.timeTaken, 0);
    const averageTimePerQuestion = history.length > 0 ? totalTime / history.length : 0;
    
    // Performance by topic
    const topicPerformance: Record<string, { correct: number; total: number }> = {};
    history.forEach(q => {
      const topic = q.topic || 'unknown';
      if (!topicPerformance[topic]) {
        topicPerformance[topic] = { correct: 0, total: 0 };
      }
      topicPerformance[topic].total += 1;
      if (q.isCorrect) {
        topicPerformance[topic].correct += 1;
      }
    });
    
    return {
      accuracy,
      averageConfidence,
      confidenceAccuracy,
      averageTimePerQuestion,
      topicPerformance
    };
  }, [history]);
  
  // Get recommended next difficulty based on performance
  const getRecommendedDifficulty = useCallback((currentDifficulty: 1 | 2 | 3): 1 | 2 | 3 => {
    const metrics = calculateMetrics();
    
    // No history yet, stick with current difficulty
    if (history.length < 3) return currentDifficulty;
    
    // Get recent trend (last 5 questions or fewer)
    const recentQuestions = history.slice(-Math.min(5, history.length));
    const recentCorrect = recentQuestions.filter(q => q.isCorrect).length;
    const recentAccuracy = recentCorrect / recentQuestions.length;
    
    // Calculate ideal difficulty
    if (recentAccuracy > 0.8) {
      // Performing very well, increase difficulty if not already at max
      return Math.min(currentDifficulty + 1, 3) as 1 | 2 | 3;
    } else if (recentAccuracy < 0.4) {
      // Struggling significantly, decrease difficulty if not already at min
      return Math.max(currentDifficulty - 1, 1) as 1 | 2 | 3;
    }
    
    // Otherwise maintain current difficulty
    return currentDifficulty;
  }, [history, calculateMetrics]);
  
  return {
    history,
    recordPerformance,
    calculateMetrics,
    getRecommendedDifficulty
  };
}
