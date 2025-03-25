
import { supabase } from '@/integrations/supabase/client';
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
