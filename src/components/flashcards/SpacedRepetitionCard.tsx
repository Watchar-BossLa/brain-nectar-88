
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { updateFlashcardAfterReview } from '@/services/spacedRepetition';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence } from 'framer-motion';
import 'katex/dist/katex.min.css';
import { calculateRetention } from '@/services/spacedRepetition/algorithm';
import { MemoryRetentionIndicator } from './components/MemoryRetentionIndicator';
import { DifficultyRatingButtons } from './components/DifficultyRatingButtons';
import { AnimatedFlashcardContent } from './components/FlashcardContent';

interface Flashcard {
  id: string;
  front_content?: string;
  frontContent?: string;
  back_content?: string;
  backContent?: string;
  next_review_date?: string;
  nextReviewDate?: string;
  repetition_count?: number;
  repetitionCount?: number;
  difficulty?: number;
  [key: string]: any; // Allow other properties
}

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

  const frontContent = flashcard.front_content || flashcard.frontContent || '';
  const backContent = flashcard.back_content || flashcard.backContent || '';
  const repetitionCount = flashcard.repetition_count || flashcard.repetitionCount || 0;
  const nextReviewDate = flashcard.next_review_date || flashcard.nextReviewDate;

  useEffect(() => {
    // Reset state when flashcard changes
    setIsFlipped(false);
    setDifficultyRating(null);
    
    // Calculate estimated current retention
    if (nextReviewDate && repetitionCount > 0) {
      const reviewDate = new Date(nextReviewDate);
      const now = new Date();
      const daysSinceReview = Math.max(0, (now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Estimate memory strength based on repetition count and difficulty
      const memoryStrength = repetitionCount * 0.2 * (flashcard.difficulty || 2.5);
      
      // Calculate current retention
      const retention = calculateRetention(daysSinceReview, memoryStrength);
      setRetentionEstimate(retention);
    }
  }, [flashcard.id, nextReviewDate, repetitionCount]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRating = async (difficulty: number) => {
    setDifficultyRating(difficulty);
    setIsSubmitting(true);

    try {
      const { error } = await updateFlashcardAfterReview(flashcard.id, difficulty);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Update stats if callback is provided
      if (onUpdateStats) {
        onUpdateStats();
      }
      
      // Short delay to show the selected rating
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
        
        {/* Memory Retention Indicator */}
        <MemoryRetentionIndicator 
          retention={retentionEstimate}
          repetitionCount={repetitionCount}
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
                content={backContent}
                isAnswer={true}
                onClick={handleFlip}
                isFlipped={isFlipped}
              />
            ) : (
              <AnimatedFlashcardContent
                content={frontContent}
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
