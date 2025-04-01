
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ReviewLoading: React.FC = () => {
  return (
    <Card>
      <CardContent className="flex justify-center items-center p-12">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Loading flashcards...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewLoading;
