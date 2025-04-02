
// This file is kept for backwards compatibility.
// It re-exports the refactored hooks from the flashcards directory.

import { 
  useFlashcardsPage, 
  UseFlashcardsPageReturn
} from './flashcards';

// Re-export types properly
import type { Flashcard } from '@/types/supabase';
import type { FlashcardStats } from '@/types/flashcard-types';

// Re-export the types and the main hook
export type { Flashcard, FlashcardStats, UseFlashcardsPageReturn };
export { useFlashcardsPage };
