
import { useState } from 'react';
import { spacedRepetitionService } from '@/services/flashcards/spacedRepetitionService';

/**
 * Hook for reviewing flashcards using spaced repetition
 */
export const useFlashcardReview = (onReviewComplete?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recordReview = async (flashcardId: string, difficulty: number) => {
    try {
      setIsSubmitting(true);
      const success = await spacedRepetitionService.recordReview(flashcardId, difficulty);
      
      if (success && onReviewComplete) {
        onReviewComplete();
      }
      
      return success;
    } catch (error) {
      console.error('Error recording review:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    recordReview,
    isSubmitting
  };
};
