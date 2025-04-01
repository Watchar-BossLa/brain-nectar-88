// Constants for spaced repetition algorithm
export const INITIAL_EASINESS_FACTOR = 2.5;
export const MIN_EASINESS_FACTOR = 1.3;

/**
 * Calculate next review date based on difficulty rating and current repetition count
 * @param difficulty - Rating from 1 (hard) to 5 (easy)
 * @param repetitionCount - Current repetition count
 * @returns Object containing next review date and new repetition count
 */
export const calculateNextReviewDate = (
  difficulty: number,
  repetitionCount: number,
  easinessFactor: number = INITIAL_EASINESS_FACTOR
): { nextReviewDate: Date; newRepetitionCount: number; newEasinessFactor: number } => {
  // Convert 1-5 difficulty scale to SuperMemo's 0-5 scale where 5 is easiest
  
  // Calculate new easiness factor
  const newEasinessFactor = Math.max(
    MIN_EASINESS_FACTOR,
    easinessFactor + (0.1 - (5 - difficulty) * (0.08 + (5 - difficulty) * 0.02))
  );
  
  // Reset or increment repetition count based on difficulty
  let newRepetitionCount = repetitionCount;
  if (difficulty < 3) {
    // If difficult, reset repetition count
    newRepetitionCount = 0;
  } else {
    // Otherwise increment it
    newRepetitionCount += 1;
  }
  
  // Calculate interval in days
  let intervalDays: number;
  if (newRepetitionCount <= 1) {
    intervalDays = 1; // First review: 1 day
  } else if (newRepetitionCount === 2) {
    intervalDays = 6; // Second review: 6 days
  } else {
    // Subsequent reviews: previous interval * easiness factor
    intervalDays = Math.round((repetitionCount) * newEasinessFactor);
  }
  
  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);
  
  return { nextReviewDate, newRepetitionCount, newEasinessFactor };
};

/**
 * Calculate retention (probability of recall) based on days since last review
 * @param daysSinceReview - Days since the last review
 * @param memoryStrength - Current memory strength (based on repetition count and difficulty)
 * @returns Probability of recall (0.0 to 1.0)
 */
export const calculateRetention = (daysSinceReview: number, memoryStrength: number): number => {
  // Simplified Ebbinghaus forgetting curve: R = e^(-t/S)
  // where R is retention, t is time, and S is memory strength
  const retention = Math.exp(-daysSinceReview / Math.max(1, memoryStrength));
  return Math.max(0, Math.min(1, retention));
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
