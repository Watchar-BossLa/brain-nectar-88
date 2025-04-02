
import { supabase } from '@/lib/supabase';
import { Flashcard } from '@/types/supabase';

/**
 * Service for flashcard spaced repetition functionality
 */
export const spacedRepetitionService = {
  /**
   * Get all flashcards due for review
   */
  async getDueFlashcards(userId: string): Promise<Flashcard[]> {
    try {
      const today = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId)
        .lte('next_review_date', today)
        .order('next_review_date', { ascending: true });
        
      if (error) throw error;
      
      return data || [];
    } catch (err) {
      console.error('Error fetching due flashcards:', err);
      return [];
    }
  },

  /**
   * Get all flashcards for a user
   */
  async getUserFlashcards(userId: string): Promise<Flashcard[]> {
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (err) {
      console.error('Error fetching user flashcards:', err);
      return [];
    }
  },

  /**
   * Record a review for a flashcard
   */
  async recordReview(flashcardId: string, difficulty: number): Promise<boolean> {
    try {
      const { data: flashcard, error: fetchError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('id', flashcardId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Calculate new spaced repetition values
      const easinessFactor = Math.max(
        1.3, 
        (flashcard.easiness_factor || 2.5) + 
        (0.1 - (5 - difficulty) * (0.08 + (5 - difficulty) * 0.02))
      );
      
      let repetitions = flashcard.repetition_count || 0;
      if (difficulty < 3) {
        repetitions = 0;
      } else {
        repetitions += 1;
      }
      
      // Calculate interval
      let interval;
      if (repetitions <= 1) {
        interval = 1;
      } else if (repetitions === 2) {
        interval = 6;
      } else {
        interval = Math.round((flashcard.interval || 1) * easinessFactor);
      }
      
      // Calculate next review date
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + interval);
      
      // Update the flashcard
      const { error: updateError } = await supabase
        .from('flashcards')
        .update({
          easiness_factor: easinessFactor,
          interval: interval,
          last_reviewed_at: new Date().toISOString(),
          next_review_date: nextDate.toISOString(),
          repetition_count: repetitions,
          last_retention: difficulty / 5.0
        })
        .eq('id', flashcardId);
      
      if (updateError) throw updateError;

      // Record the review
      const { error: reviewError } = await supabase
        .from('flashcard_reviews')
        .insert({
          flashcard_id: flashcardId,
          user_id: flashcard.user_id,
          difficulty_rating: difficulty,
          retention_estimate: difficulty / 5.0
        });
        
      if (reviewError) throw reviewError;
      
      return true;
    } catch (err) {
      console.error('Error recording flashcard review:', err);
      return false;
    }
  },

  /**
   * Get flashcard statistics for a user
   */
  async getFlashcardStats(userId: string) {
    try {
      const { data: flashcards, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Calculate statistics
      const totalCards = flashcards?.length || 0;
      const masteredCards = flashcards?.filter(card => card.mastery_level >= 0.9).length || 0;
      const dueCards = flashcards?.filter(card => new Date(card.next_review_date) <= now).length || 0;
      const reviewsToday = flashcards?.filter(card => 
        card.last_reviewed_at && new Date(card.last_reviewed_at) >= today
      ).length || 0;
      
      // Calculate average difficulty
      let totalDifficulty = 0;
      flashcards?.forEach(card => {
        totalDifficulty += card.difficulty || 0;
      });
      const averageDifficulty = totalCards > 0 ? totalDifficulty / totalCards : 0;
      
      return {
        totalCards,
        masteredCards,
        dueCards,
        reviewsToday,
        averageDifficulty
      };
    } catch (err) {
      console.error('Error fetching flashcard stats:', err);
      return {
        totalCards: 0,
        masteredCards: 0,
        dueCards: 0,
        reviewsToday: 0,
        averageDifficulty: 0
      };
    }
  }
};
