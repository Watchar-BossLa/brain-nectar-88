
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimerDurationSelectorProps } from '@/types/components/timer';

const DURATIONS = [25, 50, 75];

const TimerDurationSelector: React.FC<TimerDurationSelectorProps> = ({ 
  duration, 
  onDurationChange, 
  disabled 
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Study Duration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between space-x-2">
          {DURATIONS.map(minutes => (
            <Button
              key={minutes}
              onClick={() => onDurationChange(minutes)}
              variant={duration === minutes ? "default" : "outline"}
              className="flex-1"
              disabled={disabled}
            >
              {minutes} min
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimerDurationSelector;
