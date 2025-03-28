
import React from 'react';
import { Flashcard } from '@/types/supabase';
import FlashcardCard from './FlashcardCard';

interface FlashcardGridProps {
  flashcards: Flashcard[];
  onDelete: (id: string) => void;
  onUpdated?: () => void;
}

const FlashcardGrid: React.FC<FlashcardGridProps> = ({ 
  flashcards, 
  onDelete,
  onUpdated
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {flashcards.map((flashcard) => (
        <FlashcardCard
          key={flashcard.id}
          flashcard={flashcard}
          onDelete={onDelete}
          onUpdated={onUpdated}
        />
      ))}
    </div>
  );
};

export default FlashcardGrid;
