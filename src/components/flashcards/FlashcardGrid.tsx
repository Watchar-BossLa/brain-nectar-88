
import React from 'react';
import { Flashcard } from '@/types/supabase';
import FlashcardCard from './FlashcardCard';
import { deleteFlashcard } from '@/services/spacedRepetition';
import { useToast } from '@/hooks/use-toast';

interface FlashcardGridProps {
  flashcards: Flashcard[];
  onDelete?: (id: string) => void;
  onCardUpdated?: () => void;
}

const FlashcardGrid: React.FC<FlashcardGridProps> = ({ flashcards, onDelete, onCardUpdated }) => {
  const { toast } = useToast();
  
  const handleDelete = async (id: string) => {
    if (onDelete) {
      onDelete(id);
    } else {
      try {
        const { error } = await deleteFlashcard(id);
        if (error) throw error;
        
        if (onCardUpdated) {
          onCardUpdated();
        }
      } catch (error) {
        console.error('Error deleting flashcard:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete flashcard',
          variant: 'destructive'
        });
      }
    }
  };
  
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
          onDelete={() => handleDelete(flashcard.id)}
          onUpdated={onCardUpdated}
        />
      ))}
    </div>
  );
};

export default FlashcardGrid;
