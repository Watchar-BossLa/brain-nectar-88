
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ReviewProgressProps {
  current: number;
  total: number;
}

const ReviewProgress: React.FC<ReviewProgressProps> = ({ current, total }) => {
  const progress = Math.round((current / total) * 100);
  
  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm mb-1">
        <span>Card {current} of {total}</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} />
    </div>
  );
};

export default ReviewProgress;
