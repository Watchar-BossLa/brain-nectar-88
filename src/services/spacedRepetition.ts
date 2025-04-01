
// Re-export specific functions with explicit names to avoid conflicts
import {
  calculateNextReviewDate,
  calculateRetention,
  INITIAL_EASINESS_FACTOR,
  MIN_EASINESS_FACTOR
} from './spacedRepetition/algorithm';

import {
  getUserFlashcards as getUserCards,
  getDueFlashcards as getDueCards,
  getFlashcardsByTopic as getCardsByTopic,
  createFlashcard as createCard,
  updateFlashcard as updateCard,
  deleteFlashcard as deleteCard
} from './spacedRepetition/flashcardService';

// Re-export with renamed functions to avoid conflicts
export {
  calculateNextReviewDate,
  calculateRetention,
  INITIAL_EASINESS_FACTOR,
  MIN_EASINESS_FACTOR,
  // Export services with their original names
  getUserCards as getUserFlashcards,
  getDueCards as getDueFlashcards,
  getCardsByTopic as getFlashcardsByTopic,
  createCard as createFlashcard,
  updateCard as updateFlashcard,
  deleteCard as deleteFlashcard
};

// Export the flashcard review update functionality
export { updateFlashcardAfterReview } from './spacedRepetition/reviewUpdate';

// Export flashcard stats functionality
export * from './spacedRepetition/flashcardStats';

// Export review service with explicit names
export { getFlashcardLearningStats } from './spacedRepetition/flashcardStats';
