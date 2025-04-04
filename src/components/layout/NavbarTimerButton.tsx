
import React from 'react';
import TimerButton from '@/components/study-timer/TimerButton';
import { useStudyTimer } from '@/hooks/useStudyTimer';

const NavbarTimerButton: React.FC = () => {
  const timer = useStudyTimer();
  
  return (
    <TimerButton 
      timeRemaining={timer.timeRemaining} 
      isRunning={timer.isRunning} 
    />
  );
};

export default NavbarTimerButton;
