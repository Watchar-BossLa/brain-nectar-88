
import { useState } from 'react';
import { spacedRepetitionService } from '@/services/flashcards/spacedRepetitionService';
import { Flashcard } from '@/types/flashcards';

/**
 * Hook for reviewing flashcards using spaced repetition
 * @param onReviewComplete Optional callback to be called when the review is completed
 */
export const useFlashcardReview = (onReviewComplete?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewCards, setReviewCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [reviewState, setReviewState] = useState<'reviewing' | 'answering' | 'complete'>('reviewing');
  const [currentCard, setCurrentCard] = useState<any>(null);
  const [reviewStats, setReviewStats] = useState({
    totalReviewed: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    averageRating: 0
  });

  // Record a review for a flashcard
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

  // Show the answer for the current card
  const showAnswer = () => {
    setReviewState('answering');
  };

  // Rate the current card and proceed to the next one
  const rateCard = (rating: number) => {
    // Update stats based on rating
    setReviewStats(prev => {
      const newTotalReviewed = prev.totalReviewed + 1;
      const newEasy = rating >= 4 ? prev.easy + 1 : prev.easy;
      const newMedium = rating === 3 ? prev.medium + 1 : prev.medium;
      const newHard = rating <= 2 ? prev.hard + 1 : prev.hard;
      const newTotalRating = prev.averageRating * prev.totalReviewed + rating;
      
      return {
        totalReviewed: newTotalReviewed,
        easy: newEasy,
        medium: newMedium,
        hard: newHard,
        averageRating: newTotalRating / newTotalReviewed
      };
    });
    
    // If currentCard exists and has an id, record the review
    if (currentCard && currentCard.id) {
      recordReview(currentCard.id, rating);
    }
    
    // Set state to complete or get next card
    setReviewState('complete');
  };

  // Complete the review session
  const completeReview = () => {
    if (onReviewComplete) {
      onReviewComplete();
    }
  };

  // Handle flipping the card
  const handleFlip = () => {
    if (reviewState === 'reviewing') {
      setReviewState('answering');
    } else {
      setReviewState('reviewing');
    }
  };

  // Handle difficulty rating
  const handleDifficultyRating = (rating: number) => {
    rateCard(rating);
  };

  // Skip current card
  const handleSkip = () => {
    if (currentCardIndex < reviewCards.length - 1) {
      setCurrentCardIndex(prevIndex => prevIndex + 1);
      setCurrentCard(reviewCards[currentCardIndex + 1]);
      setReviewState('reviewing');
    } else {
      setReviewState('complete');
    }
  };

  return {
    recordReview,
    isSubmitting,
    isLoading,
    reviewCards,
    currentCardIndex,
    reviewState,
    currentCard,
    reviewStats,
    showAnswer,
    rateCard,
    completeReview,
    handleFlip,
    handleDifficultyRating,
    handleSkip
  };
};

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  topic?: string;
  tags?: string[];
  mastery: number;
  audioUrl?: string;
}
