
/**
 * Core spaced repetition algorithm implementation
 */

// Constants for the SM-2 algorithm
export const INITIAL_EASINESS_FACTOR = 2.5;
export const MIN_EASINESS_FACTOR = 1.3;

/**
 * Calculate memory retention based on days since last review and memory strength
 * @param daysSinceReview Number of days since last review
 * @param memoryStrength Memory strength (increases with repetitions and easiness)
 * @returns A number between 0 and 1 representing estimated retention
 */
export const calculateRetention = (daysSinceReview: number, memoryStrength: number): number => {
  // Using exponential forgetting curve: R = e^(-t/S)
  // where R = retention, t = time since last review, S = stability/strength
  if (memoryStrength <= 0) return 0;
  
  const retention = Math.exp(-daysSinceReview / memoryStrength);
  return Math.max(0, Math.min(1, retention));
};

/**
 * Calculate the next review date based on difficulty rating and repetition count
 * Implementing the SM-2 algorithm
 * 
 * @param difficulty Integer between 0-5 (0: complete blackout, 5: perfect recall)
 * @param repetitionCount Number of times the card has been reviewed
 * @returns NextReviewDate and updated repetition count
 */
export const calculateNextReview = (difficulty: number, repetitionCount: number): { 
  nextReviewDate: Date, 
  newRepetitionCount: number 
} => {
  // SM-2 Algorithm implementation
  // Difficulty 0-2: Start over with repetitions
  // Difficulty 3-5: Progress with increasing intervals
  
  let interval: number;
  let newRepetitionCount = repetitionCount;
  
  if (difficulty < 3) {
    // If recall was difficult, reset the repetition count
    newRepetitionCount = 0;
    interval = 1; // Review again in 1 day
  } else {
    // Increase repetition count for easy recalls
    newRepetitionCount++;
    
    // Calculate interval based on SM-2 algorithm
    if (newRepetitionCount === 1) {
      interval = 1; // First successful recall: 1 day
    } else if (newRepetitionCount === 2) {
      interval = 6; // Second successful recall: 6 days
    } else {
      // For subsequent successful recalls, use increasing intervals
      // Base interval from previous review (starting with 6 days)
      const prevInterval = newRepetitionCount === 3 ? 6 : (newRepetitionCount - 2) * 6;
      
      // Ease factor adjusts based on difficulty (3: standard, 4: easier, 5: much easier)
      const easeFactor = 1.3 + (difficulty - 3) * 0.1;
      
      interval = Math.round(prevInterval * easeFactor);
    }
  }
  
  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  
  return { nextReviewDate, newRepetitionCount };
};

/**
 * Calculate the next review date based on SM-2 algorithm
 * @param difficulty - Rating from 0-5, where 0 is hardest and 5 is easiest
 * @param easinessFactor - Current easiness factor (starts at 2.5)
 * @param repetitionCount - Current repetition count
 * @returns Object containing the next review date and new easiness factor
 */
export const calculateNextReviewDate = (
  difficulty: number,
  easinessFactor: number,
  repetitionCount: number
): { nextReviewDate: Date; newEasinessFactor: number } => {
  // Normalize difficulty from 0-5 to 0-1
  const normalizedDifficulty = difficulty / 5;
  
  // Calculate new easiness factor using SM-2 algorithm
  let newEF = easinessFactor + (0.1 - (5 - difficulty) * (0.08 + (5 - difficulty) * 0.02));
  
  // Ensure EF doesn't go below 1.3
  newEF = Math.max(MIN_EASINESS_FACTOR, newEF);
  
  // Calculate interval
  let interval: number;
  if (repetitionCount === 1) {
    interval = 1; // 1 day
  } else if (repetitionCount === 2) {
    interval = 6; // 6 days
  } else {
    // For repetitions > 2, use the formula interval = interval * EF
    interval = Math.round((repetitionCount - 1) * newEF);
  }
  
  // If difficulty is very low, reduce interval
  if (difficulty <= 2) {
    interval = 1; // Review again tomorrow if difficulty was high
  }
  
  // Calculate the next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  
  return {
    nextReviewDate,
    newEasinessFactor: newEF
  };
};
