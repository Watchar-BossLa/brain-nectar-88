
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { updateFlashcardAfterReview } from '@/services/spacedRepetition';

/**
 * Hook for flashcard review actions (rating, restarting)
 */
export const useReviewActions = (
  flashcards: any[],
  currentIndex: number,
  setCurrentIndex: (index: number) => void,
  setIsFlipped: (flipped: boolean) => void,
  setReviewComplete: (complete: boolean) => void,
  onComplete?: () => void
) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Handle difficulty rating
  const handleDifficultyRating = async (difficulty: number) => {
    if (!user || currentIndex >= flashcards.length) return;
    
    const currentCard = flashcards[currentIndex];
    
    try {
      await updateFlashcardAfterReview(currentCard.id, difficulty, user.id);
      
      // Move to next card or complete review
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      } else {
        setReviewComplete(true);
        if (onComplete) onComplete();
      }
    } catch (err) {
      toast({
        title: 'Error saving review',
        description: 'There was a problem saving your review.',
        variant: 'destructive',
      });
      console.error('Error updating flashcard:', err);
    }
  };

  // Restart review
  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewComplete(false);
  };

  return {
    handleDifficultyRating,
    handleRestart
  };
};
