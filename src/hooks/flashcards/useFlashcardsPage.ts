
import { useState } from 'react';
import { useFlashcardsRetrieval } from './useFlashcardsRetrieval';
import { useFlashcardMutation } from './useFlashcardMutation';
import { Flashcard } from './types';

export const useFlashcardsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { 
    flashcards,
    dueFlashcards,
    isLoading,
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
    createFlashcard,
    deleteFlashcard,
    updateFlashcard,
    isLoading: isMutating
  } = useFlashcardMutation(() => {
    refreshFlashcards();
  });

  return {
    activeTab,
    setActiveTab,
    flashcards,
    dueFlashcards,
    isLoading: isLoading || isMutating,
    error,
    refreshFlashcards: refreshFlashcards,
    createFlashcard,
    deleteFlashcard,
    updateFlashcard
  };
};
