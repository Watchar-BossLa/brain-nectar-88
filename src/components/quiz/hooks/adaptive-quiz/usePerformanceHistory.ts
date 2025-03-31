import { useState, useCallback, useEffect } from 'react';
import { AnsweredQuestion } from '../../types';

interface PerformanceMetrics {
  accuracy: number;
  averageConfidence: number;
  confidenceAccuracy: number;
  averageTimePerQuestion: number;
  topicPerformance: Record<string, { correct: number; total: number }>;
  difficultyPerformance: Record<string, { correct: number; total: number }>;
  trend: 'improving' | 'stable' | 'declining' | 'undefined';
  strengths: string[];
  weaknesses: string[];
}

export function usePerformanceHistory() {
  const [history, setHistory] = useState<AnsweredQuestion[]>([]);
  const [detailedMetrics, setDetailedMetrics] = useState<PerformanceMetrics>({
    accuracy: 0,
    averageConfidence: 0,
    confidenceAccuracy: 0,
    averageTimePerQuestion: 0,
    topicPerformance: {},
    difficultyPerformance: {},
    trend: 'undefined',
    strengths: [],
    weaknesses: []
  });
  
  // Add a new performance record to history
  const recordPerformance = useCallback((question: AnsweredQuestion) => {
    setHistory(prev => [...prev, question]);
  }, []);
  
  // Analyze the performance history to get detailed metrics
  useEffect(() => {
    if (history.length === 0) return;
    
    // Basic metrics
    const correctCount = history.filter(q => q.isCorrect).length;
    const accuracy = correctCount / history.length;
    
    // Get confidence levels safely
    const confidenceLevels = history.filter(q => q.confidenceLevel !== undefined)
      .map(q => q.confidenceLevel || 0.5);
    const averageConfidence = confidenceLevels.length > 0 
      ? confidenceLevels.reduce((sum, val) => sum + val, 0) / confidenceLevels.length 
      : 0.5;
    
    // Confidence accuracy measures how well confidence predicts correctness
    let confidenceAccuracy = 0;
    let confidenceCount = 0;
    history.forEach(q => {
      if (q.confidenceLevel !== undefined) {
        const expectedOutcome = q.confidenceLevel;
        const actualOutcome = q.isCorrect ? 1 : 0;
        confidenceAccuracy += 1 - Math.abs(expectedOutcome - actualOutcome);
        confidenceCount++;
      }
    });
    confidenceAccuracy = confidenceCount > 0 ? confidenceAccuracy / confidenceCount : 0;
    
    // Time analytics
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
    
    // Performance by difficulty
    const difficultyPerformance: Record<string, { correct: number; total: number }> = {
      '1': { correct: 0, total: 0 },
      '2': { correct: 0, total: 0 },
      '3': { correct: 0, total: 0 }
    };
    history.forEach(q => {
      if (q.difficulty) {
        const diffKey = q.difficulty.toString();
        difficultyPerformance[diffKey].total += 1;
        if (q.isCorrect) {
          difficultyPerformance[diffKey].correct += 1;
        }
      }
    });
    
    // Calculate performance trend
    let trend: 'improving' | 'stable' | 'declining' | 'undefined' = 'undefined';
    if (history.length >= 10) {
      const firstHalf = history.slice(0, Math.floor(history.length / 2));
      const secondHalf = history.slice(Math.floor(history.length / 2));
      
      const firstHalfAccuracy = firstHalf.filter(q => q.isCorrect).length / firstHalf.length;
      const secondHalfAccuracy = secondHalf.filter(q => q.isCorrect).length / secondHalf.length;
      
      const difference = secondHalfAccuracy - firstHalfAccuracy;
      if (difference > 0.1) trend = 'improving';
      else if (difference < -0.1) trend = 'declining';
      else trend = 'stable';
    }
    
    // Identify strengths and weaknesses (topics)
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    Object.entries(topicPerformance).forEach(([topic, data]) => {
      if (data.total >= 3) { // Only consider topics with enough data
        const topicAccuracy = data.correct / data.total;
        if (topicAccuracy >= 0.75) {
          strengths.push(topic);
        } else if (topicAccuracy <= 0.4) {
          weaknesses.push(topic);
        }
      }
    });
    
    // Update detailed metrics
    setDetailedMetrics({
      accuracy,
      averageConfidence,
      confidenceAccuracy,
      averageTimePerQuestion,
      topicPerformance,
      difficultyPerformance,
      trend,
      strengths,
      weaknesses
    });
    
  }, [history]);
  
  // Calculate metrics for external use
  const calculateMetrics = useCallback((): PerformanceMetrics => {
    return detailedMetrics;
  }, [detailedMetrics]);
  
  // Get recommended next difficulty based on performance
  const getRecommendedDifficulty = useCallback((currentDifficulty: 1 | 2 | 3): 1 | 2 | 3 => {
    // No history yet, stick with current difficulty
    if (history.length < 5) return currentDifficulty;
    
    // Check performance at current difficulty level
    const difficultyKey = currentDifficulty.toString();
    const currentLevelPerformance = detailedMetrics.difficultyPerformance[difficultyKey];
    const currentLevelAccuracy = currentLevelPerformance?.total > 0 
      ? currentLevelPerformance.correct / currentLevelPerformance.total 
      : 0.5;
    
    // Get recent trend (last 8 questions or fewer)
    const recentQuestions = history.slice(-Math.min(8, history.length));
    const recentCorrect = recentQuestions.filter(q => q.isCorrect).length;
    const recentAccuracy = recentCorrect / recentQuestions.length;
    
    // Decide on difficulty change
    if (recentAccuracy > 0.8 && currentLevelAccuracy > 0.75 && currentDifficulty < 3) {
      // Performing very well, increase difficulty if not already at max
      return (currentDifficulty + 1) as 1 | 2 | 3;
    } else if (recentAccuracy < 0.4 && currentLevelAccuracy < 0.5 && currentDifficulty > 1) {
      // Struggling significantly, decrease difficulty if not already at min
      return (currentDifficulty - 1) as 1 | 2 | 3;
    }
    
    // Check if user is mastering a level
    const questionsAtCurrentLevel = history.filter(q => q.difficulty === currentDifficulty).length;
    if (questionsAtCurrentLevel > 10 && currentLevelAccuracy > 0.85 && currentDifficulty < 3) {
      // Mastered this level, move up
      return (currentDifficulty + 1) as 1 | 2 | 3;
    }
    
    // Otherwise maintain current difficulty
    return currentDifficulty;
  }, [history, detailedMetrics]);
  
  // Predict what the user should focus on next
  const getRecommendedFocus = useCallback(() => {
    // Return topics that need improvement
    return detailedMetrics.weaknesses;
  }, [detailedMetrics]);
  
  return {
    history,
    recordPerformance,
    calculateMetrics,
    getRecommendedDifficulty,
    getRecommendedFocus,
    metrics: detailedMetrics
  };
}
