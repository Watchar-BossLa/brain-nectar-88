
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { Flashcard } from '@/types/flashcards';

interface SpacedRepetitionCardProps {
  flashcard: Flashcard;
  onComplete?: () => void;
  onUpdateStats?: () => void;
}

const SpacedRepetitionCard: React.FC<SpacedRepetitionCardProps> = ({
  flashcard,
  onComplete,
  onUpdateStats,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDifficultyRating = async (rating: number) => {
    try {
      // Make API calls or update state here
      setFeedbackGiven(true);
      
      // Call the onComplete prop if provided
      if (onComplete) {
        onComplete();
      }
      
      // Call onUpdateStats prop if provided
      if (onUpdateStats) {
        onUpdateStats();
      }
    } catch (error) {
      console.error('Error submitting difficulty rating:', error);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
          <span>{isFlipped ? "Answer" : "Question"}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="min-h-[200px]">
        {/* Card content */}
        <div 
          className="flex items-center justify-center h-[200px] cursor-pointer"
          onClick={handleFlip}
        >
          <p className="text-center text-lg">
            {isFlipped ? flashcard.back_content || flashcard.back : flashcard.front_content || flashcard.front}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col items-stretch">
        {!isFlipped ? (
          <Button 
            className="w-full"
            onClick={handleFlip}
          >
            Show Answer
          </Button>
        ) : (
          !feedbackGiven && (
            <div className="w-full space-y-2">
              <p className="text-sm text-center mb-2">How well did you know this?</p>
              <div className="grid grid-cols-5 gap-2">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDifficultyRating(1)}
                >
                  1 - Forgot
                </Button>
                <Button 
                  variant="outline" 
                  className="border-red-200 hover:bg-red-50 hover:text-red-700" 
                  size="sm"
                  onClick={() => handleDifficultyRating(2)}
                >
                  2 - Hard
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDifficultyRating(3)}
                >
                  3 - Good
                </Button>
                <Button 
                  variant="outline" 
                  className="border-green-200 hover:bg-green-50 hover:text-green-700" 
                  size="sm"
                  onClick={() => handleDifficultyRating(4)}
                >
                  4 - Easy
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => handleDifficultyRating(5)}
                >
                  5 - Perfect
                </Button>
              </div>
            </div>
          )
        )}
      </CardFooter>
    </Card>
  );
};

export default SpacedRepetitionCard;
