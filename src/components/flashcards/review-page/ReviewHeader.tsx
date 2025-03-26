
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeftIcon } from 'lucide-react';

interface ReviewHeaderProps {
  reviewsCompleted: number;
  totalToReview: number;
}

const ReviewHeader: React.FC<ReviewHeaderProps> = ({ 
  reviewsCompleted, 
  totalToReview 
}) => {
  const navigate = useNavigate();
  const progressPercentage = Math.round((reviewsCompleted / totalToReview) * 100);
  
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Flashcard Review</h1>
          <p className="text-muted-foreground">
            Reviewing {reviewsCompleted} of {totalToReview} cards
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/flashcards')}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to flashcards
        </Button>
      </div>
      
      <Progress value={progressPercentage} className="mb-8 h-2" />
    </>
  );
};

export default ReviewHeader;
