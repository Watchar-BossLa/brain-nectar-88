
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { getDueFlashcards, updateFlashcardAfterReview } from '@/services/spacedRepetition';
import { useToast } from '@/hooks/use-toast';
import { Flashcard } from '@/types/supabase';

export const useFlashcardReview = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadDueFlashcards();
  }, [user]);

  const loadDueFlashcards = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await getDueFlashcards(user.id);
      
      if (data && data.length > 0) {
        setFlashcards(data);
        setCurrentIndex(0);
        setIsFlipped(false);
      } else {
        setFlashcards([]);
      }
    } catch (error) {
      console.error('Error loading flashcards:', error);
      toast({
        title: 'Error',
        description: 'Failed to load flashcards for review',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const reviewFlashcard = async (flashcardId: string, difficulty: number) => {
    if (!user) return;
    
    try {
      // Update the flashcard with the provided difficulty rating
      await updateFlashcardAfterReview(flashcardId, difficulty);
      
      // Move to next card
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      } else {
        // End of review session
        toast({
          title: 'Review complete',
          description: 'You have completed this review session!',
        });
      }
    } catch (error) {
      console.error('Error updating flashcard review:', error);
      toast({
        title: 'Error',
        description: 'Failed to record your review',
        variant: 'destructive'
      });
    }
  };

  const refreshCards = async () => {
    await loadDueFlashcards();
  };

  return {
    flashcards,
    currentFlashcard: flashcards.length > 0 ? flashcards[currentIndex] : null,
    currentIndex,
    isFlipped,
    loading,
    flipCard,
    reviewFlashcard,
    refreshCards
  };
};
