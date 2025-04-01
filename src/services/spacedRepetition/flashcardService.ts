
import { supabase } from '@/integrations/supabase/client';
import { INITIAL_EASINESS_FACTOR } from './algorithm';

/**
 * Get all flashcards for a user
 */
export const getUserFlashcards = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting user flashcards:', error);
    return [];
  }
};

/**
 * Get flashcards that are due for review
 */
export const getDueFlashcards = async (userId: string, topicId?: string) => {
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
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting due flashcards:', error);
    return [];
  }
};

/**
 * Create multiple flashcards for a user
 */
export const createFlashcardsInBulk = async (userId: string, flashcards: { front_content: string; back_content: string; topic_id?: string }[]) => {
  try {
    const formattedFlashcards = flashcards.map(card => ({
      user_id: userId,
      front_content: card.front_content,
      back_content: card.back_content,
      topic_id: card.topic_id || null,
      difficulty: 1,
      repetition_count: 0,
      mastery_level: 0,
      easiness_factor: INITIAL_EASINESS_FACTOR,
      next_review_date: new Date().toISOString()
    }));
    
    // Insert multiple flashcards as an array
    const { data, error } = await supabase
      .from('flashcards')
      .insert(formattedFlashcards)
      .select();
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error creating flashcards in bulk:', error);
    return [];
  }
};

/**
 * Create a new flashcard
 */
export const createFlashcard = async (userId: string, frontContent: string, backContent: string, topicId?: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .insert({
        user_id: userId,
        front_content: frontContent,
        back_content: backContent,
        topic_id: topicId || null,
        difficulty: 1,
        repetition_count: 0,
        mastery_level: 0,
        easiness_factor: INITIAL_EASINESS_FACTOR,
        next_review_date: new Date().toISOString()
      })
      .select();
      
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error creating flashcard:', error);
    return null;
  }
};

/**
 * Update a flashcard
 */
export const updateFlashcard = async (flashcardId: string, updates: { front_content?: string; back_content?: string; topic_id?: string }) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .update(updates)
      .eq('id', flashcardId)
      .select();
      
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error updating flashcard:', error);
    return null;
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
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    return false;
  }
};

/**
 * Get flashcards by topic
 */
export const getFlashcardsByTopic = async (userId: string, topicId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting flashcards by topic:', error);
    return [];
  }
};
