
/**
 * Implementation of the improved SM-2 Spaced Repetition Algorithm with memory decay curve
 */

// SM-2 Spaced Repetition Algorithm parameters
export const INITIAL_EASINESS_FACTOR = 2.5;
export const MIN_EASINESS_FACTOR = 1.3;

// Memory decay constants
const MEMORY_DECAY_RATE = 0.1;
const MEMORY_STRENGTH_MODIFIER = 0.2;

type RepetitionSchedule = {
  interval: number;     // in days
  easinessFactor: number;
  nextReviewDate: Date;
  estimatedRetention: number; // percentage (0-1)
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
 * where we target a retention of 0.85 (85%)
 */
export const calculateOptimalInterval = (memoryStrength: number): number => {
  const targetRetention = 0.85;
  return -memoryStrength * 10 * Math.log(targetRetention);
};

/**
 * Calculates the next review schedule based on the enhanced SM-2 algorithm
 * @param repetitionCount Current repetition count
 * @param easinessFactor Current easiness factor
 * @param difficulty User-rated difficulty (1-5, 5 = most difficult)
 * @param previousInterval Previous interval in days (optional)
 * @returns Next review schedule information
 */
export const calculateNextReviewSchedule = (
  repetitionCount: number,
  easinessFactor: number,
  difficulty: number,
  previousInterval: number = 1
): RepetitionSchedule => {
  // Convert difficulty from 1-5 scale to 0-5 scale for algorithm
  const quality = 6 - difficulty;
  
  // Calculate new easiness factor
  let newEasinessFactor = easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
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
      interval = Math.max(Math.round(baseInterval * newEasinessFactor), previousInterval + 1);
    }
  }
  
  // Calculate estimated retention at review time
  const estimatedRetention = calculateRetention(interval, memoryStrength);
  
  // Calculate the next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  
  return {
    interval,
    easinessFactor: newEasinessFactor,
    nextReviewDate,
    estimatedRetention
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
