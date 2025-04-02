
import { useMemo } from 'react';
import { Flashcard } from './types';

export const useFlashcardsStats = (flashcards: Flashcard[]) => {
  const stats = useMemo(() => {
    const totalCards = flashcards.length;
    const dueCards = flashcards.filter(card => {
      // Consider a card due if next_review_at is in the past
      if (!card.next_review_at) return true;
      return new Date(card.next_review_at) <= new Date();
    }).length;
    
    const masteredCards = flashcards.filter(card => {
      return (card.easiness_factor || 0) > 2.5 && (card.repetitions || 0) >= 3;
    }).length;
    
    const learningCards = totalCards - masteredCards;
    const newCards = flashcards.filter(card => !(card.repetitions && card.repetitions > 0)).length;
    
    return {
      totalCards,
      dueCards,
      masteredCards,
      learningCards,
      newCards,
      masteryPercentage: totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0
    };
  }, [flashcards]);
  
  return stats;
};
