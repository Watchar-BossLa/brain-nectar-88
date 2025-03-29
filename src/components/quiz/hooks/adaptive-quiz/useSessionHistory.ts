
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { QuizResults, AnsweredQuestion } from '../../types';

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
  
  const clearHistory = useCallback(() => {
    localStorage.removeItem('quiz-sessions');
    setSessions([]);
  }, []);
  
  return {
    sessions,
    saveSession,
    getSession,
    clearHistory
  };
};
