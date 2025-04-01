
/**
 * Core algorithm implementation for spaced repetition
 * Contains the SM-2 algorithm logic for scheduling flashcard reviews
 */
import { Flashcard } from '@/types/flashcards';

/**
 * Calculate the new easiness factor based on difficulty rating
 * @param oldEasinessFactor Current easiness factor
 * @param difficulty Difficulty rating (1-5)
 * @returns New easiness factor
 */
export const calculateEasinessFactor = (oldEasinessFactor: number, difficulty: number): number => {
  // Convert difficulty rating (1-5) to SM-2 quality (0-5)
  // In SM-2, 5 is perfect response, 0 is complete blackout
  // In our app, 1 is very hard, 5 is very easy
  const quality = difficulty - 1;
  
  // Calculate new easiness factor using SM-2 formula
  let newEasinessFactor = oldEasinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEasinessFactor = Math.max(1.3, newEasinessFactor); // Minimum 1.3
  
  return newEasinessFactor;
};

/**
 * Calculate interval for the next review based on repetition count
 * @param repetitionCount Number of times the card has been reviewed
 * @returns Interval in days
 */
export const calculateBaseInterval = (repetitionCount: number): number => {
  if (repetitionCount <= 1) return 1; // First review after 1 day
  if (repetitionCount === 2) return 6; // Second review after 6 days
  
  // For subsequent reviews, calculate based on previous interval
  return 6 * Math.pow(2, repetitionCount - 2);
};

/**
 * Calculate the review interval in days based on easiness factor and mastery level
 * using a modified version of the SM-2 algorithm
 * @param easinessFactor The easiness factor
 * @param masteryLevel The mastery level
 * @param repetitionCount The number of times the card has been reviewed
 * @returns The number of days until the next review
 */
export const calculateReviewInterval = (easinessFactor: number, masteryLevel: number, repetitionCount: number): number => {
  // Default values if undefined
  const ef = easinessFactor || 2.5;
  const repCount = repetitionCount || 0;
  
  if (repCount === 0) return 1; // First review after 1 day
  if (repCount === 1) return 3; // Second review after 3 days
  
  // For subsequent reviews, use exponential backoff with easiness factor
  return Math.round(Math.pow(ef, repCount - 1) * 3);
};

/**
 * Calculate the next review date based on the review information
 * @param flashcard The flashcard being reviewed
 * @param difficulty The difficulty rating from review
 * @returns Object containing new values for the flashcard
 */
export const calculateNextReview = (
  flashcard: Flashcard, 
  difficulty: number
): {
  easinessFactor: number;
  interval: number;
  repetitionCount: number;
  nextReviewDate: Date;
} => {
  const oldEasinessFactor = flashcard.easiness_factor || 2.5;
  const repetitionCount = (flashcard.repetition_count || 0) + 1;
  
  // Calculate new easiness factor 
  const newEasinessFactor = calculateEasinessFactor(oldEasinessFactor, difficulty);
  
  // Calculate interval
  let interval: number;
  if (repetitionCount === 1) {
    interval = 1; // 1 day
  } else if (repetitionCount === 2) {
    interval = 6; // 6 days
  } else {
    // Use the helper method to calculate the interval
    const currentInterval = calculateReviewInterval(
      oldEasinessFactor,
      flashcard.mastery_level || 0,
      repetitionCount - 1
    );
    interval = Math.round(currentInterval * newEasinessFactor);
  }
  
  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  
  return {
    easinessFactor: newEasinessFactor,
    interval,
    repetitionCount,
    nextReviewDate
  };
};
