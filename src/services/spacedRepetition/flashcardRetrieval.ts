
import { supabase } from '@/integrations/supabase/client';
import { Flashcard } from '@/hooks/flashcards/types';

/**
 * Get all flashcards for a user
 */
export const getUserFlashcards = async (userId?: string): Promise<Flashcard[]> => {
  try {
    // If userId not provided, get from session
    if (!userId) {
      const { data: sessionData } = await supabase.auth.getSession();
      userId = sessionData.session?.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
    }
    
    // Get flashcards
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return [];
  }
};

/**
 * Get flashcards due for review
 */
export const getDueFlashcards = async (userId?: string, topicId?: string): Promise<Flashcard[]> => {
  try {
    // If userId not provided, get from session
    if (!userId) {
      const { data: sessionData } = await supabase.auth.getSession();
      userId = sessionData.session?.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
    }
    
    // Build query
    let query = supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review_date', new Date().toISOString());
      
    // Filter by topic if provided
    if (topicId) {
      query = query.eq('topic_id', topicId);
    }
    
    // Execute query
    const { data, error } = await query.order('next_review_date');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching due flashcards:', error);
    return [];
  }
};

/**
 * Get flashcards by topic
 */
export const getFlashcardsByTopic = async (
  userId: string,
  topicId: string
): Promise<Flashcard[]> => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId);
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching flashcards by topic:', error);
    return [];
  }
};

/**
 * Get struggling flashcards (low mastery, frequently wrong)
 */
export const getStrugglingFlashcards = async (userId: string): Promise<Flashcard[]> => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lt('mastery_level', 0.3)
      .order('mastery_level');
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching struggling flashcards:', error);
    return [];
  }
};

/**
 * Get mastered flashcards (high mastery)
 */
export const getMasteredFlashcards = async (userId: string): Promise<Flashcard[]> => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .gte('mastery_level', 0.8)
      .order('mastery_level', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching mastered flashcards:', error);
    return [];
  }
};
