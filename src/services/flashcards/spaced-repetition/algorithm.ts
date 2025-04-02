
/**
 * Core spaced repetition algorithm implementation
 */

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
