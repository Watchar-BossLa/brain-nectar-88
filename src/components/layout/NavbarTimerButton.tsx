
import React from 'react';
import TimerButton from '@/components/study-timer/TimerButton';
import { useTimer } from '@/context/timer/TimerContext';

const NavbarTimerButton: React.FC = () => {
  // We'll try to access the timer context, but it might not be available
  // so we'll use optional chaining to prevent errors
  let timeRemaining = null;
  let isRunning = false;
  
  try {
    const timer = useTimer();
    if (timer) {
      timeRemaining = timer.timeRemaining;
      isRunning = timer.isRunning;
    }
  } catch (error) {
    // Timer context not available
  }
  
  return (
    <TimerButton 
      timeRemaining={timeRemaining} 
      isRunning={isRunning} 
    />
  );
};

export default NavbarTimerButton;
