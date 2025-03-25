
import { supabase } from '@/integrations/supabase/client';
import { INITIAL_EASINESS_FACTOR } from './algorithm';
import { Flashcard } from '@/types/supabase';

/**
 * Create a new flashcard
 * 
 * @param frontContent The front content of the flashcard
 * @param backContent The back content of the flashcard
 * @param topicId Optional topic ID to associate with the flashcard
 * @returns Object with data (created flashcard) or error
 */
export const createFlashcard = async (
  frontContent: string,
  backContent: string,
  topicId?: string
): Promise<{ data: Flashcard | null; error: Error | null }> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      return { data: null, error: userError };
    }
    
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }
    
    // Calculate initial review date (today)
    const initialReviewDate = new Date().toISOString();
    
    // Create the flashcard
    const { data, error } = await supabase
      .from('flashcards')
      .insert({
        user_id: user.id,
        front_content: frontContent,
        back_content: backContent,
        topic_id: topicId,
        difficulty: 0, // No difficulty rating yet
        repetition_count: 0,
        easiness_factor: INITIAL_EASINESS_FACTOR,
        next_review_date: initialReviewDate,
        mastery_level: 0
      })
      .select()
      .single();
      
    if (error) {
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating flashcard:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error creating flashcard') 
    };
  }
};

/**
 * Delete a flashcard
 * 
 * @param flashcardId The ID of the flashcard to delete
 * @returns Object with success status or error
 */
export const deleteFlashcard = async (
  flashcardId: string
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      return { success: false, error: userError };
    }
    
    if (!user) {
      return { success: false, error: new Error('User not authenticated') };
    }
    
    // Delete the flashcard
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', flashcardId)
      .eq('user_id', user.id); // Ensure the user owns the flashcard
      
    if (error) {
      return { success: false, error };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Unknown error deleting flashcard') 
    };
  }
};
