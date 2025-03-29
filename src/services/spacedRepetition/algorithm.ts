
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
  
  if (repetition === 0) {
    interval = 1; // First review after 1 day
  } else if (repetition === 1) {
    interval = 3; // Second review after 3 days
  } else {
    // For subsequent reviews, use the formula: previousInterval * easinessFactor
    const previousInterval = calculateNextReviewSchedule(easinessFactor, repetition - 1).interval;
    interval = Math.round(previousInterval * easinessFactor);
  }
  
  return {
    interval,
    repetition: repetition + 1,
    easinessFactor
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
  // This is a simplified model that can be adjusted
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
