
// Re-export specific functions with explicit names to avoid conflicts
import {
  calculateNextReviewDate,
  calculateRetention,
  INITIAL_EASINESS_FACTOR,
  MIN_EASINESS_FACTOR
} from './spacedRepetition/algorithm';

// Export algorithm functions with their original names
export {
  calculateNextReviewDate,
  calculateRetention,
  INITIAL_EASINESS_FACTOR,
  MIN_EASINESS_FACTOR
};

// Export flashcard services with unique names to avoid conflicts
export {
  getUserFlashcards as fetchUserFlashcards,
  getDueFlashcards as fetchDueFlashcards,
  getFlashcardsByTopic as fetchFlashcardsByTopic,
  createFlashcard as createNewFlashcard,
  updateFlashcard as modifyFlashcard,
  deleteFlashcard as removeFlashcard
} from './spacedRepetition/flashcardService';

// Export the flashcard review update functionality
export { updateFlashcardAfterReview } from './spacedRepetition/reviewUpdate';

// Export flashcard stats functionality
export * from './spacedRepetition/flashcardStats';
