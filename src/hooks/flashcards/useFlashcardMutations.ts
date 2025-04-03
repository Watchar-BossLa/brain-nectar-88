
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Flashcard, toDatabaseFormat } from '@/types/flashcard';
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
      
      // Ensure required fields are present
      if (!dbFlashcard.front_content || !dbFlashcard.back_content || !dbFlashcard.user_id) {
        throw new Error('Missing required flashcard fields');
      }
      
      const { data, error } = await supabase
        .from('flashcards')
        .insert({
          front_content: dbFlashcard.front_content,
          back_content: dbFlashcard.back_content,
          user_id: dbFlashcard.user_id,
          topic_id: dbFlashcard.topic_id || null,
          difficulty: dbFlashcard.difficulty || 2.5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Success!',
        description: 'Flashcard created successfully.',
      });

      return data ? {
        id: data.id,
        userId: data.user_id,
        user_id: data.user_id,
        topicId: data.topic_id || '',
        topic_id: data.topic_id || '',
        frontContent: data.front_content,
        front_content: data.front_content,
        backContent: data.back_content,
        back_content: data.back_content,
        difficulty: data.difficulty,
        nextReviewDate: data.next_review_date || new Date().toISOString(),
        next_review_date: data.next_review_date || new Date().toISOString(),
        repetitionCount: data.repetition_count || 0,
        repetition_count: data.repetition_count || 0,
        masteryLevel: data.mastery_level || 0,
        mastery_level: data.mastery_level || 0,
        createdAt: data.created_at || new Date().toISOString(),
        created_at: data.created_at || new Date().toISOString(),
        updatedAt: data.updated_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
        easinessFactor: data.easiness_factor || 2.5,
        easiness_factor: data.easiness_factor || 2.5,
        lastRetention: data.last_retention || 0,
        last_retention: data.last_retention || 0,
        lastReviewedAt: data.last_reviewed_at || new Date().toISOString(),
        last_reviewed_at: data.last_reviewed_at || new Date().toISOString(),
        front: data.front_content,
        back: data.back_content
      } : null;
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
