
import React from 'react';
import { Clock, CheckCircle, XCircle, SkipForward } from 'lucide-react';

interface ScoreSummaryProps {
  scorePercentage?: number;
  correctAnswers?: number;
  questionsAttempted?: number;
  incorrectAnswers?: number;
  skippedQuestions?: number;
  timeInMinutes?: number;
  timeInSeconds?: number;
  // For backward compatibility
  score?: number;
  correctCount?: number;
  totalCount?: number;
}

const ScoreSummary: React.FC<ScoreSummaryProps> = ({
  scorePercentage,
  correctAnswers,
  questionsAttempted,
  incorrectAnswers,
  skippedQuestions,
  timeInMinutes,
  timeInSeconds,
  // Handle backwards compatibility
  score,
  correctCount,
  totalCount
}) => {
  // Determine which values to use (prefer new props but fall back to old ones)
  const finalScore = scorePercentage ?? score ?? 0;
  const finalCorrect = correctAnswers ?? correctCount ?? 0;
  const finalTotal = questionsAttempted ?? totalCount ?? 0;
  
  const accuracyColor = 
    finalScore >= 80 ? 'text-green-500' :
    finalScore >= 60 ? 'text-amber-500' : 'text-red-500';
    
  return (
    <>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className={`text-4xl font-bold ${accuracyColor}`}>{finalScore}%</span>
          <span className="text-lg text-muted-foreground">
            ({finalCorrect}/{finalTotal})
          </span>
        </div>
        {(timeInMinutes !== undefined && timeInSeconds !== undefined) && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Completed in {timeInMinutes}m {timeInSeconds}s</span>
          </div>
        )}
      </div>
        
      {(incorrectAnswers !== undefined && skippedQuestions !== undefined) && (
        <div className="grid grid-cols-3 gap-4 py-2">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-green-500">
              <CheckCircle className="h-5 w-5" />
              <span className="text-lg font-semibold">{finalCorrect}</span>
            </div>
            <span className="text-xs text-muted-foreground">Correct</span>
          </div>
            
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-red-500">
              <XCircle className="h-5 w-5" />
              <span className="text-lg font-semibold">{incorrectAnswers}</span>
            </div>
            <span className="text-xs text-muted-foreground">Incorrect</span>
          </div>
            
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-muted-foreground">
              <SkipForward className="h-5 w-5" />
              <span className="text-lg font-semibold">{skippedQuestions}</span>
            </div>
            <span className="text-xs text-muted-foreground">Skipped</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ScoreSummary;
