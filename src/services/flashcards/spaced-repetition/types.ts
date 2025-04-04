
/**
 * Types for the spaced repetition system
 */

export interface FlashcardReviewResult {
  flashcardId: string;
  difficulty: number;
  reviewedAt: string;
  userId?: string;
  retentionChange?: number;
  responseTime?: number;
  isCorrect?: boolean;
}

export interface RepetitionAlgorithmParams {
  initialEaseFactor: number;
  minimumEaseFactor: number;
  defaultInterval: number;
  maxInterval: number;
}

export interface ReviewResults {
  nextReviewDate: Date;
  easinessFactor: number;
  repetitionCount: number;
  retentionEstimate: number;
  masteryLevel: number;
}

export interface FlashcardReviewStats {
  totalReviews: number;
  correctReviews: number;
  averageDifficulty: number;
  lastReviewDate: string | null;
  reviewHistory: Array<{
    date: string;
    difficulty: number;
    isCorrect: boolean;
  }>;
}

export interface RetentionCalculationParams {
  currentRetention: number;
  difficulty: number;
  intervalDays: number;
  repetitionCount: number;
}

export enum ReviewDifficulty {
  VeryEasy = 0,
  Easy = 1,
  Medium = 2,
  Hard = 3,
  VeryHard = 4
}
