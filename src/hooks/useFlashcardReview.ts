
import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';

// Import from the flashcard service instead of spacedRepetition
import { 
  getDueFlashcards, 
  updateFlashcardAfterReview 
} from '@/services/flashcardService';

interface Flashcard {
  id: string;
  user_id: string;
  front_content: string;
  back_content: string;
  difficulty: number;
  repetition_count: number;
  easiness_factor: number;
  next_review_date: string;
  last_reviewed_at: string;
  mastery_level: number;
  last_retention: number;
  created_at: string;
  updated_at: string;
  topic_id?: string;
  topic?: string;
}

export const useFlashcardReview = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Get the current flashcard
  const currentFlashcard = flashcards[currentIndex];

  // Fetch due flashcards
  const fetchFlashcards = useCallback(async () => {
    try {
      if (!user) return;

      setLoading(true);
      const { data, error } = await getDueFlashcards(user.id);

      if (error) {
        throw error;
      }

      if (data) {
        setFlashcards(data);
      }
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      toast({
        title: 'Error',
        description: 'Failed to load flashcards for review',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Load flashcards on component mount
  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  // Flip the current card
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // Review the current flashcard with a difficulty rating
  const reviewFlashcard = async (id: string, difficulty: number) => {
    try {
      const { data, error } = await updateFlashcardAfterReview(id, difficulty);

      if (error) {
        throw error;
      }

      // Move to the next card
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);

      return data;
    } catch (error) {
      console.error('Error updating flashcard:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your review',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Refresh the cards
  const refreshCards = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    fetchFlashcards();
  };

  return {
    flashcards,
    currentFlashcard,
    currentIndex,
    isFlipped,
    loading,
    flipCard,
    reviewFlashcard,
    refreshCards,
  };
};
