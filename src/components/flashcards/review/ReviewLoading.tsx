import React from 'react';
import { ReviewLoadingProps } from '@/types/components';
import { Loader2 } from 'lucide-react';

const ReviewLoading: React.FC<ReviewLoadingProps> = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Loading flashcards...</p>
    </div>
  );
};

export default ReviewLoading;
