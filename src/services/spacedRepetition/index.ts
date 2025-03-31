
// Re-export all spaced repetition services
import { 
  calculateNextReviewDate, 
  calculateNextReviewSchedule,
  calculateMasteryLevel,
  calculateRetention,
  INITIAL_EASINESS_FACTOR, 
  MIN_EASINESS_FACTOR,
  type RepetitionSchedule
} from './algorithm';

import { 
  getDueFlashcards, 
  createFlashcard, 
  getUserFlashcards,
  deleteFlashcard,
  getFlashcardsByTopic,
  getStrugglingFlashcards,
  getMasteredFlashcards,
  getFlashcardStats
} from './flashcardService';

import { 
  updateFlashcardAfterReview,
  calculateFlashcardRetention,
  getFlashcardLearningStats
} from './reviewService';

import type { 
  FlashcardRetentionResult,
  FlashcardLearningStats
} from './reviewTypes';

// Create a compatibility layer for backward compatibility
import { 
  createFlashcard as createFlashcardCompat, 
  getUserFlashcards as getUserFlashcardsCompat,
  getDueFlashcards as getDueFlashcardsCompat,
  deleteFlashcard as deleteFlashcardCompat,
  updateFlashcardAfterReview as updateFlashcardAfterReviewCompat,
  getFlashcardsByTopic as getFlashcardsByTopicCompat,
  getFlashcardStats as getFlashcardStatsCompat
} from '../flashcardService';

// Export all the services
export {
  // Algorithm
  calculateNextReviewDate,
  calculateNextReviewSchedule,
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
  getStrugglingFlashcards,
  getMasteredFlashcards,
  getFlashcardStats,
  
  // Review management
  updateFlashcardAfterReview,
  calculateFlashcardRetention,
  getFlashcardLearningStats,
  
  // Types
  type RepetitionSchedule,
  type FlashcardRetentionResult,
  type FlashcardLearningStats,
  
  // Backward compatibility exports
  createFlashcardCompat as createFlashcard,
  getUserFlashcardsCompat as getUserFlashcards,
  getDueFlashcardsCompat as getDueFlashcards,
  deleteFlashcardCompat as deleteFlashcard,
  updateFlashcardAfterReviewCompat as updateFlashcardAfterReview,
  getFlashcardsByTopicCompat as getFlashcardsByTopic,
  getFlashcardStatsCompat as getFlashcardStats
};
