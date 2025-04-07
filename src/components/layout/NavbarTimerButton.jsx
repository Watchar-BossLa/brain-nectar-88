import React from 'react';
import TimerButton from '@/components/study-timer/TimerButton';
import { useStudyTimer } from '@/hooks/useStudyTimer';

/**
 * Timer button component for the navbar
 * @returns {React.ReactElement} Timer button component
 */
const NavbarTimerButton = () => {
  const timer = useStudyTimer();
  
  return (
    <TimerButton 
      timeRemaining={timer.timeRemaining} 
      isRunning={timer.isRunning} 
    />
  );
};

export default NavbarTimerButton;
