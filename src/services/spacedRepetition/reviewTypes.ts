
/**
 * Types for flashcard review system
 */

/**
 * Individual flashcard retention result
 */
export interface FlashcardRetentionItem {
  id: string;
  retention: number;
  masteryLevel: number;
  daysUntilReview: number;
}

/**
 * Overall retention calculation result
 */
export interface FlashcardRetentionResult {
  overallRetention: number;
  cardRetention: FlashcardRetentionItem[];
}

/**
 * Extended learning statistics for flashcards
 */
export interface FlashcardLearningStats {
  totalCards: number;
  dueCards: number;
  masteredCards: number;
  learningCards: number;
  newCards: number;
  reviewedToday: number;
  averageRetention: number;
  streakDays: number;
  totalReviews?: number;
  averageEaseFactor?: number;
  retentionRate?: number;
  strugglingCardCount?: number;
  learningEfficiency?: number;
  recommendedDailyReviews?: number;
}

/**
 * Result of a flashcard review
 */
export interface FlashcardReviewResult {
  flashcardId: string;
  difficulty: number;
  reviewedAt: string;
  userId?: string;
}
