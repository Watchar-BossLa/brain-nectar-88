import { supabase } from '@/integrations/supabase/client';
import { INITIAL_EASINESS_FACTOR, calculateMasteryLevel } from './algorithm';
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
 * Creates a new flashcard with initial spaced repetition parameters
 */
export const createFlashcard = async (
  frontContent: string,
  backContent: string,
  topicId?: string
) => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    // Default next review date is today (cards are due immediately after creation)
    const nextReviewDate = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('flashcards')
      .insert({
        user_id: user.id,
        front_content: frontContent,
        back_content: backContent,
        topic_id: topicId || null,
        difficulty: INITIAL_EASINESS_FACTOR,
        repetition_count: 0,
        next_review_date: nextReviewDate,
        mastery_level: 0, // Start with zero mastery
      })
      .select();
      
    if (error) {
      console.error('Error creating flashcard:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in createFlashcard:', error);
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
 * Delete a flashcard
 */
export const deleteFlashcard = async (flashcardId: string) => {
  try {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', flashcardId);
      
    if (error) {
      console.error('Error deleting flashcard:', error);
      return { error };
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error in deleteFlashcard:', error);
    return { error };
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

/**
 * Get flashcard statistics for a user
 */
export const getFlashcardStats = async (userId: string) => {
  try {
    // Get total cards count
    const { count: totalCount, error: countError } = await supabase
      .from('flashcards')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
      
    if (countError) {
      throw countError;
    }
    
    // Get due cards
    const now = new Date().toISOString();
    const { data: dueCards, error: dueError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review_date', now);
      
    if (dueError) {
      throw dueError;
    }
    
    // Get mastered cards count
    const { data: masteredData, error: masteredError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .gte('mastery_level', 0.8);
      
    if (masteredError) {
      throw masteredError;
    }
    
    // Get average difficulty
    const { data: allCards, error: allCardsError } = await supabase
      .from('flashcards')
      .select('difficulty')
      .eq('user_id', userId);
      
    if (allCardsError) {
      throw allCardsError;
    }
    
    const averageDifficulty = allCards?.length 
      ? allCards.reduce((sum, card) => sum + (card.difficulty || 0), 0) / allCards.length
      : 0;
    
    // Get reviews today count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if the flashcard_reviews table exists before querying it
    let reviewsToday = 0;
    try {
      const { count: reviewsCount, error: reviewsError } = await supabase
        .from('flashcard_reviews')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('reviewed_at', today.toISOString());
        
      if (!reviewsError) {
        reviewsToday = reviewsCount || 0;
      }
    } catch (error) {
      console.warn('Could not get reviews count, table might not exist yet:', error);
      // If the table doesn't exist, we'll just continue with reviewsToday = 0
    }
    
    return {
      totalCards: totalCount || 0,
      dueCards: dueCards?.length || 0,
      masteredCards: masteredData?.length || 0,
      averageDifficulty: averageDifficulty || 0,
      reviewsToday: reviewsToday
    };
  } catch (error) {
    console.error('Error getting flashcard stats:', error);
    return {
      totalCards: 0,
      dueCards: 0,
      masteredCards: 0,
      averageDifficulty: 0,
      reviewsToday: 0
    };
  }
};
