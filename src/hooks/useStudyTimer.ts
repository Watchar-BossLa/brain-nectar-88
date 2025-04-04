
import { useEffect } from 'react';
import { useTimer } from '@/context/timer/TimerContext';

export const useStudyTimer = (onComplete?: () => void) => {
  const defaultTimerState = {
    duration: 25,
    isRunning: false,
    isPaused: false,
    timeRemaining: 25 * 60,
    sessionsToday: 0,
    totalMinutesToday: 0,
    sessionsThisWeek: 0,
    totalMinutesThisWeek: 0,
    sessionsThisMonth: 0,
    totalMinutesThisMonth: 0,
    setDuration: () => {},
    startTimer: () => {},
    pauseTimer: () => {},
    resumeTimer: () => {},
    resetTimer: () => {},
    completeSession: async () => Promise.resolve(),
    isLoading: false,
    error: null,
    recentSessions: []
  };
  
  let timer;
  
  try {
    timer = useTimer();
    
    useEffect(() => {
      // Check if timer has just completed
      if (timer.timeRemaining === 0 && timer.isRunning && onComplete) {
        onComplete();
      }
    }, [timer.timeRemaining, timer.isRunning, onComplete]);
    
    return timer;
  } catch (error) {
    // Handle case where timer context isn't available
    console.warn("Timer context not available in this component tree");
    return defaultTimerState;
  }
};
