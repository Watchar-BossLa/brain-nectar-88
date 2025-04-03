
import { useState } from 'react';
import { useFlashcardRetrieval } from './useFlashcardRetrieval';
import { useFlashcardStats } from './useFlashcardStats';
import { useFlashcardMutations } from './useFlashcardMutations';
import { Flashcard, FlashcardLearningStats } from '@/types/flashcard';
import { useAuth } from '@/context/auth';

export interface UseFlashcardsReturn {
  flashcards: Flashcard[];
  dueFlashcards: Flashcard[];
  stats: FlashcardLearningStats & { averageDifficulty: number };
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
  const { user } = useAuth();
  const userId = user?.id || '';
  
  // Compose the specialized hooks
  const { flashcards, dueFlashcards, loading: retrievalLoading, error: retrievalError, fetchFlashcards } = useFlashcardRetrieval();
  const { stats, isLoading: statsLoading, error: statsError, refreshStats } = useFlashcardStats();
  const { createFlashcard: create, updateFlashcard: update, deleteFlashcard: remove, isCreating, isUpdating, isDeleting } = useFlashcardMutations(userId);
  
  // Local UI state
  const [activeTab, setActiveTab] = useState('all');
  const [isCreating, setIsCreating] = useState(false);

  // Refresh all flashcard data
  const refreshFlashcards = async () => {
    await fetchFlashcards();
    await refreshStats();
  };

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
  const loading = retrievalLoading || statsLoading || isCreating || isUpdating || isDeleting;
  const error = retrievalError || statsError;

  // Create wrapper functions for mutators
  const createFlashcard = async (flashcardData: Partial<Flashcard>) => {
    const result = await create(flashcardData);
    return result?.data || null;
  };

  const updateFlashcard = async (id: string, updates: Partial<Flashcard>) => {
    const flashcardToUpdate = { id, ...updates } as Flashcard;
    const result = await update(flashcardToUpdate);
    return result !== null;
  };

  const deleteFlashcard = async (id: string) => {
    const result = await remove(id);
    return result?.success || false;
  };

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
export type { Flashcard, FlashcardLearningStats } from '@/types/flashcard';
export { fromDatabaseFormat, toDatabaseFormat } from '@/types/flashcard';
