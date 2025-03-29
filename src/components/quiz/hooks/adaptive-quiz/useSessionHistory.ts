
import { useState, useCallback } from 'react';
import { QuizResults, AnsweredQuestion } from '../../types';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

export function useSessionHistory() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<any[]>([]);
  
  // Save a completed quiz session to history
  const saveSession = useCallback((
    results: QuizResults,
    answeredQuestions: AnsweredQuestion[],
    topics: string[],
    difficulty: number,
    totalQuestions: number
  ) => {
    const sessionId = uuidv4();
    const correctStreak = answeredQuestions
      .filter(q => q.isCorrect)
      .reduce((max, _, i, arr) => {
        // Count consecutive correct answers
        let count = 1;
        for (let j = i - 1; j >= 0 && arr[j].isCorrect; j--) {
          count++;
        }
        return Math.max(max, count);
      }, 0);
      
    const session = {
      id: sessionId,
      date: new Date().toISOString(),
      score: results.correctAnswers / results.questionsAttempted * 100,
      totalQuestions,
      difficulty,
      correctStreak,
      topics,
      answeredQuestions,
      results
    };
    
    // Store in local state (in a real app, this would be saved to a database)
    setSessions(prev => [session, ...prev]);
    
    // Display success notification
    toast({
      title: "Session saved",
      description: `Quiz results saved to your history.`,
      duration: 3000,
    });
    
    return sessionId;
  }, [toast]);
  
  // Get a specific session by ID
  const getSession = useCallback((sessionId: string) => {
    return sessions.find(session => session.id === sessionId) || null;
  }, [sessions]);
  
  // Get all sessions
  const getAllSessions = useCallback(() => {
    return sessions;
  }, [sessions]);
  
  return {
    saveSession,
    getSession,
    getAllSessions,
    sessions
  };
}
