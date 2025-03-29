
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
): Promise<FlashcardRetentionResult> => {
  try {
    // Get all flashcards for the user
    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching flashcards for retention calculation:', error);
      return { 
        overallRetention: 0, 
        cardRetention: [],
        easinessFactor: 0,
        userId
      };
    }
    
    if (!flashcards || flashcards.length === 0) {
      return { 
        overallRetention: 0, 
        cardRetention: [],
        easinessFactor: 0,
        userId
      };
    }
    
    // Calculate average retention across all cards
    const totalRetention = flashcards.reduce((sum, card) => sum + (card.last_retention || 0.5), 0);
    const overallRetention = totalRetention / flashcards.length;
    
    // Calculate average easiness factor
    const totalEasinessFactor = flashcards.reduce((sum, card) => sum + (card.easiness_factor || 2.5), 0);
    const averageEasinessFactor = totalEasinessFactor / flashcards.length;
    
    // Calculate retention for each card, identifying cards that need attention
    const cardRetention = flashcards
      .map(card => ({
        id: card.id,
        retention: card.last_retention || 0.5,
        easinessFactor: card.easiness_factor || 2.5,
        nextReviewDate: card.next_review_date,
        masteryLevel: card.mastery_level || 0
      }))
      .sort((a, b) => a.retention - b.retention); // Sort by retention (lowest first)
    
    return {
      overallRetention,
      cardRetention,
      easinessFactor: averageEasinessFactor,
      userId
    };
  } catch (error) {
    console.error('Error calculating flashcard retention:', error);
    return { 
      overallRetention: 0, 
      cardRetention: [],
      easinessFactor: 0,
      userId
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
