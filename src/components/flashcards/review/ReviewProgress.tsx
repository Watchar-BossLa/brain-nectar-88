
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ReviewProgressProps {
  currentIndex: number;
  totalCards: number;
}

const ReviewProgress: React.FC<ReviewProgressProps> = ({ currentIndex, totalCards }) => {
  const progress = Math.round(((currentIndex) / totalCards) * 100);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {totalCards}
        </div>
        <div className="text-sm font-medium">{progress}% Complete</div>
      </div>
      
      <Progress value={progress} className="h-2" />
    </>
  );
};

export default ReviewProgress;
