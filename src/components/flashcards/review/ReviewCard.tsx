
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flashcard } from '@/types/supabase';
import { motion } from 'framer-motion';

interface ReviewCardProps {
  currentCard: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
  onRating: (difficulty: number) => Promise<void>;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  currentCard,
  isFlipped,
  onFlip,
  onRating
}) => {
  return (
    <motion.div
      key={currentCard.id + (isFlipped ? "-flipped" : "")}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="w-full overflow-hidden">
        <div 
          className="min-h-[280px] cursor-pointer p-6 flex flex-col items-center justify-center"
          onClick={onFlip}
        >
          <div className="text-lg font-medium mb-2">
            {isFlipped ? "Answer" : "Question"}
          </div>
          <div className="text-xl font-bold text-center">
            {isFlipped ? currentCard.back_content : currentCard.front_content}
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            Click to {isFlipped ? "see question" : "reveal answer"}
          </div>
        </div>
        
        {isFlipped && (
          <CardFooter className="flex flex-col space-y-4 p-6 bg-muted/50">
            <div className="text-sm font-medium mb-1">How well did you know this?</div>
            <div className="flex w-full justify-between gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant={rating <= 2 ? "destructive" : rating >= 4 ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => onRating(rating)}
                >
                  {rating === 1 && "Forgot"}
                  {rating === 2 && "Hard"}
                  {rating === 3 && "Medium"}
                  {rating === 4 && "Easy"}
                  {rating === 5 && "Perfect"}
                </Button>
              ))}
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default ReviewCard;
