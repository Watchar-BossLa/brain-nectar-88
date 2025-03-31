
/**
 * Re-export all spaced repetition functionality from separate modules
 * This ensures backward compatibility with existing code
 */

// Re-export from algorithm module
export {
  calculateNextReviewDate,
  calculateRetention,
  calculateMasteryLevel,
  INITIAL_EASINESS_FACTOR,
  MIN_EASINESS_FACTOR
} from './spacedRepetition/algorithm';

// Re-export from flashcardStats module
export {
  getFlashcardStats
} from './spacedRepetition/flashcardStats';

// Re-export from flashcardMutation module
export {
  createFlashcard,
  deleteFlashcard
} from './spacedRepetition/flashcardMutation';

// Re-export from flashcardRetrieval module
export {
  getDueFlashcards,
  getUserFlashcards,
  getFlashcardsByTopic
} from './spacedRepetition/flashcardRetrieval';

// Re-export from reviewUpdate module
export {
  updateFlashcardAfterReview
} from './spacedRepetition/reviewUpdate';

// Re-export from reviewStats module
export {
  calculateFlashcardRetention,
  getFlashcardLearningStats
} from './spacedRepetition/reviewStats';

// Re-export types
export type {
  FlashcardLearningStats,
  FlashcardRetentionResult
} from './spacedRepetition/reviewTypes';
