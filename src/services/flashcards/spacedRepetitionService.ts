import { supabase } from '@/integrations/supabase/client';
import { 
  calculateNextReviewDate, 
  updateEasinessFactor, 
  calculateRetention, 
  calculateMasteryLevel,
  INITIAL_EASINESS_FACTOR 
} from '@/services/spacedRepetition/algorithm';
import { FlashcardLearningStats } from '@/services/spacedRepetition/reviewTypes';

/**
 * Service for managing flashcards using a spaced repetition algorithm
 */
export class SpacedRepetitionService {
  /**
   * Record a flashcard review and update the next review date
   * 
   * @param flashcardId The ID of the reviewed flashcard
   * @param difficultyRating The user's difficulty rating (1-5) or an object containing the rating
   * @returns The updated flashcard or null if error
   */
  public async recordReview(
    flashcardId: string, 
    difficultyRating: number | { difficulty: number; reviewedAt: string }
  ): Promise<any | null> {
    try {
      // Extract difficulty from the parameter, which can be a number or an object
      const difficulty = typeof difficultyRating === 'number' 
        ? difficultyRating 
        : difficultyRating.difficulty;

      // Get current flashcard data
      const { data: flashcard, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('id', flashcardId)
        .single();
        
      if (error || !flashcard) {
        console.error('Error fetching flashcard:', error);
        return null;
      }
      
      // Calculate retention based on difficulty and current easiness factor
      const retention = calculateRetention(
        flashcard.difficulty || 3,
        flashcard.easiness_factor || INITIAL_EASINESS_FACTOR
      );
      
      // Update easiness factor based on difficulty rating
      const easinessFactor = updateEasinessFactor(
        flashcard.easiness_factor || INITIAL_EASINESS_FACTOR,
        6 - difficulty // Convert 1-5 difficulty to 5-1 quality (SM-2 uses 0-5 quality)
      );
      
      // Calculate mastery level
      const masteryLevel = calculateMasteryLevel(
        flashcard.mastery_level || 0,
        retention,
        difficulty
      );
      
      // Calculate next review date
      const nextReviewDate = calculateNextReviewDate(
        easinessFactor,
        (flashcard.repetition_count || 0) + 1
      );
      
      // Update the flashcard
      const { data, error: updateError } = await supabase
        .from('flashcards')
        .update({
          difficulty: difficulty,
          easiness_factor: easinessFactor,
          last_retention: retention,
          mastery_level: masteryLevel,
          repetition_count: (flashcard.repetition_count || 0) + 1,
          last_reviewed_at: new Date().toISOString(),
          next_review_date: nextReviewDate
        })
        .eq('id', flashcardId)
        .select('*')
        .single();
        
      if (updateError) {
        console.error('Error updating flashcard:', updateError);
        return null;
      }
      
      // Record the review
      const { error: reviewError } = await supabase
        .from('flashcard_reviews')
        .insert({
          user_id: flashcard.user_id,
          flashcard_id: flashcardId,
          difficulty_rating: difficulty,
          retention_estimate: retention
        });
        
      if (reviewError) {
        console.error('Error recording flashcard review:', reviewError);
      }
      
      return data;
    } catch (error) {
      console.error('Error recording flashcard review:', error);
      return null;
    }
  }
  
  /**
   * Get due flashcards for a user
   * 
   * @param userId The user ID
   * @param limit Maximum number of flashcards to return
   * @returns Array of due flashcards
   */
  public async getDueFlashcards(userId: string, limit: number = 20): Promise<any[]> {
    try {
      const now = new Date().toISOString();
      
      // Get cards due for review (with next_review_date before or equal to now)
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId)
        .lte('next_review_date', now)
        .order('next_review_date', { ascending: true })
        .limit(limit);
        
      if (error) {
        console.error('Error fetching due flashcards:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error getting due flashcards:', error);
      return [];
    }
  }
  
  /**
   * Get flashcard statistics for a user
   * 
   * @param userId The user ID
   * @returns Statistics about the user's flashcard learning
   */
  public async getFlashcardStats(userId: string): Promise<{
    totalCards: number;
    masteredCards: number;
    dueCards: number;
    averageDifficulty: number;
    reviewsToday: number;
  }> {
    try {
      // Get count of all flashcards
      const { count: totalCount, error: countError } = await supabase
        .from('flashcards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
        
      if (countError) {
        throw countError;
      }
      
      // Get due cards
      const now = new Date().toISOString();
      const { count: dueCount, error: dueError } = await supabase
        .from('flashcards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .lte('next_review_date', now);
        
      if (dueError) {
        throw dueError;
      }
      
      // Get mastered cards (mastery level >= 0.8)
      const { count: masteredCount, error: masteredError } = await supabase
        .from('flashcards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('mastery_level', 0.8);
        
      if (masteredError) {
        throw masteredError;
      }
      
      // Get average difficulty
      const { data: allCards, error: cardsError } = await supabase
        .from('flashcards')
        .select('difficulty')
        .eq('user_id', userId);
        
      if (cardsError) {
        throw cardsError;
      }
      
      const avgDifficulty = allCards && allCards.length > 0
        ? allCards.reduce((sum, card) => sum + (card.difficulty || 3), 0) / allCards.length
        : 3;
      
      // Get reviews today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: reviewsToday, error: reviewsError } = await supabase
        .from('flashcard_reviews')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('reviewed_at', today.toISOString());
        
      if (reviewsError) {
        throw reviewsError;
      }
      
      return {
        totalCards: totalCount || 0,
        masteredCards: masteredCount || 0,
        dueCards: dueCount || 0,
        averageDifficulty: avgDifficulty,
        reviewsToday: reviewsToday || 0
      };
    } catch (error) {
      console.error('Error getting flashcard stats:', error);
      return {
        totalCards: 0,
        masteredCards: 0,
        dueCards: 0,
        averageDifficulty: 3,
        reviewsToday: 0
      };
    }
  }
  
  /**
   * Calculate optimal study schedule for flashcard review
   * 
   * @param userId The user's ID
   * @returns An object with the optimal review schedule
   */
  public async calculateOptimalReviewSchedule(userId: string): Promise<{
    recommendedBatchSize: number;
    optimalTimeOfDay: string;
    priorityFlashcards: string[];
  }> {
    try {
      // Get due flashcards
      const dueCards = await this.getDueFlashcards(userId, 100);
      
      // Sort by priority (lowest retention first)
      const sortedCards = dueCards.sort((a, b) => 
        (a.last_retention || 0.5) - (b.last_retention || 0.5)
      );
      
      // Get priority flashcards (lowest retention)
      const priorityFlashcards = sortedCards.slice(0, 10).map(card => card.id);
      
      // Calculate recommended batch size based on due card count
      let recommendedBatchSize = 20;
      if (dueCards.length <= 5) {
        recommendedBatchSize = dueCards.length;
      } else if (dueCards.length <= 20) {
        recommendedBatchSize = Math.max(5, Math.min(15, Math.floor(dueCards.length * 0.75)));
      } else if (dueCards.length <= 50) {
        recommendedBatchSize = 20;
      } else {
        recommendedBatchSize = 25;
      }
      
      // Determine optimal time of day (this could be personalized based on user's history)
      const hour = new Date().getHours();
      let optimalTimeOfDay: string;
      
      if (hour >= 5 && hour < 9) optimalTimeOfDay = 'morning';
      else if (hour >= 9 && hour < 12) optimalTimeOfDay = 'mid-morning';
      else if (hour >= 12 && hour < 15) optimalTimeOfDay = 'early afternoon';
      else if (hour >= 15 && hour < 18) optimalTimeOfDay = 'late afternoon';
      else if (hour >= 18 && hour < 21) optimalTimeOfDay = 'evening';
      else optimalTimeOfDay = 'night';
      
      return {
        recommendedBatchSize,
        optimalTimeOfDay,
        priorityFlashcards
      };
    } catch (error) {
      console.error('Error calculating optimal review schedule:', error);
      return {
        recommendedBatchSize: 10,
        optimalTimeOfDay: 'evening',
        priorityFlashcards: []
      };
    }
  }
}

// Export a singleton instance
export const spacedRepetitionService = new SpacedRepetitionService();
