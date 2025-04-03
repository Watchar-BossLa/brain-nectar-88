
/**
 * Types related to Flashcards and spaced repetition system
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
  front?: string;
  back?: string;
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
}

export interface FlashcardCreateParams {
  frontContent: string;
  backContent: string;
  topicId?: string | null;
  difficulty?: number;
}

export interface FlashcardUpdateParams {
  frontContent?: string;
  backContent?: string;
  topicId?: string | null;
  difficulty?: number;
  nextReviewDate?: string;
  repetitionCount?: number;
  masteryLevel?: number;
  easinessFactor?: number;
  lastRetention?: number;
  lastReviewedAt?: string | null;
}

export interface FlashcardLearningStats {
  totalCards: number;
  masteredCards: number;
  dueCards: number;
  reviewsToday: number;
}

/**
 * Normalizes a flashcard from any format (DB or client-side) to ensure both naming
 * conventions are present
 */
export function normalizeFlashcard(dbFlashcard: any): Flashcard {
  if (!dbFlashcard) return null;

  return {
    // Primary fields
    id: dbFlashcard.id || '',
    userId: dbFlashcard.userId || dbFlashcard.user_id || '',
    topicId: dbFlashcard.topicId || dbFlashcard.topic_id || null,
    frontContent: dbFlashcard.frontContent || dbFlashcard.front_content || '',
    backContent: dbFlashcard.backContent || dbFlashcard.back_content || '',
    difficulty: dbFlashcard.difficulty || 0,
    nextReviewDate: dbFlashcard.nextReviewDate || dbFlashcard.next_review_date || new Date().toISOString(),
    repetitionCount: dbFlashcard.repetitionCount || dbFlashcard.repetition_count || 0,
    masteryLevel: dbFlashcard.masteryLevel || dbFlashcard.mastery_level || 0,
    createdAt: dbFlashcard.createdAt || dbFlashcard.created_at || new Date().toISOString(),
    updatedAt: dbFlashcard.updatedAt || dbFlashcard.updated_at || new Date().toISOString(),
    easinessFactor: dbFlashcard.easinessFactor || dbFlashcard.easiness_factor || 2.5,
    lastRetention: dbFlashcard.lastRetention || dbFlashcard.last_retention || 0,
    lastReviewedAt: dbFlashcard.lastReviewedAt || dbFlashcard.last_reviewed_at || null,
    
    // Alias fields for compatibility
    user_id: dbFlashcard.userId || dbFlashcard.user_id || '',
    topic_id: dbFlashcard.topicId || dbFlashcard.topic_id || null,
    front: dbFlashcard.frontContent || dbFlashcard.front_content || '',
    back: dbFlashcard.backContent || dbFlashcard.back_content || '',
    front_content: dbFlashcard.frontContent || dbFlashcard.front_content || '',
    back_content: dbFlashcard.backContent || dbFlashcard.back_content || '',
    next_review_date: dbFlashcard.nextReviewDate || dbFlashcard.next_review_date || new Date().toISOString(),
    repetition_count: dbFlashcard.repetitionCount || dbFlashcard.repetition_count || 0,
    mastery_level: dbFlashcard.masteryLevel || dbFlashcard.mastery_level || 0,
    created_at: dbFlashcard.createdAt || dbFlashcard.created_at || new Date().toISOString(),
    updated_at: dbFlashcard.updatedAt || dbFlashcard.updated_at || new Date().toISOString(),
    easiness_factor: dbFlashcard.easinessFactor || dbFlashcard.easiness_factor || 2.5,
    last_retention: dbFlashcard.lastRetention || dbFlashcard.last_retention || 0,
    last_reviewed_at: dbFlashcard.lastReviewedAt || dbFlashcard.last_reviewed_at || null
  };
}

/**
 * Converts a flashcard to snake_case format for database operations
 */
export function toDatabaseFormat(flashcard: Partial<Flashcard>): Record<string, any> {
  return {
    id: flashcard.id,
    user_id: flashcard.userId || flashcard.user_id,
    topic_id: flashcard.topicId || flashcard.topic_id,
    front_content: flashcard.frontContent || flashcard.front_content,
    back_content: flashcard.backContent || flashcard.back_content,
    difficulty: flashcard.difficulty,
    next_review_date: flashcard.nextReviewDate || flashcard.next_review_date,
    repetition_count: flashcard.repetitionCount || flashcard.repetition_count,
    mastery_level: flashcard.masteryLevel || flashcard.mastery_level,
    created_at: flashcard.createdAt || flashcard.created_at,
    updated_at: flashcard.updatedAt || flashcard.updated_at,
    easiness_factor: flashcard.easinessFactor || flashcard.easiness_factor,
    last_retention: flashcard.lastRetention || flashcard.last_retention,
    last_reviewed_at: flashcard.lastReviewedAt || flashcard.last_reviewed_at
  };
}
