
import React from 'react';
import { Progress } from "@/components/ui/progress";

export interface PerformanceByDifficultyProps {
  difficulties?: Record<string, { correct: number; total: number }>;
  difficultyStats?: Record<number, { correct: number; total: number }>; // For backwards compatibility
}

const PerformanceByDifficulty: React.FC<PerformanceByDifficultyProps> = ({ difficulties, difficultyStats }) => {
  // Use either difficulties or difficultyStats, preferring difficulties if both are provided
  const statsToRender = difficulties || 
    // Convert number keys to string if using difficultyStats
    (difficultyStats ? Object.entries(difficultyStats).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, { correct: number; total: number }>) : {});
  
  return (
    <div className="space-y-3">
      {Object.entries(statsToRender)
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
              />
            </div>
          );
        })}
    </div>
  );
};

export default PerformanceByDifficulty;
