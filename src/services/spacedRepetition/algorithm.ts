
// Constants for spaced repetition algorithm
export const INITIAL_EASINESS_FACTOR = 2.5;
export const MIN_EASINESS_FACTOR = 1.3;

/**
 * Calculate memory retention based on days since review and memory strength
 * Uses an implementation of the forgetting curve
 * 
 * @param daysSinceReview Number of days since last review
 * @param memoryStrength Strength of memory (higher means better retention)
 * @returns Retention value between 0 and 1
 */
export const calculateRetention = (daysSinceReview: number, memoryStrength: number): number => {
  // Implement forgetting curve: R = e^(-t/S) where:
  // R is retention, t is time, S is strength of memory
  const retention = Math.exp(-daysSinceReview / (memoryStrength || 1));
  return Math.max(0, Math.min(1, retention));
};

/**
 * Calculate next review date based on SM-2 algorithm
 * 
 * @param repetitions Number of successful repetitions
 * @param easinessFactor Current easiness factor
 * @param difficulty User-rated difficulty (1-5)
 * @returns Object with next review date and updated repetition count
 */
export const calculateNextReviewDate = (
  repetitions: number,
  easinessFactor: number,
  difficulty: number
): { 
  nextReviewDate: Date; 
  newRepetitionCount: number; 
  newEasinessFactor: number;
} => {
  // Convert 1-5 difficulty scale to 0-5 for algorithm
  const difficultyFactor = 5 - difficulty;

  // Calculate new easiness factor (bounded by MIN_EASINESS_FACTOR)
  const newEasinessFactor = Math.max(
    MIN_EASINESS_FACTOR,
    easinessFactor + (0.1 - difficultyFactor * (0.08 + difficultyFactor * 0.02))
  );

  // Calculate new repetition count
  let newRepetitionCount = repetitions;
  if (difficulty >= 3) {
    // If the answer was correct, increment repetition count
    newRepetitionCount += 1;
  } else {
    // If the answer was wrong, reset repetition count
    newRepetitionCount = 0;
  }

  // Calculate interval
  let intervalDays: number;
  if (newRepetitionCount <= 1) {
    intervalDays = 1;
  } else if (newRepetitionCount === 2) {
    intervalDays = 6;
  } else {
    intervalDays = Math.round(newRepetitionCount * newEasinessFactor);
  }

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);

  return {
    nextReviewDate,
    newRepetitionCount,
    newEasinessFactor
  };
};

/**
 * Calculate mastery level based on repetitions and easiness factor
 * 
 * @param repetitions Number of successful repetitions
 * @param easinessFactor Current easiness factor
 * @returns Mastery level between 0 and 1
 */
export const calculateMasteryLevel = (
  repetitions: number,
  easinessFactor: number
): number => {
  // Simple formula to calculate mastery level
  return Math.min(1.0, (repetitions / 10) + (easinessFactor - MIN_EASINESS_FACTOR) / (INITIAL_EASINESS_FACTOR - MIN_EASINESS_FACTOR) * 0.5);
};
