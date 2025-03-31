
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getDueFlashcards } from '@/services/spacedRepetition';

export const useFlashcardLoading = () => {
  const { user } = useAuth();
  const [dueFlashcards, setDueFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewCompleted, setReviewCompleted] = useState(false);

  useEffect(() => {
    const loadFlashcards = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const cards = await getDueFlashcards(user.id);
        setDueFlashcards(cards);
      } catch (error) {
        console.error('Error loading due flashcards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFlashcards();
  }, [user]);

  const handleRate = (difficulty: string | number) => {
    // Convert string to number if needed
    const difficultyValue = typeof difficulty === 'string' ? parseInt(difficulty, 10) : difficulty;
    
    // Update flashcard rating logic here
    // This is just a placeholder
    console.log(`Rated flashcard as ${difficultyValue}`);
    
    moveToNextCard();
  };

  const moveToNextCard = () => {
    if (currentIndex < dueFlashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setReviewCompleted(true);
    }
  };

  const restartReview = () => {
    setCurrentIndex(0);
    setReviewCompleted(false);
  };

  return {
    dueFlashcards,
    currentFlashcard: dueFlashcards[currentIndex],
    currentIndex,
    isLoading,
    reviewCompleted,
    totalCards: dueFlashcards.length,
    handleRate,
    moveToNextCard,
    restartReview
  };
};
