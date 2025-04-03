
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFlashcard, deleteFlashcard } from '@/services/spacedRepetition';
import { useToast } from '@/hooks/use-toast';
import { Flashcard, toDatabaseFormat, fromDatabaseFormat } from '@/types/flashcard';

export const useFlashcardMutations = (userId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Create flashcard mutation
  const createMutation = useMutation({
    mutationFn: async (flashcardData: Partial<Flashcard>) => {
      // Extract the front and back content using the correct properties
      const frontContent = flashcardData.frontContent || flashcardData.front_content || '';
      const backContent = flashcardData.backContent || flashcardData.back_content || '';
      
      // Use the topicId if provided
      const topicId = flashcardData.topicId || flashcardData.topic_id || null;
      
      return createFlashcard(userId, frontContent, backContent, topicId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards', userId] });
      toast({
        title: 'Success',
        description: 'Flashcard created successfully'
      });
    },
    onError: (error: Error) => {
      console.error('Error creating flashcard:', error);
      toast({
        title: 'Error',
        description: 'Failed to create flashcard',
        variant: 'destructive'
      });
    }
  });

  // Update flashcard mutation
  const updateMutation = useMutation({
    mutationFn: async (flashcard: Flashcard) => {
      // Convert to database format to ensure consistent property names
      const dbFormat = toDatabaseFormat(flashcard);
      
      // Update using the Supabase client directly
      const { data, error } = await window.supabase
        .from('flashcards')
        .update(dbFormat)
        .eq('id', flashcard.id)
        .select();
        
      if (error) throw error;
      return data ? fromDatabaseFormat(data[0]) : null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards', userId] });
      toast({
        title: 'Success',
        description: 'Flashcard updated successfully'
      });
    },
    onError: (error: Error) => {
      console.error('Error updating flashcard:', error);
      toast({
        title: 'Error',
        description: 'Failed to update flashcard',
        variant: 'destructive'
      });
    }
  });

  // Delete flashcard mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return deleteFlashcard(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards', userId] });
      toast({
        title: 'Success',
        description: 'Flashcard deleted successfully'
      });
    },
    onError: (error: Error) => {
      console.error('Error deleting flashcard:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete flashcard',
        variant: 'destructive'
      });
    }
  });

  return {
    createFlashcard: createMutation.mutateAsync,
    updateFlashcard: updateMutation.mutateAsync,
    deleteFlashcard: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};
