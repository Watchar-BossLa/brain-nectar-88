
import React from 'react';
import FlashcardGrid from '../FlashcardGrid';
import { Flashcard } from '@/types/flashcards';
import EmptyFlashcardState from '../EmptyFlashcardState';

export interface DueFlashcardsTabProps {
  flashcards: Flashcard[];
  isLoading?: boolean;
  onDelete?: (id: string) => Promise<void>;
  onAddNew?: () => void;
  onFlashcardsUpdated?: () => Promise<void>;
}

const DueFlashcardsTab = ({ 
  flashcards, 
  isLoading = false,
  onDelete,
  onAddNew,
  onFlashcardsUpdated 
}: DueFlashcardsTabProps) => {
  
  if (!isLoading && (!flashcards || flashcards.length === 0)) {
    return (
      <EmptyFlashcardState 
        title="No due flashcards" 
        description="You've caught up with all your flashcard reviews. Well done!"
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

export default DueFlashcardsTab;
