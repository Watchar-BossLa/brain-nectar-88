
import { supabase } from '@/integrations/supabase/client';

export interface FlashcardReviewResult {
  flashcardId: string;
  difficulty: number;
  reviewedAt: string;
}

/**
 * SpacedRepetitionService
 * 
 * Implements the SM-2 spaced repetition algorithm for flashcard study optimization
 */
export class SpacedRepetitionService {
  
  /**
   * Calculate the next review date based on difficulty rating and repetition count
   * Implementing the SM-2 algorithm
   * 
   * @param difficulty Integer between 0-5 (0: complete blackout, 5: perfect recall)
   * @param repetitionCount Number of times the card has been reviewed
   * @returns NextReviewDate and updated repetition count
   */
  public calculateNextReview(difficulty: number, repetitionCount: number): { 
    nextReviewDate: Date, 
    newRepetitionCount: number 
  } {
    // SM-2 Algorithm implementation
    // Difficulty 0-2: Start over with repetitions
    // Difficulty 3-5: Progress with increasing intervals
    
    let interval: number;
    let newRepetitionCount = repetitionCount;
    
    if (difficulty < 3) {
      // If recall was difficult, reset the repetition count
      newRepetitionCount = 0;
      interval = 1; // Review again in 1 day
    } else {
      // Increase repetition count for easy recalls
      newRepetitionCount++;
      
      // Calculate interval based on SM-2 algorithm
      if (newRepetitionCount === 1) {
        interval = 1; // First successful recall: 1 day
      } else if (newRepetitionCount === 2) {
        interval = 6; // Second successful recall: 6 days
      } else {
        // For subsequent successful recalls, use increasing intervals
        // Base interval from previous review (starting with 6 days)
        const prevInterval = newRepetitionCount === 3 ? 6 : (newRepetitionCount - 2) * 6;
        
        // Ease factor adjusts based on difficulty (3: standard, 4: easier, 5: much easier)
        const easeFactor = 1.3 + (difficulty - 3) * 0.1;
        
        interval = Math.round(prevInterval * easeFactor);
      }
    }
    
    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);
    
    return { nextReviewDate, newRepetitionCount };
  }
  
  /**
   * Record a flashcard review result and update the next review date
   */
  public async recordReview(reviewResult: FlashcardReviewResult): Promise<boolean> {
    try {
      // Get current flashcard data
      const { data: flashcard, error: fetchError } = await supabase
        .from('flashcards')
        .select('repetition_count')
        .eq('id', reviewResult.flashcardId)
        .single();
        
      if (fetchError) {
        console.error('Error fetching flashcard:', fetchError);
        return false;
      }
      
      // Calculate next review date
      const { nextReviewDate, newRepetitionCount } = this.calculateNextReview(
        reviewResult.difficulty,
        flashcard?.repetition_count || 0
      );
      
      // Update flashcard with new review data
      const { error: updateError } = await supabase
        .from('flashcards')
        .update({
          difficulty: reviewResult.difficulty,
          repetition_count: newRepetitionCount,
          next_review_date: nextReviewDate.toISOString(),
        })
        .eq('id', reviewResult.flashcardId);
        
      if (updateError) {
        console.error('Error updating flashcard:', updateError);
        return false;
      }
      
      // Note: We'll add review history functionality when we create the flashcard_reviews table
      // For now, we just update the flashcard record

      return true;
    } catch (error) {
      console.error('Error recording flashcard review:', error);
      return false;
    }
  }
  
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

export const spacedRepetitionService = new SpacedRepetitionService();
