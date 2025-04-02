
/**
 * Implements the SM-2 spaced repetition algorithm
 */
export function calculateSpacedRepetition(
  previousEasinessFactor: number,
  previousInterval: number,
  previousRepetition: number,
  difficultyRating: number // 0-5 scale, 0 = hardest, 5 = easiest
) {
  // Normalize difficulty from 0-5 scale to 0-1 scale required by SM-2
  const q = difficultyRating / 5;
  
  // Calculate new easiness factor (EF)
  let easinessFactor = previousEasinessFactor + (0.1 - (5 - difficultyRating) * (0.08 + (5 - difficultyRating) * 0.02));
  
  // Ensure EF doesn't go below 1.3 (algorithm constraint)
  if (easinessFactor < 1.3) {
    easinessFactor = 1.3;
  }
  
  // Calculate new repetition count (n) and interval (I)
  let repetitionCount = previousRepetition;
  let intervalDays = 0;
  
  // If the user found it too difficult (correct but difficult)
  if (difficultyRating < 3) {
    // Reset repetition counter but maintain some previous knowledge
    repetitionCount = Math.max(0, previousRepetition - 1);
    intervalDays = 1; // Review again tomorrow
  } else {
    // User found it manageable, increase repetition counter
    repetitionCount += 1;
    
    // Calculate interval based on repetition count
    if (repetitionCount === 1) {
      intervalDays = 1; // First successful review, repeat tomorrow
    } else if (repetitionCount === 2) {
      intervalDays = 6; // Second successful review, repeat in 6 days
    } else {
      // For third and subsequent reviews, use the formula
      intervalDays = Math.round(previousInterval * easinessFactor);
    }
  }
  
  // Ensure interval is at least 1 day
  if (intervalDays < 1) {
    intervalDays = 1;
  }
  
  return {
    easinessFactor,
    intervalDays,
    repetitionCount
  };
}

/**
 * Calculate retention score (estimate of how well the user remembers the material)
 * Returns a value between 0 and 1
 */
export function calculateRetention(
  lastReviewDate: string,
  intervalDays: number,
  easinessFactor: number
) {
  const daysSinceReview = getDaysDifference(new Date(lastReviewDate), new Date());
  
  // If we've passed the scheduled review date, retention decays more rapidly
  if (daysSinceReview > intervalDays) {
    // Steep decay after scheduled review date
    const daysOverdue = daysSinceReview - intervalDays;
    return Math.max(0, 1 - (daysOverdue / (intervalDays * easinessFactor)));
  } else {
    // Gentle decay up to the scheduled review date
    return 1 - (daysSinceReview / (intervalDays * 2));
  }
}

/**
 * Helper function to get days between two dates
 */
function getDaysDifference(date1: Date, date2: Date) {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
