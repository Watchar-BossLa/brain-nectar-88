// Function to get review statistics for a user
// This tracks spaced repetition performance and retention metrics

import { getLocalStorage, setLocalStorage } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

// Types for review statistics
interface ReviewData {
  id: string;
  cardId: string;
  timestamp: number;
  performance: 1 | 2 | 3 | 4 | 5; // 1=forgot, 5=perfect recall
  timeTaken: number; // milliseconds
  nextReviewDate: number;
}

interface CardStats {
  cardId: string;
  totalReviews: number;
  averagePerformance: number;
  lastReviewDate: number;
  nextReviewDate: number;
  interval: number; // days
  easeFactor: number;
}

interface UserReviewStats {
  userId: string;
  totalReviews: number;
  cardsReviewed: number;
  averagePerformance: number;
  reviewHistory: ReviewData[];
  cardStats: Record<string, CardStats>;
  lastUpdated: number;
}

// Get review statistics for a user
export function getReviewStats(userId: string): {
  success: boolean;
  data: any;
  error?: string;
} {
  try {
    const storageKey = `user_review_stats_${userId}`;
    const stats = getLocalStorage<UserReviewStats>(storageKey);
    
    if (!stats) {
      // Initialize empty stats if none exist
      const emptyStats: UserReviewStats = {
        userId,
        totalReviews: 0,
        cardsReviewed: 0,
        averagePerformance: 0,
        reviewHistory: [],
        cardStats: {},
        lastUpdated: Date.now()
      };
      
      setLocalStorage(storageKey, emptyStats);
      return {
        success: true,
        data: emptyStats
      };
    }
    
    return {
      success: true,
      data: stats
    };
  } catch (error) {
    console.error("Failed to get review stats:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// Record a new review session
export function recordReview(
  userId: string,
  cardId: string,
  performance: 1 | 2 | 3 | 4 | 5,
  timeTaken: number
): {
  success: boolean;
  data: any;
  error?: string;
} {
  try {
    const storageKey = `user_review_stats_${userId}`;
    const stats = getLocalStorage<UserReviewStats>(storageKey);
    
    if (!stats) {
      return {
        success: false,
        data: null,
        error: "User stats not found"
      };
    }
    
    // Calculate next review date based on spaced repetition algorithm
    const cardStats = stats.cardStats[cardId] || {
      cardId,
      totalReviews: 0,
      averagePerformance: 0,
      lastReviewDate: 0,
      nextReviewDate: 0,
      interval: 1, // Start with 1 day interval
      easeFactor: 2.5 // Initial ease factor
    };
    
    // SM-2 algorithm for spaced repetition
    let newInterval = cardStats.interval;
    let newEaseFactor = cardStats.easeFactor;
    
    if (performance >= 3) {
      // Correct response
      if (cardStats.totalReviews === 0) {
        newInterval = 1; // First correct review: 1 day
      } else if (cardStats.totalReviews === 1) {
        newInterval = 6; // Second correct review: 6 days
      } else {
        newInterval = Math.round(cardStats.interval * cardStats.easeFactor);
      }
      
      // Update ease factor based on performance
      newEaseFactor = cardStats.easeFactor + (0.1 - (5 - performance) * (0.08 + (5 - performance) * 0.02));
    } else {
      // Incorrect response, reset interval
      newInterval = 1;
      // Slightly reduce ease factor
      newEaseFactor = Math.max(1.3, cardStats.easeFactor - 0.2);
    }
    
    // Ensure ease factor stays within reasonable bounds
    newEaseFactor = Math.max(1.3, Math.min(2.5, newEaseFactor));
    
    // Calculate next review date
    const now = Date.now();
    const nextReviewDate = now + newInterval * 24 * 60 * 60 * 1000;
    
    // Create review record
    const reviewData: ReviewData = {
      id: uuidv4(),
      cardId,
      timestamp: now,
      performance,
      timeTaken,
      nextReviewDate
    };
    
    // Update card stats
    const updatedCardStats: CardStats = {
      ...cardStats,
      totalReviews: cardStats.totalReviews + 1,
      averagePerformance: (cardStats.averagePerformance * cardStats.totalReviews + performance) / (cardStats.totalReviews + 1),
      lastReviewDate: now,
      nextReviewDate,
      interval: newInterval,
      easeFactor: newEaseFactor
    };
    
    // Update user stats
    const updatedStats: UserReviewStats = {
      ...stats,
      totalReviews: stats.totalReviews + 1,
      cardsReviewed: Object.keys(stats.cardStats).includes(cardId) 
        ? stats.cardsReviewed 
        : stats.cardsReviewed + 1,
      averagePerformance: (stats.averagePerformance * stats.totalReviews + performance) / (stats.totalReviews + 1),
      reviewHistory: [...stats.reviewHistory, reviewData],
      cardStats: {
        ...stats.cardStats,
        [cardId]: updatedCardStats
      },
      lastUpdated: now
    };
    
    // Save updated stats
    setLocalStorage(storageKey, updatedStats);
    
    return {
      success: true,
      data: {
        reviewData,
        cardStats: updatedCardStats,
        nextReviewDate
      }
    };
  } catch (error) {
    console.error("Failed to record review:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// Get cards due for review
export function getDueCards(userId: string): {
  success: boolean;
  data: any;
  error?: string;
} {
  try {
    const stats = getReviewStats(userId);
    
    if (!stats.success || !stats.data) {
      return {
        success: false,
        data: null,
        error: "Failed to get user stats"
      };
    }
    
    const now = Date.now();
    const dueCards = Object.values(stats.data.cardStats)
      .filter((card: CardStats) => card.nextReviewDate <= now)
      .map((card: CardStats) => card.cardId);
    
    return {
      success: true,
      data: {
        dueCards,
        count: dueCards.length
      }
    };
  } catch (error) {
    console.error("Failed to get due cards:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// Calculate retention metrics
export function calculateRetentionMetrics(userId: string): {
  success: boolean;
  data: any;
  error?: string;
} {
  try {
    const stats = getReviewStats(userId);
    
    if (!stats.success || !stats.data) {
      return {
        success: false,
        data: null,
        error: "Failed to get user stats"
      };
    }
    
    const reviewHistory = stats.data.reviewHistory;
    
    if (reviewHistory.length === 0) {
      return {
        success: true,
        data: {
          overallRetention: 0,
          retentionByDay: {},
          cardRetention: {}
        }
      };
    }
    
    // Calculate overall retention rate (performance >= 3 is considered "remembered")
    const rememberedCount = reviewHistory.filter(r => r.performance >= 3).length;
    const overallRetention = rememberedCount / reviewHistory.length;
    
    // Calculate retention by day of week
    const retentionByDay: Record<string, { total: number, remembered: number }> = {
      "0": { total: 0, remembered: 0 }, // Sunday
      "1": { total: 0, remembered: 0 },
      "2": { total: 0, remembered: 0 },
      "3": { total: 0, remembered: 0 },
      "4": { total: 0, remembered: 0 },
      "5": { total: 0, remembered: 0 },
      "6": { total: 0, remembered: 0 }  // Saturday
    };
    
    reviewHistory.forEach(review => {
      const day = new Date(review.timestamp).getDay().toString();
      retentionByDay[day].total++;
      if (review.performance >= 3) {
        retentionByDay[day].remembered++;
      }
    });
    
    // Calculate retention by card
    const cardRetention: Record<string, { total: number, remembered: number, rate: number }> = {};
    
    reviewHistory.forEach(review => {
      if (!cardRetention[review.cardId]) {
        cardRetention[review.cardId] = { total: 0, remembered: 0, rate: 0 };
      }
      
      cardRetention[review.cardId].total++;
      if (review.performance >= 3) {
        cardRetention[review.cardId].remembered++;
      }
    });
    
    // Calculate retention rate for each card
    Object.keys(cardRetention).forEach(cardId => {
      const card = cardRetention[cardId];
      card.rate = card.remembered / card.total;
    });
    
    return {
      success: true,
      data: {
        overallRetention,
        retentionByDay,
        cardRetention
      }
    };
  } catch (error) {
    console.error("Failed to calculate retention metrics:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Calculate flashcard retention stats
 * 
 * @param userId User ID to calculate stats for
 * @param options Optional configuration options
 * @returns Retention statistics
 */
export function calculateFlashcardRetention(userId: string, options: any = {}): {
  success: boolean;
  data: {
    overallRetention: number;
    cardRetention: Record<string, { total: number; remembered: number; rate: number }>;
    retentionByDay: Record<string, { total: number; remembered: number }>;
  };
  error?: string;
} {
  try {
    // Get user's review history
    const stats = getReviewStats(userId);
    
    if (!stats.success || !stats.data) {
      return {
        success: false,
        data: {
          overallRetention: 0,
          cardRetention: {},
          retentionByDay: {}
        },
        error: "Failed to get user stats"
      };
    }
    
    // Calculate retention metrics using the existing function
    const retentionData = calculateRetentionMetrics(userId);
    
    return {
      success: true,
      data: retentionData.data || {
        overallRetention: 0,
        cardRetention: {},
        retentionByDay: {}
      }
    };
  } catch (error) {
    console.error("Failed to calculate flashcard retention:", error);
    return {
      success: false,
      data: {
        overallRetention: 0,
        cardRetention: {},
        retentionByDay: {}
      },
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Get detailed learning statistics for flashcards
 * 
 * @param userId User ID to get stats for
 * @returns Learning statistics
 */
export function getFlashcardLearningStats(userId: string): {
  success: boolean;
  data: {
    totalCards: number;
    masteredCards: number;
    averageDifficulty: number;
    learningCards: number;
    retentionRate: number;
    reviewsToday: number;
    streakDays: number;
    averageRetention: number;
  };
  error?: string;
} {
  try {
    // Get user's review stats
    const stats = getReviewStats(userId);
    
    if (!stats.success || !stats.data) {
      return {
        success: false,
        data: {
          totalCards: 0,
          masteredCards: 0,
          averageDifficulty: 0,
          learningCards: 0,
          retentionRate: 0,
          reviewsToday: 0,
          streakDays: 0,
          averageRetention: 0
        },
        error: "Failed to get user stats"
      };
    }
    
    // Calculate retention metrics
    const retentionData = calculateRetentionMetrics(userId);
    
    // Return dummy data for now (in a real app, you'd calculate this from the stats)
    return {
      success: true,
      data: {
        totalCards: Object.keys(stats.data.cardStats || {}).length,
        masteredCards: Math.floor(Object.keys(stats.data.cardStats || {}).length * 0.3),
        averageDifficulty: 2.5,
        learningCards: Math.floor(Object.keys(stats.data.cardStats || {}).length * 0.7),
        retentionRate: retentionData.data?.overallRetention || 0.8,
        reviewsToday: 5,
        streakDays: 3,
        averageRetention: 0.75
      }
    };
  } catch (error) {
    console.error("Failed to get flashcard learning stats:", error);
    return {
      success: false,
      data: {
        totalCards: 0,
        masteredCards: 0,
        averageDifficulty: 0,
        learningCards: 0,
        retentionRate: 0,
        reviewsToday: 0,
        streakDays: 0,
        averageRetention: 0
      },
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
