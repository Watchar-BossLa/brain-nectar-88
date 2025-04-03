
/**
 * Flashcard service main file
 * 
 * This file contains all core functions for flashcard management
 */

import { supabase } from '@/integrations/supabase/client';
import { calculateNextReviewDate } from './algorithm';
import { Flashcard } from '@/types/supabase';

/**
 * Get flashcards that are due for review
 * 
 * @param userId The user ID to get flashcards for
 * @returns Object with data or error
 */
export const getDueFlashcards = async (userId: string) => {
  try {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review_date', now)
      .order('next_review_date', { ascending: true });
      
    if (error) {
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching due flashcards:', error);
    return { data: null, error };
  }
};

/**
 * Get all flashcards for a user
 * 
 * @param userId The user ID to get flashcards for
 * @returns Object with data or error
 */
export const getUserFlashcards = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user flashcards:', error);
    return { data: null, error };
  }
};

/**
 * Get flashcards for a specific topic
 * 
 * @param userId The user ID to get flashcards for
 * @param topicId The topic ID to get flashcards for
 * @returns Object with data or error
 */
export const getFlashcardsByTopic = async (userId: string, topicId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .order('created_at', { ascending: false });
      
    if (error) {
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching topic flashcards:', error);
    return { data: null, error };
  }
};

/**
 * Create a new flashcard
 * 
 * @param userId User ID for the flashcard owner
 * @param frontContent Content for the front of the flashcard
 * @param backContent Content for the back of the flashcard
 * @param topicId Optional topic ID for categorization
 * @returns Object with data or error
 */
export const createFlashcard = async (
  userId: string,
  frontContent: string,
  backContent: string,
  topicId?: string
) => {
  try {
    const now = new Date().toISOString();
    
    const flashcard = {
      user_id: userId,
      front_content: frontContent,
      back_content: backContent,
      topic_id: topicId || null,
      difficulty: 0,
      next_review_date: now,
      repetition_count: 0,
      mastery_level: 0,
      easiness_factor: 2.5,
      created_at: now,
      updated_at: now
    };
    
    const { data, error } = await supabase
      .from('flashcards')
      .insert(flashcard)
      .select()
      .single();
      
    if (error) {
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating flashcard:', error);
    return { data: null, error };
  }
};

/**
 * Delete a flashcard
 * 
 * @param flashcardId ID of the flashcard to delete
 * @returns Object with success or error
 */
export const deleteFlashcard = async (flashcardId: string) => {
  try {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', flashcardId);
      
    if (error) {
      return { success: false, error };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    return { success: false, error };
  }
};

/**
 * Get statistics for a user's flashcards
 * 
 * @param userId The user ID to get statistics for
 * @returns Object with statistics
 */
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

/**
 * Get struggling flashcards (low mastery level, high difficulty)
 * 
 * @param userId The user ID to get flashcards for
 * @returns Object with data or error
 */
export const getStrugglingFlashcards = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lt('mastery_level', 0.4)
      .gt('repetition_count', 2)
      .order('mastery_level', { ascending: true });
      
    if (error) {
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching struggling flashcards:', error);
    return { data: null, error };
  }
};

/**
 * Get mastered flashcards (high mastery level)
 * 
 * @param userId The user ID to get flashcards for
 * @returns Object with data or error
 */
export const getMasteredFlashcards = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .gte('mastery_level', 0.8)
      .gt('repetition_count', 3)
      .order('mastery_level', { ascending: false });
      
    if (error) {
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching mastered flashcards:', error);
    return { data: null, error };
  }
};
