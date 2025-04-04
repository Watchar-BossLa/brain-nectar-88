
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth/AuthContext';
import { TimerContextType, TimerSession } from '@/types/components/timer';
import * as timerService from '@/services/timerService';

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Timer state
  const [duration, setDuration] = useState<number>(25);
  const [timeRemaining, setTimeRemaining] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  // Stats
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [sessionsToday, setSessionsToday] = useState<number>(0);
  const [totalMinutesToday, setTotalMinutesToday] = useState<number>(0);
  const [sessionsThisWeek, setSessionsThisWeek] = useState<number>(0);
  const [totalMinutesThisWeek, setTotalMinutesThisWeek] = useState<number>(0);
  const [sessionsThisMonth, setSessionsThisMonth] = useState<number>(0);
  const [totalMinutesThisMonth, setTotalMinutesThisMonth] = useState<number>(0);
  const [recentSessions, setRecentSessions] = useState<TimerSession[]>([]);
  
  // Load timer stats
  const loadStats = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const stats = await timerService.getTimerSessionStats();
      
      setSessionsToday(stats.today.sessions);
      setTotalMinutesToday(stats.today.totalMinutes);
      setSessionsThisWeek(stats.week.sessions);
      setTotalMinutesThisWeek(stats.week.totalMinutes);
      setSessionsThisMonth(stats.month.sessions);
      setTotalMinutesThisMonth(stats.month.totalMinutes);
      setRecentSessions(stats.recentSessions);
      setError(null);
    } catch (err) {
      console.error('Failed to load timer stats:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Load stats on mount and when user changes
  useEffect(() => {
    loadStats();
  }, [loadStats]);
  
  // Timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isRunning) {
      completeSession();
      toast({
        title: "Time's up!",
        description: `You've completed a ${duration} minute study session.`,
      });
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused, timeRemaining]);
  
  // Set custom duration
  const handleSetDuration = useCallback((minutes: number) => {
    if (isRunning) return;
    setDuration(minutes);
    setTimeRemaining(minutes * 60);
  }, [isRunning]);
  
  // Start timer
  const startTimer = useCallback(async () => {
    if (isRunning || user === null) return;
    
    try {
      const session = await timerService.createTimerSession(duration);
      setCurrentSessionId(session.id);
      setIsRunning(true);
      setIsPaused(false);
    } catch (err) {
      console.error('Failed to start timer session:', err);
      toast({
        title: "Couldn't start session",
        description: "There was an error starting your study session.",
        variant: "destructive",
      });
    }
  }, [isRunning, duration, user, toast]);
  
  // Pause timer
  const pauseTimer = useCallback(() => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
    }
  }, [isRunning, isPaused]);
  
  // Resume timer
  const resumeTimer = useCallback(() => {
    if (isRunning && isPaused) {
      setIsPaused(false);
    }
  }, [isRunning, isPaused]);
  
  // Reset timer
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(duration * 60);
    setCurrentSessionId(null);
  }, [duration]);
  
  // Complete session
  const completeSession = useCallback(async () => {
    if (!currentSessionId) return;
    
    try {
      await timerService.completeTimerSession(currentSessionId);
      setIsRunning(false);
      setIsPaused(false);
      setCurrentSessionId(null);
      
      // Refresh stats
      await loadStats();
      
      return Promise.resolve();
    } catch (err) {
      console.error('Failed to complete timer session:', err);
      toast({
        title: "Couldn't save session",
        description: "There was an error saving your study session.",
        variant: "destructive",
      });
      
      return Promise.reject(err);
    }
  }, [currentSessionId, loadStats, toast]);
  
  const value: TimerContextType = {
    duration,
    isRunning,
    isPaused,
    timeRemaining,
    sessionsToday,
    totalMinutesToday,
    sessionsThisWeek,
    totalMinutesThisWeek,
    sessionsThisMonth,
    totalMinutesThisMonth,
    setDuration: handleSetDuration,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    completeSession,
    isLoading,
    error,
    recentSessions
  };
  
  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
