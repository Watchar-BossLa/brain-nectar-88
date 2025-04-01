
import { useState } from 'react';
import { updateFlashcardAfterReview } from '@/services/spacedRepetition';
import { Flashcard } from '@/hooks/flashcards/types';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for handling flashcard review actions
 */
export const useReviewActions = (
  onReviewComplete?: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  /**
   * Submit flashcard review
   */
  const submitReview = async (flashcard: Flashcard, difficulty: number) => {
    if (!flashcard?.id) {
      toast({
        title: 'Error',
        description: 'Invalid flashcard data',
        variant: 'destructive',
      });
      return false;
    }

    setIsSubmitting(true);
    try {
      // Use updateFlashcardAfterReview from the service
      await updateFlashcardAfterReview(flashcard.id, difficulty);
      
      if (onReviewComplete) {
        onReviewComplete();
      }
      
      return true;
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitReview
  };
};
