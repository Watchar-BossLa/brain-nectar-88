
import { supabase } from '@/integrations/supabase/client';
import { Flashcard } from '@/types/supabase';

/**
 * Gets flashcards due for review today based on the spaced repetition algorithm
 */
export const getDueFlashcards = async (userId: string, topicId?: string) => {
  try {
    const now = new Date().toISOString();
    let query = supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review_date', now)
      .order('next_review_date', { ascending: true });
    
    if (topicId) {
      query = query.eq('topic_id', topicId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching due flashcards:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in getDueFlashcards:', error);
    return { data: null, error };
  }
};

/**
 * Get all flashcards for the current user
 */
export const getUserFlashcards = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .order('next_review_date', { ascending: true });
      
    if (error) {
      console.error('Error fetching flashcards:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in getUserFlashcards:', error);
    return { data: null, error };
  }
};

/**
 * Get flashcards by topic ID
 */
export const getFlashcardsByTopic = async (userId: string, topicId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .order('next_review_date', { ascending: true });
      
    if (error) {
      console.error('Error fetching flashcards by topic:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in getFlashcardsByTopic:', error);
    return { data: null, error };
  }
};

/**
 * Get flashcards with low mastery levels (struggling cards)
 */
export const getStrugglingFlashcards = async (userId: string, limit: number = 10) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lt('mastery_level', 0.3) // Cards with low mastery
      .order('mastery_level', { ascending: true })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching struggling flashcards:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in getStrugglingFlashcards:', error);
    return { data: null, error };
  }
};

/**
 * Get flashcards with high mastery levels (mastered cards)
 */
export const getMasteredFlashcards = async (userId: string, limit: number = 10) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .gte('mastery_level', 0.8) // Cards with high mastery
      .order('next_review_date', { ascending: true })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching mastered flashcards:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in getMasteredFlashcards:', error);
    return { data: null, error };
  }
};
