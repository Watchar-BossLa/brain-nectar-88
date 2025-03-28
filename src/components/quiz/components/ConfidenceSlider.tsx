
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ShieldQuestion, Lightbulb, Brain } from 'lucide-react';

interface ConfidenceSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const ConfidenceSlider: React.FC<ConfidenceSliderProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => {
  const handleValueChange = (values: number[]) => {
    onChange(values[0]);
  };
  
  return (
    <div className="space-y-4 my-4">
      <div className="flex justify-between items-center">
        <Label htmlFor="confidence" className="text-sm font-medium">
          How confident are you in your answer?
        </Label>
        <div className="bg-muted px-2 py-1 rounded text-xs font-medium">
          {value <= 0.33 ? 'Not Sure' : value <= 0.66 ? 'Somewhat Sure' : 'Very Sure'}
        </div>
      </div>
      
      <div className="relative pt-5 pb-1">
        <Slider
          id="confidence"
          disabled={disabled}
          defaultValue={[0.5]}
          value={[value]}
          max={1}
          step={0.01}
          onValueChange={handleValueChange}
          className="my-4"
        />
        
        <div className="absolute top-0 left-0 flex justify-between w-full">
          <div className="flex flex-col items-center">
            <ShieldQuestion className="h-4 w-4 text-red-500" />
            <span className="text-xs text-muted-foreground">Unsure</span>
          </div>
          <div className="flex flex-col items-center">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <span className="text-xs text-muted-foreground">Maybe</span>
          </div>
          <div className="flex flex-col items-center">
            <Brain className="h-4 w-4 text-green-500" />
            <span className="text-xs text-muted-foreground">Confident</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceSlider;
