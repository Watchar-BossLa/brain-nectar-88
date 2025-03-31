
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flashcard } from '@/types/supabase';

interface FlashcardViewProps {
  flashcard: Flashcard;
  onRate?: (rating: number) => void;
  onFlip?: () => void;
  onNext?: () => void;
}

const FlashcardView: React.FC<FlashcardViewProps> = ({
  flashcard,
  onRate,
  onFlip,
  onNext
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (onFlip) {
      onFlip();
    }
  };

  const handleRating = (rating: number) => {
    if (onRate) {
      onRate(rating);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent 
        className="p-6 min-h-[250px] flex items-center justify-center cursor-pointer"
        onClick={handleFlip}
      >
        <div className="text-center text-lg">
          {isFlipped ? (
            <div className="animate-fadeIn">
              {flashcard.back_content || flashcard.back}
            </div>
          ) : (
            <div>
              {flashcard.front_content || flashcard.front}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-4">
        <div className="flex justify-center w-full">
          <Button 
            variant="outline" 
            onClick={handleFlip}
            className="w-full"
          >
            {isFlipped ? 'Show Question' : 'Show Answer'}
          </Button>
        </div>
        
        {isFlipped && onRate && (
          <div className="flex justify-between w-full">
            <Button 
              variant="outline" 
              onClick={() => handleRating(1)}
              className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
            >
              Hard
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleRating(3)}
              className="flex-1 mx-2 border-yellow-500 text-yellow-500 hover:bg-yellow-50"
            >
              Medium
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleRating(5)}
              className="flex-1 border-green-500 text-green-500 hover:bg-green-50"
            >
              Easy
            </Button>
          </div>
        )}
        
        {onNext && (
          <Button onClick={onNext} className="w-full">Next Card</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FlashcardView;
