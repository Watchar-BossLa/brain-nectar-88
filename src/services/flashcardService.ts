/**
 * This file serves as a facade for backward compatibility.
 * It re-exports all flashcard-related functionality from the spacedRepetition module.
 */

import { supabase } from '@/integrations/supabase/client';
import { 
  calculateNextReviewDate, 
  INITIAL_EASINESS_FACTOR,
  MIN_EASINESS_FACTOR,
  updateFlashcardAfterReview as updateReview
} from './spacedRepetition';

// Export the constants
export { INITIAL_EASINESS_FACTOR, MIN_EASINESS_FACTOR };
export { calculateNextReviewDate };

// Get all flashcards for the current user
export const getUserFlashcards = async () => {
  try {
    // Get current user with updated syntax
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    
    if (!user) {
      console.error('No authenticated user found');
      return { data: null, error: new Error('User not authenticated') };
    }
    
    return getSpacedRepUserFlashcards(user.id);
  } catch (error) {
    console.error('Error in getUserFlashcards:', error);
    return { data: null, error };
  }
};

// Get flashcards due for review
export const getDueFlashcards = async (topicId?: string) => {
  try {
    // Get current user with updated syntax
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    
    if (!user) {
      console.error('No authenticated user found');
      return { data: null, error: new Error('User not authenticated') };
    }
    
    return getSpacedRepDueFlashcards(user.id);
  } catch (error) {
    console.error('Error in getDueFlashcards:', error);
    return { data: null, error };
  }
};

// Get a user's flashcards
export const getSpacedRepUserFlashcards = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);
      
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

// Get flashcards due for review
export const getSpacedRepDueFlashcards = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review_date', new Date().toISOString());
      
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

// Create a new flashcard
export const createFlashcard = async (frontContent: string, backContent: string, topicId?: string) => {
  try {
    // Get current user with updated syntax
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    
    if (!user) {
      console.error('No authenticated user found');
      return { data: null, error: new Error('User not authenticated') };
    }
    
    return createSpacedRepFlashcard(user.id, frontContent, backContent, topicId);
  } catch (error) {
    console.error('Error in createFlashcard:', error);
    return { data: null, error };
  }
};

// Create a new flashcard with the spaced repetition system
export const createSpacedRepFlashcard = async (
  userId: string, 
  frontContent: string, 
  backContent: string, 
  topicId?: string
) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .insert({
        user_id: userId,
        front_content: frontContent,
        back_content: backContent,
        topic_id: topicId || null,
        difficulty: 0,
        repetition_count: 0,
        mastery_level: 0,
        easiness_factor: INITIAL_EASINESS_FACTOR,
        next_review_date: new Date().toISOString()
      })
      .select();
      
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

// Update flashcard after review
export const updateFlashcardAfterReview = async (
  flashcardId: string, 
  difficulty: number,
  userId?: string
) => {
  return updateReview(flashcardId, difficulty, userId);
};

// Delete a flashcard
export const deleteFlashcard = async (flashcardId: string) => {
  try {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', flashcardId);
      
    return { data: null, error };
  } catch (error) {
    return { data: null, error };
  }
};

// Get flashcards by topic ID
export const getFlashcardsByTopic = async (userId: string, topicId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId);
      
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};
