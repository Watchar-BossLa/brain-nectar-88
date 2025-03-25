
import { supabase } from '@/integrations/supabase/client';
import { Flashcard } from '@/types/supabase';

/**
 * Get flashcards due for review for a user
 * 
 * @param userId The user ID to fetch flashcards for
 * @param topicId Optional topic ID to filter by
 * @param limit Maximum number of flashcards to return
 * @returns Object with data array or error
 */
export const getDueFlashcards = async (
  userId: string,
  topicId?: string,
  limit: number = 50
): Promise<{ data: Flashcard[] | null; error: Error | null }> => {
  try {
    // Get flashcards due for review
    const now = new Date().toISOString();
    let query = supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review_date', now)
      .order('next_review_date');
      
    // Filter by topic if provided
    if (topicId) {
      query = query.eq('topic_id', topicId);
    }
    
    const { data, error } = await query.limit(limit);
    
    if (error) {
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error getting due flashcards:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error getting due flashcards') 
    };
  }
};

/**
 * Get all flashcards for a user
 * 
 * @param userId The user ID to fetch flashcards for
 * @returns Object with data array or error
 */
export const getUserFlashcards = async (
  userId: string
): Promise<{ data: Flashcard[] | null; error: Error | null }> => {
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
    console.error('Error getting user flashcards:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error getting user flashcards') 
    };
  }
};

/**
 * Get flashcards for a specific topic
 * 
 * @param userId The user ID to fetch flashcards for
 * @param topicId The topic ID to filter by
 * @returns Object with data array or error
 */
export const getFlashcardsByTopic = async (
  userId: string,
  topicId: string
): Promise<{ data: Flashcard[] | null; error: Error | null }> => {
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
    console.error('Error getting flashcards by topic:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error getting flashcards by topic') 
    };
  }
};

/**
 * Get flashcards that the user is struggling with
 * 
 * @param userId The user ID to fetch flashcards for
 * @param limit Maximum number of flashcards to return
 * @returns Object with data array or error
 */
export const getStrugglingFlashcards = async (
  userId: string,
  limit: number = 10
): Promise<{ data: Flashcard[] | null; error: Error | null }> => {
  try {
    // Define struggling as:
    // - Repetition count > 1 (reviewed multiple times)
    // - High difficulty rating (4-5)
    // - OR low easiness factor (less than 1.8)
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .gt('repetition_count', 1)
      .or('difficulty.gt.3,easiness_factor.lt.1.8')
      .order('difficulty', { ascending: false })
      .limit(limit);
      
    if (error) {
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error getting struggling flashcards:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error getting struggling flashcards') 
    };
  }
};

/**
 * Get mastered flashcards
 * 
 * @param userId The user ID to fetch flashcards for
 * @param limit Maximum number of flashcards to return
 * @returns Object with data array or error
 */
export const getMasteredFlashcards = async (
  userId: string,
  limit: number = 50
): Promise<{ data: Flashcard[] | null; error: Error | null }> => {
  try {
    // Define mastered as:
    // - Repetition count >= 5 (reviewed multiple times successfully)
    // - Low difficulty rating (1-2)
    // - OR high easiness factor (greater than 2.5)
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .gte('repetition_count', 5)
      .or('difficulty.lt.3,easiness_factor.gt.2.5')
      .order('repetition_count', { ascending: false })
      .limit(limit);
      
    if (error) {
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error getting mastered flashcards:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error getting mastered flashcards') 
    };
  }
};
