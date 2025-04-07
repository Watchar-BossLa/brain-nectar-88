import React from 'react';
import { Timer } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useStudyTimer } from '@/hooks/useStudyTimer';

/**
 * Timer button component for the main layout
 * @returns {React.ReactElement} Timer button component
 */
const MainLayoutTimerButton = () => {
  const timer = useStudyTimer();
  let timerInfo = null;
  
  if (timer && timer.isRunning) {
    timerInfo = (
      <span className="ml-2 text-xs font-medium bg-primary/20 px-2 py-0.5 rounded-full">
        {Math.floor(timer.timeRemaining / 60)}m
      </span>
    );
  }

  return (
    <NavLink
      to="/study-timer"
      className={({ isActive }) => 
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive 
            ? 'bg-primary/10 text-primary font-medium' 
            : 'hover:bg-muted/50'
        }`
      }
    >
      <Timer size={18} />
      <span>Study Timer</span>
      {timerInfo}
    </NavLink>
  );
};

export default MainLayoutTimerButton;
