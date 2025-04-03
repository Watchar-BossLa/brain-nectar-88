
import { useState, useEffect, useCallback } from 'react';
import { getDueFlashcards, updateFlashcardAfterReview } from '@/services/spacedRepetition';
import { useAuth } from '@/context/auth';
import { Flashcard, fromDatabaseFormat } from '@/types/flashcard';

type ReviewState = 'reviewing' | 'answering' | 'complete';

interface ReviewStats {
  totalReviewed: number;
  easy: number;
  medium: number;
  hard: number;
  averageRating: number;
}

export const useFlashcardReview = (onComplete?: () => void) => {
  const [reviewCards, setReviewCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewState, setReviewState] = useState<ReviewState>('reviewing');
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    totalReviewed: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    averageRating: 0
  });
  const { user } = useAuth();

  // Fetch due flashcards
  useEffect(() => {
    const fetchCards = async () => {
      setIsLoading(true);
      try {
        if (!user) return;
        
        const { data, error } = await getDueFlashcards(user.id);
        if (error) throw new Error(error.message);
        
        if (data && Array.isArray(data)) {
          // Convert all cards to the consistent Flashcard type
          const flashcards = data.map(card => fromDatabaseFormat(card));
          setReviewCards(flashcards);
        }
      } catch (error) {
        console.error('Error fetching flashcards for review:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCards();
  }, [user]);

  // Get the current card
  const currentCard = reviewCards.length > 0 && currentCardIndex < reviewCards.length
    ? reviewCards[currentCardIndex]
    : null;

  // Show the answer side of the card
  const handleFlip = useCallback(() => {
    if (reviewState === 'reviewing') {
      setReviewState('answering');
    } else {
      setReviewState('reviewing');
    }
  }, [reviewState]);

  // Rate difficulty and move to next card
  const handleDifficultyRating = useCallback(
    async (rating: number) => {
      if (!currentCard) return;

      try {
        await updateFlashcardAfterReview(currentCard.id, rating);

        // Update stats
        setReviewStats((prev) => {
          const newStats = { ...prev };
          newStats.totalReviewed++;

          if (rating <= 2) newStats.hard++;
          else if (rating <= 4) newStats.medium++;
          else newStats.easy++;

          const totalRatings = newStats.easy + newStats.medium + newStats.hard;
          newStats.averageRating =
            (newStats.easy * 5 + newStats.medium * 3 + newStats.hard * 1) / totalRatings;

          return newStats;
        });

        // Move to next card
        if (currentCardIndex < reviewCards.length - 1) {
          setCurrentCardIndex((prev) => prev + 1);
          setReviewState('reviewing');
        } else {
          setReviewState('complete');
          if (onComplete) {
            onComplete();
          }
        }
      } catch (error) {
        console.error('Error updating flashcard review:', error);
      }
    },
    [currentCard, currentCardIndex, reviewCards.length, onComplete]
  );

  // Skip current card
  const handleSkip = useCallback(() => {
    if (currentCardIndex < reviewCards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setReviewState('reviewing');
    } else {
      setReviewState('complete');
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentCardIndex, reviewCards.length, onComplete]);

  // Complete the review session
  const completeReview = useCallback(() => {
    setReviewState('complete');
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  return {
    isLoading,
    reviewCards,
    currentCardIndex,
    currentCard,
    reviewState,
    reviewStats,
    handleFlip,
    handleDifficultyRating,
    handleSkip,
    completeReview,
    showAnswer: () => setReviewState('answering'),
    rateCard: handleDifficultyRating
  };
};

export default useFlashcardReview;
