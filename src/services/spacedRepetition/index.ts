
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
  updateFlashcardAfterReview 
} from './reviewUpdate';

import { 
  calculateFlashcardRetention,
  getFlashcardLearningStats
} from './reviewStats';

import {
  getDueFlashcards,
  getUserFlashcards,
  getFlashcardsByTopic,
  getStrugglingFlashcards,
  getMasteredFlashcards
} from './flashcardRetrieval';

import {
  createFlashcard,
  deleteFlashcard
} from './flashcardMutation';

import {
  getFlashcardStats
} from './flashcardStats';

import type { 
  FlashcardRetentionResult,
  FlashcardLearningStats
} from './reviewTypes';

// Export all the services and functions
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
  type FlashcardLearningStats
};
