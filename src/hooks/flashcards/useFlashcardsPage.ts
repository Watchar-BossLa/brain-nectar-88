
import { useState, useEffect } from 'react';
import { Flashcard } from './types';
import { useFlashcardsRetrieval } from './useFlashcardsRetrieval';
import { useFlashcardsStats } from './useFlashcardsStats';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';

export interface UseFlashcardsPageReturn {
  flashcards: Flashcard[];
  loading: boolean;
  error: Error | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  dueFlashcards: Flashcard[];
  stats: any;
  refreshFlashcards: () => Promise<void>;
}

export const useFlashcardsPage = (): UseFlashcardsPageReturn => {
  const [activeTab, setActiveTab] = useState('all');
  const { flashcards, dueFlashcards, loading, error, refreshFlashcards } = useFlashcardsRetrieval();
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
