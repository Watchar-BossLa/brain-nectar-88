
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface ReviewCardProps {
  flashcard: any;
  nextCard: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ flashcard, nextCard }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  
  const handleShowAnswer = () => {
    setShowAnswer(true);
  };
  
  const handleRate = (score: number) => {
    setRating(score);
    setTimeout(() => {
      nextCard();
      setShowAnswer(false);
      setRating(null);
    }, 500);
  };
  
  return (
    <div className="min-h-[300px]">
      <Card className="h-full">
        <CardContent className="pt-6 h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center mb-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">
                {showAnswer ? 'Answer' : 'Question'}
              </h3>
              <div className="text-xl">
                {showAnswer 
                  ? (flashcard.back_content || flashcard.back) 
                  : (flashcard.front_content || flashcard.front)}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t p-4">
          {!showAnswer ? (
            <Button onClick={handleShowAnswer} className="w-full">
              Show Answer
            </Button>
          ) : (
            <div className="w-full">
              <p className="text-sm text-center mb-2">How well did you know this?</p>
              <div className="flex justify-between gap-2">
                <Button 
                  variant="outline" 
                  className={rating === 1 ? "bg-red-100" : ""}
                  onClick={() => handleRate(1)}
                >
                  Forgot
                </Button>
                <Button 
                  variant="outline"
                  className={rating === 2 ? "bg-orange-100" : ""} 
                  onClick={() => handleRate(2)}
                >
                  Hard
                </Button>
                <Button 
                  variant="outline"
                  className={rating === 3 ? "bg-yellow-100" : ""} 
                  onClick={() => handleRate(3)}
                >
                  Good
                </Button>
                <Button 
                  variant="outline"
                  className={rating === 4 ? "bg-green-100" : ""} 
                  onClick={() => handleRate(4)}
                >
                  Easy
                </Button>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReviewCard;
