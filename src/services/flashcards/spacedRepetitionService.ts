
import { supabase } from '@/integrations/supabase/client';

class SpacedRepetitionService {
  /**
   * Calculate the next review date based on difficulty rating
   */
  calculateNextReviewDate(difficulty: number, repetitions: number): Date {
    // Simple algorithm
    let daysToAdd = 1;
    
    if (difficulty >= 4) {
      // Easy
      daysToAdd = repetitions < 2 ? 3 : 7;
    } else if (difficulty >= 3) {
      // Medium
      daysToAdd = repetitions < 2 ? 2 : 5;
    } else {
      // Hard
      daysToAdd = 1;
    }
    
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysToAdd);
    return nextDate;
  }
  
  /**
   * Record a flashcard review and update its next review date
   */
  async recordReview(flashcardId: string, difficulty: number): Promise<boolean> {
    try {
      // Get current flashcard data
      const { data: flashcard, error: fetchError } = await supabase
        .from('flashcards')
        .select('repetition_count')
        .eq('id', flashcardId)
        .single();
        
      if (fetchError) {
        console.error('Error fetching flashcard:', fetchError);
        return false;
      }
      
      // Calculate new values
      const repetitionCount = (flashcard?.repetition_count || 0) + 1;
      const nextReviewDate = this.calculateNextReviewDate(difficulty, repetitionCount);
      
      // Update flashcard with new review data
      const { error: updateError } = await supabase
        .from('flashcards')
        .update({
          difficulty: difficulty,
          repetition_count: repetitionCount,
          next_review_date: nextReviewDate.toISOString(),
          last_reviewed_at: new Date().toISOString()
        })
        .eq('id', flashcardId);
        
      if (updateError) {
        console.error('Error updating flashcard:', updateError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error recording flashcard review:', error);
      return false;
    }
  }
  
  /**
   * Get flashcards due for review
   */
  async getDueFlashcards(userId: string, limit: number = 20): Promise<any[]> {
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
   * Get flashcard statistics
   */
  async getFlashcardStats(userId: string) {
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
      
      // Calculate due cards
      const now = new Date();
      const dueCards = flashcards?.filter(card => {
        if (!card.next_review_date) return false;
        const reviewDate = new Date(card.next_review_date);
        return reviewDate <= now;
      }).length || 0;
      
      // Calculate average difficulty
      let totalDifficulty = 0;
      flashcards?.forEach(card => {
        totalDifficulty += card.difficulty || 3;
      });
      const averageDifficulty = totalCards > 0 ? totalDifficulty / totalCards : 0;
      
      return {
        totalCards,
        masteredCards,
        dueCards,
        averageDifficulty,
        reviewsToday: 0 // This would require a more complex query, simplified for now
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
