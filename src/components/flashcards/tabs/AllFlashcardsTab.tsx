
import React from 'react';
import FlashcardGrid from '../FlashcardGrid';
import { Flashcard } from '@/types/flashcards';
import EmptyFlashcardState from '../EmptyFlashcardState';

export interface AllFlashcardsTabProps {
  flashcards: Flashcard[];
  isLoading: boolean;
  onDelete?: (id: string) => Promise<void>;
  onAddNew?: () => void;
  onFlashcardsUpdated?: () => Promise<void>;
}

const AllFlashcardsTab = ({ 
  flashcards, 
  isLoading,
  onDelete,
  onAddNew,
  onFlashcardsUpdated
}: AllFlashcardsTabProps) => {
  
  if (!isLoading && (!flashcards || flashcards.length === 0)) {
    return (
      <EmptyFlashcardState 
        title="No flashcards found" 
        description="You haven't created any flashcards yet. Create your first flashcard to start learning!"
        onAddNew={onAddNew}
      />
    );
  }
  
  return (
    <FlashcardGrid 
      flashcards={flashcards} 
      isLoading={isLoading} 
      onDelete={onDelete}
      onFlashcardsUpdated={onFlashcardsUpdated}
    />
  );
};

export default AllFlashcardsTab;
