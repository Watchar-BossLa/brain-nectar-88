
/**
 * Core spaced repetition algorithm implementation
 */

// Constants for the spaced repetition algorithm
export const INITIAL_EASINESS_FACTOR = 2.5;
export const MIN_EASINESS_FACTOR = 1.3;

/**
 * Calculate the next review date based on difficulty rating, repetition count, and easiness factor
 * Implementing the SM-2 algorithm
 * 
 * @param difficulty Integer between 0-5 (0: complete blackout, 5: perfect recall)
 * @param repetitionCount Number of times the card has been reviewed
 * @param easinessFactor Current easiness factor (defaults to 2.5)
 * @returns Object with nextReviewDate, newRepetitionCount, and newEasinessFactor
 */
export const calculateNextReviewDate = (difficulty: number, repetitionCount: number, easinessFactor: number = INITIAL_EASINESS_FACTOR) => {
  // Calculate new easiness factor (EF)
  const newEasinessFactor = Math.max(
    MIN_EASINESS_FACTOR,
    easinessFactor + (0.1 - (5 - difficulty) * (0.08 + (5 - difficulty) * 0.02))
  );
  
  // Calculate new repetition count
  let newRepetitionCount = repetitionCount;
  
  // If recall was difficult, reset the repetition count
  if (difficulty < 3) {
    newRepetitionCount = 0;
  } else {
    newRepetitionCount += 1;
  }
  
  // Calculate interval based on SM-2 algorithm
  let interval: number;
  if (newRepetitionCount <= 1) {
    interval = 1; // 1 day
  } else if (newRepetitionCount === 2) {
    interval = 6; // 6 days
  } else {
    // For subsequent repetitions
    interval = Math.round((newRepetitionCount - 2) * 6 * newEasinessFactor);
  }
  
  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  
  return { nextReviewDate, newRepetitionCount, newEasinessFactor, interval };
};

/**
 * Calculate estimated retention rate for a flashcard
 * 
 * @param daysElapsed Days since last review
 * @param easinessFactor Easiness factor of the card
 * @returns Estimated retention rate (0-1)
 */
export const calculateRetention = (daysElapsed: number, easinessFactor: number): number => {
  // Using an exponential decay model: R = e^(-t/λ)
  // where λ is related to easiness factor: higher EF = slower decay
  const decayFactor = 3 * easinessFactor; // Scale factor to relate EF to decay rate
  return Math.exp(-daysElapsed / decayFactor);
};

/**
 * Calculate the next review date using a simplified approach
 * For backward compatibility with other implementations
 */
export const calculateNextReview = (difficulty: number, repetitionCount: number): { 
  nextReviewDate: Date, 
  newRepetitionCount: number 
} => {
  // Simplified algorithm implementation
  let interval: number;
  let newRepetitionCount = repetitionCount;
  
  if (difficulty < 3) {
    // Reset repetition count for difficult recalls
    newRepetitionCount = 0;
    interval = 1; // Review again in 1 day
  } else {
    // Increase repetition count for easy recalls
    newRepetitionCount++;
    
    // Calculate interval
    if (newRepetitionCount === 1) {
      interval = 1; // First successful recall: 1 day
    } else if (newRepetitionCount === 2) {
      interval = 6; // Second successful recall: 6 days
    } else {
      // For subsequent successful recalls
      const prevInterval = newRepetitionCount === 3 ? 6 : (newRepetitionCount - 2) * 6;
      const easeFactor = 1.3 + (difficulty - 3) * 0.1;
      interval = Math.round(prevInterval * easeFactor);
    }
  }
  
  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  
  return { nextReviewDate, newRepetitionCount };
};
