
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Flashcard, fromDatabaseFormat, toDatabaseFormat } from '@/types/flashcard';
import { supabase } from '@/integrations/supabase/client';

export const useFlashcardMutations = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const createFlashcard = async (flashcard: Partial<Flashcard>): Promise<Flashcard | null> => {
    try {
      setIsCreating(true);
      
      // Convert to database format
      const dbFlashcard = toDatabaseFormat(flashcard);
      
      const { data, error } = await supabase
        .from('flashcards')
        .insert(dbFlashcard)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Success!',
        description: 'Flashcard created successfully.',
      });

      return fromDatabaseFormat(data);
    } catch (error) {
      console.error('Error creating flashcard:', error);
      toast({
        title: 'Error',
        description: 'Failed to create flashcard.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const updateFlashcard = async (id: string, updates: Partial<Flashcard>): Promise<boolean> => {
    try {
      setIsUpdating(true);

      // Convert to database format
      const dbUpdates = toDatabaseFormat(updates);
      
      const { error } = await supabase
        .from('flashcards')
        .update(dbUpdates)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Success!',
        description: 'Flashcard updated successfully.',
      });
      
      return true;
    } catch (error) {
      console.error('Error updating flashcard:', error);
      toast({
        title: 'Error',
        description: 'Failed to update flashcard.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteFlashcard = async (id: string): Promise<boolean> => {
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Success!',
        description: 'Flashcard deleted successfully.',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete flashcard.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    isCreating,
    isUpdating,
    isDeleting
  };
};
