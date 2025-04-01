
/**
 * Calculate the next review date based on SM-2 algorithm
 * 
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
  newEF = Math.max(1.3, newEF);
  
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

// Alias for backwards compatibility
export const calculateNextReview = calculateNextReviewDate;
