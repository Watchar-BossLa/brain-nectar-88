
import { useState, useEffect } from 'react';
import { updateFlashcardAfterReview } from '@/services/spacedRepetition';
import { Flashcard } from './useFlashcardsPage';

export function useFlashcardReview(onComplete: () => void) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [reviewState, setReviewState] = useState<'reviewing' | 'answering' | 'complete'>('reviewing');
  const [reviewCards, setReviewCards] = useState<Flashcard[]>([]);
  const [userRating, setUserRating] = useState<0 | 1 | 2 | 3 | 4 | 5 | null>(null);
  const [reviewStats, setReviewStats] = useState({
    totalReviewed: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    averageRating: 0
  });

  // Load due flashcards for review
  useEffect(() => {
    const loadDueCards = async () => {
      // In a real app, this would be an API call to get due cards from the backend
      // For this demo, we'll use mock data
      const mockDueCards: Flashcard[] = [
        {
          id: '1',
          front: 'What is the accounting equation?',
          back: 'Assets = Liabilities + Equity'
        },
        {
          id: '2',
          front: 'What is working capital?',
          back: 'Current Assets - Current Liabilities'
        },
        {
          id: '3',
          front: 'What is depreciation?',
          back: 'The systematic allocation of the cost of an asset over its useful life'
        }
      ];
      
      setReviewCards(mockDueCards);
    };
    
    loadDueCards();
  }, []);

  const currentCard = reviewCards[currentCardIndex];

  // Show the answer for the current card
  const showAnswer = () => {
    setReviewState('answering');
  };

  // Rate the current card and move to the next one
  const rateCard = async (rating: 0 | 1 | 2 | 3 | 4 | 5) => {
    setUserRating(rating);
    
    // Update review statistics
    setReviewStats(prev => {
      const newStats = { ...prev };
      newStats.totalReviewed += 1;
      
      if (rating <= 2) newStats.hard += 1;
      else if (rating <= 4) newStats.medium += 1;
      else newStats.easy += 1;
      
      newStats.averageRating = (prev.averageRating * prev.totalReviewed + rating) / newStats.totalReviewed;
      
      return newStats;
    });
    
    try {
      // In a real app, this would update the flashcard in the backend
      await updateFlashcardAfterReview(currentCard.id, rating);
      
      // Move to the next card or complete the review
      if (currentCardIndex < reviewCards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
        setReviewState('reviewing');
        setUserRating(null);
      } else {
        setReviewState('complete');
      }
    } catch (error) {
      console.error('Error updating flashcard review:', error);
    }
  };

  // Complete the review session
  const completeReview = () => {
    onComplete();
  };

  return {
    currentCard,
    reviewState,
    userRating,
    reviewStats,
    showAnswer,
    rateCard,
    completeReview
  };
}
