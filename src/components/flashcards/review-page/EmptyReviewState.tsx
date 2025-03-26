
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';

const EmptyReviewState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-5xl py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No flashcards to review</CardTitle>
          <CardDescription>
            You're all caught up! Check back later for more cards to review.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => navigate('/flashcards')}>
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to flashcards
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmptyReviewState;
