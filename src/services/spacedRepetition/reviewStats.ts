
/**
 * Functions for calculating flashcard review statistics
 */
import { supabase } from '@/integrations/supabase/client';
import { FlashcardRetentionResult, FlashcardLearningStats } from './reviewTypes';

/**
 * Calculate retention for a user's flashcards
 */
export async function calculateFlashcardRetention(userId: string): Promise<FlashcardRetentionResult> {
  // Get all user's flashcards
  const { data: flashcards, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching flashcards:', error);
    return {
      overallRetention: 0.5,
      cardRetention: 0.5,
      easinessFactor: 2.5,
      userId
    };
  }

  // Calculate average retention from flashcards
  const totalCards = flashcards?.length || 0;
  if (totalCards === 0) {
    return {
      overallRetention: 0.5,
      cardRetention: 0.5,
      easinessFactor: 2.5,
      userId
    };
  }

  let totalRetention = 0;
  let totalEasiness = 0;

  flashcards?.forEach(card => {
    totalRetention += card.last_retention || 0.85;
    totalEasiness += card.easiness_factor || 2.5;
  });

  return {
    overallRetention: totalRetention / totalCards,
    cardRetention: totalRetention / totalCards,
    easinessFactor: totalEasiness / totalCards,
    userId
  };
}

/**
 * Get detailed learning statistics for a user
 */
export async function getFlashcardLearningStats(userId: string): Promise<FlashcardLearningStats> {
  // Default stats if data can't be retrieved
  const defaultStats: FlashcardLearningStats = {
    totalCards: 0,
    masteredCards: 0,
    averageDifficulty: 3,
    learningCards: 0,
    retentionRate: 0.85,
    reviewsLast7Days: [0, 0, 0, 0, 0, 0, 0],
    reviewsToday: 0,
    reviewsYesterday: 0,
    streakDays: 0,
    averageRetention: 0.85,
    nextDueCards: 0
  };

  try {
    // Get all user's flashcards
    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);

    if (error || !flashcards) {
      console.error('Error fetching flashcards:', error);
      return defaultStats;
    }

    // Get all review records for the user
    const { data: reviews, error: reviewsError } = await supabase
      .from('flashcard_reviews')
      .select('*')
      .eq('user_id', userId)
      .order('reviewed_at', { ascending: false });

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      return defaultStats;
    }

    // Count mastered cards (mastery_level >= 0.9)
    const masteredCards = flashcards.filter(card => (card.mastery_level || 0) >= 0.9).length;
    
    // Count learning cards (mastery_level between 0.1 and 0.89)
    const learningCards = flashcards.filter(card => {
      const level = card.mastery_level || 0;
      return level >= 0.1 && level < 0.9;
    }).length;

    // Calculate average difficulty
    const totalDifficulty = flashcards.reduce((sum, card) => sum + (card.difficulty || 3), 0);
    const averageDifficulty = totalDifficulty / (flashcards.length || 1);

    // Calculate average retention
    const totalRetention = flashcards.reduce((sum, card) => sum + (card.last_retention || 0.85), 0);
    const averageRetention = totalRetention / (flashcards.length || 1);

    // Count cards due for review
    const nextDueCards = flashcards.filter(card => {
      const dueDate = new Date(card.next_review_date || '');
      return dueDate <= new Date();
    }).length;

    // Count reviews in the last 7 days
    const reviewsLast7Days = Array(7).fill(0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let reviewsToday = 0;
    let reviewsYesterday = 0;
    
    reviews?.forEach(review => {
      const reviewDate = new Date(review.reviewed_at);
      reviewDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((today.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        reviewsToday++;
      } else if (diffDays === 1) {
        reviewsYesterday++;
      }
      
      if (diffDays >= 0 && diffDays < 7) {
        reviewsLast7Days[diffDays]++;
      }
    });
    
    // Calculate streaks
    let streakDays = 0;
    let currentDate = new Date(today);
    let hasReviewsOnDate = true;
    
    while (hasReviewsOnDate) {
      currentDate.setDate(currentDate.getDate() - 1);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      const hasReviews = reviews?.some(review => 
        review.reviewed_at.startsWith(dateStr)
      );
      
      if (hasReviews) {
        streakDays++;
      } else {
        hasReviewsOnDate = false;
      }
    }

    return {
      totalCards: flashcards.length,
      masteredCards,
      averageDifficulty,
      learningCards,
      retentionRate: averageRetention,
      reviewsLast7Days,
      reviewsToday,
      reviewsYesterday,
      streakDays,
      averageRetention,
      nextDueCards
    };
  } catch (error) {
    console.error('Error calculating learning stats:', error);
    return defaultStats;
  }
}
