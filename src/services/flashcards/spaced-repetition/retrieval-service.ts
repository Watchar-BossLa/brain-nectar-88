
/**
 * Service for retrieving flashcards
 */
import { supabase } from '@/integrations/supabase/client';
import { Flashcard } from '@/types/flashcards';

/**
 * Get flashcards that are due for review for a user
 * @param userId The user ID
 * @returns Array of flashcards due for review
 */
export const getDueFlashcards = async (userId: string): Promise<Flashcard[]> => {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review_date', now)
      .order('next_review_date', { ascending: true });
      
    if (error) {
      console.error('Error fetching due flashcards:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getDueFlashcards:', error);
    return [];
  }
};

// Create a class for RetrievalService to be consistent with other services
export class RetrievalService {
  public getDueFlashcards = getDueFlashcards;
}

// Export a singleton instance
export const retrievalService = new RetrievalService();
