
import { supabase } from '@/integrations/supabase/client';

/**
 * Service for retrieving flashcards based on various criteria
 */
export class RetrievalService {
  /**
   * Get flashcards due for review for a user
   */
  public async getDueFlashcards(userId: string, limit: number = 20): Promise<any[]> {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId)
        .lte('next_review_date', now)
        .order('next_review_date')
        .limit(limit);
        
      if (error) {
        console.error('Error fetching due flashcards:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getDueFlashcards:', error);
      return [];
    }
  }
}

export const retrievalService = new RetrievalService();
