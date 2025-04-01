
import { useState, useEffect } from 'react';
import { useFlashcardRetrieval } from './useFlashcardRetrieval';
import { useFlashcardStats } from './useFlashcardStats';
import { useFlashcardMutation } from './useFlashcardMutation';
import { useFlashcardReview } from './useFlashcardReview';

/**
 * Main flashcards hook that combines the functionality of the smaller hooks
 */
export const useFlashcards = () => {
  const {
    flashcards,
    dueFlashcards,
    isLoading,
    fetchFlashcards,
    fetchDueFlashcards
  } = useFlashcardRetrieval();
  
  const {
    stats,
    fetchStats
  } = useFlashcardStats();
  
  const {
    createFlashcard,
    deleteFlashcard,
    updateFlashcard
  } = useFlashcardMutation(() => {
    fetchFlashcards();
    fetchDueFlashcards();
    fetchStats();
  });
  
  const {
    recordReview
  } = useFlashcardReview(() => {
    fetchStats();
    fetchDueFlashcards();
  });

  // Combine and re-export everything for backward compatibility
  return {
    flashcards,
    dueFlashcards,
    stats,
    isLoading,
    fetchFlashcards,
    fetchDueFlashcards,
    fetchStats,
    createFlashcard,
    deleteFlashcard,
    updateFlashcard,
    recordReview
  };
};

// Re-export the retention calculation function as is for backward compatibility
export { calculateFlashcardRetention } from '@/hooks/useFlashcards';
