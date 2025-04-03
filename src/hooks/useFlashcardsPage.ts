
// This file now re-exports from the new modular hooks
import { 
  useFlashcardsPage,
  UseFlashcardsReturn,
  Flashcard,
  FlashcardLearningStats,
  formatFlashcardToCamelCase,
  formatFlashcardToSnakeCase
} from './flashcards/useFlashcardsPage';

export type { UseFlashcardsReturn, Flashcard, FlashcardLearningStats };
export { useFlashcardsPage, formatFlashcardToCamelCase, formatFlashcardToSnakeCase };
