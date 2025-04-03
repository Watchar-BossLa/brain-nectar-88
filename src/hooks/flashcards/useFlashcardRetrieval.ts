
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Flashcard, formatFlashcardToCamelCase } from './useFlashcardTypes';

export function useFlashcardRetrieval() {
  const { toast } = useToast();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [dueFlashcards, setDueFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      
      // Fetch all flashcards
      const { data: allFlashcards, error: allError } = await supabase
        .from('flashcards')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (allError) throw allError;
      
      // Fetch due flashcards (next_review_date <= current time)
      const { data: dueCards, error: dueError } = await supabase
        .from('flashcards')
        .select('*')
        .lte('next_review_date', new Date().toISOString())
        .order('next_review_date', { ascending: true });
      
      if (dueError) throw dueError;
      
      // Convert to camelCase
      const camelCaseFlashcards = (allFlashcards || []).map(formatFlashcardToCamelCase);
      const camelCaseDueCards = (dueCards || []).map(formatFlashcardToCamelCase);
      
      setFlashcards(camelCaseFlashcards);
      setDueFlashcards(camelCaseDueCards);
      setError(null);
      
      return { 
        flashcards: camelCaseFlashcards, 
        dueFlashcards: camelCaseDueCards 
      };
    } catch (err) {
      console.error('Error fetching flashcards:', err);
      setError(err as Error);
      toast({
        title: 'Error fetching flashcards',
        description: (err as Error).message,
        variant: 'destructive',
      });
      return { flashcards: [], dueFlashcards: [] };
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
    fetchFlashcards
  };
}
