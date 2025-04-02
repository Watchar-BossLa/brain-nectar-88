
import { useState } from 'react';
import { useFlashcardsRetrieval } from './useFlashcardsRetrieval';
import { useFlashcardMutation } from './useFlashcardMutation';
import { Flashcard } from './types';

export interface UseFlashcardsPageReturn {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  flashcards: Flashcard[];
  dueFlashcards: Flashcard[];
  isLoading: boolean;
  error: Error | null;
  refreshFlashcards: () => void;
  createFlashcard: (frontContent: string, backContent: string, topicId?: string) => Promise<any>;
  deleteFlashcard: (flashcardId: string) => Promise<any>;
  updateFlashcard: (flashcardId: string, updates: Partial<Flashcard>) => Promise<any>;
  // Backward compatibility
  stats?: any;
  loading?: boolean;
}

export const useFlashcardsPage = (): UseFlashcardsPageReturn => {
  const [activeTab, setActiveTab] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { 
    flashcards,
    dueFlashcards,
    isLoading,
    loading,
    error,
    fetchFlashcards,
    fetchDueFlashcards
  } = useFlashcardsRetrieval();

  const refreshFlashcards = () => {
    setRefreshKey(prev => prev + 1);
    fetchFlashcards();
    fetchDueFlashcards();
  };

  const { 
    createFlashcard: createFlashcardMutation,
    deleteFlashcard,
    updateFlashcard,
    isLoading: isMutating
  } = useFlashcardMutation(() => {
    refreshFlashcards();
  });
  
  // Adapter function to match the expected signature
  const createFlashcard = async (frontContent: string, backContent: string, topicId?: string) => {
    return createFlashcardMutation({
      front_content: frontContent,
      back_content: backContent,
      topic_id: topicId
    });
  };

  return {
    activeTab,
    setActiveTab,
    flashcards,
    dueFlashcards,
    isLoading: isLoading || isMutating,
    error,
    refreshFlashcards,
    createFlashcard,
    deleteFlashcard,
    updateFlashcard,
    // For backward compatibility
    loading: isLoading || isMutating,
    stats: {}
  };
};
