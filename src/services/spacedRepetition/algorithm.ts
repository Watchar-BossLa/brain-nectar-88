
/**
 * Algorithm for spaced repetition based on a modified SM-2 algorithm
 * 
 * References:
 * - https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 * - https://www.msankhala.com/blog/spaced-repetition-algorithm/
 */

export const INITIAL_EASINESS_FACTOR = 2.5;
export const MIN_EASINESS_FACTOR = 1.3;

export interface RepetitionSchedule {
  interval: number;  // in days
  repetition: number;
  easinessFactor: number;
  nextReviewDate?: Date;
  estimatedRetention?: number;
  masteryLevel?: number;
}

/**
 * Calculate the next review date for a flashcard
 * 
 * @param easinessFactor The easiness factor (between 1.3 and 2.5)
 * @param repetition The number of times the card has been reviewed
 * @returns The next review date as a string
 */
export const calculateNextReviewDate = (
  easinessFactor: number,
  repetition: number
): string => {
  const schedule = calculateNextReviewSchedule(easinessFactor, repetition);
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + schedule.interval);
  return nextDate.toISOString();
};

/**
 * Calculate the next review schedule for a flashcard
 * Implementation of the SuperMemo SM-2 algorithm with some modifications
 * 
 * @param easinessFactor The easiness factor (between 1.3 and 2.5)
 * @param repetition The number of times the card has been reviewed
 * @returns An object with the next interval, repetition number, and easiness factor
 */
export const calculateNextReviewSchedule = (
  easinessFactor: number,
  repetition: number
): RepetitionSchedule => {
  let interval: number;
  
  // Standard SM-2 algorithm intervals
  if (repetition === 0) {
    interval = 1; // First review after 1 day
  } else if (repetition === 1) {
    interval = 3; // Second review after 3 days
  } else if (repetition === 2) {
    interval = 7; // Third review after 7 days
  } else {
    // For subsequent reviews, use the formula: previousInterval * easinessFactor
    // with a maximum practical limit to avoid too long intervals
    const previousInterval = calculateNextReviewSchedule(easinessFactor, repetition - 1).interval;
    interval = Math.min(Math.round(previousInterval * easinessFactor), 365); // Cap at 365 days
  }
  
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  
  // Calculate estimated retention based on the interval and repetition count
  const estimatedRetention = calculateEstimatedRetention(interval, repetition);
  
  // Calculate mastery level based on repetition count and retention
  const masteryLevel = Math.min(1.0, repetition * 0.1 + estimatedRetention * 0.2);
  
  return {
    interval,
    repetition: repetition + 1,
    easinessFactor,
    nextReviewDate,
    estimatedRetention,
    masteryLevel
  };
};

/**
 * Update the easiness factor based on the quality of recall
 * 
 * @param currentEF The current easiness factor
 * @param quality The quality of recall (0-5, where 0 is complete blackout, 5 is perfect recall)
 * @returns The updated easiness factor
 */
export const updateEasinessFactor = (currentEF: number, quality: number): number => {
  // SM-2 algorithm formula for updating the easiness factor
  const newEF = currentEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  return Math.max(MIN_EASINESS_FACTOR, newEF);
};

/**
 * Calculate the retention probability based on difficulty and easiness factor
 * 
 * @param difficulty The difficulty rating (1-5, where 1 is easy, 5 is hard)
 * @param easinessFactor The easiness factor of the card
 * @returns The estimated retention probability (0-1)
 */
export const calculateRetention = (difficulty: number, easinessFactor: number): number => {
  // Convert 1-5 difficulty to 0-1 range (inverted, since higher difficulty means lower retention)
  const normalizedDifficulty = (6 - difficulty) / 5;
  
  // Normalize easiness factor to 0-1 range
  const normalizedEF = (easinessFactor - MIN_EASINESS_FACTOR) / (INITIAL_EASINESS_FACTOR - MIN_EASINESS_FACTOR);
  
  // Calculate retention based on difficulty and easiness factor
  // This is a simplified model that combines difficulty rating and easiness factor
  const rawRetention = 0.5 + (normalizedDifficulty * 0.3) + (normalizedEF * 0.2);
  
  // Ensure retention is between 0.1 and 1.0
  return Math.min(1.0, Math.max(0.1, rawRetention));
};

/**
 * Calculate the mastery level for a card based on its history
 * 
 * @param currentMastery The current mastery level (0-1)
 * @param retention The estimated retention probability
 * @param difficulty The difficulty rating (1-5)
 * @returns The updated mastery level (0-1)
 */
export const calculateMasteryLevel = (
  currentMastery: number,
  retention: number,
  difficulty: number
): number => {
  // Convert difficulty to a mastery impact factor
  // Easier cards (low difficulty) increase mastery more
  const masteryImpact = (6 - difficulty) / 5;
  
  // Calculate mastery change based on retention and impact
  const masteryChange = (retention * masteryImpact * 0.1);
  
  // Calculate new mastery level
  const newMastery = currentMastery + masteryChange;
  
  // Ensure mastery is between 0 and 1
  return Math.min(1.0, Math.max(0, newMastery));
};

/**
 * Calculate estimated retention based on interval and repetition count
 * Uses the forgetting curve formula: R = e^(-t/S), where:
 * - R is retention (0-1)
 * - t is time in days
 * - S is strength of memory (increases with repetition)
 * 
 * @param interval Days until next review
 * @param repetition Number of successful reviews
 * @returns Estimated retention (0-1) at review time
 */
export const calculateEstimatedRetention = (interval: number, repetition: number): number => {
  // Memory strength increases with each successful review
  const memoryStrength = 1 + repetition * 0.7;
  
  // Apply forgetting curve formula
  const retention = Math.exp(-interval / (memoryStrength * 10));
  
  // Ensure retention is between 0.1 and 0.95
  return Math.min(0.95, Math.max(0.1, retention));
};
