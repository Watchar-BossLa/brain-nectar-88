
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for creating, updating, and deleting flashcards
 */
export const useFlashcardMutation = (onMutationComplete?: () => void) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const createFlashcard = async (flashcardData: { 
    front_content: string; 
    back_content: string;
    topic_id?: string;
  }) => {
    if (!user) return null;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('flashcards')
        .insert({
          ...flashcardData,
          user_id: user.id,
          difficulty: 0,
          repetition_count: 0,
          next_review_date: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      
      if (onMutationComplete) {
        onMutationComplete();
      }
      
      return data;
    } catch (error) {
      console.error('Error creating flashcard:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteFlashcard = async (flashcardId: string) => {
    if (!user) return false;
    
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', flashcardId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      if (onMutationComplete) {
        onMutationComplete();
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateFlashcard = async (flashcardId: string, updates: Partial<{
    front_content: string;
    back_content: string;
    topic_id: string;
  }>) => {
    if (!user) return null;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('flashcards')
        .update(updates)
        .eq('id', flashcardId)
        .eq('user_id', user.id)
        .select()
        .single();
        
      if (error) throw error;
      
      if (onMutationComplete) {
        onMutationComplete();
      }
      
      return data;
    } catch (error) {
      console.error('Error updating flashcard:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createFlashcard,
    deleteFlashcard,
    updateFlashcard,
    isLoading
  };
};
