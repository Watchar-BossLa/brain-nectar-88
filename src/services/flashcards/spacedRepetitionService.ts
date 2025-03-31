
import { supabase } from '@/integrations/supabase/client';
import { 
  calculateNextReviewDate,
  INITIAL_EASINESS_FACTOR,
  MIN_EASINESS_FACTOR
} from '@/services/spacedRepetition/algorithm';

// Type definitions
interface FlashcardReviewResult {
  flashcardId: string;
  difficulty: number; // 1-5 scale
  userId: string;
}

export class SpacedRepetitionService {
  /**
   * Record a review of a flashcard
   */
  public async recordReview(flashcardId: string, difficulty: number): Promise<boolean> {
    try {
      // Get current user
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;
      
      if (!userId) {
        console.error('User not authenticated');
        return false;
      }
      
      // Get current flashcard data
      const { data: flashcard, error: fetchError } = await supabase
        .from('flashcards')
        .select('repetition_count, easiness_factor')
        .eq('id', flashcardId)
        .single();
        
      if (fetchError) {
        console.error('Error fetching flashcard:', fetchError);
        return false;
      }
      
      // Calculate new spaced repetition values
      const easinessFactor = Math.max(MIN_EASINESS_FACTOR, 
        (flashcard.easiness_factor || INITIAL_EASINESS_FACTOR) + 
        (0.1 - (5 - difficulty) * (0.08 + (5 - difficulty) * 0.02)));
      
      let repetitions = (flashcard.repetition_count || 0);
      if (difficulty < 3) {
        repetitions = 0;
      } else {
        repetitions += 1;
      }
      
      // Calculate next review date
      const nextReviewDate = calculateNextReviewDate(difficulty, repetitions, easinessFactor);
      
      // Calculate mastery level - simple formula based on repetitions
      const masteryLevel = Math.min(1.0, (repetitions / 10) + (easinessFactor - 1.3) / 2.5 * 0.5);
      
      // Update the flashcard
      const { error: updateError } = await supabase
        .from('flashcards')
        .update({
          easiness_factor: easinessFactor,
          repetition_count: repetitions,
          last_reviewed_at: new Date().toISOString(),
          next_review_date: nextReviewDate.toISOString(),
          mastery_level: masteryLevel,
          difficulty: difficulty
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
  public async getDueFlashcards(userId: string, limit: number = 20): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId)
        .lte('next_review_date', new Date().toISOString())
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
   * Calculate retention metrics
   */
  public async calculateRetention(userId: string): Promise<{ overall: number; improved: number }> {
    try {
      // This would be a complex calculation based on review history
      // For now, return a simple estimation
      return {
        overall: 85, // 85% retention rate
        improved: 5  // 5% improvement
      };
    } catch (error) {
      console.error('Error calculating retention:', error);
      return { overall: 0, improved: 0 };
    }
  }
}

// Create a singleton instance
export const spacedRepetitionService = new SpacedRepetitionService();
