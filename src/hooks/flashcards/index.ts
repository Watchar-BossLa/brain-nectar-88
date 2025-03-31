
import { useState, useEffect } from 'react';
import { useFlashcardsRetrieval } from './useFlashcardsRetrieval';
import { useFlashcardsStats } from './useFlashcardsStats';
import { useFlashcardsMutation } from './useFlashcardsMutation';
import { Flashcard, FlashcardLearningStats } from './types';

export interface UseFlashcardsPageReturn {
  flashcards: Flashcard[];
  dueFlashcards: Flashcard[];
  stats: FlashcardLearningStats;
  loading: boolean;
  error: Error | null;
  refreshFlashcards: () => Promise<void>;
  createFlashcard: (flashcard: Partial<Flashcard>) => Promise<void>;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => Promise<void>;
  deleteFlashcard: (id: string) => Promise<void>;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  isCreating?: boolean;
  setIsCreating?: (creating: boolean) => void;
  isLoading?: boolean;
  handleCreateFlashcard?: () => void;
  handleFlashcardCreated?: () => void;
  handleStartReview?: () => void;
  handleUpdateStats?: () => void;
}

// Combined hook that uses all the smaller hooks
export const useFlashcardsPage = (): UseFlashcardsPageReturn => {
  const {
    flashcards,
    dueFlashcards,
    loading,
    error,
    refreshFlashcards
  } = useFlashcardsRetrieval();
  
  const { stats, calculateStats } = useFlashcardsStats(flashcards, dueFlashcards);
  
  const {
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    loading: mutationLoading
  } = useFlashcardsMutation(async () => {
    await refreshFlashcards();
    calculateStats();
  });
  
  // Calculate stats when flashcards or dueFlashcards change
  useEffect(() => {
    calculateStats();
  }, [flashcards, dueFlashcards]);

  return {
    flashcards,
    dueFlashcards,
    stats,
    loading: loading || mutationLoading,
    error,
    refreshFlashcards: async () => {
      await refreshFlashcards();
      calculateStats();
    },
    createFlashcard,
    updateFlashcard,
    deleteFlashcard
  };
};

// Re-export the types
export * from './types';
