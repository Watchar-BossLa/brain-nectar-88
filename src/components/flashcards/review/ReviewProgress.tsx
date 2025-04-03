
import React from 'react';
import { ReviewProgressProps } from '@/types/components/flashcard';
import { Progress } from '@/components/ui/progress';

const ReviewProgress: React.FC<ReviewProgressProps> = ({
  currentIndex,
  totalCards
}) => {
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
