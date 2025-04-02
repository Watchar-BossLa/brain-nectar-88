
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/components/ui/use-toast';
import { Flashcard } from '@/types/supabase';
import { spacedRepetitionService } from '@/services/flashcards/spacedRepetitionService';

export type ReviewState = 'reviewing' | 'answering' | 'complete';

export interface ReviewStats {
  totalReviewed: number;
  easy: number;
  medium: number;
  hard: number;
  averageRating: number;
}

/**
 * Hook for reviewing flashcards using spaced repetition
 */
export const useFlashcardReview = (onComplete?: () => void) => {
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [reviewCards, setReviewCards] = useState<Flashcard[]>([]);
  const [reviewState, setReviewState] = useState<ReviewState>('reviewing');
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    totalReviewed: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    averageRating: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Load due cards when the component mounts
  useEffect(() => {
    if (user) {
      loadDueCards();
    }
  }, [user]);

  const loadDueCards = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const dueCards = await spacedRepetitionService.getDueFlashcards(user.id);
      
      // Ensure front/back compatibility for components that use these properties
      const processedCards = dueCards.map(card => ({
        ...card,
        front: card.front_content,
        back: card.back_content
      }));
      
      setReviewCards(processedCards || []);
      if (processedCards && processedCards.length > 0) {
        setCurrentCard(processedCards[0]);
        setCurrentCardIndex(0);
      }
    } catch (err) {
      console.error('Error loading due cards:', err);
      toast({
        title: 'Error',
        description: 'Failed to load flashcards for review',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlip = () => {
    setReviewState('answering');
  };

  const rateCard = async (difficulty: number) => {
    if (!currentCard) return;
    
    try {
      // Record the review
      const success = await spacedRepetitionService.recordReview(currentCard.id, difficulty);
      
      if (!success) {
        throw new Error('Failed to update flashcard');
      }
      
      // Update stats
      const newStats = { ...reviewStats };
      newStats.totalReviewed++;
      
      if (difficulty <= 2) newStats.hard++;
      else if (difficulty === 3) newStats.medium++;
      else newStats.easy++;
      
      // Update average
      const totalRatings = newStats.totalReviewed;
      const totalScore = newStats.averageRating * (totalRatings - 1) + difficulty;
      newStats.averageRating = totalScore / totalRatings;
      
      setReviewStats(newStats);
      
      // Move to the next card
      moveToNextCard();
    } catch (err) {
      console.error('Error updating flashcard:', err);
      toast({
        title: 'Error',
        description: 'Failed to save your rating',
        variant: 'destructive'
      });
    }
  };
  
  const moveToNextCard = () => {
    const nextIndex = currentCardIndex + 1;
    
    if (nextIndex < reviewCards.length) {
      setCurrentCard(reviewCards[nextIndex]);
      setCurrentCardIndex(nextIndex);
      setReviewState('reviewing');
    } else {
      setReviewState('complete');
      setCurrentCard(null);
      if (onComplete) onComplete();
    }
  };

  const handleSkip = () => {
    moveToNextCard();
  };
  
  const completeReview = () => {
    if (onComplete) onComplete();
  };

  return {
    currentCard,
    reviewState,
    reviewStats,
    showAnswer: handleFlip,
    rateCard,
    completeReview,
    isLoading,
    reviewCards,
    handleFlip,
    handleSkip,
    currentCardIndex
  };
};
