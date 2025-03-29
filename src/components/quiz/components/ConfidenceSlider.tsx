
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  ThumbsDown, 
  ThumbsUp,
  HelpCircle,
  CheckCircle
} from 'lucide-react';

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
  // Get confidence level text
  const getConfidenceText = () => {
    if (value <= 0.25) return "Not confident at all";
    if (value <= 0.5) return "Somewhat uncertain";
    if (value <= 0.75) return "Fairly confident";
    return "Very confident";
  };
  
  // Get confidence icon
  const ConfidenceIcon = () => {
    if (value <= 0.25) return <HelpCircle className="h-5 w-5 text-red-400" />;
    if (value <= 0.5) return <Brain className="h-5 w-5 text-amber-400" />;
    if (value <= 0.75) return <ThumbsUp className="h-5 w-5 text-blue-400" />;
    return <CheckCircle className="h-5 w-5 text-green-400" />;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">How confident are you?</div>
        <div className="flex items-center gap-1.5 text-sm">
          <ConfidenceIcon />
          <span>{getConfidenceText()}</span>
        </div>
      </div>
      
      <Slider
        value={[value * 100]}
        min={0}
        max={100}
        step={25}
        onValueChange={values => onChange(values[0] / 100)}
        disabled={disabled}
        className="w-full"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground pt-1">
        <div className="flex items-center gap-1">
          <ThumbsDown className="h-3 w-3" />
          <span>Not confident</span>
        </div>
        <div className="flex items-center gap-1">
          <ThumbsUp className="h-3 w-3" />
          <span>Very confident</span>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceSlider;
