
// This file is kept for backwards compatibility.
// It re-exports the refactored hook from the flashcards directory.

import { useFlashcardsPage } from './flashcards';
import { Flashcard } from '@/types/supabase';

// Re-export the types and the main hook
export type { Flashcard };
export { useFlashcardsPage };
