
/**
 * Implementation of the SM-2 Spaced Repetition Algorithm
 */

// SM-2 Spaced Repetition Algorithm parameters
export const INITIAL_EASINESS_FACTOR = 2.5;
export const MIN_EASINESS_FACTOR = 1.3;

/**
 * Calculates the next review date based on the SM-2 spaced repetition algorithm
 * @param repetitionCount Current repetition count
 * @param easinessFactor Current easiness factor
 * @param difficulty User-rated difficulty (1-5, 5 = most difficult)
 * @returns Next review date
 */
export const calculateNextReviewDate = (
  repetitionCount: number,
  easinessFactor: number,
  difficulty: number
): Date => {
  // Convert difficulty from 1-5 scale to 0-5 scale for algorithm
  const quality = 6 - difficulty;
  
  // Calculate new easiness factor
  let newEasinessFactor = easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEasinessFactor < MIN_EASINESS_FACTOR) {
    newEasinessFactor = MIN_EASINESS_FACTOR;
  }
  
  // Calculate new interval
  let interval: number;
  let newRepetitionCount = repetitionCount;
  
  if (quality < 3) {
    // If the quality is poor, reset the repetition count
    newRepetitionCount = 0;
    interval = 1; // Review again tomorrow
  } else {
    // If repetition is successful, increase the interval
    newRepetitionCount += 1;
    
    if (newRepetitionCount === 1) {
      interval = 1; // 1 day
    } else if (newRepetitionCount === 2) {
      interval = 6; // 6 days
    } else {
      // For subsequent repetitions, use the formula: interval = interval * easiness_factor
      interval = Math.round((repetitionCount > 0 ? repetitionCount : 1) * newEasinessFactor);
    }
  }
  
  // Calculate the next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  
  return nextReviewDate;
};
