
import { useState, useMemo } from 'react';
import { AnsweredQuestion } from '../types';
import { useSessionHistory } from './adaptive-quiz';

interface TopicPerformance {
  topic: string;
  correct: number;
  incorrect: number;
  total: number;
  accuracy: number;
}

interface DifficultyPerformance {
  name: string;
  correct: number;
  incorrect: number;
  total: number;
  accuracy: number;
}

interface ConfidenceData {
  confidenceLevel: string;
  correct: number;
  incorrect: number;
  accuracy: number;
}

export function useQuizAnalytics(answeredQuestions: AnsweredQuestion[]) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const sessionHistory = useSessionHistory();
  
  // Add loading state for session history
  const [sessionLoading, setSessionLoading] = useState(false);
  
  // Topic performance analysis
  const topicPerformance = useMemo(() => {
    const performanceByTopic: Record<string, { correct: number; incorrect: number }> = {};
    
    answeredQuestions.forEach(question => {
      if (!question.topic) return;
      
      if (!performanceByTopic[question.topic]) {
        performanceByTopic[question.topic] = { correct: 0, incorrect: 0 };
      }
      
      if (question.isCorrect) {
        performanceByTopic[question.topic].correct++;
      } else {
        performanceByTopic[question.topic].incorrect++;
      }
    });
    
    return Object.entries(performanceByTopic).map(([topic, data]) => {
      const total = data.correct + data.incorrect;
      const accuracy = total > 0 ? (data.correct / total) * 100 : 0;
      
      return {
        topic,
        correct: data.correct,
        incorrect: data.incorrect,
        total,
        accuracy: Math.round(accuracy)
      };
    });
  }, [answeredQuestions]);
  
  // Difficulty level performance
  const difficultyPerformance = useMemo(() => {
    const performanceByDifficulty: Record<string, { correct: number; incorrect: number }> = {
      'Easy': { correct: 0, incorrect: 0 },
      'Medium': { correct: 0, incorrect: 0 },
      'Hard': { correct: 0, incorrect: 0 }
    };
    
    answeredQuestions.forEach(question => {
      let difficultyLabel;
      
      switch(question.difficulty) {
        case 1:
          difficultyLabel = 'Easy';
          break;
        case 2:
          difficultyLabel = 'Medium';
          break;
        case 3:
          difficultyLabel = 'Hard';
          break;
        default:
          difficultyLabel = 'Medium';
      }
      
      if (question.isCorrect) {
        performanceByDifficulty[difficultyLabel].correct++;
      } else {
        performanceByDifficulty[difficultyLabel].incorrect++;
      }
    });
    
    return Object.entries(performanceByDifficulty).map(([name, data]) => {
      const total = data.correct + data.incorrect;
      const accuracy = total > 0 ? (data.correct / total) * 100 : 0;
      
      return {
        name,
        correct: data.correct,
        incorrect: data.incorrect,
        total,
        accuracy: Math.round(accuracy)
      };
    });
  }, [answeredQuestions]);
  
  // We need to check if the sessions property exists
  const historicalSessions = useMemo(() => {
    return sessionHistory && sessionHistory.sessions ? sessionHistory.sessions : [];
  }, [sessionHistory]);
  
  return {
    topicPerformance,
    difficultyPerformance,
    selectedTimeRange,
    setSelectedTimeRange,
    isLoading: sessionLoading,
    sessions: historicalSessions
  };
}
