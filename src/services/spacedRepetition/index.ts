
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
} from './reviewService';

export {
  // Algorithm
  calculateNextReviewDate,
  calculateNextReviewSchedule,
  calculateMasteryLevel,
  calculateRetention,
  INITIAL_EASINESS_FACTOR,
  MIN_EASINESS_FACTOR,
  type RepetitionSchedule,
  
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
  type FlashcardRetentionResult,
  type FlashcardLearningStats
};
