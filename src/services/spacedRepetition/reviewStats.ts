
import { supabase } from '@/integrations/supabase/client';
import { FlashcardRetentionResult, FlashcardLearningStats } from './reviewTypes';
import { calculateRetention } from './algorithm';

/**
 * Calculate estimated flashcard retention for a user
 * This helps visualize how well the memory model is working
 * 
 * @param userId The user ID to calculate retention for
 * @returns Object with retention data
 */
export const calculateFlashcardRetention = async (
  userId: string
): Promise<FlashcardRetentionResult> => {
  try {
    // Get flashcards that have been reviewed at least once
    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .gt('repetition_count', 0);
      
    if (error) {
      throw error;
    }
    
    if (!flashcards || flashcards.length === 0) {
      return {
        overallRetention: 0,
        cardRetention: []
      };
    }
    
    // Calculate retention for each card
    const now = new Date();
    let totalRetention = 0;
    
    const cardRetention = flashcards.map(card => {
      // Calculate days since last review
      const nextReviewDate = new Date(card.next_review_date);
      const daysSinceReview = Math.max(0, (now.getTime() - nextReviewDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Estimate memory strength based on repetition count and difficulty
      const memoryStrength = card.repetition_count * 0.2 * (card.difficulty || 2.5);
      
      // Calculate current retention
      const retention = calculateRetention(daysSinceReview, memoryStrength);
      
      // Days until next review
      const daysUntilReview = Math.max(0, (nextReviewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      totalRetention += retention;
      
      return {
        id: card.id,
        retention,
        masteryLevel: card.mastery_level || 0,
        daysUntilReview: Math.round(daysUntilReview)
      };
    });
    
    // Calculate overall retention
    const overallRetention = cardRetention.length > 0 ? totalRetention / cardRetention.length : 0;
    
    return {
      overallRetention,
      cardRetention
    };
  } catch (error) {
    console.error('Error calculating flashcard retention:', error);
    return {
      overallRetention: 0,
      cardRetention: []
    };
  }
};

/**
 * Get learning statistics for a user's flashcards
 * Provides analytics on the effectiveness of the spaced repetition system
 * 
 * @param userId The user ID to get statistics for
 * @returns Object with learning statistics
 */
export const getFlashcardLearningStats = async (
  userId: string
): Promise<FlashcardLearningStats> => {
  try {
    // Get flashcards with at least one review
    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      throw error;
    }
    
    if (!flashcards || flashcards.length === 0) {
      return {
        totalCards: 0,
        dueCards: 0,
        masteredCards: 0,
        learningCards: 0,
        newCards: 0,
        reviewedToday: 0,
        averageRetention: 0,
        streakDays: 0,
        totalReviews: 0,
        averageEaseFactor: 0,
        retentionRate: 0,
        strugglingCardCount: 0,
        learningEfficiency: 0,
        recommendedDailyReviews: 0
      };
    }
    
    // Calculate statistics
    let totalEaseFactor = 0;
    let totalRetention = 0;
    let masteredCount = 0;
    let strugglingCount = 0;
    let learningCount = 0;
    let newCount = 0;
    
    flashcards.forEach(card => {
      // Sum up ease factors
      totalEaseFactor += card.easiness_factor || 2.5;
      
      // Sum up retention rates
      totalRetention += card.last_retention || 0.85;
      
      // Count mastered cards (high repetition count and high mastery level)
      if (card.repetition_count >= 5 && (card.mastery_level || 0) >= 0.7) {
        masteredCount++;
      } else if (card.repetition_count > 0) {
        learningCount++;
      } else {
        newCount++;
      }
      
      // Count struggling cards (low ease factor or low mastery level after multiple reviews)
      if ((card.easiness_factor || 2.5) < 2.0 && card.repetition_count >= 3) {
        strugglingCount++;
      }
    });
    
    // Calculate average ease factor
    const averageEaseFactor = flashcards.length > 0 ? totalEaseFactor / flashcards.length : 0;
    
    // Calculate average retention rate
    const retentionRate = flashcards.length > 0 ? totalRetention / flashcards.length : 0;
    
    // Calculate learning efficiency (ratio of mastered to struggling cards)
    const learningEfficiency = strugglingCount > 0 ? 
      masteredCount / (masteredCount + strugglingCount) : 
      (masteredCount > 0 ? 1 : 0);
    
    // Recommend daily reviews based on due cards and learning efficiency
    // This is a simple heuristic that could be improved
    const recommendedDailyReviews = Math.max(
      5,
      Math.min(
        20,
        Math.ceil(flashcards.length * (1 - learningEfficiency) * 0.2)
      )
    );
    
    // Get due cards count
    const now = new Date();
    const dueCount = flashcards.filter(card => 
      new Date(card.next_review_date) <= now
    ).length;
    
    // Get reviews done today
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    
    const { data: reviewsToday, error: reviewError } = await supabase
      .from('flashcard_reviews')
      .select('id')
      .eq('user_id', userId)
      .gte('reviewed_at', startOfDay.toISOString());
      
    if (reviewError) {
      throw reviewError;
    }
    
    return {
      totalCards: flashcards.length,
      dueCards: dueCount,
      masteredCards: masteredCount,
      learningCards: learningCount,
      newCards: newCount,
      reviewedToday: reviewsToday?.length || 0,
      totalReviews: flashcards.reduce((sum, card) => sum + (card.repetition_count || 0), 0),
      averageRetention: retentionRate,
      streakDays: 0, // This would require additional tracking
      averageEaseFactor,
      retentionRate,
      strugglingCardCount: strugglingCount,
      learningEfficiency,
      recommendedDailyReviews
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
