
/**
 * Spaced Repetition System - Main export file
 * 
 * @fileoverview This file exports all functionality from the spaced repetition module
 */

// Re-export all spaced repetition services
import { 
  calculateNextReviewDate, 
  calculateNextReviewSchedule,
  calculateMasteryLevel,
  calculateRetention,
  INITIAL_EASINESS_FACTOR, 
  MIN_EASINESS_FACTOR
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
  updateFlashcardReviewData,
  recordFlashcardReview,
  calculateFlashcardRetention,
  getFlashcardLearningStats
};
