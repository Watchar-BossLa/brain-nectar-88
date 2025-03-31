
import { useState, useEffect } from 'react';
import { Flashcard } from '@/types/supabase';

export const useReviewState = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [retentionStats, setRetentionStats] = useState({
    correct: 0,
    incorrect: 0,
    retention: 0
  });

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const resetReview = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewComplete(false);
    setRetentionStats({
      correct: 0,
      incorrect: 0,
      retention: 0
    });
  };

  const currentCard = flashcards[currentIndex];

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
    currentCard
  };
};

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

  // Load flashcards (simplified)
  useEffect(() => {
    // In a real implementation, this would fetch flashcards
    setIsLoading(false);
  }, []);

  // Handle difficulty rating
  const handleDifficultyRating = async (difficulty: number) => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setReviewComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
    
    // Update retention stats
    setRetentionStats(prev => {
      const isCorrect = difficulty >= 3;
      const correct = isCorrect ? prev.correct + 1 : prev.correct;
      const incorrect = !isCorrect ? prev.incorrect + 1 : prev.incorrect;
      const total = correct + incorrect;
      const retention = total > 0 ? (correct / total) * 100 : 0;
      
      return {
        correct,
        incorrect,
        retention
      };
    });
  };

  // Handle restart
  const handleRestart = () => {
    resetReview();
  };

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
