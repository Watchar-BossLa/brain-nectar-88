
import { supabase } from '@/integrations/supabase/client';
import { calculateRetention, calculateMasteryLevel } from './algorithm';

export type FlashcardRetentionResult = {
  overallRetention: number; // 0-1 value representing average retention across all cards
  cardRetention: {
    id: string;
    retention: number;
    masteryLevel: number;
    daysUntilReview: number;
  }[];
};

/**
 * Calculate the estimated retention for all flashcards for a user
 * 
 * @param userId The user ID to calculate retention for
 * @returns Object containing overall retention and individual card retention data
 */
export const calculateFlashcardRetention = async (userId: string): Promise<FlashcardRetentionResult> => {
  try {
    // Get all flashcards for the user that have been reviewed at least once
    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .gt('repetition_count', 0)
      .order('next_review_date');
      
    if (error) {
      throw error;
    }
    
    const now = new Date();
    const cardRetention: {
      id: string;
      retention: number;
      masteryLevel: number;
      daysUntilReview: number;
    }[] = [];
    
    let totalRetention = 0;
    
    // Calculate retention for each card
    for (const card of flashcards || []) {
      const reviewDate = new Date(card.next_review_date);
      const daysSinceReview = Math.max(0, (now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Calculate memory strength based on repetition count and difficulty
      const memoryStrength = card.repetition_count * 0.2 * (card.difficulty || 2.5);
      
      // Calculate current retention based on forgetting curve
      const retention = calculateRetention(daysSinceReview, memoryStrength);
      
      // Calculate mastery level
      const masteryLevel = calculateMasteryLevel(card.repetition_count, card.difficulty || 2.5);
      
      // Calculate days until review (negative if overdue)
      const daysUntilReview = (reviewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      
      cardRetention.push({
        id: card.id,
        retention,
        masteryLevel,
        daysUntilReview
      });
      
      totalRetention += retention;
    }
    
    // Calculate overall retention
    const overallRetention = cardRetention.length > 0 ? totalRetention / cardRetention.length : 1;
    
    return {
      overallRetention,
      cardRetention: cardRetention.sort((a, b) => a.retention - b.retention) // Sort by retention (lowest first)
    };
  } catch (error) {
    console.error('Error calculating flashcard retention:', error);
    return {
      overallRetention: 1,
      cardRetention: []
    };
  }
};

/**
 * Get detailed learning statistics for a user's flashcards
 */
export type FlashcardLearningStats = {
  totalReviews: number;
  averageEaseFactor: number;
  retentionRate: number;
  masteredCardCount: number;
  strugglingCardCount: number;
  learningEfficiency: number; // 0-1 value indicating learning efficiency
  recommendedDailyReviews: number;
};

export const getFlashcardLearningStats = async (userId: string): Promise<FlashcardLearningStats> => {
  try {
    // Get flashcard stats
    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      throw error;
    }
    
    let totalReviews = 0;
    let totalEaseFactor = 0;
    let masteredCardCount = 0;
    let strugglingCardCount = 0;
    
    // Calculate statistics
    for (const card of flashcards || []) {
      totalReviews += card.repetition_count || 0;
      totalEaseFactor += card.easiness_factor || 2.5;
      
      // Cards with high repetition count and ease factor are considered mastered
      if ((card.repetition_count || 0) >= 5 && (card.easiness_factor || 2.5) >= 2.3) {
        masteredCardCount++;
      }
      
      // Cards with low ease factor or failed reviews are considered struggling
      if ((card.easiness_factor || 2.5) <= 1.5 || ((card.repetition_count || 0) > 2 && (card.difficulty || 3) >= 4)) {
        strugglingCardCount++;
      }
    }
    
    const cardCount = flashcards?.length || 1;
    const averageEaseFactor = totalEaseFactor / cardCount;
    
    // Get retention data
    const { overallRetention } = await calculateFlashcardRetention(userId);
    
    // Calculate learning efficiency based on reviews vs. mastery
    const learningEfficiency = masteredCardCount > 0 ? masteredCardCount / Math.max(1, totalReviews / 3) : 0;
    
    // Calculate recommended daily reviews based on current stats
    const dueCardsPerDay = Math.ceil(cardCount / 7); // Simple heuristic
    const recommendedDailyReviews = Math.min(30, Math.max(5, dueCardsPerDay + strugglingCardCount / 2));
    
    return {
      totalReviews,
      averageEaseFactor,
      retentionRate: overallRetention,
      masteredCardCount,
      strugglingCardCount,
      learningEfficiency,
      recommendedDailyReviews
    };
  } catch (error) {
    console.error('Error getting flashcard learning stats:', error);
    return {
      totalReviews: 0,
      averageEaseFactor: 2.5,
      retentionRate: 0.8,
      masteredCardCount: 0,
      strugglingCardCount: 0,
      learningEfficiency: 0,
      recommendedDailyReviews: 10
    };
  }
};
