
// This file is kept for backwards compatibility.
// It re-exports the refactored hooks from the flashcards directory.

import { 
  useFlashcardsPage, 
  UseFlashcardsPageReturn, 
  Flashcard, 
  FlashcardLearningStats,
  calculateFlashcardRetention
} from './flashcards';

// Re-export the types and the main hook
export type { Flashcard, FlashcardLearningStats, UseFlashcardsPageReturn };
export { useFlashcardsPage, calculateFlashcardRetention };
