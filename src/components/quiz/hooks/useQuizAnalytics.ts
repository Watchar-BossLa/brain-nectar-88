
import { useState, useEffect, useMemo } from 'react';
import { AnsweredQuestion, QuizResults } from '../types';
import { useSessionHistory } from './adaptive-quiz';

interface AnalyticsData {
  performanceOverTime: {
    date: string;
    score: number;
    difficulty: number;
  }[];
  topicMastery: {
    topic: string;
    mastery: number;
    fullMark: number;
  }[];
  difficultyPerformance: {
    name: string;
    correct: number;
    incorrect: number;
    total: number;
    accuracy: number;
  }[];
  confidenceAccuracy: {
    confidence: number;
    accuracy: number;
    count: number;
    topic?: string;
  }[];
  overallStats: {
    totalQuizzes: number;
    totalQuestions: number;
    averageScore: number;
    bestTopic: string;
    worstTopic: string;
    questionsAnswered: number;
    correctAnswers: number;
    incorrectAnswers: number;
  };
  recentQuestionsPerformance: {
    correct: number;
    incorrect: number;
    lastFiveAccuracy: number;
  };
}

const DEFAULT_ANALYTICS: AnalyticsData = {
  performanceOverTime: [],
  topicMastery: [],
  difficultyPerformance: [],
  confidenceAccuracy: [],
  overallStats: {
    totalQuizzes: 0,
    totalQuestions: 0,
    averageScore: 0,
    bestTopic: 'None',
    worstTopic: 'None',
    questionsAnswered: 0,
    correctAnswers: 0,
    incorrectAnswers: 0
  },
  recentQuestionsPerformance: {
    correct: 0,
    incorrect: 0,
    lastFiveAccuracy: 0
  }
};

