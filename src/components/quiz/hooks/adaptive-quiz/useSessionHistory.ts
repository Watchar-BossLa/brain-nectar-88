import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { QuizResults, AnsweredQuestion } from '../../types';
import { QuizSession, QuizSessionSummary } from '@/types/quiz-session';
import { useAuth } from '@/context/auth/AuthContext';
import { useSupabaseSync } from './useSupabaseSync';

export const useSessionHistory = () => {
  const { user } = useAuth();
  const supabaseSync = useSupabaseSync();
  const [localSessions, setLocalSessions] = useState<QuizSession[]>(() => {
    const savedSessions = localStorage.getItem('quiz-sessions');
    return savedSessions ? JSON.parse(savedSessions) : [];
  });
  
  const saveSession = useCallback(async (
    results: QuizResults,
    answeredQuestions: AnsweredQuestion[],
    selectedTopics: string[],
    initialDifficulty: 1 | 2 | 3,
    questionCount: number
  ) => {
    if (user) {
      const savedSession = await supabaseSync.saveSession(
        results,
        answeredQuestions,
        selectedTopics,
        initialDifficulty,
        questionCount
      );
      return savedSession;
    } 
    
    const newSession: QuizSession = {
      id: uuidv4(),
      date: new Date().toISOString(),
      results,
      answeredQuestions,
      selectedTopics,
      initialDifficulty,
      questionCount
    };
    
    const updatedSessions = [newSession, ...localSessions];
    localStorage.setItem('quiz-sessions', JSON.stringify(updatedSessions));
    setLocalSessions(updatedSessions);
    
    return newSession;
  }, [localSessions, user, supabaseSync]);
  
  const getSession = useCallback(async (sessionId: string) => {
    if (user) {
      const supabaseSession = await supabaseSync.getSession(sessionId);
      if (supabaseSession) {
        return supabaseSession;
      }
    }
    
    return localSessions.find(s => s.id === sessionId) || null;
  }, [localSessions, user, supabaseSync]);

  const deleteSession = useCallback(async (sessionId: string) => {
    if (user) {
      const success = await supabaseSync.deleteSession(sessionId);
      if (success) return true;
    }
    
    const updatedSessions = localSessions.filter(s => s.id !== sessionId);
    localStorage.setItem('quiz-sessions', JSON.stringify(updatedSessions));
    setLocalSessions(updatedSessions);
    return true;
  }, [localSessions, user, supabaseSync]);
  
  const clearHistory = useCallback(async () => {
    if (user) {
      const success = await supabaseSync.clearHistory();
      if (success) return;
    }
    
    localStorage.removeItem('quiz-sessions');
    setLocalSessions([]);
  }, [user, supabaseSync]);

  const getSessionSummaries = useCallback((): QuizSessionSummary[] => {
    if (user) {
      return supabaseSync.getSessionSummaries();
    }
    
    return localSessions.map(session => {
      const scorePercentage = Math.round((session.results.correctAnswers / session.results.questionsAttempted) * 100);
      const difficultyMap = {
        1: 'Easy',
        2: 'Medium',
        3: 'Hard'
      };
      
      return {
        id: session.id,
        date: session.date,
        scorePercentage,
        correctAnswers: session.results.correctAnswers,
        totalQuestions: session.results.questionsAttempted,
        timeSpent: session.results.timeSpent || 0,
        difficulty: difficultyMap[session.initialDifficulty],
        topics: session.selectedTopics
      };
    });
  }, [localSessions, user, supabaseSync]);
  
  useEffect(() => {
    if (user) {
      supabaseSync.loadSessions();
    }
  }, [user]);
  
  return {
    sessions: localSessions,
    saveSession,
    getSession,
    deleteSession,
    clearHistory,
    getSessionSummaries
  };
};
