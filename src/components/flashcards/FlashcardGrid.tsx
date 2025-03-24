
import React from 'react';
import { Flashcard } from '@/types/supabase';
import FlashcardCard from './FlashcardCard';

interface FlashcardGridProps {
  flashcards: Flashcard[];
  onDelete: (id: string) => void;
}

const FlashcardGrid: React.FC<FlashcardGridProps> = ({ flashcards, onDelete }) => {
  if (flashcards.length === 0) {
    return (
      <div className="col-span-full text-center p-4">
        <p>No flashcards due for review right now.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {flashcards.map(flashcard => (
        <FlashcardCard
          key={flashcard.id}
          flashcard={flashcard}
          onDelete={() => onDelete(flashcard.id)}
        />
      ))}
    </div>
  );
};

export default FlashcardGrid;
