
import React from 'react';
import { Card, CardHeader, CardDescription, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ReviewNotificationCardProps {
  dueCount: number;
  onStartReview: () => void;
}

const ReviewNotificationCard: React.FC<ReviewNotificationCardProps> = ({ 
  dueCount, 
  onStartReview 
}) => {
  if (dueCount === 0) return null;
  
  return (
    <Card className="mb-6 border-yellow-200 bg-yellow-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Time to review!</CardTitle>
        <CardDescription>
          You have {dueCount} flashcards due for review.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button onClick={onStartReview} className="bg-yellow-500 hover:bg-yellow-600">
          Start Review Session
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReviewNotificationCard;
