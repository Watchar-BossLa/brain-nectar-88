
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Flashcard, formatFlashcardToCamelCase, formatFlashcardToSnakeCase } from './useFlashcardTypes';

export function useFlashcardMutations(onSuccess?: () => void) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createFlashcard = async (flashcard: Partial<Flashcard>) => {
    try {
      setLoading(true);
      
      // Ensure required fields
      if (!flashcard.front && !flashcard.frontContent) {
        throw new Error('Front content is required');
      }
      
      if (!flashcard.back && !flashcard.backContent) {
        throw new Error('Back content is required');
      }
      
      // Get user ID from current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }
      
      // Prepare data for insert - converting camelCase to snake_case for database
      const newFlashcard = {
        user_id: session.user.id,
        front_content: flashcard.front || flashcard.frontContent,
        back_content: flashcard.back || flashcard.backContent,
        topic_id: flashcard.topicId || null,
        difficulty: flashcard.difficulty || 1,
        mastery_level: 0,
        next_review_date: new Date().toISOString(),
        easiness_factor: 2.5,
        repetition_count: 0
      };
      
      const { data, error: insertError } = await supabase
        .from('flashcards')
        .insert(newFlashcard)
        .select();
      
      if (insertError) throw insertError;
      
      toast({
        title: 'Flashcard created',
        description: 'Your new flashcard has been added',
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      setError(null);
      return data ? formatFlashcardToCamelCase(data[0]) : null;
    } catch (err) {
      console.error('Error creating flashcard:', err);
      setError(err as Error);
      toast({
        title: 'Error creating flashcard',
        description: (err as Error).message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateFlashcard = async (id: string, updates: Partial<Flashcard>) => {
    try {
      setLoading(true);
      
      // Prepare data for update - converting camelCase to snake_case for database
      const updateData = formatFlashcardToSnakeCase(updates);
      
      const { error: updateError } = await supabase
        .from('flashcards')
        .update(updateData)
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      toast({
        title: 'Flashcard updated',
        description: 'Your flashcard has been updated',
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      setError(null);
      return true;
    } catch (err) {
      console.error('Error updating flashcard:', err);
      setError(err as Error);
      toast({
        title: 'Error updating flashcard',
        description: (err as Error).message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteFlashcard = async (id: string) => {
    try {
      setLoading(true);
      
      const { error: deleteError } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id);
      
      if (deleteError) throw deleteError;
      
      toast({
        title: 'Flashcard deleted',
        description: 'Your flashcard has been removed',
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      setError(null);
      return true;
    } catch (err) {
      console.error('Error deleting flashcard:', err);
      setError(err as Error);
      toast({
        title: 'Error deleting flashcard',
        description: (err as Error).message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    loading,
    error
  };
}
