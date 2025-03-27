
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useFlashcardReview } from '@/hooks/useFlashcardReview';
import { ThumbsUp, ThumbsDown, Lightbulb, Star, Trophy } from 'lucide-react';
import LatexRenderer from '@/components/math/LatexRendererWrapper';

interface FlashcardReviewSystemProps {
  onComplete: () => void;
}

const FlashcardReviewSystem: React.FC<FlashcardReviewSystemProps> = ({ onComplete }) => {
  const {
    currentCard,
    reviewState,
    reviewStats,
    showAnswer,
    rateCard,
    completeReview
  } = useFlashcardReview(onComplete);

  // If there's no current card, show a message
  if (!currentCard && reviewState !== 'complete') {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <h3 className="text-lg font-medium mb-2">No cards due for review</h3>
          <p className="text-muted-foreground text-center">
            You've caught up with all your reviews. Check back later.
          </p>
          <Button onClick={completeReview} className="mt-4">
            Return to Flashcards
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show review completion screen
  if (reviewState === 'complete') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Review Session Complete
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-lg">
            Great job! You've completed your review session.
          </p>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-3 text-center">
              <p className="text-sm text-muted-foreground">Easy</p>
              <p className="text-2xl font-bold text-green-600">{reviewStats.easy}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-center">
              <p className="text-sm text-muted-foreground">Medium</p>
              <p className="text-2xl font-bold text-yellow-600">{reviewStats.medium}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-center">
              <p className="text-sm text-muted-foreground">Hard</p>
              <p className="text-2xl font-bold text-red-600">{reviewStats.hard}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-1">Average Rating</p>
            <Progress value={reviewStats.averageRating * 20} className="h-2" />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>Hard</span>
              <span>Easy</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={completeReview} className="w-full">
            Return to Flashcards
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Check if content contains LaTeX code
  const hasLatex = (content: string) => {
    return content.includes('$$') || content.includes('$');
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/20">
        <div className="flex justify-between items-center">
          <CardTitle>Flashcard Review</CardTitle>
          <p className="text-sm text-muted-foreground">
            Cards reviewed: {reviewStats.totalReviewed}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="min-h-[200px] flex flex-col justify-center">
          {/* Front side or question */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Question</h3>
            <div className="p-4 border rounded-md bg-card">
              {hasLatex(currentCard.front) ? (
                <LatexRenderer latex={currentCard.front} />
              ) : (
                <p className="text-lg">{currentCard.front}</p>
              )}
            </div>
          </div>
          
          {/* Back side or answer (shown only after clicking "Show Answer") */}
          {reviewState === 'answering' && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Answer</h3>
              <div className="p-4 border rounded-md bg-card">
                {hasLatex(currentCard.back) ? (
                  <LatexRenderer latex={currentCard.back} />
                ) : (
                  <p className="text-lg">{currentCard.back}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-4 bg-muted/10">
        {reviewState === 'reviewing' ? (
          <Button onClick={showAnswer} className="w-full">
            <Lightbulb className="mr-2 h-4 w-4" />
            Show Answer
          </Button>
        ) : (
          <div className="w-full space-y-4">
            <p className="text-sm text-center text-muted-foreground mb-2">
              How well did you know this?
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" onClick={() => rateCard(1)} className="flex flex-col py-3">
                <ThumbsDown className="h-5 w-5 text-red-500 mb-1" />
                <span className="text-xs">Hard</span>
              </Button>
              <Button variant="outline" onClick={() => rateCard(3)} className="flex flex-col py-3">
                <Star className="h-5 w-5 text-yellow-500 mb-1" />
                <span className="text-xs">Medium</span>
              </Button>
              <Button variant="outline" onClick={() => rateCard(5)} className="flex flex-col py-3">
                <ThumbsUp className="h-5 w-5 text-green-500 mb-1" />
                <span className="text-xs">Easy</span>
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default FlashcardReviewSystem;
