
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for retrieving flashcards from the database
 */
export const useFlashcardRetrieval = () => {
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [dueFlashcards, setDueFlashcards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFlashcards();
      fetchDueFlashcards();
    }
  }, [user]);

  const fetchFlashcards = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setFlashcards(data || []);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    } finally {
      setIsLoading(false);
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
      
      setDueFlashcards(data || []);
    } catch (error) {
      console.error('Error fetching due flashcards:', error);
    }
  };

  return {
    flashcards,
    dueFlashcards,
    isLoading,
    fetchFlashcards,
    fetchDueFlashcards
  };
};
