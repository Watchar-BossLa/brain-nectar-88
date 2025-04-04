
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { TimerDisplayProps } from '@/types/components/timer';
import { Card, CardContent } from '@/components/ui/card';

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeRemaining, duration }) => {
  // Convert seconds to minutes and seconds
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  
  // Calculate progress percentage
  const progressPercentage = ((duration * 60 - timeRemaining) / (duration * 60)) * 100;
  
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="text-6xl font-bold mb-4 font-mono tracking-widest">
            {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
          </div>
          
          <Progress 
            value={progressPercentage} 
            className="h-2 w-full mb-2" 
          />
          
          <p className="text-sm text-muted-foreground">
            {duration} minute session
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimerDisplay;
