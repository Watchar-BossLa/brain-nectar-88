
/**
 * Service for retrieving user-level flashcard statistics
 */
import { supabase } from '@/integrations/supabase/client';

/**
 * Get general statistics for a user's flashcards
 * @param userId The user ID
 * @returns Object with flashcard statistics
 */
export const getUserFlashcardStats = async (userId: string) => {
  try {
    // Get all flashcards for the user
    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      throw error;
    }
    
    // Calculate statistics
    const totalCards = flashcards?.length || 0;
    const masteredCards = flashcards?.filter(card => (card.mastery_level || 0) >= 0.8).length || 0;
    
    // Calculate average difficulty
    let totalDifficulty = 0;
    flashcards?.forEach(card => {
      totalDifficulty += card.difficulty || 3;
    });
    const averageDifficulty = totalCards > 0 ? totalDifficulty / totalCards : 0;
    
    return {
      totalCards,
      masteredCards,
      averageDifficulty
    };
  } catch (error) {
    console.error('Error getting user flashcard stats:', error);
    return {
      totalCards: 0,
      masteredCards: 0,
      averageDifficulty: 0
    };
  }
};

// Create a class for UserStatsService
export class UserStatsService {
  public getUserFlashcardStats = getUserFlashcardStats;
}

// Export a singleton instance
export const userStatsService = new UserStatsService();
