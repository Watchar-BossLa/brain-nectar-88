
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { ScoreSummaryProps } from './types';

const ScoreSummary: React.FC<ScoreSummaryProps> = ({ score, correctCount, totalCount }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">{score}%</h3>
          <p className="text-sm text-muted-foreground">
            {correctCount} correct out of {totalCount} questions
          </p>
        </div>
        <div className="text-sm font-medium">
          {score >= 80 ? 'Excellent!' : 
           score >= 60 ? 'Good work!' : 
           score >= 40 ? 'Keep practicing' : 'Needs improvement'}
        </div>
      </div>
      <Progress value={score} className="h-2" />
    </div>
  );
};

export default ScoreSummary;
