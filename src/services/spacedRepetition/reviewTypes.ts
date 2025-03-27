
/**
 * Type for flashcard retention calculation result
 */
export interface FlashcardRetentionResult {
  overallRetention: number;
  cardRetention: {
    id: string;
    retention: number;
    masteryLevel: number;
    daysUntilReview: number;
  }[];
}

/**
 * Type for flashcard learning statistics
 */
export interface FlashcardLearningStats {
  // Core usage metrics
  totalCards: number;
  dueCards: number;
  masteredCards: number;
  learningCards: number;
  newCards: number;
  
  // Performance metrics
  reviewedToday: number;
  totalReviews?: number;
  averageRetention: number;
  streakDays: number;
  
  // Additional stats
  averageEaseFactor?: number;
  retentionRate?: number;
  strugglingCardCount?: number;
  learningEfficiency?: number;
  recommendedDailyReviews?: number;
  
  // Legacy properties for backward compatibility
  averageDifficulty?: number;
  reviewsToday?: number;
}
