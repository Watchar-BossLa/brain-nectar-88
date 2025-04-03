
/**
 * This file serves as a facade for backward compatibility.
 * It re-exports all flashcard-related functionality from the spacedRepetition module.
 */

import { supabase } from '@/integrations/supabase/client';
import { 
  calculateNextReviewDate, 
  INITIAL_EASINESS_FACTOR,
  MIN_EASINESS_FACTOR,
  getDueFlashcards as getSpacedRepDueFlashcards,
  createFlashcard as createSpacedRepFlashcard,
  getUserFlashcards as getSpacedRepUserFlashcards,
  deleteFlashcard as deleteSpacedRepFlashcard,
  getFlashcardsByTopic as getSpacedRepFlashcardsByTopic,
  updateFlashcardAfterReview as updateSpacedRepFlashcardAfterReview
} from './spacedRepetition';

// Export the constants
export { INITIAL_EASINESS_FACTOR, MIN_EASINESS_FACTOR };
export { calculateNextReviewDate };

// Get all flashcards for the current user
export const getUserFlashcards = async () => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
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
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
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

// Create a new flashcard
export const createFlashcard = async (frontContent: string, backContent: string, topicId?: string) => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
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

// Update flashcard after review
export const updateFlashcardAfterReview = async (flashcardId: string, difficulty: number) => {
  return updateSpacedRepFlashcardAfterReview(flashcardId, difficulty);
};

// Delete a flashcard
export const deleteFlashcard = async (flashcardId: string) => {
  return deleteSpacedRepFlashcard(flashcardId);
};

// Get flashcards by topic ID
export const getFlashcardsByTopic = async (topicId: string) => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return { data: null, error: new Error('User not authenticated') };
    }
    
    return getSpacedRepFlashcardsByTopic(user.id, topicId);
  } catch (error) {
    console.error('Error in getFlashcardsByTopic:', error);
    return { data: null, error };
  }
};
