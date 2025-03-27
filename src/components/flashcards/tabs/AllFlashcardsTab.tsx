
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Flashcard } from '@/types/supabase';
import FlashcardGrid from '@/components/flashcards/FlashcardGrid';
import FlashcardsEmptyState from '@/components/flashcards/FlashcardsEmptyState';

interface AllFlashcardsTabProps {
  isLoading: boolean;
  flashcards: Flashcard[];
  onDeleteFlashcard: (id: string) => Promise<void>;
  onCardUpdated: () => void;
  onCreateSimpleFlashcard: () => void;
  onCreateAdvancedFlashcard: () => void;
}

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
