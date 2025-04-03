
import React from 'react';
import { MemoryRetentionIndicatorProps } from '@/types/components/flashcard';
import { Brain } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const MemoryRetentionIndicator: React.FC<MemoryRetentionIndicatorProps> = ({ 
  retention,
  repetitionCount
}) => {
  const getRetentionColor = (retention: number): string => {
    if (retention > 0.8) return "text-emerald-500";
    if (retention > 0.6) return "text-green-500";
    if (retention > 0.4) return "text-yellow-500";
    if (retention > 0.2) return "text-orange-500";
    return "text-red-500";
  };

  if (repetitionCount <= 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-1">
        <Brain size={16} className="text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Estimated Retention:</span>
        <span className={`text-sm font-medium ${getRetentionColor(retention)}`}>
          {Math.round(retention * 100)}%
        </span>
      </div>
      <Progress value={retention * 100} className="h-1.5" />
    </div>
  );
};
