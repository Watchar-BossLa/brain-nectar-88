import React from 'react';
import { AllFlashcardsTabProps } from '@/types/components';
import { Loader2 } from 'lucide-react';
import FlashcardGrid from '@/components/flashcards/FlashcardGrid';
import FlashcardsEmptyState from '@/components/flashcards/FlashcardsEmptyState';

const AllFlashcardsTab = ({
  isLoading,
  flashcards,
  onDeleteFlashcard,
  onCardUpdated,
  onCreateSimpleFlashcard,
  onCreateAdvancedFlashcard
}: AllFlashcardsTabProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (flashcards.length === 0) {
    return (
      <FlashcardsEmptyState
        title="No flashcards yet"
        description="Start creating flashcards to help you learn and retain information more effectively with spaced repetition."
        onCreateSimpleFlashcard={onCreateSimpleFlashcard}
        onCreateAdvancedFlashcard={onCreateAdvancedFlashcard}
      />
    );
  }
  
  return (
    <FlashcardGrid 
      flashcards={flashcards} 
      onDelete={onDeleteFlashcard}
      onCardUpdated={onCardUpdated} 
    />
  );
};

export default AllFlashcardsTab;
