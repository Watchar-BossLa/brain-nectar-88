
import React from 'react';
import { Timer } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const MainLayoutTimerButton: React.FC = () => {
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
    </NavLink>
  );
};

export default MainLayoutTimerButton;
