
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Flashcard, fromDatabaseFormat } from '@/types/flashcard';
import { useAuth } from '@/context/auth';

export function useFlashcardRetrieval() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [dueFlashcards, setDueFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFlashcards = async () => {
    if (!user) {
      return { flashcards: [], dueFlashcards: [] };
    }
    
    try {
      setLoading(true);
      
      // Fetch all flashcards
      const { data: allFlashcards, error: allError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (allError) throw allError;
      
      // Fetch due flashcards (next_review_date <= current time)
      const { data: dueCards, error: dueError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .lte('next_review_date', new Date().toISOString())
        .order('next_review_date', { ascending: true });
      
      if (dueError) throw dueError;
      
      // Convert to consistent format using our fromDatabaseFormat function
      const formattedFlashcards = (allFlashcards || []).map(card => fromDatabaseFormat(card));
      const formattedDueCards = (dueCards || []).map(card => fromDatabaseFormat(card));
      
      setFlashcards(formattedFlashcards);
      setDueFlashcards(formattedDueCards);
      setError(null);
      
      return { 
        flashcards: formattedFlashcards, 
        dueFlashcards: formattedDueCards 
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
  }, [user]);

  return {
    flashcards,
    dueFlashcards,
    loading,
    error,
    fetchFlashcards
  };
}
