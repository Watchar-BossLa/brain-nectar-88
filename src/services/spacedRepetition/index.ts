
// Re-export all spaced repetition services
import { 
  calculateNextReviewDate, 
  calculateMasteryLevel,
  calculateRetention,
  INITIAL_EASINESS_FACTOR, 
  MIN_EASINESS_FACTOR
} from './algorithm';

import { 
  updateFlashcardAfterReview 
} from './reviewUpdate';

import { 
  calculateFlashcardRetention,
  getFlashcardLearningStats
} from './reviewStats';

import {
  getDueFlashcards,
  getUserFlashcards,
  getFlashcardsByTopic
} from './flashcardRetrieval';

import {
  createFlashcard,
  deleteFlashcard
} from './flashcardMutation';

import {
  getFlashcardStats
} from './flashcardStats';

// Define missing types
export interface RepetitionSchedule {
  nextDate: Date;
  interval: number;
  easinessFactor: number;
}

export interface FlashcardRetentionResult {
  retention: number;
  forgettingIndex: number;
}

export interface FlashcardLearningStats {
  flashcard_id: string;
  retention_rate: number;
  review_count: number;
  mastery_level: number;
}

// Add stub implementations for missing methods
export const getStrugglingFlashcards = async (userId: string) => {
  console.log('Getting struggling flashcards for', userId);
  return { data: [], error: null };
};

export const getMasteredFlashcards = async (userId: string) => {
  console.log('Getting mastered flashcards for', userId);
  return { data: [], error: null };
};

export const calculateNextReviewSchedule = (
  currentInterval: number, 
  easinessFactor: number, 
  performanceRating: number
): RepetitionSchedule => {
  const nextReview = calculateNextReviewDate(currentInterval, easinessFactor, performanceRating);
  return {
    nextDate: nextReview,
    interval: currentInterval,
    easinessFactor: easinessFactor
  };
};

// Export all the services and functions
export {
  // Algorithm
  calculateNextReviewDate,
  calculateMasteryLevel,
  calculateRetention,
  INITIAL_EASINESS_FACTOR,
  MIN_EASINESS_FACTOR,
  
  // Flashcard management
  getDueFlashcards,
  createFlashcard,
  getUserFlashcards,
  deleteFlashcard,
  getFlashcardsByTopic,
  getFlashcardStats,
  
  // Review management
  updateFlashcardAfterReview,
  calculateFlashcardRetention,
  getFlashcardLearningStats
};
