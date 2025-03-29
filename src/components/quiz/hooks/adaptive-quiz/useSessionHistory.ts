
import { useState, useCallback } from 'react';
import { QuizResults, AnsweredQuestion } from '../../types';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

export type QuizSessionSummary = {
  id: string;
  date: string;
  score: number;
  scorePercentage: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  difficulty: string | number;
  topics: string[];
}

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
      score: results.correctAnswers,
      scorePercentage: results.correctAnswers / results.questionsAttempted * 100,
      totalQuestions,
      correctAnswers: results.correctAnswers,
      timeSpent: results.timeSpent || 0,
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
  
  // Get session summaries (used by SessionHistoryTab)
  const getSessionSummaries = useCallback(() => {
    return sessions.map(session => ({
      id: session.id,
      date: session.date,
      score: session.score,
      scorePercentage: session.scorePercentage,
      totalQuestions: session.totalQuestions,
      correctAnswers: session.correctAnswers,
      timeSpent: session.timeSpent || 0,
      difficulty: getDifficultyLabel(session.difficulty),
      topics: session.topics
    }));
  }, [sessions]);
  
  // Helper function to convert numeric difficulty to label
  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty === 1) return 'Easy';
    if (difficulty === 2) return 'Medium';
    return 'Hard';
  };
  
  // Delete a session by ID
  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    toast({
      title: "Session deleted",
      description: "Quiz session has been removed from your history.",
      duration: 2000,
    });
  }, [toast]);
  
  // Clear all history
  const clearHistory = useCallback(() => {
    setSessions([]);
    toast({
      title: "History cleared",
      description: "All quiz history has been removed.",
      duration: 2000,
    });
  }, [toast]);
  
  return {
    saveSession,
    getSession,
    getAllSessions,
    getSessionSummaries,
    deleteSession,
    clearHistory,
    sessions
  };
}
