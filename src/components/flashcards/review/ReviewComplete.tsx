
import React from 'react';
import { ReviewCompleteProps } from '@/types/components';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface ReviewCompleteProps {
  flashcardsCount: number;
  retentionStats: {
    overall: number;
    improved: number;
  };
  onRestart?: () => void;
}

const ReviewComplete: React.FC<ReviewCompleteProps> = ({ 
  flashcardsCount, 
  retentionStats, 
  onRestart 
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Review Complete!</CardTitle>
        <CardDescription className="text-center">
          {flashcardsCount === 0 
            ? "You don't have any flashcards due for review right now." 
            : `You've reviewed all ${flashcardsCount} cards due today!`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {flashcardsCount > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{retentionStats.overall}%</div>
                <div className="text-sm text-muted-foreground">Overall Retention</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">+{retentionStats.improved}%</div>
                <div className="text-sm text-muted-foreground">Improved Today</div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {flashcardsCount > 0 && onRestart && (
          <Button onClick={onRestart}>Review Again</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ReviewComplete;
