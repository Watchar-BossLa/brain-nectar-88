
import { supabase } from '@/integrations/supabase/client';

/**
 * Service for retrieving and calculating flashcard statistics
 */
export class StatsService {
  /**
   * Get statistics for flashcard learning progress
   */
  public async getFlashcardStats(userId: string): Promise<{
    totalCards: number;
    masteredCards: number;
    dueCards: number;
    averageDifficulty: number;
    reviewsToday: number;
  }> {
    try {
      // Get total cards count
      const { count: totalCards, error: countError } = await supabase
        .from('flashcards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
        
      if (countError) {
        console.error('Error counting flashcards:', countError);
        return {
          totalCards: 0,
          masteredCards: 0,
          dueCards: 0,
          averageDifficulty: 0,
          reviewsToday: 0
        };
      }
      
      // Get due cards count
      const now = new Date().toISOString();
      const { count: dueCards, error: dueError } = await supabase
        .from('flashcards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .lte('next_review_date', now);
        
      if (dueError) {
        console.error('Error counting due flashcards:', dueError);
        return {
          totalCards: totalCards || 0,
          masteredCards: 0,
          dueCards: 0,
          averageDifficulty: 0,
          reviewsToday: 0
        };
      }
      
      // Get mastered cards (repetition count >= 5 and difficulty >= 4)
      const { count: masteredCards, error: masteredError } = await supabase
        .from('flashcards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('repetition_count', 5)
        .gte('difficulty', 4);
        
      if (masteredError) {
        console.error('Error counting mastered flashcards:', masteredError);
        return {
          totalCards: totalCards || 0,
          masteredCards: 0,
          dueCards: dueCards || 0,
          averageDifficulty: 0,
          reviewsToday: 0
        };
      }
      
      // Get average difficulty
      const { data: difficultyData, error: difficultyError } = await supabase
        .from('flashcards')
        .select('difficulty')
        .eq('user_id', userId)
        .gt('difficulty', 0); // Only include cards that have been reviewed
        
      if (difficultyError) {
        console.error('Error getting flashcard difficulties:', difficultyError);
        return {
          totalCards: totalCards || 0,
          masteredCards: masteredCards || 0,
          dueCards: dueCards || 0,
          averageDifficulty: 0,
          reviewsToday: 0
        };
      }
      
      // Calculate average difficulty
      const averageDifficulty = difficultyData && difficultyData.length > 0
        ? difficultyData.reduce((sum, card) => sum + (card.difficulty || 0), 0) / difficultyData.length
        : 0;
      
      // For reviews today, we'll use an approximation based on flashcards updated today
      // since we don't have a flashcard_reviews table yet
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: reviewsToday, error: reviewsError } = await supabase
        .from('flashcards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('updated_at', today.toISOString());
        
      if (reviewsError) {
        console.error('Error getting today\'s reviews:', reviewsError);
        return {
          totalCards: totalCards || 0,
          masteredCards: masteredCards || 0,
          dueCards: dueCards || 0,
          averageDifficulty,
          reviewsToday: 0
        };
      }
      
      return {
        totalCards: totalCards || 0,
        masteredCards: masteredCards || 0,
        dueCards: dueCards || 0,
        averageDifficulty,
        reviewsToday: reviewsToday || 0
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
  }
}

export const statsService = new StatsService();
