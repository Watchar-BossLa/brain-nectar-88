
import { useState, useEffect } from 'react';
import { Flashcard } from '@/types/supabase';
import { useFlashcardsRetrieval } from './useFlashcardsRetrieval';
import { useFlashcardsStats } from './useFlashcardsStats';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { FlashcardStats } from '@/types/flashcard-types';

export interface UseFlashcardsPageReturn {
  flashcards: Flashcard[];
  loading: boolean;
  error: Error | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  dueFlashcards: Flashcard[];
  stats: FlashcardStats;
  refreshFlashcards: () => Promise<void>;
}

export const useFlashcardsPage = (): UseFlashcardsPageReturn => {
  const [activeTab, setActiveTab] = useState('all');
  const { flashcards: retrievedFlashcards, dueFlashcards: retrievedDueFlashcards, loading, error, refreshFlashcards } = useFlashcardsRetrieval();
  
  // Use type assertion to handle the mismatch between retrieved flashcards and expected type
  const flashcards = retrievedFlashcards as unknown as Flashcard[];
  const dueFlashcards = retrievedDueFlashcards as unknown as Flashcard[];
  
  // Get stats based on the flashcards
  const stats = useFlashcardsStats(flashcards);
  
  return {
    flashcards,
    dueFlashcards,
    loading,
    error,
    activeTab,
    setActiveTab,
    stats,
    refreshFlashcards
  };
};
