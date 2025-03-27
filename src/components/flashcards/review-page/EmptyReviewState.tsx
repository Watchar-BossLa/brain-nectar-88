
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyReviewState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container max-w-5xl py-10">
      <Card>
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-12">
          <h3 className="text-xl font-medium">No cards due for review</h3>
          <p className="text-center text-muted-foreground max-w-md">
            You don't have any flashcards due for review right now. You can create new flashcards or check back later.
          </p>
          <Button onClick={() => navigate('/flashcards')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Flashcards
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyReviewState;
