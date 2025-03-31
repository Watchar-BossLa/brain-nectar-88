import { supabase } from '@/integrations/supabase/client';

/**
 * Stub functions for database tables that don't exist yet
 * These can be called instead of direct supabase calls to avoid errors
 */

/**
 * Handles queries to flashcard_learning_stats table which doesn't exist yet
 * Redirects to the flashcards table instead
 */
export const queryFlashcardLearningStats = async (userId: string, flashcardId?: string) => {
  // If flashcard ID is provided, get that specific card
  if (flashcardId) {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .eq('id', flashcardId)
      .single();
      
    if (error) {
      console.error('Error querying flashcard stats:', error);
      return { data: null, error };
    }
    
    // Transform to match expected learning stats format
    const transformedData = data ? {
      id: data.id,
      flashcard_id: data.id,
      user_id: data.user_id,
      easiness_factor: data.easiness_factor || 2.5,
      interval: data.repetition_count || 0,
      repetitions: data.repetition_count || 0,
      last_reviewed_at: data.last_reviewed_at || data.updated_at,
      next_review_at: data.next_review_date,
      review_count: data.repetition_count || 0,
      mastery_level: data.mastery_level || 0
    } : null;
    
    return { data: transformedData, error: null };
  }
  
  // Otherwise get all cards for this user
  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('user_id', userId);
    
  if (error) {
    console.error('Error querying flashcard stats:', error);
    return { data: null, error };
  }
  
  // Transform to match expected learning stats format
  const transformedData = data?.map(card => ({
    id: card.id,
    flashcard_id: card.id,
    user_id: card.user_id,
    easiness_factor: card.easiness_factor || 2.5,
    interval: card.repetition_count || 0,
    repetitions: card.repetition_count || 0,
    last_reviewed_at: card.last_reviewed_at || card.updated_at,
    next_review_at: card.next_review_date,
    review_count: card.repetition_count || 0,
    mastery_level: card.mastery_level || 0
  }));
  
  return { data: transformedData || [], error: null };
};

/**
 * Handles updates to flashcard_learning_stats table which doesn't exist yet
 * Updates the flashcards table instead
 */
export const updateFlashcardLearningStats = async (
  flashcardId: string, 
  userId: string, 
  updates: Record<string, any>
) => {
  // Transform learning stats updates to flashcard updates
  const flashcardUpdates: Record<string, any> = {};
  
  if (updates.easiness_factor !== undefined) {
    flashcardUpdates.easiness_factor = updates.easiness_factor;
  }
  
  if (updates.interval !== undefined || updates.repetitions !== undefined) {
    flashcardUpdates.repetition_count = updates.repetitions || updates.interval;
  }
  
  if (updates.last_reviewed_at !== undefined) {
    flashcardUpdates.last_reviewed_at = updates.last_reviewed_at;
  }
  
  if (updates.next_review_at !== undefined) {
    flashcardUpdates.next_review_date = updates.next_review_at;
  }
  
  if (updates.mastery_level !== undefined) {
    flashcardUpdates.mastery_level = updates.mastery_level;
  }
  
  // Update the flashcards table
  const { data, error } = await supabase
    .from('flashcards')
    .update(flashcardUpdates)
    .eq('id', flashcardId)
    .eq('user_id', userId);
    
  return { data, error };
};
