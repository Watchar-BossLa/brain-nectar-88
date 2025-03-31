
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
  flashcard_id: string;
  user_id: string;
  easiness_factor: number;
  interval: number;
  repetitions: number;
  last_reviewed_at: string;
  next_review_at: string;
  review_count: number;
  totalCards: number;
  masteredCards?: number;
  averageDifficulty?: number;
  learningCards?: number;
  retentionRate?: number;
  reviewsLast7Days?: number[];
  reviewsToday?: number;
  reviewsYesterday?: number;
  streakDays?: number;
  averageRetention?: number;
  nextDueCards?: number;
  topic?: string; // Adding this field to fix compatibility issues
  id?: string; // Add for compatibility
  difficulty?: number; // Add for compatibility
  mastery_level?: number; // Add for compatibility
  easiness_factor?: number; // Ensure both naming conventions are available
  repetition_count?: number; // Add for compatibility
}
