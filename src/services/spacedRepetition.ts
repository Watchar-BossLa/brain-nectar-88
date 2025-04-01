
// Re-export specific functions from flashcardService with aliases to prevent conflicts
export { 
  createFlashcard as createNewFlashcard,
  deleteFlashcard as removeFlashcard,
  updateFlashcard as modifyFlashcard
} from './spacedRepetition/flashcardService';

// Re-export query functions with more descriptive names
export {
  getUserFlashcards as fetchUserFlashcards,
  getDueFlashcards as fetchDueFlashcards,
  getFlashcardsByTopic as fetchFlashcardsByTopic
} from './spacedRepetition/flashcardService';

// Re-export algorithm functions
export { 
  calculateNextReviewDate, 
  calculateRetention, 
  INITIAL_EASINESS_FACTOR, 
  MIN_EASINESS_FACTOR 
} from './spacedRepetition/algorithm';

// Export reviewUpdate functions
export { updateFlashcardAfterReview } from './spacedRepetition/reviewUpdate';

// Re-export types
export type { FlashcardReviewResult, FlashcardLearningStats } from './spacedRepetition/reviewTypes';

// Re-export remaining types
export * from './spacedRepetition/types';
