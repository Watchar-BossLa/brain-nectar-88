
// Re-export specific functions from algorithm
export { calculateNextReviewDate, calculateRetention, INITIAL_EASINESS_FACTOR, MIN_EASINESS_FACTOR } from './algorithm';

// Re-export flashcard stats functionality
export * from './flashcardStats';

// Re-export review update functionality
export * from './reviewUpdate';

// Re-export specific functions from reviewService with explicit names to avoid conflicts
export { getFlashcardLearningStats } from './reviewService';

// Export flashcard service functions with explicit names to avoid ambiguity
export { 
  getUserFlashcards, 
  getDueFlashcards, 
  getFlashcardsByTopic,
  createFlashcard, 
  updateFlashcard, 
  deleteFlashcard 
} from './flashcardService';
