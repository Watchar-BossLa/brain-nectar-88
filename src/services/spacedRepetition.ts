
// Fix for conflicting star exports - use named re-exports to avoid ambiguity
export { 
  createFlashcard as createNewFlashcard,
  deleteFlashcard as removeFlashcard,
  updateFlashcard as modifyFlashcard
} from './spacedRepetition/flashcardService';

export {
  getDueFlashcards as fetchDueFlashcards,
  getFlashcardsByTopic as fetchFlashcardsByTopic,
  getUserFlashcards as fetchUserFlashcards
} from './spacedRepetition/flashcardService';

// Re-export other non-conflicting functions and types
export * from './spacedRepetition/algorithm';
export * from './spacedRepetition/reviewService';
export * from './spacedRepetition/reviewStats';
export * from './spacedRepetition/reviewTypes';
export * from './spacedRepetition/reviewUpdate';
export * from './spacedRepetition/types';
