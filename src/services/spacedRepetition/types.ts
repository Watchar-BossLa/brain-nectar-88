
/**
 * Types for the spaced repetition system
 */

export interface FlashcardReviewResult {
  flashcardId: string;
  difficulty: number;
  reviewedAt: string;
}

export interface FlashcardLearningStats {
  repetition_count: number;
  easiness_factor: number;
  next_review_date: string;
  last_reviewed_at: string;
  mastery_level: number;
}
