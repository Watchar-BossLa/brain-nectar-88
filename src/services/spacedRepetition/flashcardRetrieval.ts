
import { supabase } from '@/integrations/supabase/client';
import { queryFlashcardLearningStats } from '@/lib/database-stub';

/**
 * Get all flashcards due for review for a specific user
 * @param userId The ID of the user
 * @returns Array of flashcards due for review
 */
export const getDueFlashcards = async (userId: string) => {
  try {
    const now = new Date().toISOString();
    
    // Get flashcards due for review
    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review_date', now)
      .order('next_review_date', { ascending: true });
      
    if (error) throw error;
    
    return flashcards || [];
  } catch (error) {
    console.error('Error getting due flashcards:', error);
    return [];
  }
};

/**
 * Get all flashcards for a specific user
 * @param userId The ID of the user
 * @returns Array of all user's flashcards
 */
export const getUserFlashcards = async (userId: string) => {
  try {
    // Get all flashcards for this user
    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return flashcards || [];
  } catch (error) {
    console.error('Error getting user flashcards:', error);
    return [];
  }
};

/**
 * Get flashcards for a specific topic
 * @param userId The ID of the user
 * @param topicId The ID of the topic
 * @returns Array of flashcards for the specified topic
 */
export const getFlashcardsByTopic = async (userId: string, topicId: string) => {
  try {
    // Get flashcards for this topic
    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return flashcards || [];
  } catch (error) {
    console.error('Error getting flashcards by topic:', error);
    return [];
  }
};

/**
 * Get flashcards that the user is struggling with
 * @param userId The ID of the user
 * @param limit The maximum number of flashcards to return
 * @returns Array of struggled flashcards
 */
export const getStrugglingFlashcards = async (userId: string, limit = 10) => {
  try {
    // Flashcards with low mastery level or high repetition count
    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lt('mastery_level', 0.5)
      .gt('repetition_count', 2)
      .order('mastery_level', { ascending: true })
      .limit(limit);
      
    if (error) throw error;
    
    return flashcards || [];
  } catch (error) {
    console.error('Error getting struggling flashcards:', error);
    return [];
  }
};

/**
 * Get flashcards that the user has mastered
 * @param userId The ID of the user
 * @param limit The maximum number of flashcards to return
 * @returns Array of mastered flashcards
 */
export const getMasteredFlashcards = async (userId: string, limit = 10) => {
  try {
    // Get learning stats for all flashcards
    const { data: stats } = await queryFlashcardLearningStats(userId);
    
    if (!stats || stats.length === 0) {
      return [];
    }
    
    // Filter for mastered cards (high easiness factor and repetition count)
    const masteredIds = stats
      .filter(stat => stat.easiness_factor >= 2.5 && stat.repetitions >= 3)
      .map(stat => stat.flashcard_id);
    
    if (masteredIds.length === 0) {
      return [];
    }
    
    // Get the actual flashcards
    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .in('id', masteredIds)
      .limit(limit);
      
    if (error) throw error;
    
    return flashcards || [];
  } catch (error) {
    console.error('Error getting mastered flashcards:', error);
    return [];
  }
};
