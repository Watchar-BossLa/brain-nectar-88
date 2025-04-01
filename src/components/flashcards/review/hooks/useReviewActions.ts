
import { useState } from 'react';
import { updateFlashcardAfterReview } from '@/services/spacedRepetition';
import { useToast } from '@/hooks/use-toast';

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
  const submitReview = async (flashcardId: string, difficulty: number) => {
    if (!flashcardId) {
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
      await updateFlashcardAfterReview(flashcardId, difficulty);
      
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
