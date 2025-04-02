
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/auth';
import { Flashcard } from './types';

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

      // Convert database format to Flashcard format
      const convertedCards: Flashcard[] = data.map(card => ({
        id: card.id,
        deck_id: card.deck_id || '',
        front: card.front_content || '',
        back: card.back_content || '',
        user_id: card.user_id,
        created_at: card.created_at,
        updated_at: card.updated_at,
        easiness_factor: card.easiness_factor,
        interval: card.interval,
        repetitions: card.repetitions,
        last_reviewed_at: card.last_reviewed_at,
        next_review_at: card.next_review_date, // Mapping between different field names
        review_count: card.review_count,
        // Additional fields for front-end compatibility
        front_content: card.front_content,
        back_content: card.back_content,
        topic_id: card.topic_id,
        difficulty: card.difficulty,
        mastery_level: card.mastery_level,
        repetition_count: card.repetition_count,
        next_review_date: card.next_review_date,
        last_retention: card.last_retention
      }));

      setFlashcards(convertedCards);

      // Filter due flashcards
      const due = convertedCards.filter(card => {
        if (!card.next_review_at) return true;
        return new Date(card.next_review_at) <= new Date();
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
