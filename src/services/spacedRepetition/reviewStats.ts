
import { supabase } from '@/integrations/supabase/client';
import { FlashcardRetentionResult, FlashcardLearningStats } from './reviewTypes';

/**
 * Calculate flashcard retention for a user
 * 
 * @param userId The user ID
 * @returns Object containing overall retention and card-specific retention
 */
export const calculateFlashcardRetention = async (
  userId: string
): Promise<{ success: boolean; data: any; error?: string }> => {
  try {
    // Simulate database call and calculation
    // In a real implementation, this would fetch data from the database
    
    // For demo purposes, just return sample data
    const sampleData = {
      totalFlashcards: 120,
      reviewedLast7Days: 45,
      masteryLevels: {
        low: 30,
        medium: 55,
        high: 35
      },
      reviewAccuracy: 0.72,
      needsReview: 24,
      retentionRate: 0.83, // 83% retention
      projectedRetention: 0.91, // Projected if continuing current study pattern
    };
    
    return {
      success: true,
      data: sampleData
    };
  } catch (error) {
    console.error('Error calculating flashcard retention:', error);
    return {
      success: false,
      error: 'Failed to calculate retention metrics'
    };
  }
};

/**
 * Get comprehensive flashcard learning statistics
 * 
 * @param userId The user ID
 * @returns Comprehensive statistics about the user's flashcard learning
 */
export const getFlashcardLearningStats = async (
  userId: string
): Promise<FlashcardLearningStats> => {
  try {
    // Get all flashcards for the user
    const { data: flashcards, error: flashcardsError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);
      
    if (flashcardsError) {
      console.error('Error fetching flashcards for stats:', flashcardsError);
      return getDefaultStats();
    }
    
    // Get due cards (cards due for review today or earlier)
    const now = new Date().toISOString();
    const dueCards = flashcards?.filter(card => card.next_review_date && card.next_review_date <= now) || [];
    
    // Count mastered cards (mastery level >= 0.8)
    const masteredCards = flashcards?.filter(card => (card.mastery_level || 0) >= 0.8).length || 0;
    
    // Calculate average difficulty
    const totalDifficulty = flashcards?.reduce((sum, card) => sum + (card.difficulty || 3), 0) || 0;
    const averageDifficulty = flashcards && flashcards.length > 0 
      ? totalDifficulty / flashcards.length 
      : 3;
    
    // Get reviews for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: recentReviews, error: reviewsError } = await supabase
      .from('flashcard_reviews')
      .select('*')
      .eq('user_id', userId)
      .gte('reviewed_at', sevenDaysAgo.toISOString());
      
    if (reviewsError) {
      console.error('Error fetching review history:', reviewsError);
    }
    
    // Count reviews by day (last 7 days)
    const reviewsByDay: number[] = Array(7).fill(0);
    const today = new Date();
    
    recentReviews?.forEach(review => {
      const reviewDate = new Date(review.reviewed_at);
      const dayDiff = Math.floor((today.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff >= 0 && dayDiff < 7) {
        reviewsByDay[dayDiff]++;
      }
    });
    
    // Get reviews for today and yesterday specifically
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    
    const reviewsToday = recentReviews?.filter(
      review => new Date(review.reviewed_at) >= todayStart
    ).length || 0;
    
    const reviewsYesterday = recentReviews?.filter(
      review => {
        const reviewDate = new Date(review.reviewed_at);
        return reviewDate >= yesterdayStart && reviewDate < todayStart;
      }
    ).length || 0;
    
    // Calculate study streak
    let streakDays = 0;
    let currentDate = new Date();
    let hasReviewsOnDate = false;
    
    do {
      const dateString = currentDate.toISOString().split('T')[0];
      hasReviewsOnDate = recentReviews?.some(review => 
        review.reviewed_at.startsWith(dateString)
      ) || false;
      
      if (hasReviewsOnDate) {
        streakDays++;
        currentDate.setDate(currentDate.getDate() - 1);
      }
    } while (hasReviewsOnDate);
    
    // Calculate average retention
    const totalRetention = flashcards?.reduce((sum, card) => sum + (card.last_retention || 0.5), 0) || 0;
    const averageRetention = flashcards && flashcards.length > 0 
      ? totalRetention / flashcards.length 
      : 0;
    
    return {
      totalCards: flashcards?.length || 0,
      masteredCards,
      averageDifficulty,
      learningCards: (flashcards?.length || 0) - masteredCards,
      retentionRate: averageRetention,
      reviewsLast7Days: reviewsByDay.reverse(), // Reverse to get oldest to newest
      reviewsToday,
      reviewsYesterday,
      streakDays,
      averageRetention,
      nextDueCards: dueCards.length
    };
  } catch (error) {
    console.error('Error fetching flashcard learning stats:', error);
    return getDefaultStats();
  }
};

/**
 * Get default stats object with zeroed values
 */
const getDefaultStats = (): FlashcardLearningStats => ({
  totalCards: 0,
  masteredCards: 0,
  averageDifficulty: 3,
  learningCards: 0,
  retentionRate: 0,
  reviewsLast7Days: [0, 0, 0, 0, 0, 0, 0],
  reviewsToday: 0,
  reviewsYesterday: 0,
  streakDays: 0,
  averageRetention: 0,
  nextDueCards: 0
});

export function calculateAverageRetention(retentions: number[]): number {
  if (!retentions || retentions.length === 0) {
    return 0.85; // Default retention if no data
  }
  
  // Filter out any undefined values and convert to numbers
  const validRetentions = retentions
    .filter(r => r !== undefined && r !== null)
    .map(r => Number(r));
  
  if (validRetentions.length === 0) {
    return 0.85; // Default retention if no valid data
  }
  
  // Calculate average
  const sum = validRetentions.reduce((total, current) => total + current, 0);
  return sum / validRetentions.length;
}

export function calculateOverallRetention(userId: string): number {
  // This would normally fetch from a database
  // For now, return a sample value to fix the type issue
  return 0.75; // 75% overall retention
}

export async function getRetentionTrend(userId: string): Promise<number> {
  // This would normally calculate a trend from historical data
  // For now, return a sample value to fix the type issue
  return 0.05; // 5% improvement trend
}
