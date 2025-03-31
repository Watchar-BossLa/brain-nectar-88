
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Flashcard } from '@/hooks/useFlashcardsPage';

export const useFlashcardsRetrieval = () => {
  const { toast } = useToast();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [dueFlashcards, setDueFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      
      const { data: allFlashcards, error: allError } = await supabase
        .from('flashcards')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (allError) throw allError;
      
      const { data: dueCards, error: dueError } = await supabase
        .from('flashcards')
        .select('*')
        .lte('next_review_date', new Date().toISOString())
        .order('next_review_date', { ascending: true });
      
      if (dueError) throw dueError;
      
      setFlashcards(allFlashcards || []);
      setDueFlashcards(dueCards || []);
    } catch (err) {
      console.error('Error fetching flashcards:', err);
      setError(err as Error);
      toast({
        title: 'Error fetching flashcards',
        description: (err as Error).message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  return {
    flashcards,
    dueFlashcards,
    loading,
    error,
    refreshFlashcards: fetchFlashcards
  };
};
