
import { Flashcard, FlashcardLearningStats } from '@/hooks/flashcards/types';

/**
 * Calculates the retention rate for a flashcard based on its learning history
 */
export const calculateFlashcardRetention = (flashcard: Flashcard | FlashcardLearningStats): number => {
  // Simple retention calculation based on easiness factor and repetitions
  const easinessFactor = flashcard.easiness_factor || 2.5;
  const repetitions = flashcard.repetitions || 0;
  
  // Retention formula: base retention adjusted by easiness and repetitions
  // Range: 0-100%
  const baseRetention = 40; // Starting point for a new card
  const easinessBonus = Math.min((easinessFactor - 1.3) * 20, 40); // Max 40% bonus
  const repetitionBonus = Math.min(repetitions * 5, 20); // Max 20% bonus
  
  return Math.min(Math.round(baseRetention + easinessBonus + repetitionBonus), 100);
};

/**
 * Calculates the next review date based on spaced repetition algorithm
 */
export const calculateNextReviewDate = (
  easinessFactor: number,
  repetitions: number,
  interval: number
): Date => {
  // SM-2 algorithm implementation
  let nextInterval: number;
  
  if (repetitions <= 1) {
    nextInterval = 1; // 1 day
  } else if (repetitions === 2) {
    nextInterval = 6; // 6 days
  } else {
    nextInterval = Math.round(interval * easinessFactor);
  }
  
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + nextInterval);
  return nextDate;
};

/**
 * Updates flashcard learning parameters based on review difficulty
 */
export const updateFlashcardLearningParams = (
  flashcard: Flashcard,
  difficulty: number // 0-5, where 0 is hardest (complete blackout) and 5 is easiest (perfect recall)
): {
  easinessFactor: number;
  repetitions: number;
  interval: number;
  nextReviewDate: Date;
} => {
  // Calculate new easiness factor (SM-2 algorithm)
  const oldEF = flashcard.easiness_factor || 2.5;
  const newEF = Math.max(1.3, oldEF + (0.1 - (5 - difficulty) * (0.08 + (5 - difficulty) * 0.02)));
  
  // Calculate repetitions
  let repetitions = flashcard.repetitions || 0;
  if (difficulty < 3) {
    repetitions = 0; // Reset repetitions if the answer was difficult
  } else {
    repetitions += 1;
  }
  
  // Calculate interval
  let interval = flashcard.interval || 0;
  if (repetitions <= 1) {
    interval = 1;
  } else if (repetitions === 2) {
    interval = 6;
  } else {
    interval = Math.round(interval * newEF);
  }
  
  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  
  return {
    easinessFactor: newEF,
    repetitions,
    interval,
    nextReviewDate
  };
};
