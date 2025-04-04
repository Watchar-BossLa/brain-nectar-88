
import React from 'react';
import { Timer } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTimer } from '@/context/timer/TimerContext';

const MainLayoutTimerButton: React.FC = () => {
  // We'll try to access the timer context, but it might not be available in the sidebar
  // so we'll use optional chaining to prevent errors
  let timerInfo = null;
  
  try {
    const timer = useTimer();
    if (timer && timer.isRunning) {
      timerInfo = (
        <span className="ml-2 text-xs font-medium bg-primary/20 px-2 py-0.5 rounded-full">
          {Math.floor(timer.timeRemaining / 60)}m
        </span>
      );
    }
  } catch (error) {
    // Timer context not available, don't show timer info
    timerInfo = null;
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
