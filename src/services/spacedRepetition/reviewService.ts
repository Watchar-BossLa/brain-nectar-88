
/**
 * Review service for flashcards using spaced repetition
 * 
 * This file re-exports functionality from specialized modules
 * for easier imports elsewhere in the application
 */

// Re-export all functions from the specialized modules
export { 
  updateFlashcardAfterReview 
} from './reviewUpdate';

export {
  calculateFlashcardRetention,
  getFlashcardLearningStats
} from './reviewStats';

export type { 
  FlashcardRetentionResult,
  FlashcardLearningStats
} from './reviewTypes';
