
/**
 * Implementation of the improved SM-2 Spaced Repetition Algorithm with memory decay curve
 * and adaptive learning capabilities for Study Bee
 */

// SM-2 Spaced Repetition Algorithm parameters
export const INITIAL_EASINESS_FACTOR = 2.5;
export const MIN_EASINESS_FACTOR = 1.3;

// Memory decay constants
const MEMORY_DECAY_RATE = 0.1;
const MEMORY_STRENGTH_MODIFIER = 0.2;

// Adaptive learning parameters
const RETENTION_TARGET = 0.85; // Target retention rate (85%)
const DIFFICULTY_SCALING = 0.05; // How quickly difficulty adjusts

export type RepetitionSchedule = {
  interval: number;     // in days
  easinessFactor: number;
  nextReviewDate: Date;
  estimatedRetention: number; // percentage (0-1)
  masteryLevel: number; // 0-1 scale
};

/**
 * Calculates the memory retention based on time since last review
 * Implements the forgetting curve: R = e^(-t/S)
 * Where:
 * - R is retention (0-1)
 * - t is time elapsed since last review (in days)
 * - S is memory strength (higher = slower decay)
 */
export const calculateRetention = (
  daysSinceLastReview: number,
  memoryStrength: number
): number => {
  return Math.exp(-daysSinceLastReview / (memoryStrength * 10));
};

/**
 * Calculates the optimal interval based on desired retention level
 * t = -S * ln(R)
 * where we target the defined retention target
 */
export const calculateOptimalInterval = (memoryStrength: number): number => {
  return -memoryStrength * 10 * Math.log(RETENTION_TARGET);
};

/**
 * Calculates mastery level based on repetition history and performance
 * @param repetitionCount Number of successful repetitions
 * @param averageDifficulty Average difficulty reported by user
 * @returns Mastery level between 0-1
 */
export const calculateMasteryLevel = (
  repetitionCount: number, 
  averageDifficulty: number
): number => {
  // Base mastery from repetition count (saturates around 10 repetitions)
  const repetitionMastery = Math.min(repetitionCount / 10, 0.8);
  
  // Adjust based on average reported difficulty (lower difficulty = higher mastery)
  const difficultyFactor = Math.max(0, (5 - averageDifficulty) / 5);
  
  // Combine factors (repetition contributes 70%, difficulty 30%)
  return (repetitionMastery * 0.7) + (difficultyFactor * 0.3);
};

/**
 * Calculates adaptive difficulty scaling based on user performance
 * @param targetRetention Target retention rate
 * @param actualRetention Actual observed retention rate
 * @returns Difficulty scaling factor (higher means increase difficulty)
 */
export const calculateAdaptiveDifficulty = (
  targetRetention: number,
  actualRetention: number
): number => {
  // If actual retention is too high, increase difficulty
  // If actual retention is too low, decrease difficulty
  return (actualRetention - targetRetention) * DIFFICULTY_SCALING;
};

/**
 * Calculates the next review schedule based on the enhanced SM-2 algorithm
 * with adaptive learning capabilities
 * 
 * @param repetitionCount Current repetition count
 * @param easinessFactor Current easiness factor
 * @param difficulty User-rated difficulty (1-5, 5 = most difficult)
 * @param previousInterval Previous interval in days (optional)
 * @param actualRetention Actual retention rate observed (optional)
 * @returns Next review schedule information
 */
export const calculateNextReviewSchedule = (
  repetitionCount: number,
  easinessFactor: number,
  difficulty: number,
  previousInterval: number = 1,
  actualRetention: number = RETENTION_TARGET
): RepetitionSchedule => {
  // Convert difficulty from 1-5 scale to 0-5 scale for algorithm
  const quality = 6 - difficulty;
  
  // Apply adaptive difficulty adjustment based on actual retention
  const adaptiveFactor = calculateAdaptiveDifficulty(RETENTION_TARGET, actualRetention);
  let adaptedDifficulty = difficulty + adaptiveFactor;
  adaptedDifficulty = Math.max(1, Math.min(5, adaptedDifficulty)); // Keep within 1-5
  const adaptedQuality = 6 - adaptedDifficulty;
  
  // Calculate new easiness factor with adaptive adjustment
  let newEasinessFactor = easinessFactor + (0.1 - (5 - adaptedQuality) * (0.08 + (5 - adaptedQuality) * 0.02));
  if (newEasinessFactor < MIN_EASINESS_FACTOR) {
    newEasinessFactor = MIN_EASINESS_FACTOR;
  }
  
  // Calculate memory strength based on repetition count and ease factor
  const memoryStrength = repetitionCount * MEMORY_STRENGTH_MODIFIER * newEasinessFactor;
  
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
      // For subsequent repetitions, use optimized interval
      const baseInterval = calculateOptimalInterval(memoryStrength);
      
      // Apply adaptive interval adjustment based on actual retention vs target
      const retentionRatio = actualRetention / RETENTION_TARGET;
      const adaptiveInterval = baseInterval * retentionRatio;
      
      // Ensure interval increases by at least 1 day from previous
      interval = Math.max(Math.round(adaptiveInterval * newEasinessFactor), previousInterval + 1);
    }
  }
  
  // Calculate estimated retention at review time
  const estimatedRetention = calculateRetention(interval, memoryStrength);
  
  // Calculate mastery level (0-1)
  const masteryLevel = calculateMasteryLevel(newRepetitionCount, difficulty);
  
  // Calculate the next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  
  return {
    interval,
    easinessFactor: newEasinessFactor,
    nextReviewDate,
    estimatedRetention,
    masteryLevel
  };
};

/**
 * Simplified legacy function for backward compatibility
 */
export const calculateNextReviewDate = (
  repetitionCount: number,
  easinessFactor: number,
  difficulty: number
): Date => {
  const schedule = calculateNextReviewSchedule(repetitionCount, easinessFactor, difficulty);
  return schedule.nextReviewDate;
};
