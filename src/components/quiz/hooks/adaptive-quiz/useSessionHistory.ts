
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { QuizResults, AnsweredQuestion } from '../../types';
import { QuizSessionSummary } from '@/types/quiz-session';

interface QuizSession {
  id: string;
  date: string;
  results: QuizResults;
  answeredQuestions: AnsweredQuestion[];
  selectedTopics: string[];
  initialDifficulty: 1 | 2 | 3;
  questionCount: number;
}

export const useSessionHistory = () => {
  const [sessions, setSessions] = useState<QuizSession[]>(() => {
    const savedSessions = localStorage.getItem('quiz-sessions');
    return savedSessions ? JSON.parse(savedSessions) : [];
  });
  
  const saveSession = useCallback((
    results: QuizResults,
    answeredQuestions: AnsweredQuestion[],
    selectedTopics: string[],
    initialDifficulty: 1 | 2 | 3,
    questionCount: number
  ) => {
    const newSession: QuizSession = {
      id: uuidv4(),
      date: new Date().toISOString(),
      results,
      answeredQuestions,
      selectedTopics,
      initialDifficulty,
      questionCount
    };
    
    const updatedSessions = [newSession, ...sessions];
    localStorage.setItem('quiz-sessions', JSON.stringify(updatedSessions));
    setSessions(updatedSessions);
    
    return newSession;
  }, [sessions]);
  
  const getSession = useCallback((sessionId: string) => {
    return sessions.find(s => s.id === sessionId) || null;
  }, [sessions]);

  const deleteSession = useCallback((sessionId: string) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem('quiz-sessions', JSON.stringify(updatedSessions));
    setSessions(updatedSessions);
  }, [sessions]);
  
  const clearHistory = useCallback(() => {
    localStorage.removeItem('quiz-sessions');
    setSessions([]);
  }, []);

  // Add a method to get session summaries for the table display
  const getSessionSummaries = useCallback((): QuizSessionSummary[] => {
    return sessions.map(session => {
      const difficultyMap = {
        1: 'Easy',
        2: 'Medium',
        3: 'Hard'
      };
      
      return {
        id: session.id,
        date: session.date,
        scorePercentage: session.results.score,
        correctAnswers: session.results.correctAnswers,
        totalQuestions: session.results.questionsAttempted,
        timeSpent: session.results.timeSpent || 0,
        difficulty: difficultyMap[session.initialDifficulty],
        topics: session.selectedTopics
      };
    });
  }, [sessions]);
  
  return {
    sessions,
    saveSession,
    getSession,
    deleteSession,
    clearHistory,
    getSessionSummaries
  };
};
