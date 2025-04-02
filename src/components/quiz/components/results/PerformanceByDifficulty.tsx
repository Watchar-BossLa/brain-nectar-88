
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { PerformanceByDifficultyProps } from './types';

const PerformanceByDifficulty: React.FC<PerformanceByDifficultyProps> = ({ difficulties }) => {
  return (
    <div className="space-y-3">
      {Object.entries(difficulties)
        .filter(([_, { total }]) => total > 0)
        .map(([difficulty, { correct, total }]) => {
          const percentage = Math.round((correct / total) * 100);
          return (
            <div key={difficulty} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">{difficulty}</span>
                <span className="text-sm">{correct} / {total} ({percentage}%)</span>
              </div>
              <Progress 
                value={percentage}
                className="h-2" 
                indicatorClassName={
                  difficulty === 'Easy' ? "bg-green-500" : 
                  difficulty === 'Medium' ? "bg-amber-500" : "bg-red-500"
                }
              />
            </div>
          );
        })}
    </div>
  );
};

export default PerformanceByDifficulty;
