
// Constants for the SM-2 algorithm
export const INITIAL_EASINESS_FACTOR = 2.5;
export const MIN_EASINESS_FACTOR = 1.3;

/**
 * Calculate the next review date based on the SM-2 algorithm
 * @param easinessFactor The easiness factor (EF)
 * @param repetitions The number of successful repetitions
 * @param interval The current interval in days
 */
export const calculateNextReviewDate = (
  easinessFactor: number,
  repetitions: number,
  interval: number = 0
): Date => {
  let nextInterval: number;
  
  if (repetitions <= 1) {
    nextInterval = 1;  // 1 day
  } else if (repetitions === 2) {
    nextInterval = 6;  // 6 days
  } else {
    nextInterval = Math.round(interval * easinessFactor);
  }
  
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + nextInterval);
  
  return nextDate;
};

/**
 * Calculate the memory retention based on elapsed time and memory strength
 * @param daysSinceReview Days since the last review
 * @param memoryStrength Memory strength factor (higher = stronger memory)
 */
export const calculateRetention = (
  daysSinceReview: number, 
  memoryStrength: number
): number => {
  // Simple exponential decay model: R = e^(-t/s)
  // where t is time since review and s is memory strength
  const retention = Math.exp(-(daysSinceReview / (memoryStrength || 1)));
  
  // Convert to percentage and cap between 0-100
  return Math.max(0, Math.min(100, Math.round(retention * 100)));
};

/**
 * Calculate mastery level based on repetitions and easiness factor
 * @param repetitions Number of successful repetitions
 * @param easinessFactor Easiness factor
 */
export const calculateMasteryLevel = (
  repetitions: number,
  easinessFactor: number
): number => {
  // Simple formula that weighs repetitions and easiness
  const rawMastery = (repetitions / 10) * 0.7 + ((easinessFactor - MIN_EASINESS_FACTOR) / 1.7) * 0.3;
  
  // Cap between 0 and 1
  return Math.min(1, Math.max(0, rawMastery));
};
