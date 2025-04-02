
/**
 * Service for retrieving review-related flashcard statistics
 */
import { supabase } from '@/integrations/supabase/client';

/**
 * Get statistics for a user's flashcard reviews
 * @param userId The user ID
 * @returns Object with review statistics
 */
export const getReviewStats = async (userId: string) => {
  try {
    // Get flashcards due today
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    
    const { data: dueCards, error: dueError } = await supabase
      .from('flashcards')
      .select('id')
      .eq('user_id', userId)
      .lte('next_review_date', endOfDay.toISOString());
      
    if (dueError) {
      throw dueError;
    }
    
    // Get reviews done today
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    
    const { data: reviewsToday, error: reviewError } = await supabase
      .from('flashcard_reviews')
      .select('id')
      .eq('user_id', userId)
      .gte('reviewed_at', startOfDay.toISOString());
      
    if (reviewError) {
      throw reviewError;
    }
    
    return {
      dueCards: dueCards?.length || 0,
      reviewsToday: reviewsToday?.length || 0,
    };
  } catch (error) {
    console.error('Error getting review stats:', error);
    return {
      dueCards: 0,
      reviewsToday: 0,
    };
  }
};

// Create a class for ReviewStatsService
export class ReviewStatsService {
  public getReviewStats = getReviewStats;
}

// Export a singleton instance
export const reviewStatsService = new ReviewStatsService();
