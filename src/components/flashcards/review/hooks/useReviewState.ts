
import { useState } from 'react';
import { Flashcard } from '@/types/supabase';

/**
 * Hook for managing review state
 */
export const useReviewState = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [retentionStats, setRetentionStats] = useState<{ overall: number; improved: number }>({ 
    overall: 0, 
    improved: 0 
  });

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Reset review state
  const resetReview = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewComplete(false);
  };

  return {
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
    currentCard: flashcards[currentIndex]
  };
};
