
import { useReviewState } from './hooks/useReviewState';
import { useFlashcardLoading } from './hooks/useFlashcardLoading';
import { useRetentionStats } from './hooks/useRetentionStats';
import { useReviewActions } from './hooks/useReviewActions';

/**
 * Main hook for the flashcard review system
 * Integrates all specialized hooks
 */
export const useReviewSystem = (onComplete?: () => void) => {
  // Get state management
  const {
    flashcards,
    setFlashcards,
    currentIndex,
    setCurrentIndex,
    isFlipped,
    setIsFlipped,
    isLoading,
    setIsLoading,
    reviewComplete,
    setReviewComplete,
    retentionStats,
    setRetentionStats,
    handleFlip,
    resetReview,
    currentCard
  } = useReviewState();

  // Load flashcards
  useFlashcardLoading(
    setFlashcards,
    setIsLoading,
    setReviewComplete
  );

  // Calculate retention statistics
  useRetentionStats(
    reviewComplete,
    setRetentionStats
  );

  // Get review actions
  const {
    handleDifficultyRating,
    handleRestart
  } = useReviewActions(
    flashcards,
    currentIndex,
    setCurrentIndex,
    setIsFlipped,
    setReviewComplete,
    onComplete
  );

  return {
    flashcards,
    currentIndex,
    isFlipped,
    isLoading,
    reviewComplete,
    retentionStats,
    currentCard,
    handleFlip,
    handleDifficultyRating,
    handleRestart
  };
};
