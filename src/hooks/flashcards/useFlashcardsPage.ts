import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth';
import { Flashcard, FlashcardLearningStats, normalizeFlashcard, toDatabaseFormat } from '@/types/flashcard';
import { supabase } from '@/integrations/supabase/client';
import { useFlashcardRetrieval } from './useFlashcardRetrieval';
import { useFlashcardStats } from './useFlashcardStats';
import { useFlashcardMutations } from './useFlashcardMutations';

export type { Flashcard, FlashcardLearningStats };

export interface UseFlashcardsReturn {
  flashcards: Flashcard[];
  dueFlashcards: Flashcard[];
  stats: FlashcardLearningStats & { averageDifficulty: number };
  loading: boolean;
  error: Error | null;
  createFlashcard: (flashcard: Partial<Flashcard>) => Promise<Flashcard | null>;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => Promise<boolean>;
  deleteFlashcard: (id: string) => Promise<boolean>;
  refreshFlashcards: () => Promise<void>;
  isCreating: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
}

export const useFlashcardsPage = (): UseFlashcardsReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { flashcards, dueFlashcards, loading, error, fetchFlashcards } = useFlashcardRetrieval();
  const { stats, refreshStats } = useFlashcardStats();
  const { 
    createFlashcard, 
    updateFlashcard, 
    deleteFlashcard, 
    isCreating, 
    isDeleting,
    isUpdating
  } = useFlashcardMutations();

  const refreshFlashcards = async () => {
    await fetchFlashcards();
    await refreshStats();
  };

  return {
    flashcards,
    dueFlashcards,
    stats,
    loading,
    error,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    refreshFlashcards,
    isCreating,
    isDeleting,
    isUpdating
  };
};

// Additional utility functions to convert between naming conventions
export const formatFlashcardToCamelCase = normalizeFlashcard;
export const formatFlashcardToSnakeCase = toDatabaseFormat;
