
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface ReviewCompleteProps {
  restartReview: () => void;
  totalCards: number;
}

const ReviewComplete: React.FC<ReviewCompleteProps> = ({ restartReview, totalCards }) => {
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="flex justify-center">
          <CheckCircle className="text-green-500 h-12 w-12 mb-2" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-2xl font-bold mb-2">Review Complete!</h2>
        <p className="text-muted-foreground mb-6">
          You've successfully reviewed {totalCards} {totalCards === 1 ? 'card' : 'cards'}.
        </p>
        <Button onClick={restartReview}>
          Start Another Review
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReviewComplete;
