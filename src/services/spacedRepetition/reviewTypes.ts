
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
  totalReviews: number;
  averageEaseFactor: number;
  retentionRate: number;
  masteredCardCount: number;
  strugglingCardCount: number;
  learningEfficiency: number;
  recommendedDailyReviews: number;
}
