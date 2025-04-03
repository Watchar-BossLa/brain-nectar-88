
import { Flashcard as FlashcardType, fromDatabaseFormat, toDatabaseFormat, FlashcardLearningStats } from '@/types/flashcard';

// Re-export the main types
export type Flashcard = FlashcardType;
export type { FlashcardLearningStats };

// Re-export the conversion functions with more descriptive names
export const formatFlashcardToCamelCase = fromDatabaseFormat;
export const formatFlashcardToSnakeCase = toDatabaseFormat;
