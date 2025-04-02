
import React from 'react';
import { Flashcard } from '@/types/supabase';
import FlashcardCard from './FlashcardCard';

interface FlashcardGridProps {
  flashcards: Flashcard[];
  onDelete: (id: string) => void;
  onUpdated?: () => void;
  onCardUpdated?: () => void; // Added this prop for compatibility
}

const FlashcardGrid: React.FC<FlashcardGridProps> = ({ 
  flashcards, 
  onDelete,
  onUpdated,
  onCardUpdated
}) => {
  // Use onCardUpdated as a fallback for onUpdated
  const handleUpdated = () => {
    if (onUpdated) onUpdated();
    if (onCardUpdated) onCardUpdated();
  };

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
