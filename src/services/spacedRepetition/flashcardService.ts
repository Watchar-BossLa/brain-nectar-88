
/**
 * Flashcard service
 * 
 * This file re-exports functionality from specialized modules
 * for easier imports elsewhere in the application
 */

// Re-export all functions from the specialized modules
export {
  getDueFlashcards,
  getUserFlashcards,
  getFlashcardsByTopic,
  getStrugglingFlashcards,
  getMasteredFlashcards
} from './flashcardRetrieval';

export {
  createFlashcard,
  deleteFlashcard
} from './flashcardMutation';

export {
  getFlashcardStats
} from './flashcardStats';
