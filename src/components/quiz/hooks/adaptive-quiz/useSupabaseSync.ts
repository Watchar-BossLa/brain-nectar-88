
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth/AuthContext';
import { QuizResults, AnsweredQuestion } from '@/types/quiz';
import { saveQuizSession, fetchQuizSessions, fetchQuizSessionDetails, deleteQuizSession, clearUserQuizHistory } from '../../services/quizSessionService';
import { QuizSession, QuizSessionSummary } from '@/types/quiz-session';
import { useToast } from '@/components/ui/use-toast';

export const useSupabaseSync = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<QuizSessionSummary[]>([]);

  // Fetch sessions when user changes
  useEffect(() => {
    if (user) {
      loadSessions();
    } else {
      setSessions([]);
    }
  }, [user]);

  const loadSessions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const fetchedSessions = await fetchQuizSessions(user.id);
      setSessions(fetchedSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load quiz history',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSession = async (
    results: QuizResults,
    answeredQuestions: AnsweredQuestion[],
    selectedTopics: string[],
    initialDifficulty: 1 | 2 | 3,
    questionCount: number
  ): Promise<QuizSession | null> => {
    if (!user) {
      toast({
        title: 'Not logged in',
        description: 'Please log in to save your quiz results',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const sessionId = await saveQuizSession(
        user.id,
        results,
        answeredQuestions,
        selectedTopics,
        initialDifficulty
      );

      if (!sessionId) {
        throw new Error('Failed to save session');
      }

      const newSession = await fetchQuizSessionDetails(sessionId);
      
      // Refresh the sessions list
      await loadSessions();
      
      return newSession;
    } catch (error) {
      console.error('Error saving session:', error);
      toast({
        title: 'Error',
        description: 'Failed to save quiz results',
        variant: 'destructive',
      });
      return null;
    }
  };

  const getSession = async (sessionId: string): Promise<QuizSession | null> => {
    if (!user) return null;
    
    try {
      return await fetchQuizSessionDetails(sessionId);
    } catch (error) {
      console.error('Error getting session:', error);
      toast({
        title: 'Error',
        description: 'Failed to load quiz session',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteSession = async (sessionId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const success = await deleteQuizSession(sessionId);
      if (success) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        toast({
          title: 'Success',
          description: 'Quiz session deleted',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete quiz session',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const clearHistory = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const success = await clearUserQuizHistory(user.id);
      if (success) {
        setSessions([]);
        toast({
          title: 'Success',
          description: 'Quiz history cleared',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error clearing history:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear quiz history',
        variant: 'destructive',
      });
      return false;
    }
  };

  const getSessionSummaries = (): QuizSessionSummary[] => {
    return sessions;
  };
  
  return {
    sessions,
    isLoading,
    saveSession,
    getSession,
    deleteSession,
    clearHistory,
    loadSessions,
    getSessionSummaries
  };
};
