
// Re-export all spaced repetition related functions
export * from './algorithm';
export * from './flashcardStats';
export * from './reviewUpdate';

// Re-export specific functions to avoid naming conflicts
export { getFlashcardLearningStats } from './reviewService';
export { getUserFlashcards, getDueFlashcards, getFlashcardsByTopic } from './flashcardService';
export { createFlashcard, updateFlashcard, deleteFlashcard } from './flashcardService';

// Do not re-export duplicate named functions/constants
