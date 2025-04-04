
import React from 'react';
import { Button } from '@/components/ui/button';
import { Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const TimerButton: React.FC = () => {
  const location = useLocation();
  const isActive = location.pathname === '/study-timer';
  
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      asChild
      className="gap-2"
    >
      <Link to="/study-timer">
        <Timer className="h-4 w-4" />
        <span className="hidden md:inline">Study Timer</span>
      </Link>
    </Button>
  );
};

export default TimerButton;
