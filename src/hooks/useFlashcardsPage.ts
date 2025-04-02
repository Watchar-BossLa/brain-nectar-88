
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Flashcard } from '@/services/flashcardService';
import { toast } from '@/components/ui/use-toast';

interface UseFlashcardsPageReturn {
  flashcards: Flashcard[];
  loading: boolean;
  fetchFlashcards: () => Promise<void>;
  reloadFlashcards: () => Promise<void>;
  dueFlashcards: Flashcard[];
  stats: {
    total: number;
    mastered: number;
    learning: number;
    due: number;
  };
}

export const useFlashcardsPage = (): UseFlashcardsPageReturn => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [dueFlashcards, setDueFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    mastered: 0,
    learning: 0,
    due: 0
  });

  const fetchFlashcards = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user?.id;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const { data: userFlashcards, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setFlashcards(userFlashcards || []);

      // Fetch due flashcards
      const now = new Date().toISOString();
      const { data: dueCards, error: dueError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId)
        .lte('next_review_date', now)
        .order('next_review_date', { ascending: true });

      if (dueError) throw dueError;
      setDueFlashcards(dueCards || []);

      // Calculate stats
      const masterCount = (userFlashcards || []).filter(card => (card.mastery_level || 0) >= 0.8).length;
      
      setStats({
        total: (userFlashcards || []).length,
        mastered: masterCount,
        learning: (userFlashcards || []).length - masterCount,
        due: (dueCards || []).length
      });
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
  }, []);

  // Alias for fetchFlashcards to match the expected prop name
  const reloadFlashcards = fetchFlashcards;

  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  return { flashcards, loading, fetchFlashcards, reloadFlashcards, dueFlashcards, stats };
};
