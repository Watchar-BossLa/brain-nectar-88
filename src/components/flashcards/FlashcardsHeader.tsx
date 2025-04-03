import React from 'react';
import { FlashcardsHeaderProps } from '@/types/components';
import { Button } from '@/components/ui/button';
import { BookText, Calculator } from 'lucide-react';

const FlashcardsHeader = ({ 
  isCreating, 
  onCreateSimpleFlashcard, 
  onCreateAdvancedFlashcard 
}: FlashcardsHeaderProps) => {
  return (
    <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Flashcards</h2>
        <p className="text-muted-foreground">
          Create and review flashcards with spaced repetition
        </p>
      </div>
      {!isCreating && (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onCreateSimpleFlashcard}>
            <BookText className="mr-2 h-4 w-4" />
            Simple Flashcard
          </Button>
          <Button onClick={onCreateAdvancedFlashcard}>
            <Calculator className="mr-2 h-4 w-4" />
            Advanced Flashcard
          </Button>
        </div>
      )}
    </div>
  );
};

export default FlashcardsHeader;
