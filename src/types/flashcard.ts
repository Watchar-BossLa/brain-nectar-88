
/**
 * Flashcard types for the application
 */

/**
 * Core Flashcard interface that all components should use
 */
export interface Flashcard {
  id: string;
  userId: string;
  user_id: string;
  topicId: string | null;
  topic_id: string | null;
  frontContent: string;
  front_content: string;
  backContent: string;
  back_content: string;
  difficulty: number;
  nextReviewDate: string;
  next_review_date: string;
  repetitionCount: number;
  repetition_count: number;
  masteryLevel: number;
  mastery_level: number;
  createdAt: string;
  created_at: string;
  updatedAt: string;
  updated_at: string;
  easinessFactor: number;
  easiness_factor: number;
  lastRetention: number;
  last_retention: number;
  lastReviewedAt: string | null;
  last_reviewed_at: string | null;
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
 * Convert a database format flashcard to camelCase properties
 * @param flashcard The database format flashcard with snake_case properties
 * @returns A flashcard with camelCase properties
 */
export function fromDatabaseFormat(flashcard: any): Flashcard {
  if (!flashcard) return null;
  
  return {
    id: flashcard.id,
    userId: flashcard.user_id,
    user_id: flashcard.user_id,
    topicId: flashcard.topic_id,
    topic_id: flashcard.topic_id,
    frontContent: flashcard.front_content,
    front_content: flashcard.front_content,
    backContent: flashcard.back_content,
    back_content: flashcard.back_content,
    difficulty: flashcard.difficulty || 0,
    nextReviewDate: flashcard.next_review_date,
    next_review_date: flashcard.next_review_date,
    repetitionCount: flashcard.repetition_count || 0,
    repetition_count: flashcard.repetition_count || 0,
    masteryLevel: flashcard.mastery_level || 0,
    mastery_level: flashcard.mastery_level || 0,
    createdAt: flashcard.created_at,
    created_at: flashcard.created_at,
    updatedAt: flashcard.updated_at,
    updated_at: flashcard.updated_at,
    easinessFactor: flashcard.easiness_factor || 2.5,
    easiness_factor: flashcard.easiness_factor || 2.5,
    lastRetention: flashcard.last_retention || 0,
    last_retention: flashcard.last_retention || 0,
    lastReviewedAt: flashcard.last_reviewed_at,
    last_reviewed_at: flashcard.last_reviewed_at
  };
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
    front_content: flashcard.frontContent || flashcard.front_content,
    back_content: flashcard.backContent || flashcard.back_content,
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
