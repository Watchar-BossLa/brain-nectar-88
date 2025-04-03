
import { useState } from 'react';
import { useFlashcardRetrieval } from './useFlashcardRetrieval';
import { useFlashcardStats } from './useFlashcardStats';
import { useFlashcardMutations } from './useFlashcardMutations';
import { Flashcard, FlashcardLearningStats } from './useFlashcardTypes';

export interface UseFlashcardsReturn {
  flashcards: Flashcard[];
  dueFlashcards: Flashcard[];
  stats: FlashcardLearningStats;
  loading: boolean;
  error: Error | null;
  refreshFlashcards: () => Promise<void>;
  createFlashcard: (flashcard: Partial<Flashcard>) => Promise<Flashcard | null>;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => Promise<boolean>;
  deleteFlashcard: (id: string) => Promise<boolean>;
  // Additional properties for the Flashcards page
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  isCreating?: boolean;
  setIsCreating?: (creating: boolean) => void;
  handleCreateFlashcard?: () => void;
  handleFlashcardCreated?: () => void;
  handleStartReview?: () => void;
  handleUpdateStats?: () => void;
}

export function useFlashcardsPage(): UseFlashcardsReturn {
  // Compose the specialized hooks
  const { flashcards, dueFlashcards, loading: retrievalLoading, error: retrievalError, fetchFlashcards } = useFlashcardRetrieval();
  const { stats, updateStats } = useFlashcardStats();
  const { createFlashcard, updateFlashcard, deleteFlashcard, loading: mutationLoading, error: mutationError } = useFlashcardMutations(refreshStats);
  
  // Local UI state
  const [activeTab, setActiveTab] = useState('all');
  const [isCreating, setIsCreating] = useState(false);

  // Refresh all flashcard data
  const refreshFlashcards = async () => {
    const { flashcards, dueFlashcards } = await fetchFlashcards();
    updateStats(flashcards, dueFlashcards);
  };

  // Update stats only
  function refreshStats() {
    updateStats(flashcards, dueFlashcards);
  }

  // UI handlers
  const handleCreateFlashcard = () => {
    setIsCreating(true);
    setActiveTab('create');
  };

  const handleFlashcardCreated = () => {
    setIsCreating(false);
    setActiveTab('all');
    refreshFlashcards();
  };

  const handleStartReview = () => {
    setActiveTab('review');
  };

  // Derived state
  const loading = retrievalLoading || mutationLoading;
  const error = retrievalError || mutationError;

  // Initialize stats if they haven't been set yet
  if (stats.totalCards === 0 && flashcards.length > 0) {
    updateStats(flashcards, dueFlashcards);
  }

  return {
    flashcards,
    dueFlashcards,
    stats,
    loading,
    error,
    refreshFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    // UI state helpers
    activeTab,
    setActiveTab,
    isCreating,
    setIsCreating,
    handleCreateFlashcard,
    handleFlashcardCreated,
    handleStartReview,
    handleUpdateStats: refreshStats
  };
}

// Re-export the types for convenience
export type { Flashcard, FlashcardLearningStats } from './useFlashcardTypes';
export { formatFlashcardToCamelCase, formatFlashcardToSnakeCase } from './useFlashcardTypes';
