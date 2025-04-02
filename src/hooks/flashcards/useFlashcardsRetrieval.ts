
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/auth';

export interface Flashcard {
  id: string;
  front_content: string;
  back_content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  easiness_factor: number;
  next_review_date: string;
  repetition_count: number;
  topic_id: string | null;
  difficulty: number;
  mastery_level: number;
  last_reviewed_at: string | null;
  last_retention: number;
}

export const useFlashcardsRetrieval = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [dueFlashcards, setDueFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchFlashcards = async () => {
    if (!user) {
      setFlashcards([]);
      setDueFlashcards([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      setFlashcards(data || []);

      // Filter due flashcards
      const due = (data || []).filter(card => {
        if (!card.next_review_date) return true;
        return new Date(card.next_review_date) <= new Date();
      });
      setDueFlashcards(due);

    } catch (err) {
      console.error('Error fetching flashcards:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching flashcards'));
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
    refreshFlashcards: fetchFlashcards
  };
};
