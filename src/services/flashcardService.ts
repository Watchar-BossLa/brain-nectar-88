
/**
 * This file serves as a facade for backward compatibility.
 * It re-exports all flashcard-related functionality from the spacedRepetition module.
 */

import { supabase } from '@/integrations/supabase/client';
import { 
  calculateNextReviewDate,
  INITIAL_EASINESS_FACTOR as INITIAL_EF,
  MIN_EASINESS_FACTOR as MIN_EF
} from './spacedRepetition/algorithm';

// Export the constants
export const INITIAL_EASINESS_FACTOR = INITIAL_EF;
export const MIN_EASINESS_FACTOR = MIN_EF;
export { calculateNextReviewDate };

// Get all flashcards for the current user
export const getUserFlashcards = async () => {
  try {
    // Get current user with updated syntax
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    
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
export const getDueFlashcards = async (userId: string, topicId?: string) => {
  try {
    if (!userId) {
      // Get current user with updated syntax
      const { data: sessionData } = await supabase.auth.getSession();
      userId = sessionData.session?.user?.id;
    
      if (!userId) {
        console.error('No authenticated user found');
        return { data: null, error: new Error('User not authenticated') };
      }
    }
    
    return getSpacedRepDueFlashcards(userId, topicId);
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
export const getSpacedRepDueFlashcards = async (userId: string, topicId?: string) => {
  try {
    let query = supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review_date', new Date().toISOString());
      
    if (topicId) {
      query = query.eq('topic_id', topicId);
    }
    
    const { data, error } = await query;
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

// Create a new flashcard
export const createFlashcard = async (userId: string, frontContent: string, backContent: string, topicId?: string) => {
  // Support both function signatures for backward compatibility
  if (typeof userId !== 'string' || userId.length < 10) {
    // If first argument doesn't look like a userId, assume it's frontContent
    return createSpacedRepFlashcard(null, userId, frontContent, backContent);
  }
  return createSpacedRepFlashcard(userId, frontContent, backContent, topicId);
};

// Create a new flashcard with the spaced repetition system
export const createSpacedRepFlashcard = async (
  userId: string | null, 
  frontContent: string, 
  backContent: string, 
  topicId?: string
) => {
  try {
    if (!userId) {
      // Get current user
      const { data: sessionData } = await supabase.auth.getSession();
      userId = sessionData.session?.user?.id;
      
      if (!userId) {
        return { data: null, error: new Error('User not authenticated') };
      }
    }

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
export const updateFlashcardAfterReview = async (flashcardId: string, difficulty: number) => {
  try {
    // Get current flashcard data
    const { data: flashcard, error: fetchError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('id', flashcardId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching flashcard:', fetchError);
      return { data: null, error: fetchError };
    }
    
    if (!flashcard) {
      return { data: null, error: new Error('Flashcard not found') };
    }
    
    // Calculate new spaced repetition values
    const easinessFactor = Math.max(MIN_EASINESS_FACTOR, 
      (flashcard.easiness_factor || INITIAL_EASINESS_FACTOR) + 
      (0.1 - (5 - difficulty) * (0.08 + (5 - difficulty) * 0.02)));
    
    let repetitions = (flashcard.repetition_count || 0);
    if (difficulty < 3) {
      repetitions = 0;
    } else {
      repetitions += 1;
    }
    
    // Calculate next review interval
    let interval: number;
    if (repetitions <= 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round((flashcard.repetition_count || repetitions) * easinessFactor);
    }
    
    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);
    
    // Calculate mastery level - simple formula based on repetitions
    const masteryLevel = Math.min(1.0, (repetitions / 10) + (easinessFactor - 1.3) / 2.5 * 0.5);
    
    // Update the flashcard
    const { data, error } = await supabase
      .from('flashcards')
      .update({
        easiness_factor: easinessFactor,
        repetition_count: repetitions,
        interval: interval,
        last_reviewed_at: new Date().toISOString(),
        next_review_date: nextReviewDate.toISOString(),
        mastery_level: masteryLevel,
        difficulty: difficulty
      })
      .eq('id', flashcardId)
      .select();
      
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
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

// Get flashcard statistics
export const getFlashcardStats = async (userId: string) => {
  try {
    // Get all flashcards for the user
    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      throw error;
    }
    
    // Get flashcards due today
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    
    const { data: dueCards, error: dueError } = await supabase
      .from('flashcards')
      .select('id')
      .eq('user_id', userId)
      .lte('next_review_date', endOfDay.toISOString());
      
    if (dueError) {
      throw dueError;
    }
    
    // Get reviews done today
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    
    const { data: reviewsToday, error: reviewError } = await supabase
      .from('flashcard_reviews')
      .select('id')
      .eq('user_id', userId)
      .gte('reviewed_at', startOfDay.toISOString());
      
    if (reviewError) {
      throw reviewError;
    }
    
    // Calculate statistics
    const totalCards = flashcards?.length || 0;
    const masteredCards = flashcards?.filter(card => (card.mastery_level || 0) >= 0.8).length || 0;
    const dueCount = dueCards?.length || 0;
    const reviewCount = reviewsToday?.length || 0;
    
    // Calculate average difficulty
    let totalDifficulty = 0;
    flashcards?.forEach(card => {
      totalDifficulty += card.difficulty || 2.5;
    });
    const averageDifficulty = totalCards > 0 ? totalDifficulty / totalCards : 0;
    
    return {
      totalCards,
      masteredCards,
      dueCards: dueCount,
      averageDifficulty,
      reviewsToday: reviewCount
    };
  } catch (error) {
    console.error('Error getting flashcard stats:', error);
    return {
      totalCards: 0,
      masteredCards: 0,
      dueCards: 0,
      averageDifficulty: 0,
      reviewsToday: 0
    };
  }
};
