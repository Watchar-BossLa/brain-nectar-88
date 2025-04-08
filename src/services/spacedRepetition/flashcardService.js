
/**
 * Basic flashcard CRUD operations and queries
 */
import { supabase } from '@/integrations/supabase/client';

/**
 * Get due flashcards for a user
 * 
 * @param {string} userId - User ID
 * @param {string} [topicId] - Optional topic ID filter
 * @param {number} [limit=20] - Maximum number of flashcards to return
 * @returns {Promise<{data?: any[], error?: Error}>} Result with data or error
 */
export const getDueFlashcards = async (userId, topicId = null, limit = 20) => {
  try {
    const now = new Date().toISOString();
    let query = supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review_date', now)
      .order('next_review_date')
      .limit(limit);
      
    if (topicId) {
      query = query.eq('topic_id', topicId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      return { error };
    }
    
    return { data };
  } catch (error) {
    return { error };
  }
};

/**
 * Get all flashcards for a user
 * 
 * @param {string} userId - User ID
 * @returns {Promise<{data?: any[], error?: Error}>} Result with data or error
 */
export const getUserFlashcards = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      return { error };
    }
    
    return { data };
  } catch (error) {
    return { error };
  }
};

/**
 * Get flashcards for a specific topic
 * 
 * @param {string} userId - User ID
 * @param {string} topicId - Topic ID
 * @returns {Promise<{data?: any[], error?: Error}>} Result with data or error
 */
export const getFlashcardsByTopic = async (userId, topicId) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .order('created_at', { ascending: false });
      
    if (error) {
      return { error };
    }
    
    return { data };
  } catch (error) {
    return { error };
  }
};

/**
 * Get flashcards that a user is struggling with (high difficulty)
 * 
 * @param {string} userId - User ID
 * @param {number} [minDifficulty=4] - Minimum difficulty to include
 * @param {number} [limit=10] - Maximum number to return
 * @returns {Promise<{data?: any[], error?: Error}>} Result with data or error
 */
export const getStrugglingFlashcards = async (userId, minDifficulty = 4, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .gte('difficulty', minDifficulty)
      .order('difficulty', { ascending: false })
      .limit(limit);
      
    if (error) {
      return { error };
    }
    
    return { data };
  } catch (error) {
    return { error };
  }
};

/**
 * Get flashcards that a user has mastered
 * 
 * @param {string} userId - User ID
 * @param {number} [minMastery=0.8] - Minimum mastery level
 * @param {number} [limit=10] - Maximum number to return
 * @returns {Promise<{data?: any[], error?: Error}>} Result with data or error
 */
export const getMasteredFlashcards = async (userId, minMastery = 0.8, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .gte('mastery_level', minMastery)
      .order('mastery_level', { ascending: false })
      .limit(limit);
      
    if (error) {
      return { error };
    }
    
    return { data };
  } catch (error) {
    return { error };
  }
};

/**
 * Create a new flashcard
 * 
 * @param {string} userId - User ID
 * @param {string} frontContent - Front content
 * @param {string} backContent - Back content
 * @param {string} [topicId] - Topic ID
 * @returns {Promise<{data?: any, error?: Error}>} Result with data or error
 */
export const createFlashcard = async (userId, frontContent, backContent, topicId = null) => {
  try {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('flashcards')
      .insert({
        user_id: userId,
        front_content: frontContent,
        back_content: backContent,
        topic_id: topicId,
        next_review_date: now,
        created_at: now,
        updated_at: now,
        difficulty: 3, // Default middle difficulty
        repetition_count: 0,
        easiness_factor: 2.5,
        mastery_level: 0
      })
      .select();
      
    if (error) {
      return { error };
    }
    
    return { data: data[0] };
  } catch (error) {
    return { error };
  }
};

/**
 * Delete a flashcard
 * 
 * @param {string} id - Flashcard ID
 * @returns {Promise<{success?: boolean, error?: Error}>} Result with success or error
 */
export const deleteFlashcard = async (id) => {
  try {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', id);
      
    if (error) {
      return { error };
    }
    
    return { success: true };
  } catch (error) {
    return { error };
  }
};

/**
 * Get flashcard statistics
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Flashcard stats
 */
export const getFlashcardStats = async (userId) => {
  try {
    // This is a wrapper around the learning stats service
    // Importing from there would create a circular dependency
    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      throw error;
    }
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Basic stats calculation
    let totalCards = flashcards?.length || 0;
    let masteredCards = 0;
    let dueCards = 0;
    let totalDifficulty = 0;
    
    for (const card of flashcards || []) {
      if ((card.mastery_level || 0) > 0.8) {
        masteredCards++;
      }
      
      if (card.next_review_date && new Date(card.next_review_date) <= now) {
        dueCards++;
      }
      
      totalDifficulty += card.difficulty || 0;
    }
    
    const averageDifficulty = totalCards > 0 ? totalDifficulty / totalCards : 0;
    
    // Get review count for today
    const { count: reviewsToday, error: reviewError } = await supabase
      .from('flashcard_reviews')
      .select('id', { count: true })
      .eq('user_id', userId)
      .gte('reviewed_at', today.toISOString());
      
    if (reviewError) {
      console.error('Error fetching reviews:', reviewError);
    }
    
    return {
      totalCards,
      masteredCards,
      dueCards,
      averageDifficulty,
      reviewsToday: reviewsToday || 0
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
