
import { Flashcard, FlashcardLearningStats } from './types';

/**
 * Calculates the estimated retention for a flashcard based on spaced repetition principles
 * 
 * @param flashcard The flashcard to calculate retention for
 * @param currentDate The current date (defaults to now)
 * @returns A number between 0 and 1 representing estimated retention percentage
 */
export const calculateFlashcardRetention = (
  flashcard: Flashcard | FlashcardLearningStats,
  currentDate: Date = new Date()
): number => {
  // If the flashcard has never been reviewed, return a low baseline retention
  if (!flashcard.last_reviewed_at) {
    return 0.3; // 30% baseline retention for new cards
  }

  const lastReviewDate = new Date(flashcard.last_reviewed_at);
  const daysSinceReview = (currentDate.getTime() - lastReviewDate.getTime()) / (1000 * 60 * 60 * 24);
  
  // Calculate retention using the SM-2 algorithm decay formula
  // R = e^(-t/S), where:
  // - R is retention
  // - t is time since last review (in days)
  // - S is stability factor (influenced by easiness_factor)
  const stabilityFactor = flashcard.easiness_factor 
    ? flashcard.easiness_factor * 1.5 
    : 2.5;
  
  // Calculate retention percentage (between 0 and 1)
  const retention = Math.exp(-daysSinceReview / stabilityFactor);
  
  // Ensure retention is between 0 and 1
  return Math.max(0, Math.min(1, retention));
};

/**
 * Determines if a flashcard is due for review based on retention threshold
 *
 * @param flashcard The flashcard to check
 * @param retentionThreshold The minimum retention before review is needed (default: 0.7)
 * @returns Boolean indicating if card should be reviewed
 */
export const isFlashcardDueForReview = (
  flashcard: Flashcard | FlashcardLearningStats,
  retentionThreshold: number = 0.7
): boolean => {
  const currentRetention = calculateFlashcardRetention(flashcard);
  return currentRetention < retentionThreshold;
};
