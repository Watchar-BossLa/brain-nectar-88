
import { useCallback, useEffect, useState } from 'react';
import { QuizSession, QuizSessionSummary } from '@/types/quiz-session';
import { QuizResults, AnsweredQuestion } from '@/types/quiz';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

const STORAGE_KEY = 'study-bee-quiz-sessions';

export function useSessionHistory() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<QuizSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Load sessions from local storage on component mount
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem(STORAGE_KEY);
      if (savedSessions) {
        setSessions(JSON.parse(savedSessions));
      }
    } catch (error) {
      console.error('Failed to load quiz sessions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load quiz history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Save a new quiz session
  const saveSession = useCallback(
    (
      results: QuizResults,
      answeredQuestions: AnsweredQuestion[],
      selectedTopics: string[],
      initialDifficulty: 1 | 2 | 3,
      questionCount: number
    ) => {
      try {
        const newSession: QuizSession = {
          id: uuidv4(),
          date: new Date().toISOString(),
          results,
          answeredQuestions,
          selectedTopics,
          initialDifficulty,
          questionCount,
        };

        const updatedSessions = [newSession, ...sessions];
        setSessions(updatedSessions);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
        
        return newSession.id;
      } catch (error) {
        console.error('Failed to save quiz session:', error);
        toast({
          title: 'Error',
          description: 'Failed to save quiz results',
          variant: 'destructive',
        });
        return null;
      }
    },
    [sessions, toast]
  );

  // Get a specific session by ID
  const getSession = useCallback(
    (id: string) => {
      return sessions.find(session => session.id === id) || null;
    },
    [sessions]
  );

  // Delete a session
  const deleteSession = useCallback(
    (id: string) => {
      try {
        const updatedSessions = sessions.filter(session => session.id !== id);
        setSessions(updatedSessions);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
        toast({
          title: 'Success',
          description: 'Quiz session deleted successfully',
        });
      } catch (error) {
        console.error('Failed to delete quiz session:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete quiz session',
          variant: 'destructive',
        });
      }
    },
    [sessions, toast]
  );

  // Get all sessions as summaries
  const getSessionSummaries = useCallback((): QuizSessionSummary[] => {
    return sessions.map(session => ({
      id: session.id,
      date: session.date,
      scorePercentage: Math.round(
        (session.results.correctAnswers / session.results.questionsAttempted) * 100
      ),
      correctAnswers: session.results.correctAnswers,
      totalQuestions: session.results.questionsAttempted,
      timeSpent: session.results.timeSpent,
      difficulty: ['Easy', 'Medium', 'Hard'][session.initialDifficulty - 1],
      topics: session.selectedTopics,
    }));
  }, [sessions]);

  // Clear all history
  const clearHistory = useCallback(() => {
    try {
      setSessions([]);
      localStorage.removeItem(STORAGE_KEY);
      toast({
        title: 'Success',
        description: 'Quiz history cleared successfully',
      });
    } catch (error) {
      console.error('Failed to clear quiz history:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear quiz history',
        variant: 'destructive',
      });
    }
  }, [toast]);

  return {
    sessions,
    loading,
    saveSession,
    getSession,
    deleteSession,
    getSessionSummaries,
    clearHistory,
  };
}
