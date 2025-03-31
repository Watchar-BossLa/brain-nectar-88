
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
  getDueFlashcards as getDueFlashcardsFromRetrieval, 
  createFlashcard as createFlashcardFromMutation, 
  getUserFlashcards as getUserFlashcardsFromRetrieval,
  deleteFlashcard as deleteFlashcardFromMutation,
  getFlashcardsByTopic as getFlashcardsByTopicFromRetrieval,
  getStrugglingFlashcards,
  getMasteredFlashcards,
  getFlashcardStats as getFlashcardStatsFromService
} from './flashcardService';

import { 
  updateFlashcardAfterReview as updateFlashcardAfterReviewFromService,
  calculateFlashcardRetention,
  getFlashcardLearningStats
} from './reviewService';

import type { 
  FlashcardRetentionResult,
  FlashcardLearningStats
} from './reviewTypes';

// Create a compatibility layer for backward compatibility
import {
  getUserFlashcards as getUserFlashcardsCompat,
  getDueFlashcards as getDueFlashcardsCompat,
  createFlashcard as createFlashcardCompat, 
  deleteFlashcard as deleteFlashcardCompat,
  updateFlashcardAfterReview as updateFlashcardAfterReviewCompat,
  getFlashcardsByTopic as getFlashcardsByTopicCompat,
  getFlashcardStats as getFlashcardStatsCompat,
  getFlashcardLearningStats as getFlashcardLearningStatsCompat
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
  getDueFlashcardsFromRetrieval as getDueFlashcards,
  createFlashcardFromMutation as createFlashcard,
  getUserFlashcardsFromRetrieval as getUserFlashcards,
  deleteFlashcardFromMutation as deleteFlashcard,
  getFlashcardsByTopicFromRetrieval as getFlashcardsByTopic,
  getStrugglingFlashcards,
  getMasteredFlashcards,
  getFlashcardStatsFromService as getFlashcardStats,
  
  // Review management
  updateFlashcardAfterReviewFromService as updateFlashcardAfterReview,
  calculateFlashcardRetention,
  getFlashcardLearningStats,
  
  // Types
  type RepetitionSchedule,
  type FlashcardRetentionResult,
  type FlashcardLearningStats,
  
  // Re-export services from flashcardService for backward compatibility
  getUserFlashcardsCompat,
  getDueFlashcardsCompat,
  createFlashcardCompat,
  deleteFlashcardCompat,
  updateFlashcardAfterReviewCompat,
  getFlashcardsByTopicCompat,
  getFlashcardStatsCompat,
  getFlashcardLearningStatsCompat
};
