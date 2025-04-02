
// Export all spaced repetition related functions
export * from './spacedRepetition/flashcardService';
export * from './spacedRepetition/flashcardMutation';
export * from './spacedRepetition/flashcardRetrieval';
export * from './spacedRepetition/reviewService';
export * from './spacedRepetition/reviewStats';
export * from './spacedRepetition/spacedRepAlgorithm';

// Re-export specific functions for backward compatibility
export {
  calculateFlashcardRetention,
  getFlashcardLearningStats,
  getFlashcardRetentionStats
} from './spacedRepetition/reviewStats';
