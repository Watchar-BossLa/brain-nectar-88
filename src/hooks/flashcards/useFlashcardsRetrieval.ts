
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { Flashcard } from './types';

/**
 * Hook for retrieving flashcards from the database
 */
export const useFlashcardsRetrieval = () => {
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [dueFlashcards, setDueFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      fetchFlashcards();
      fetchDueFlashcards();
    }
  }, [user]);

  const fetchFlashcards = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Convert from database format to our Flashcard type
      const convertedCards: Flashcard[] = (data || []).map(card => ({
        id: card.id,
        deck_id: card.deck_id || '',
        front: card.front_content || '',
        back: card.back_content || '',
        user_id: card.user_id,
        created_at: card.created_at,
        updated_at: card.updated_at,
        easiness_factor: card.easiness_factor,
        interval: card.interval || 0,
        repetitions: card.repetitions || 0,
        last_reviewed_at: card.last_reviewed_at,
        next_review_at: card.next_review_date,
        review_count: card.review_count || 0,
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
    } catch (err) {
      console.error('Error fetching flashcards:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching flashcards'));
    } finally {
      setLoading(false);
    }
  };

  const fetchDueFlashcards = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .lte('next_review_date', new Date().toISOString())
        .order('next_review_date', { ascending: true });
        
      if (error) throw error;
      
      // Convert to Flashcard type
      const convertedCards: Flashcard[] = (data || []).map(card => ({
        id: card.id,
        deck_id: card.deck_id || '',
        front: card.front_content || '',
        back: card.back_content || '',
        user_id: card.user_id,
        created_at: card.created_at,
        updated_at: card.updated_at,
        easiness_factor: card.easiness_factor,
        interval: card.interval || 0, 
        repetitions: card.repetitions || 0,
        last_reviewed_at: card.last_reviewed_at,
        next_review_at: card.next_review_date,
        review_count: card.review_count || 0,
        // Additional fields
        front_content: card.front_content,
        back_content: card.back_content,
        topic_id: card.topic_id,
        difficulty: card.difficulty,
        mastery_level: card.mastery_level,
        repetition_count: card.repetition_count,
        next_review_date: card.next_review_date,
        last_retention: card.last_retention
      }));
      
      setDueFlashcards(convertedCards);
    } catch (err) {
      console.error('Error fetching due flashcards:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching due flashcards'));
    }
  };

  return {
    flashcards,
    dueFlashcards,
    isLoading: loading,
    loading,
    error,
    fetchFlashcards,
    fetchDueFlashcards
  };
};
