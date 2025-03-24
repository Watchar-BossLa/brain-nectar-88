
import React from 'react';
import { Card, CardHeader, CardDescription, CardTitle, CardFooter, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, BrainCircuit } from 'lucide-react';

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
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-yellow-600" />
          <CardTitle className="text-lg">Time to review!</CardTitle>
        </div>
        <CardDescription>
          You have {dueCount} flashcard{dueCount !== 1 ? 's' : ''} due for review.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-2 text-sm text-yellow-700">
          <BrainCircuit className="h-4 w-4" />
          <span>Regular review helps strengthen your memory and improve recall.</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onStartReview} 
          className="bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Start Review Session
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReviewNotificationCard;
