
/**
 * Types for the flashcard review system
 */

export interface FlashcardRetentionResult {
  overallRetention: number;
  cardRetention: number;
  easinessFactor: number;
  userId: string;
}

export interface FlashcardLearningStats {
  totalCards: number;
  masteredCards: number;
  averageDifficulty: number;
  learningCards: number;
  retentionRate: number;
  reviewsLast7Days: number[];
  reviewsToday: number;
  reviewsYesterday: number;
  streakDays: number;
  averageRetention: number;
  nextDueCards: number;
}
