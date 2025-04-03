
/**
 * Flashcard types for the application
 */

/**
 * Core Flashcard interface that all components should use
 */
export interface Flashcard {
  // Primary camelCase properties
  id: string;
  userId: string;
  topicId: string | null;
  frontContent: string;
  backContent: string;
  difficulty: number;
  nextReviewDate: string;
  repetitionCount: number;
  masteryLevel: number;
  createdAt: string;
  updatedAt: string;
  easinessFactor: number;
  lastRetention: number;
  lastReviewedAt: string | null;
  
  // Alias properties for compatibility
  user_id: string;
  topic_id: string | null;
  front_content: string;
  back_content: string;
  next_review_date: string;
  repetition_count: number;
  mastery_level: number;
  created_at: string;
  updated_at: string;
  easiness_factor: number;
  last_retention: number;
  last_reviewed_at: string | null;
  
  // Additional aliases
  front?: string;
  back?: string;
}

/**
 * Learning statistics for flashcards
 */
export interface FlashcardLearningStats {
  totalCards: number;
  dueCards: number;
  masteredCards: number;
  learningCards: number;
  newCards: number;
  reviewedToday: number;
  averageRetention: number;
  streakDays: number;
  totalReviews?: number;
  averageEaseFactor?: number;
  retentionRate?: number;
  strugglingCardCount?: number;
  learningEfficiency?: number;
  recommendedDailyReviews?: number;
  averageDifficulty?: number;
}

/**
 * Result of a flashcard review
 */
export interface FlashcardReviewResult {
  flashcardId: string;
  difficulty: number;
  reviewedAt: string;
  userId?: string;
}

/**
 * Convert a database format flashcard to a normalized Flashcard object
 * with both camelCase and snake_case properties
 * 
 * @param dbFlashcard The database format flashcard
 * @returns A fully normalized flashcard object
 */
export function normalizeFlashcard(dbFlashcard: any): Flashcard {
  if (!dbFlashcard) return null;
  
  return {
    // Primary fields
    id: dbFlashcard.id,
    userId: dbFlashcard.user_id,
    topicId: dbFlashcard.topic_id,
    frontContent: dbFlashcard.front_content,
    backContent: dbFlashcard.back_content,
    difficulty: dbFlashcard.difficulty || 0,
    nextReviewDate: dbFlashcard.next_review_date,
    repetitionCount: dbFlashcard.repetition_count || 0,
    masteryLevel: dbFlashcard.mastery_level || 0,
    createdAt: dbFlashcard.created_at,
    updatedAt: dbFlashcard.updated_at,
    easinessFactor: dbFlashcard.easiness_factor || 2.5,
    lastRetention: dbFlashcard.last_retention || 0,
    lastReviewedAt: dbFlashcard.last_reviewed_at,
    
    // Alias fields for compatibility
    user_id: dbFlashcard.user_id,
    topic_id: dbFlashcard.topic_id,
    front: dbFlashcard.front_content,
    back: dbFlashcard.back_content,
    front_content: dbFlashcard.front_content,
    back_content: dbFlashcard.back_content,
    next_review_date: dbFlashcard.next_review_date,
    repetition_count: dbFlashcard.repetition_count || 0,
    mastery_level: dbFlashcard.mastery_level || 0,
    created_at: dbFlashcard.created_at,
    updated_at: dbFlashcard.updated_at,
    easiness_factor: dbFlashcard.easiness_factor || 2.5,
    last_retention: dbFlashcard.last_retention || 0,
    last_reviewed_at: dbFlashcard.last_reviewed_at
  };
}

/**
 * Convert a database format flashcard to camelCase properties
 * @param flashcard The database format flashcard with snake_case properties
 * @returns A flashcard with camelCase properties
 * 
 * @deprecated Use normalizeFlashcard instead for more comprehensive normalization
 */
export function fromDatabaseFormat(flashcard: any): Flashcard {
  return normalizeFlashcard(flashcard);
}

/**
 * Convert a camelCase flashcard to database format
 * @param flashcard The flashcard with camelCase properties
 * @returns A flashcard with snake_case properties for database storage
 */
export function toDatabaseFormat(flashcard: Partial<Flashcard>): any {
  if (!flashcard) return null;
  
  return {
    id: flashcard.id,
    user_id: flashcard.userId || flashcard.user_id,
    topic_id: flashcard.topicId || flashcard.topic_id,
    front_content: flashcard.frontContent || flashcard.front_content || flashcard.front,
    back_content: flashcard.backContent || flashcard.back_content || flashcard.back,
    difficulty: flashcard.difficulty || 0,
    next_review_date: flashcard.nextReviewDate || flashcard.next_review_date,
    repetition_count: flashcard.repetitionCount || flashcard.repetition_count || 0,
    mastery_level: flashcard.masteryLevel || flashcard.mastery_level || 0,
    created_at: flashcard.createdAt || flashcard.created_at,
    updated_at: flashcard.updatedAt || flashcard.updated_at,
    easiness_factor: flashcard.easinessFactor || flashcard.easiness_factor || 2.5,
    last_retention: flashcard.lastRetention || flashcard.last_retention || 0,
    last_reviewed_at: flashcard.lastReviewedAt || flashcard.last_reviewed_at
  };
}
