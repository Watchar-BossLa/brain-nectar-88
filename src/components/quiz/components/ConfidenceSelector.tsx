
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ThumbsUp, 
  ThumbsDown,
  ShieldQuestion, 
  ShieldCheck
} from 'lucide-react';

interface ConfidenceSelectorProps {
  selected: number;
  onChange: (confidence: number) => void;
  disabled?: boolean;
}

const ConfidenceSelector: React.FC<ConfidenceSelectorProps> = ({
  selected,
  onChange,
  disabled = false
}) => {
  const levels = [
    { value: 0.25, label: 'Not Sure', icon: <ShieldQuestion className="h-4 w-4" /> },
    { value: 0.5, label: 'Somewhat', icon: <ThumbsDown className="h-4 w-4" /> },
    { value: 0.75, label: 'Confident', icon: <ThumbsUp className="h-4 w-4" /> },
    { value: 1.0, label: 'Very Sure', icon: <ShieldCheck className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">How confident are you about your answer?</p>
      <div className="flex flex-wrap gap-2">
        {levels.map((level) => (
          <Button
            key={level.value}
            size="sm"
            variant={selected === level.value ? "default" : "outline"}
            onClick={() => onChange(level.value)}
            disabled={disabled}
            className="flex items-center gap-1"
          >
            {level.icon}
            {level.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ConfidenceSelector;