export function useQuizAnalytics(currentQuizAnswers: AnsweredQuestion[] = []) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(DEFAULT_ANALYTICS);
  const { sessions, isLoading } = useSessionHistory();

  // Process the data when sessions or current quiz answers change
  useEffect(() => {
    if (isLoading) return;
    
    // Performance over time from sessions
    const performanceOverTime = sessions.map(session => ({
      date: new Date(session.date).toLocaleDateString(),
      score: session.results.correctAnswers / session.results.questionsAttempted * 100,
      difficulty: session.initialDifficulty
    }));
    
    // Process topic mastery
    const topicData: Record<string, { correct: number; total: number }> = {};
    
    // Process sessions for topic data
    sessions.forEach(session => {
      Object.entries(session.results.performanceByTopic).forEach(([topic, data]) => {
        if (!topicData[topic]) {
          topicData[topic] = { correct: 0, total: 0 };
        }
        topicData[topic].correct += data.correct;
        topicData[topic].total += data.total;
      });
    });
    
    // Add current quiz answers to topic data
    currentQuizAnswers.forEach(answer => {
      const topic = answer.topic || 'Unknown';
      if (!topicData[topic]) {
        topicData[topic] = { correct: 0, total: 0 };
      }
      topicData[topic].total += 1;
      if (answer.isCorrect) {
        topicData[topic].correct += 1;
      }
    });
    
    // Convert topic data to chart format
    const topicMastery = Object.entries(topicData).map(([topic, data]) => ({
      topic,
      mastery: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      fullMark: 100
    }));
    
    // Process difficulty performance
    const difficultyData: Record<string, { correct: number; incorrect: number; total: number }> = {
      'Easy': { correct: 0, incorrect: 0, total: 0 },
      'Medium': { correct: 0, incorrect: 0, total: 0 },
      'Hard': { correct: 0, incorrect: 0, total: 0 }
    };
    
    // Process sessions for difficulty data
    sessions.forEach(session => {
      Object.entries(session.results.performanceByDifficulty).forEach(([difficulty, data]) => {
        difficultyData[difficulty].correct += data.correct;
        difficultyData[difficulty].total += data.total;
        difficultyData[difficulty].incorrect += data.total - data.correct;
      });
    });
    
    // Add current quiz answers to difficulty data
    currentQuizAnswers.forEach(answer => {
      const difficultyLevel = answer.difficulty || 2;
      const difficultyName = difficultyLevel === 1 ? 'Easy' : difficultyLevel === 2 ? 'Medium' : 'Hard';
      
      difficultyData[difficultyName].total += 1;
      if (answer.isCorrect) {
        difficultyData[difficultyName].correct += 1;
      } else {
        difficultyData[difficultyName].incorrect += 1;
      }
    });
    
    // Convert difficulty data to chart format
    const difficultyPerformance = Object.entries(difficultyData).map(([name, data]) => ({
      name,
      correct: data.correct,
      incorrect: data.incorrect,
      total: data.total,
      accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
    }));
    
    // Process confidence vs accuracy
    const confidenceData: Record<string, { sumConfidence: number; sumAccuracy: number; count: number }> = {};
    
    // Group by rounded confidence levels (0%, 20%, 40%, 60%, 80%, 100%)
    const confidenceGroups = [0, 20, 40, 60, 80, 100];
    
    // Process all answers with confidence data
    const allAnswersWithConfidence = [
      ...sessions.flatMap(session => 
        session.answeredQuestions.filter(q => q.confidenceLevel !== undefined)
      ),
      ...currentQuizAnswers.filter(q => q.confidenceLevel !== undefined)
    ];
    
    allAnswersWithConfidence.forEach(answer => {
      const confidenceLevel = answer.confidenceLevel || answer.confidence || 0.5;
      const confidencePercent = Math.round(confidenceLevel * 100);
      
      // Find the appropriate confidence group
      let groupIndex = 0;
      for (let i = 0; i < confidenceGroups.length; i++) {
        if (confidencePercent <= confidenceGroups[i]) {
          groupIndex = i;
          break;
        }
      }
      
      const groupName = confidenceGroups[groupIndex].toString();
      
      if (!confidenceData[groupName]) {
        confidenceData[groupName] = { sumConfidence: 0, sumAccuracy: 0, count: 0 };
      }
      
      confidenceData[groupName].sumConfidence += confidencePercent;
      confidenceData[groupName].sumAccuracy += answer.isCorrect ? 100 : 0;
      confidenceData[groupName].count += 1;
    });
    
    // Convert confidence data to chart format
    const confidenceAccuracy = Object.entries(confidenceData).map(([confidence, data]) => ({
      confidence: Math.round(data.sumConfidence / data.count),
      accuracy: Math.round(data.sumAccuracy / data.count),
      count: data.count
    }));
    
    // Calculate overall statistics
    const totalQuizzes = sessions.length;
    const totalQuestions = sessions.reduce((sum, session) => sum + session.results.questionsAttempted, 0);
    const totalCorrect = sessions.reduce((sum, session) => sum + session.results.correctAnswers, 0);
    const averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    
    // Find best and worst topics
    let bestTopic = 'None';
    let worstTopic = 'None';
    let bestAccuracy = -1;
    let worstAccuracy = 101;
    
    Object.entries(topicData).forEach(([topic, data]) => {
      if (data.total >= 5) { // Only consider topics with at least 5 questions
        const accuracy = data.correct / data.total;
        if (accuracy > bestAccuracy) {
          bestAccuracy = accuracy;
          bestTopic = topic;
        }
        if (accuracy < worstAccuracy) {
          worstAccuracy = accuracy;
          worstTopic = topic;
        }
      }
    });
    
    // Calculate recent performance (last 5 questions)
    const recentQuestions = [...currentQuizAnswers].slice(-5);
    const recentCorrect = recentQuestions.filter(q => q.isCorrect).length;
    
    const recentQuestionsPerformance = {
      correct: recentCorrect,
      incorrect: recentQuestions.length - recentCorrect,
      lastFiveAccuracy: recentQuestions.length > 0 ? Math.round((recentCorrect / recentQuestions.length) * 100) : 0
    };
    
    // Combine all analytics
    const analytics: AnalyticsData = {
      performanceOverTime,
      topicMastery,
      difficultyPerformance,
      confidenceAccuracy,
      overallStats: {
        totalQuizzes,
        totalQuestions: totalQuestions + currentQuizAnswers.length,
        averageScore,
        bestTopic,
        worstTopic,
        questionsAnswered: totalQuestions + currentQuizAnswers.length,
        correctAnswers: totalCorrect + currentQuizAnswers.filter(q => q.isCorrect).length,
        incorrectAnswers: (totalQuestions - totalCorrect) + currentQuizAnswers.filter(q => !q.isCorrect).length
      },
      recentQuestionsPerformance
    };
    
    setAnalyticsData(analytics);
  }, [sessions, currentQuizAnswers, isLoading]);
  
  return {
    analyticsData,
    isLoading
  };
}
