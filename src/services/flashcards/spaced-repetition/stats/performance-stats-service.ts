
/**
 * Service for retrieving performance-related flashcard statistics
 */
import { supabase } from '@/integrations/supabase/client';

/**
 * Get performance statistics for a user's flashcards
 * @param userId The user ID
 * @returns Object with performance statistics
 */
export const getPerformanceStats = async (userId: string) => {
  try {
    // Get all reviews for the user
    const { data: reviews, error } = await supabase
      .from('flashcard_reviews')
      .select('difficulty_rating, retention_estimate')
      .eq('user_id', userId);
      
    if (error) {
      throw error;
    }
    
    let averageRetention = 0;
    let averageDifficulty = 3; // Default middle value
    
    if (reviews && reviews.length > 0) {
      // Calculate average retention
      const totalRetention = reviews.reduce((sum, review) => {
        return sum + (review.retention_estimate || 0);
      }, 0);
      averageRetention = totalRetention / reviews.length;
      
      // Calculate average difficulty
      const totalDifficulty = reviews.reduce((sum, review) => {
        return sum + (review.difficulty_rating || 3);
      }, 0);
      averageDifficulty = totalDifficulty / reviews.length;
    }
    
    return {
      averageRetention,
      averageDifficulty,
      reviewCount: reviews?.length || 0,
    };
  } catch (error) {
    console.error('Error getting performance stats:', error);
    return {
      averageRetention: 0,
      averageDifficulty: 3,
      reviewCount: 0,
    };
  }
};

// Create a class for PerformanceStatsService
export class PerformanceStatsService {
  public getPerformanceStats = getPerformanceStats;
}

// Export a singleton instance
export const performanceStatsService = new PerformanceStatsService();
