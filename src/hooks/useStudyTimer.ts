
import { useEffect } from 'react';
import { useTimer } from '@/context/timer/TimerContext';

export const useStudyTimer = (onComplete?: () => void) => {
  const timer = useTimer();
  
  useEffect(() => {
    // Check if timer has just completed
    if (timer.timeRemaining === 0 && timer.isRunning) {
      if (onComplete) onComplete();
    }
  }, [timer.timeRemaining, timer.isRunning, onComplete]);
  
  return timer;
};
