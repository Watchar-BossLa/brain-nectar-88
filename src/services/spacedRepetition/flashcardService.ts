
import { supabase } from '@/integrations/supabase/client';
import { INITIAL_EASINESS_FACTOR } from './algorithm';
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
  userId: string,
  frontContent: string,
  backContent: string,
  topicId?: string
) => {
  try {
    // Default next review date is today (cards are due immediately after creation)
    const nextReviewDate = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('flashcards')
      .insert({
        user_id: userId,
        front_content: frontContent,
        back_content: backContent,
        topic_id: topicId || null,
        difficulty: INITIAL_EASINESS_FACTOR,
        repetition_count: 0,
        next_review_date: nextReviewDate,
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
