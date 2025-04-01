
import { supabase } from '@/integrations/supabase/client';
import { calculateNextReview } from '@/services/spacedRepetition/algorithm';
import { Flashcard } from '@/types/supabase';
import { updateFlashcardLearningStats } from '@/lib/database-stub';

// Service to handle spaced repetition functionality
export const spacedRepetitionService = {
  // Get flashcards due for review
  getDueFlashcards: async (userId: string): Promise<Flashcard[]> => {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId)
        .lte('next_review_date', now)
        .order('next_review_date', { ascending: true });

      if (error) {
        throw error;
      }

      return data as Flashcard[];
    } catch (error) {
      console.error('Error fetching due flashcards:', error);
      return [];
    }
  },

  // Record a flashcard review
  recordReview: async (flashcardId: string, difficulty: number): Promise<boolean> => {
    try {
      // First get the current flashcard data
      const { data: flashcard, error: fetchError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('id', flashcardId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Calculate next review date and updated parameters
      const now = new Date();
      const repetitionCount = (flashcard.repetition_count || 0) + 1;
      const easinessFactor = flashcard.easiness_factor || 2.5;
      
      // Calculate values for next review
      const { nextReviewDate, newEasinessFactor } = calculateNextReview(
        difficulty,
        easinessFactor,
        repetitionCount
      );

      // Update flashcard in database
      const { error: updateError } = await supabase
        .from('flashcards')
        .update({
          last_reviewed_at: now.toISOString(),
          next_review_date: nextReviewDate.toISOString(),
          repetition_count: repetitionCount,
          easiness_factor: newEasinessFactor,
          difficulty: difficulty // Store the last difficulty rating
        })
        .eq('id', flashcardId);

      if (updateError) {
        throw updateError;
      }

      // Record the review in flashcard_reviews table
      const { error: reviewError } = await supabase
        .from('flashcard_reviews')
        .insert({
          flashcard_id: flashcardId,
          user_id: flashcard.user_id,
          difficulty_rating: difficulty,
          reviewed_at: now.toISOString(),
          retention_estimate: 1.0 // Default value, would be calculated in a real implementation
        });

      if (reviewError) {
        console.error('Error recording flashcard review:', reviewError);
        // Continue even if review record fails
      }

      return true;
    } catch (error) {
      console.error('Error updating flashcard after review:', error);
      return false;
    }
  },

  // Get stats for a specific flashcard
  getFlashcardStats: async (flashcardId: string) => {
    try {
      // Get review history
      const { data: reviews, error: reviewsError } = await supabase
        .from('flashcard_reviews')
        .select('*')
        .eq('flashcard_id', flashcardId)
        .order('reviewed_at', { ascending: false });

      if (reviewsError) {
        throw reviewsError;
      }

      // Get flashcard details
      const { data: flashcard, error: flashcardError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('id', flashcardId)
        .single();

      if (flashcardError) {
        throw flashcardError;
      }

      return {
        flashcard,
        reviews,
        totalReviews: reviews.length,
        averageDifficulty: reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.difficulty_rating, 0) / reviews.length 
          : 0,
        lastReviewed: flashcard.last_reviewed_at,
        nextReview: flashcard.next_review_date,
        mastery: calculateMastery(flashcard, reviews)
      };
    } catch (error) {
      console.error('Error fetching flashcard stats:', error);
      return null;
    }
  }
};

// Calculate mastery level based on review history and spaced repetition data
function calculateMastery(flashcard: any, reviews: any[]): number {
  if (reviews.length === 0) return 0;
  
  // Base mastery on repetition count, ease factor and recent performance
  let mastery = Math.min(100, (flashcard.repetition_count || 0) * 20);
  
  // Recent reviews have more weight
  const recentReviews = reviews.slice(0, Math.min(5, reviews.length));
  const recentAvgDifficulty = recentReviews.reduce((sum, review) => sum + review.difficulty_rating, 0) / recentReviews.length;
  
  // Adjust mastery based on recent difficulty ratings (higher rating = easier = more mastery)
  const difficultyFactor = recentAvgDifficulty / 3; // Normalize to a factor around 1.0
  mastery *= difficultyFactor;
  
  // Cap at 100%
  return Math.min(100, Math.max(0, mastery));
}
