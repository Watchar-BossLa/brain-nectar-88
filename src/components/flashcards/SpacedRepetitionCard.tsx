import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flashcard } from '@/types/supabase';
import { updateFlashcardAfterReview } from '@/services/spacedRepetition';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence } from 'framer-motion';
import 'katex/dist/katex.min.css';
import { calculateRetention } from '@/services/spacedRepetition/algorithm';
import { MemoryRetentionIndicator } from './components/MemoryRetentionIndicator';
import { DifficultyRatingButtons } from './components/DifficultyRatingButtons';
import { AnimatedFlashcardContent } from './components/AnimatedFlashcardContent';
import { useAuth } from '@/context/auth';

interface SpacedRepetitionCardProps {
  flashcard: Flashcard;
  onComplete: () => void;
  onUpdateStats?: () => void;
}

const SpacedRepetitionCard: React.FC<SpacedRepetitionCardProps> = ({ 
  flashcard, 
  onComplete,
  onUpdateStats
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [difficultyRating, setDifficultyRating] = useState<number | null>(null);
  const [retentionEstimate, setRetentionEstimate] = useState<number>(1);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    setIsFlipped(false);
    setDifficultyRating(null);
    
    if (flashcard.next_review_date && flashcard.repetition_count > 0) {
      const reviewDate = new Date(flashcard.next_review_date);
      const now = new Date();
      const daysSinceReview = Math.max(0, (now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
      
      const memoryStrength = flashcard.repetition_count * 0.2 * (flashcard.difficulty || 2.5);
      
      const retention = calculateRetention(daysSinceReview, memoryStrength);
      setRetentionEstimate(retention);
    }
  }, [flashcard.id]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRating = async (difficulty: number) => {
    setDifficultyRating(difficulty);
    setIsSubmitting(true);

    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const result = await updateFlashcardAfterReview(flashcard.id, difficulty, user.id);
      
      if (result.error) {
        throw result.error;
      }
      
      if (onUpdateStats) {
        onUpdateStats();
      }
      
      setTimeout(() => {
        onComplete();
        setIsSubmitting(false);
      }, 600);
      
    } catch (error) {
      console.error('Error updating flashcard review:', error);
      toast({
        title: 'Error',
        description: 'Failed to update flashcard. Please try again.',
        variant: 'destructive'
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Flashcard Review</CardTitle>
        <CardDescription>
          How well did you remember this card? Be honest for best results.
        </CardDescription>
        
        <MemoryRetentionIndicator 
          retention={retentionEstimate}
          repetitionCount={flashcard.repetition_count}
        />
      </CardHeader>
      
      <CardContent className="flex justify-center pb-8">
        <div 
          className="relative w-full h-[300px] cursor-pointer"
          onClick={handleFlip}
        >
          <AnimatePresence initial={false} mode="wait">
            {isFlipped ? (
              <AnimatedFlashcardContent
                content={flashcard.back_content}
                isAnswer={true}
                onClick={handleFlip}
                isFlipped={isFlipped}
              />
            ) : (
              <AnimatedFlashcardContent
                content={flashcard.front_content}
                isAnswer={false}
                onClick={handleFlip}
                isFlipped={isFlipped}
              />
            )}
          </AnimatePresence>
        </div>
      </CardContent>
      
      <CardFooter className="flex-col space-y-4">
        {isFlipped && (
          <DifficultyRatingButtons
            onRate={handleRating}
            selectedRating={difficultyRating}
            isSubmitting={isSubmitting}
          />
        )}
        {!isFlipped && (
          <Button 
            onClick={handleFlip}
            className="w-full"
          >
            Show Answer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SpacedRepetitionCard;
