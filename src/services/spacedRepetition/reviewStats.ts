
import { supabase } from '@/integrations/supabase/client';

/**
 * Calculate the retention rate for a flashcard based on review history
 * @param flashcardId The ID of the flashcard
 * @param userId The ID of the user
 * @returns The calculated retention rate (0-1)
 */
export const calculateFlashcardRetention = async (
  flashcardId: string,
  userId: string
): Promise<number> => {
  try {
    // Get review history for this flashcard
    const { data: reviews, error } = await supabase
      .from('flashcard_reviews')
      .select('*')
      .eq('flashcard_id', flashcardId)
      .eq('user_id', userId)
      .order('reviewed_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    
    if (!reviews || reviews.length === 0) {
      return 0.85; // Default retention rate for new cards
    }
    
    // Calculate retention based on difficulty ratings
    // Lower difficulty rating = higher retention
    const totalRatings = reviews.reduce((sum, review) => sum + review.difficulty_rating, 0);
    const avgDifficulty = totalRatings / reviews.length;
    
    // Convert to retention rate (5=difficult → low retention, 1=easy → high retention)
    // Scale from 1-5 to 0.6-1.0 range
    const retentionRate = 1 - ((avgDifficulty - 1) / 10);
    
    return Math.max(0.6, Math.min(1, retentionRate));
  } catch (error) {
    console.error('Error calculating flashcard retention:', error);
    return 0.85; // Default fallback
  }
};

/**
 * Get learning statistics for a flashcard
 * @param flashcardId The ID of the flashcard
 * @param userId The ID of the user
 * @returns Learning statistics object
 */
export const getFlashcardLearningStats = async (
  flashcardId: string,
  userId: string
) => {
  try {
    // Use flashcards table instead of flashcard_learning_stats
    // since the latter doesn't exist in the database schema
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('id', flashcardId)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return null;
    }
    
    // Return stats from the flashcards table
    return {
      flashcard_id: data.id,
      user_id: data.user_id,
      easiness_factor: data.easiness_factor,
      interval: data.repetition_count,
      repetitions: data.repetition_count,
      last_reviewed_at: data.last_reviewed_at,
      next_review_at: data.next_review_date,
      review_count: data.repetition_count,
      mastery_level: data.mastery_level
    };
  } catch (error) {
    console.error('Error getting flashcard learning stats:', error);
    return null;
  }
};

/**
 * Get retention statistics for a flashcard
 */
export const getFlashcardRetentionStats = async (userId: string) => {
  try {
    // Get all flashcards for this user
    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    if (!flashcards || flashcards.length === 0) {
      return {
        averageRetention: 0,
        totalReviews: 0,
        masteredCount: 0
      };
    }
    
    // Count mastered cards (those with high mastery_level)
    const masteredCount = flashcards.filter(card => 
      card.mastery_level && card.mastery_level >= 0.8
    ).length;
    
    // Calculate average retention across all cards
    const totalRetention = flashcards.reduce((sum, card) => 
      sum + (card.last_retention || 0.85), 0);
    const averageRetention = totalRetention / flashcards.length;
    
    // Get total number of reviews
    const { count: totalReviews, error: reviewsError } = await supabase
      .from('flashcard_reviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (reviewsError) throw reviewsError;
    
    return {
      averageRetention,
      totalReviews: totalReviews || 0,
      masteredCount
    };
  } catch (error) {
    console.error('Error getting flashcard retention stats:', error);
    return {
      averageRetention: 0,
      totalReviews: 0,
      masteredCount: 0
    };
  }
};
