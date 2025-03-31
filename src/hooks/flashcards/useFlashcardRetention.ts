
import { useEffect, useState } from 'react';
import { calculateFlashcardRetention } from '@/services/spacedRepetition';
import { Flashcard, FlashcardLearningStats } from './types';

/**
 * Hook to track flashcard retention over time
 */
export const useFlashcardRetention = (flashcard: Flashcard | FlashcardLearningStats | undefined) => {
  const [retention, setRetention] = useState<number>(0);
  
  useEffect(() => {
    if (!flashcard) return;
    
    // Calculate current retention
    const currentRetention = calculateFlashcardRetention(flashcard);
    setRetention(currentRetention);
  }, [flashcard]);
  
  return { retention };
};
