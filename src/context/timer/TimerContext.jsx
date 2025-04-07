import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth/AuthContext';
import * as timerService from '@/services/timerService';

/**
 * @typedef {import('../../types/components/timer').TimerContextType} TimerContextType
 * @typedef {import('../../types/components/timer').TimerSession} TimerSession
 */

/**
 * Timer context
 * @type {React.Context<TimerContextType|undefined>}
 */
const TimerContext = createContext(undefined);

/**
 * Timer provider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} Timer provider component
 */
export const TimerProvider = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Timer state
  const [duration, setDuration] = useState(25);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  
  // Stats
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionsToday, setSessionsToday] = useState(0);
  const [totalMinutesToday, setTotalMinutesToday] = useState(0);
  const [sessionsThisWeek, setSessionsThisWeek] = useState(0);
  const [totalMinutesThisWeek, setTotalMinutesThisWeek] = useState(0);
  const [sessionsThisMonth, setSessionsThisMonth] = useState(0);
  const [totalMinutesThisMonth, setTotalMinutesThisMonth] = useState(0);
  const [recentSessions, setRecentSessions] = useState([]);
  
  /**
   * Load timer stats
   * @returns {Promise<void>}
   */
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
      setError(err);
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
    let interval = null;
    
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
  
  /**
   * Set custom duration
   * @param {number} minutes - Duration in minutes
   */
  const handleSetDuration = useCallback((minutes) => {
    if (isRunning) return;
    setDuration(minutes);
    setTimeRemaining(minutes * 60);
  }, [isRunning]);
  
  /**
   * Start timer
   * @returns {Promise<void>}
   */
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
  
  /**
   * Pause timer
   */
  const pauseTimer = useCallback(() => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
    }
  }, [isRunning, isPaused]);
  
  /**
   * Resume timer
   */
  const resumeTimer = useCallback(() => {
    if (isRunning && isPaused) {
      setIsPaused(false);
    }
  }, [isRunning, isPaused]);
  
  /**
   * Reset timer
   */
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(duration * 60);
    setCurrentSessionId(null);
  }, [duration]);
  
  /**
   * Complete session
   * @returns {Promise<void>}
   */
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
  
  /** @type {TimerContextType} */
  const value = {
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

/**
 * Hook for accessing timer context
 * @returns {TimerContextType} Timer context
 */
export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
