import { supabase } from '@/integrations/supabase/client';
import { Flashcard } from '@/types/flashcard';
import { calculateMasteryLevel, calculateRetention, calculateNextReviewDate } from './algorithm';

export interface FlashcardRetentionResult {
  newRetention: number;
  newMasteryLevel: number;
  newEasinessFactor: number;
  nextReviewDate: string;
}

export interface FlashcardLearningStats {
  totalReviews: number;
  retentionRate: number;
  masteredCardCount: number;
  averageEaseFactor: number;
  learningEfficiency: number;
  recommendedDailyReviews: number;
}

/**
 * Update a flashcard after it has been reviewed
 * 
 * @param flashcard The flashcard to update
 * @param difficultyRating The user's difficulty rating (1-5)
 * @returns The updated flashcard
 */
export const updateFlashcardAfterReview = async (
  flashcard: Flashcard,
  difficultyRating: number
): Promise<Flashcard | null> => {
  try {
    // Calculate retention and updated parameters
    const { retention, easinessFactor } = calculateFlashcardRetention(flashcard, difficultyRating);
    
    // Calculate new mastery level
    const masteryLevel = calculateMasteryLevel(flashcard.mastery_level, retention, difficultyRating);
    
    // Calculate next review date
    const now = new Date();
    let daysUntilNextReview = calculateNextReview(easinessFactor, flashcard.repetition_count + 1);
    const nextReviewDate = new Date(now);
    nextReviewDate.setDate(now.getDate() + daysUntilNextReview);
    
    // Update the flashcard
    const { data, error } = await supabase
      .from('flashcards')
      .update({
        difficulty: difficultyRating,
        easiness_factor: easinessFactor,
        last_retention: retention,
        mastery_level: masteryLevel,
        repetition_count: flashcard.repetition_count + 1,
        last_reviewed_at: now.toISOString(),
        next_review_date: nextReviewDate.toISOString()
      })
      .eq('id', flashcard.id)
      .select('*')
      .single();
      
    if (error) {
      console.error('Error updating flashcard:', error);
      return null;
    }
    
    // Record the review
    const { error: reviewError } = await supabase
      .from('flashcard_reviews')
      .insert({
        user_id: flashcard.user_id,
        flashcard_id: flashcard.id,
        difficulty_rating: difficultyRating,
        retention_estimate: retention
      });
      
    if (reviewError) {
      console.error('Error recording flashcard review:', reviewError);
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateFlashcardAfterReview:', error);
    return null;
  }
};

/**
 * Calculate retention and easiness factor for a flashcard review
 * 
 * @param flashcard The flashcard being reviewed
 * @param difficultyRating The user's difficulty rating (1-5)
 * @returns The calculated retention and updated easiness factor
 */
export const calculateFlashcardRetention = (
  flashcard: Flashcard,
  difficultyRating: number
): { retention: number; easinessFactor: number } => {
  // Get the current easiness factor or use default
  const easinessFactor = flashcard.easiness_factor || 2.5;
  
  // Calculate retention based on difficulty rating
  // Using modified SM-2 algorithm
  const retention = calculateRetention(difficultyRating, easinessFactor);
  
  // Update the easiness factor based on the difficulty rating
  // Easy ratings increase the factor, hard ratings decrease it
  const diffModifier = (5 - difficultyRating) / 5;
  const newEasinessFactor = Math.max(1.3, easinessFactor + (0.1 - (5 - difficultyRating) * 0.08 + diffModifier * 0.02));
  
  return { retention, easinessFactor: newEasinessFactor };
};

/**
 * Calculate days until next review using the SM-2 algorithm
 * 
 * @param easinessFactor The easiness factor
 * @param repetitionCount The number of times the card has been reviewed
 * @returns Number of days until next review
 */
const calculateNextReview = (easinessFactor: number, repetitionCount: number): number => {
  if (repetitionCount <= 1) {
    return 1; // First review: 1 day
  } else if (repetitionCount === 2) {
    return 3; // Second review: 3 days
  } else {
    // For subsequent reviews, use the formula: previousInterval * easinessFactor
    const previousInterval = calculateNextReview(easinessFactor, repetitionCount - 1);
    return Math.ceil(previousInterval * easinessFactor);
  }
};

/**
 * Get learning statistics for a user
 * 
 * @param userId The user ID to get statistics for
 * @returns Learning statistics
 */
export const getFlashcardLearningStats = async (userId: string): Promise<FlashcardLearningStats> => {
  try {
    // Get all flashcards for the user
    const { data: flashcards, error: flashcardsError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);
      
    if (flashcardsError) {
      throw flashcardsError;
    }
    
    // Get all reviews for the user
    const { data: reviews, error: reviewsError } = await supabase
      .from('flashcard_reviews')
      .select('*')
      .eq('user_id', userId);
      
    if (reviewsError) {
      throw reviewsError;
    }
    
    // Calculate statistics
    const totalReviews = reviews.length;
    
    // Calculate retention rate
    const totalRetention = reviews.reduce((sum, review) => sum + (review.retention_estimate || 0), 0);
    const retentionRate = totalReviews > 0 ? totalRetention / totalReviews : 0;
    
    // Count mastered cards (cards with mastery level >= 0.8)
    const masteredCardCount = flashcards.filter(card => (card.mastery_level || 0) >= 0.8).length;
    
    // Calculate average ease factor
    const totalEaseFactor = flashcards.reduce((sum, card) => sum + (card.easiness_factor || 2.5), 0);
    const averageEaseFactor = flashcards.length > 0 ? totalEaseFactor / flashcards.length : 2.5;
    
    // Calculate learning efficiency (ratio of mastered cards to total reviews)
    const learningEfficiency = totalReviews > 0 ? masteredCardCount / totalReviews : 0;
    
    // Calculate recommended daily reviews based on due cards and learning patterns
    const dueCards = flashcards.filter(card => {
      const nextReview = new Date(card.next_review_date);
      const now = new Date();
      return nextReview <= now;
    }).length;
    
    const recommendedDailyReviews = Math.min(20, Math.max(5, dueCards));
    
    return {
      totalReviews,
      retentionRate,
      masteredCardCount,
      averageEaseFactor,
      learningEfficiency,
      recommendedDailyReviews
    };
  } catch (error) {
    console.error('Error getting flashcard learning stats:', error);
    return {
      totalReviews: 0,
      retentionRate: 0,
      masteredCardCount: 0,
      averageEaseFactor: 2.5,
      learningEfficiency: 0,
      recommendedDailyReviews: 0
    };
  }
};
