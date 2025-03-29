
import { supabase } from '@/integrations/supabase/client';
import { Flashcard } from '@/types/flashcard';
import { calculateMasteryLevel, calculateRetention, calculateNextReviewDate } from './algorithm';
import { FlashcardRetentionResult, FlashcardLearningStats } from './reviewTypes';

/**
 * Update a flashcard after it has been reviewed
 * 
 * @param flashcardId The ID of the flashcard to update
 * @param difficultyRating The user's difficulty rating (1-5)
 * @returns The updated flashcard or null if error
 */
export const updateFlashcardAfterReview = async (
  flashcardId: string,
  difficultyRating: number
): Promise<any | null> => {
  try {
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
    
    // Calculate retention and updated parameters
    const { retention, easinessFactor } = calculateFlashcardRetention(
      flashcard.difficulty || 3,
      flashcard.easiness_factor || 2.5
    );
    
    // Calculate new mastery level
    const masteryLevel = calculateMasteryLevel(
      flashcard.mastery_level || 0, 
      retention, 
      difficultyRating
    );
    
    // Calculate next review date
    const now = new Date();
    const daysUntilNextReview = calculateNextReview(easinessFactor, (flashcard.repetition_count || 0) + 1);
    const nextReviewDate = new Date(now);
    nextReviewDate.setDate(now.getDate() + daysUntilNextReview);
    
    // Update the flashcard
    const { data, error: updateError } = await supabase
      .from('flashcards')
      .update({
        difficulty: difficultyRating,
        easiness_factor: easinessFactor,
        last_retention: retention,
        mastery_level: masteryLevel,
        repetition_count: (flashcard.repetition_count || 0) + 1,
        last_reviewed_at: now.toISOString(),
        next_review_date: nextReviewDate.toISOString()
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
 * @param difficulty The difficulty rating (1-5)
 * @param easinessFactor The current easiness factor
 * @returns The calculated retention and updated easiness factor
 */
export const calculateFlashcardRetention = (
  difficulty: number,
  easinessFactor: number
): { retention: number; easinessFactor: number } => {
  // Calculate retention based on difficulty rating
  const retention = calculateRetention(difficulty, easinessFactor);
  
  // Update the easiness factor based on the difficulty rating
  // Easy ratings increase the factor, hard ratings decrease it
  const diffModifier = (5 - difficulty) / 5;
  const newEasinessFactor = Math.max(1.3, easinessFactor + (0.1 - (5 - difficulty) * 0.08 + diffModifier * 0.02));
  
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
 * Get overall retention statistics for a user's flashcards
 * 
 * @param userId The user ID to get statistics for
 * @returns Retention statistics
 */
export const calculateFlashcardRetention = async (userId: string): Promise<FlashcardRetentionResult> => {
  try {
    // Get all flashcard reviews for the user
    const { data: reviews, error: reviewsError } = await supabase
      .from('flashcard_reviews')
      .select('flashcard_id, difficulty_rating, retention_estimate')
      .eq('user_id', userId)
      .order('reviewed_at', { ascending: false });
      
    if (reviewsError) {
      throw reviewsError;
    }
    
    // Get all flashcards for the user
    const { data: flashcards, error: flashcardsError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);
      
    if (flashcardsError) {
      throw flashcardsError;
    }
    
    // Calculate overall retention
    const totalReviews = reviews.length;
    let totalRetention = 0;
    
    reviews.forEach(review => {
      totalRetention += review.retention_estimate || 0.85;
    });
    
    const overallRetention = totalReviews > 0 ? totalRetention / totalReviews : 0.85;
    
    // Calculate individual card retention
    const cardRetention = flashcards.map(card => {
      // Find the most recent review for this card
      const cardReviews = reviews.filter(r => r.flashcard_id === card.id);
      const retention = cardReviews.length > 0 ? 
        cardReviews[0].retention_estimate || 0.85 : 
        0.85;
      
      // Calculate days until next review
      const nextReview = new Date(card.next_review_date);
      const now = new Date();
      const daysUntilReview = Math.max(0, Math.ceil((nextReview.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      
      return {
        id: card.id,
        retention,
        masteryLevel: card.mastery_level || 0,
        daysUntilReview
      };
    });
    
    return {
      overallRetention,
      cardRetention
    };
  } catch (error) {
    console.error('Error calculating flashcard retention:', error);
    return {
      overallRetention: 0.85,
      cardRetention: []
    };
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
    
    // Count cards by category
    const learningCards = flashcards.filter(
      card => (card.mastery_level || 0) > 0 && (card.mastery_level || 0) < 0.8
    ).length;
    
    const newCards = flashcards.filter(
      card => (card.mastery_level || 0) === 0
    ).length;
    
    const today = new Date().toISOString().split('T')[0];
    const reviewsToday = reviews.filter(
      review => review.reviewed_at.startsWith(today)
    ).length;
    
    // Calculate streak days (placeholder)
    const streakDays = 1; // Would require more sophisticated tracking
    
    return {
      totalCards: flashcards.length,
      dueCards,
      masteredCards: masteredCardCount,
      learningCards,
      newCards,
      reviewedToday: reviewsToday,
      totalReviews,
      averageRetention: retentionRate,
      streakDays,
      averageEaseFactor,
      retentionRate,
      strugglingCardCount: flashcards.filter(card => (card.difficulty || 0) >= 4).length,
      learningEfficiency,
      recommendedDailyReviews,
      // Legacy properties
      averageDifficulty: flashcards.reduce((sum, card) => sum + (card.difficulty || 0), 0) / 
                          (flashcards.length || 1),
      reviewsToday
    };
  } catch (error) {
    console.error('Error getting flashcard learning stats:', error);
    return {
      totalCards: 0,
      dueCards: 0,
      masteredCards: 0,
      learningCards: 0,
      newCards: 0,
      reviewedToday: 0,
      averageRetention: 0,
      streakDays: 0
    };
  }
};
