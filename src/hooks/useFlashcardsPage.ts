import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Flashcard } from '@/services/flashcardService';
import { useToast } from '@/hooks/use-toast';

interface UseFlashcardsPageReturn {
  flashcards: Flashcard[];
  loading: boolean;
  fetchFlashcards: () => Promise<void>;
}

export const useFlashcardsPage = (): UseFlashcardsPageReturn => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchFlashcards = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user?.id;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const userFlashcards = await getUserFlashcards(userId);
      setFlashcards(userFlashcards);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      toast({
        title: 'Error',
        description: 'Failed to load flashcards',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  return { flashcards, loading, fetchFlashcards };
};
