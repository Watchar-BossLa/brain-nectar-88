
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { Flashcard } from './types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for retrieving flashcards from the database
 */
export const useFlashcardsRetrieval = () => {
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [dueFlashcards, setDueFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true); // For backward compatibility
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      fetchFlashcards();
      fetchDueFlashcards();
    }
  }, [user]);

  const fetchFlashcards = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      // Transform database results to match Flashcard interface
      const transformedData: Flashcard[] = data ? data.map(card => ({
        id: card.id,
        deck_id: card.topic_id, // For backward compatibility
        front: card.front_content || '',
        back: card.back_content || '',
        front_content: card.front_content,
        back_content: card.back_content,
        user_id: card.user_id,
        topic_id: card.topic_id,
        topicId: card.topic_id,
        created_at: card.created_at,
        updated_at: card.updated_at,
        difficulty: card.difficulty,
        interval: card.repetition_count, // For backward compatibility
        repetitions: card.repetition_count, // For backward compatibility 
        mastery_level: card.mastery_level,
        easiness_factor: card.easiness_factor,
        review_count: card.repetition_count, // For backward compatibility
        next_review_date: card.next_review_date,
        last_reviewed_at: card.last_reviewed_at || card.updated_at,
        next_review_at: card.next_review_date,
        last_retention: card.last_retention,
      })) : [];
      
      setFlashcards(transformedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching flashcards:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching flashcards'));
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const fetchDueFlashcards = async () => {
    if (!user) return;
    
    try {
      const { data, error: fetchError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .lte('next_review_date', new Date().toISOString())
        .order('next_review_date', { ascending: true });
        
      if (fetchError) throw fetchError;
      
      // Transform database results to match Flashcard interface
      const transformedData: Flashcard[] = data ? data.map(card => ({
        id: card.id,
        deck_id: card.topic_id, // For backward compatibility
        front: card.front_content || '',
        back: card.back_content || '',
        front_content: card.front_content,
        back_content: card.back_content,
        user_id: card.user_id,
        topic_id: card.topic_id,
        topicId: card.topic_id,
        created_at: card.created_at,
        updated_at: card.updated_at,
        difficulty: card.difficulty,
        interval: card.repetition_count, // For backward compatibility
        repetitions: card.repetition_count, // For backward compatibility 
        mastery_level: card.mastery_level,
        easiness_factor: card.easiness_factor,
        review_count: card.repetition_count, // For backward compatibility
        next_review_date: card.next_review_date,
        last_reviewed_at: card.last_reviewed_at || card.updated_at,
        next_review_at: card.next_review_date,
        last_retention: card.last_retention,
      })) : [];
      
      setDueFlashcards(transformedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching due flashcards:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching due flashcards'));
    }
  };

  return {
    flashcards,
    dueFlashcards,
    isLoading,
    loading,
    error,
    fetchFlashcards,
    fetchDueFlashcards
  };
};
