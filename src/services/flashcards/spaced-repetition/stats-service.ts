
/**
 * Service for retrieving flashcard statistics
 */
import { supabase } from '@/integrations/supabase/client';

/**
 * Get statistics for a user's flashcards
 * @param userId The user ID
 * @returns Object with flashcard statistics
 */
export const getFlashcardStats = async (userId: string) => {
  try {
    // Get all flashcards for the user
    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      throw error;
    }
    
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
    
    // Calculate statistics
    const totalCards = flashcards?.length || 0;
    const masteredCards = flashcards?.filter(card => (card.mastery_level || 0) >= 0.8).length || 0;
    const dueCount = dueCards?.length || 0;
    const reviewCount = reviewsToday?.length || 0;
    
    // Calculate average difficulty
    let totalDifficulty = 0;
    flashcards?.forEach(card => {
      totalDifficulty += card.difficulty || 3;
    });
    const averageDifficulty = totalCards > 0 ? totalDifficulty / totalCards : 0;
    
    return {
      totalCards,
      masteredCards,
      dueCards: dueCount,
      averageDifficulty,
      reviewsToday: reviewCount
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

// Create a class for StatsService to be consistent with other services
export class StatsService {
  public getFlashcardStats = getFlashcardStats;
}

// Export a singleton instance
export const statsService = new StatsService();
