
import { Flashcard, FlashcardLearningStats, normalizeFlashcard, toDatabaseFormat } from '@/types/flashcard';

// Re-export the main types
export type { Flashcard, FlashcardLearningStats };

// Re-export the conversion functions with more descriptive names
export const formatFlashcardToCamelCase = normalizeFlashcard;
export const formatFlashcardToSnakeCase = toDatabaseFormat;
