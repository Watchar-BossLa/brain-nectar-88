
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flashcard } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';
import 'katex/dist/katex.min.css';
import { calculateRetention } from '@/services/spacedRepetition/algorithm';

interface SpacedRepetitionCardProps {
  flashcard: Flashcard;
  onComplete: (difficulty: number) => Promise<void>;
  onUpdateStats?: () => void;
}

const RetentionIndicator = ({ value }: { value: number }) => {
  const percentage = Math.max(0, Math.min(100, Math.round(value * 100)));
  let colorClass = 'bg-red-500';
  if (percentage > 80) colorClass = 'bg-green-500';
  else if (percentage > 50) colorClass = 'bg-yellow-500';

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div
        className={`h-2.5 rounded-full ${colorClass}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

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

  useEffect(() => {
    // Reset state when flashcard changes
    setIsFlipped(false);
    setDifficultyRating(null);
    
    // Calculate estimated current retention
    if (flashcard.next_review_date && flashcard.repetition_count > 0) {
      const reviewDate = new Date(flashcard.next_review_date);
      const now = new Date();
      const daysSinceReview = Math.max(0, (now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Estimate memory strength based on repetition count and difficulty
      const memoryStrength = flashcard.repetition_count * 0.2 * (flashcard.difficulty || 2.5);
      
      // Calculate current retention
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
      await onComplete(difficulty);
      
      // Update stats if callback is provided
      if (onUpdateStats) {
        onUpdateStats();
      }
      
      // Short delay to show the selected rating
      setTimeout(() => {
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
        <RetentionIndicator value={retentionEstimate} />
      </CardHeader>
      
      <CardContent className="flex justify-center pb-8">
        <div 
          className="relative w-full h-[300px] cursor-pointer flex items-center justify-center p-8 border rounded-md"
          onClick={handleFlip}
        >
          <div className="text-center transition-all duration-300 ease-in-out">
            <div className="text-xl font-semibold">
              {isFlipped ? flashcard.back_content : flashcard.front_content}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex-col space-y-4">
        {isFlipped ? (
          <div className="grid grid-cols-3 gap-2 w-full">
            <Button 
              onClick={() => handleRating(1)} 
              variant="outline" 
              className="bg-red-100 hover:bg-red-200"
              disabled={isSubmitting}
            >
              Hard
            </Button>
            <Button 
              onClick={() => handleRating(3)} 
              variant="outline" 
              className="bg-yellow-100 hover:bg-yellow-200"
              disabled={isSubmitting}
            >
              Medium
            </Button>
            <Button 
              onClick={() => handleRating(5)} 
              variant="outline" 
              className="bg-green-100 hover:bg-green-200"
              disabled={isSubmitting}
            >
              Easy
            </Button>
          </div>
        ) : (
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
