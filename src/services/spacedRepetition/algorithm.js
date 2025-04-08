
/**
 * Enhanced Spaced Repetition Algorithm for StudyBee
 * Based on SM-2 with adaptive difficulty adjustments
 */

/**
 * Initial easiness factor for new flashcards
 * @type {number}
 */
export const INITIAL_EASINESS_FACTOR = 2.5;

/**
 * Minimum easiness factor to prevent cards from becoming too difficult
 * @type {number}
 */
export const MIN_EASINESS_FACTOR = 1.3;

/**
 * Calculate next review date
 * 
 * @param {number} interval - Number of days until next review
 * @returns {Date} Date object for next review
 */
export const calculateNextReviewDate = (interval) => {
  const now = new Date();
  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + interval);
  return nextDate;
};

/**
 * Calculate mastery level based on repetition count, difficulty, and interval
 * 
 * @param {number} repetitionCount - Number of times the card has been reviewed
 * @param {number} difficulty - Difficulty rating (1-5)
 * @param {number} interval - Days between reviews
 * @returns {number} Mastery level (0-1)
 */
export const calculateMasteryLevel = (
  repetitionCount,
  difficulty,
  interval
) => {
  // Convert difficulty (1-5) to a 0-1 scale where 1 is easiest
  const normalizedDifficulty = (6 - difficulty) / 5;
  
  // Calculate mastery based on repetition count, difficulty, and interval
  const repetitionFactor = Math.min(repetitionCount / 10, 1);
  const intervalFactor = Math.min(interval / 30, 1);
  
  // Combine factors with weights
  const mastery = 
    repetitionFactor * 0.5 + 
    normalizedDifficulty * 0.3 + 
    intervalFactor * 0.2;
  
  // Ensure mastery is in 0-1 range
  return Math.max(0, Math.min(1, mastery));
};

/**
 * Calculate memory retention based on days since last review
 * 
 * @param {number} daysSinceReview - Days since last review
 * @param {number} memoryStrength - Memory strength (higher = better retention)
 * @returns {number} Retention rate (0-1)
 */
export const calculateRetention = (
  daysSinceReview,
  memoryStrength
) => {
  // Ebbinghaus forgetting curve: R = e^(-t/S)
  // where R is retention, t is time, and S is memory strength
  return Math.exp(-1 * daysSinceReview / (memoryStrength + 1));
};

/**
 * Calculate next review schedule using enhanced SM-2 algorithm
 * 
 * @param {number} repetitionCount - Number of times the card has been reviewed
 * @param {number} easinessFactor - Current easiness factor
 * @param {number} difficultyRating - User's difficulty rating (1-5)
 * @param {number} previousInterval - Previous interval in days
 * @param {number} [targetRetention=0.85] - Target retention rate (0-1)
 * @returns {Object} Next review schedule details
 * @returns {number} returns.interval - Days until next review
 * @returns {number} returns.easinessFactor - New easiness factor
 * @returns {Date} returns.nextReviewDate - Next review date
 * @returns {number} returns.masteryLevel - Calculated mastery level (0-1)
 * @returns {number} returns.estimatedRetention - Estimated retention at next review
 */
export const calculateNextReviewSchedule = (
  repetitionCount,
  easinessFactor,
  difficultyRating,
  previousInterval,
  targetRetention = 0.85
) => {
  // Convert difficulty rating (1-5) to SM-2's quality (0-5)
  // In SM-2, higher quality means easier, but our difficulty scale is opposite
  const quality = 6 - difficultyRating;
  
  // Update easiness factor (EF)
  let newEasinessFactor = easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // Ensure EF doesn't go below minimum
  newEasinessFactor = Math.max(MIN_EASINESS_FACTOR, newEasinessFactor);
  
  let nextInterval;
  
  if (quality < 3) {
    // If response quality is poor, reset interval to 1
    nextInterval = 1;
  } else {
    // Calculate next interval based on repetition count
    if (repetitionCount === 0) {
      nextInterval = 1;
    } else if (repetitionCount === 1) {
      nextInterval = 6;
    } else {
      // Apply SM-2 formula for interval increase
      nextInterval = Math.round(previousInterval * newEasinessFactor);
    }
    
    // Adaptive modification based on target retention
    if (targetRetention > 0.9 && nextInterval > 4) {
      // For high retention targets, slightly shorten intervals
      nextInterval = Math.max(4, Math.round(nextInterval * 0.9));
    } else if (targetRetention < 0.8 && quality >= 4) {
      // For lower retention targets, extend intervals for well-known cards
      nextInterval = Math.round(nextInterval * 1.1);
    }
  }
  
  // Ensure minimum interval of 1 day
  nextInterval = Math.max(1, nextInterval);
  
  // Calculate next review date
  const nextReviewDate = calculateNextReviewDate(nextInterval);
  
  // Calculate mastery level
  const masteryLevel = calculateMasteryLevel(repetitionCount + 1, difficultyRating, nextInterval);
  
  // Estimate retention at the time of next review
  const estimatedRetention = calculateRetention(nextInterval, (repetitionCount + 1) * newEasinessFactor);
  
  return {
    interval: nextInterval,
    easinessFactor: newEasinessFactor,
    nextReviewDate,
    masteryLevel,
    estimatedRetention
  };
};
