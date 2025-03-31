
/**
 * Result of calculating flashcard retention
 */
export interface FlashcardRetentionResult {
  flashcardId: string;
  retention: number;          // 0-100% retention rate
  timeToForget: number;       // Estimated days until retention drops below threshold
  masteryLevel: number;       // 0-1 mastery level
}

/**
 * Learning statistics for a flashcard
 */
export interface FlashcardLearningStats {
  flashcard_id: string;
  userId: string;
  repetitionCount: number;
  easinessFactor: number;
  interval: number;
  lastReviewedAt: string;
  nextReviewAt: string;
  reviewCount: number;
  masteryLevel: number;       // 0-1 mastery level
  retentionRate: number;      // 0-100% retention rate
  totalCards: number;
}

/**
 * Learning plan parameters
 */
export interface LearningPlanParameters {
  userId: string;
  targetRetention: number;    // Target retention rate (e.g., 0.9 for 90%)
  studySessionMinutes: number;
  cardsPerSession: number;
  studyFrequency: 'daily' | 'every-other-day' | 'weekly';
}

/**
 * Flashcard learning progress data for UI display
 */
export interface FlashcardProgressData {
  id: string;
  front: string;
  back: string;
  masteryLevel: number;
  repetitionCount: number;
  nextReviewIn: number;      // Days until next review
  lastRetention: number;     // Last recorded retention rate
}
