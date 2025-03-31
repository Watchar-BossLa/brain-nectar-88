
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  // Determine progress color based on score
  const getProgressColor = () => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="text-center py-4 space-y-4">
      <div className="text-4xl font-bold flex items-center justify-center gap-2">
        <span className={getScoreColor()}>{score}%</span>
      </div>
      <Progress 
        value={score} 
        className="h-2 w-full max-w-md mx-auto"
        indicatorClassName={getProgressColor()}
      />
      <div className="text-sm text-muted-foreground">
        {score >= 80 ? 'Excellent! Keep it up!' :
         score >= 60 ? 'Good progress. Keep practicing.' :
         'More practice needed for mastery.'}
      </div>
    </div>
  );
};

export default ScoreDisplay;
