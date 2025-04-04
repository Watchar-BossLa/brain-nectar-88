
import React from 'react';
import { Button } from '@/components/ui/button';
import { Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

interface TimerButtonProps {
  timeRemaining?: number | null;
  isRunning?: boolean;
}

const TimerButton: React.FC<TimerButtonProps> = ({ timeRemaining, isRunning }) => {
  const location = useLocation();
  const isActive = location.pathname === '/study-timer';
  
  // Format time remaining if available
  let timeDisplay = null;
  if (isRunning && typeof timeRemaining === 'number') {
    const minutes = Math.floor(timeRemaining / 60);
    timeDisplay = (
      <span className="ml-1 text-xs bg-primary/20 px-1.5 py-0.5 rounded-full">
        {minutes}m
      </span>
    );
  }
  
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      asChild
      className="gap-1"
    >
      <Link to="/study-timer">
        <Timer className="h-4 w-4" />
        <span className="hidden md:inline">Study Timer</span>
        {timeDisplay}
      </Link>
    </Button>
  );
};

export default TimerButton;
