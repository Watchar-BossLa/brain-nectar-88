
import React from 'react';
import { Button } from '@/components/ui/button';
import { TimerControlsProps } from '@/types/components/timer';
import { Play, Pause, RefreshCw, TimerReset } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TimerControls: React.FC<TimerControlsProps> = ({ 
  isRunning, 
  isPaused, 
  onStart, 
  onPause, 
  onResume, 
  onReset 
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-center space-x-4">
          {!isRunning ? (
            <Button onClick={onStart} size="lg" className="px-8">
              <Play className="mr-2 h-4 w-4" />
              Start
            </Button>
          ) : isPaused ? (
            <Button onClick={onResume} size="lg" variant="secondary" className="px-8">
              <Play className="mr-2 h-4 w-4" />
              Resume
            </Button>
          ) : (
            <Button onClick={onPause} size="lg" variant="secondary" className="px-8">
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
          )}
          
          <Button 
            onClick={onReset} 
            size="lg" 
            variant="outline" 
            className="px-8"
            disabled={!isRunning && !isPaused}
          >
            <TimerReset className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimerControls;
