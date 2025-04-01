
import React from 'react';
import { Flashcard } from '@/types/supabase';
import FlashcardCard from './FlashcardCard';

interface FlashcardGridProps {
  flashcards: Flashcard[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onFlashcardsUpdated?: () => Promise<void>;
  onCardUpdated?: () => void;
}

const FlashcardGrid: React.FC<FlashcardGridProps> = ({ 
  flashcards, 
  isLoading,
  onDelete,
  onFlashcardsUpdated,
  onCardUpdated
}) => {
  // Use onCardUpdated as a fallback for onUpdated
  const handleUpdated = () => {
    if (onFlashcardsUpdated) onFlashcardsUpdated();
    if (onCardUpdated) onCardUpdated();
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 bg-muted/20 rounded-md animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {flashcards.map((flashcard) => (
        <FlashcardCard
          key={flashcard.id}
          flashcard={flashcard}
          onDelete={onDelete}
          onUpdated={handleUpdated}
        />
      ))}
    </div>
  );
};

export default FlashcardGrid;
