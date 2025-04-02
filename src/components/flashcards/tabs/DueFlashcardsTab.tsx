
import React from 'react';
import { Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Flashcard } from '@/types/supabase';
import FlashcardGrid from '@/components/flashcards/FlashcardGrid';
import FlashcardsEmptyState from '@/components/flashcards/FlashcardsEmptyState';

interface DueFlashcardsTabProps {
  flashcards: Flashcard[];
  onStartReview: () => void;
  onDeleteFlashcard: (id: string) => Promise<void>;
  onCardUpdated: () => void;
  onCreateSimpleFlashcard: () => void;
  onCreateAdvancedFlashcard: () => void;
}

const DueFlashcardsTab = ({
  flashcards,
  onStartReview,
  onDeleteFlashcard,
  onCardUpdated,
  onCreateSimpleFlashcard,
  onCreateAdvancedFlashcard
}: DueFlashcardsTabProps) => {
  if (flashcards.length === 0) {
    return (
      <FlashcardsEmptyState
        title="No cards due for review"
        description="Great job! You've reviewed all your due flashcards. Check back later or create new cards."
        onCreateSimpleFlashcard={onCreateSimpleFlashcard}
        onCreateAdvancedFlashcard={onCreateAdvancedFlashcard}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Cards Due for Review</h3>
        <Button onClick={onStartReview}>
          <Brain className="mr-2 h-4 w-4" />
          Start Review
        </Button>
      </div>
      <FlashcardGrid 
        flashcards={flashcards} 
        onDelete={onDeleteFlashcard}
        onCardUpdated={onCardUpdated} 
      />
    </div>
  );
};

export default DueFlashcardsTab;
