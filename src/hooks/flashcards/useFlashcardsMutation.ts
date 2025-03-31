import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Flashcard } from './types';
import { getSession } from '@/lib/supabaseAuth';

export const useFlashcardsMutation = (onSuccess: () => void) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createFlashcard = async (flashcard: Partial<Flashcard>) => {
    try {
      setLoading(true);
      
      if (!flashcard.front && !flashcard.front_content) {
        throw new Error('Front content is required');
      }
      
      if (!flashcard.back && !flashcard.back_content) {
        throw new Error('Back content is required');
      }
      
      // Use the compatibility layer to get the session
      const { data } = await getSession();
      const user = data.session?.user;
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      const newFlashcard = {
        user_id: user.id,
        front_content: flashcard.front || flashcard.front_content,
        back_content: flashcard.back || flashcard.back_content,
        topic_id: flashcard.topicId || flashcard.topic_id || null,
        difficulty: flashcard.difficulty || 1,
        mastery_level: 0,
        next_review_date: new Date().toISOString(),
        easiness_factor: 2.5,
        repetition_count: 0
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('flashcards')
        .insert(newFlashcard)
        .select();
      
      if (insertError) throw insertError;
      
      toast({
        title: 'Flashcard created',
        description: 'Your new flashcard has been added',
      });
      
      onSuccess();
      return insertData;
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
      
      const updateData: any = {};
      if (updates.front || updates.front_content) {
        updateData.front_content = updates.front || updates.front_content;
      }
      if (updates.back || updates.back_content) {
        updateData.back_content = updates.back || updates.back_content;
      }
      if (updates.difficulty !== undefined) {
        updateData.difficulty = updates.difficulty;
      }
      if (updates.topicId || updates.topic_id) {
        updateData.topic_id = updates.topicId || updates.topic_id;
      }
      if (updates.next_review_date || updates.next_review_at) {
        updateData.next_review_date = updates.next_review_date || updates.next_review_at;
      }
      
      const { error: updateError } = await supabase
        .from('flashcards')
        .update(updateData)
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      toast({
        title: 'Flashcard updated',
        description: 'Your flashcard has been updated',
      });
      
      onSuccess();
    } catch (err) {
      console.error('Error updating flashcard:', err);
      setError(err as Error);
      toast({
        title: 'Error updating flashcard',
        description: (err as Error).message,
        variant: 'destructive',
      });
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
      
      onSuccess();
    } catch (err) {
      console.error('Error deleting flashcard:', err);
      setError(err as Error);
      toast({
        title: 'Error deleting flashcard',
        description: (err as Error).message,
        variant: 'destructive',
      });
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
};
