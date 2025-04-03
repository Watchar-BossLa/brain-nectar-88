
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
  updateFlashcardReviewData,
  recordFlashcardReview
} from './reviewService';

import {
  calculateFlashcardRetention
} from './flashcardRetention';

import {
  getFlashcardLearningStats
} from './learningStats';

import {
  FlashcardRetentionResult,
  FlashcardLearningStats,
  FlashcardRetentionItem,
  FlashcardReviewResult
} from './reviewTypes';

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
  updateFlashcardReviewData,
  recordFlashcardReview,
  calculateFlashcardRetention,
  getFlashcardLearningStats,
  
  // Types
  type FlashcardRetentionResult,
  type FlashcardLearningStats,
  type FlashcardRetentionItem,
  type FlashcardReviewResult
};
