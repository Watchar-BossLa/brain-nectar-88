
import React from 'react';
import { ReviewHeaderProps } from '@/types/components/flashcard';
import { Progress } from '@/components/ui/progress';

const ReviewHeader: React.FC<ReviewHeaderProps> = ({ 
  reviewsCompleted, 
  totalToReview 
}) => {
  const progress = totalToReview > 0 
    ? Math.round((reviewsCompleted / totalToReview) * 100) 
    : 0;

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-2">Flashcard Review</h1>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">
          Progress: {reviewsCompleted} of {totalToReview} cards
        </span>
        <span className="text-sm font-medium">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default ReviewHeader;
