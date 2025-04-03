
/**
 * Flashcard type definitions for the Study Bee application
 */

export interface FlashcardLearningStats {
  totalCards: number;
  masteredCards: number;
  dueCards: number;
  reviewsToday: number;
  averageRetention: number;
  streakDays: number;
}

export interface Flashcard {
  // Primary camelCase properties
  id: string;
  userId: string;
  topicId: string;
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
  lastReviewedAt: string;
  
  // Alias properties for compatibility
  user_id: string;
  topic_id: string;
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
  last_reviewed_at: string;
}

/**
 * Converts a flashcard from any format to a standardized format with both camelCase
 * and snake_case properties for compatibility
 */
export function normalizeFlashcard(flashcard: any): Flashcard {
  if (!flashcard) return null;

  const normalized: Flashcard = {
    // Primary fields in camelCase
    id: flashcard.id || '',
    userId: flashcard.userId || flashcard.user_id || '',
    topicId: flashcard.topicId || flashcard.topic_id || '',
    frontContent: flashcard.frontContent || flashcard.front_content || flashcard.front || '',
    backContent: flashcard.backContent || flashcard.back_content || flashcard.back || '',
    difficulty: flashcard.difficulty || 2.5,
    nextReviewDate: flashcard.nextReviewDate || flashcard.next_review_date || new Date().toISOString(),
    repetitionCount: flashcard.repetitionCount || flashcard.repetition_count || 0,
    masteryLevel: flashcard.masteryLevel || flashcard.mastery_level || 0,
    createdAt: flashcard.createdAt || flashcard.created_at || new Date().toISOString(),
    updatedAt: flashcard.updatedAt || flashcard.updated_at || new Date().toISOString(),
    easinessFactor: flashcard.easinessFactor || flashcard.easiness_factor || 2.5,
    lastRetention: flashcard.lastRetention || flashcard.last_retention || 0,
    lastReviewedAt: flashcard.lastReviewedAt || flashcard.last_reviewed_at || null,
    
    // Also provide snake_case for backward compatibility
    user_id: flashcard.userId || flashcard.user_id || '',
    topic_id: flashcard.topicId || flashcard.topic_id || '',
    front: flashcard.frontContent || flashcard.front_content || flashcard.front || '',
    back: flashcard.backContent || flashcard.back_content || flashcard.back || '',
    front_content: flashcard.frontContent || flashcard.front_content || flashcard.front || '',
    back_content: flashcard.backContent || flashcard.back_content || flashcard.back || '',
    next_review_date: flashcard.nextReviewDate || flashcard.next_review_date || new Date().toISOString(),
    repetition_count: flashcard.repetitionCount || flashcard.repetition_count || 0,
    mastery_level: flashcard.masteryLevel || flashcard.mastery_level || 0,
    created_at: flashcard.createdAt || flashcard.created_at || new Date().toISOString(),
    updated_at: flashcard.updatedAt || flashcard.updated_at || new Date().toISOString(),
    easiness_factor: flashcard.easinessFactor || flashcard.easiness_factor || 2.5,
    last_retention: flashcard.lastRetention || flashcard.last_retention || 0,
    last_reviewed_at: flashcard.lastReviewedAt || flashcard.last_reviewed_at || null
  };

  return normalized;
}

export function fromDatabaseFormat(dbFlashcard: any): Flashcard {
  return normalizeFlashcard(dbFlashcard);
}

export function toDatabaseFormat(flashcard: Partial<Flashcard>): Record<string, any> {
  return {
    id: flashcard.id,
    user_id: flashcard.userId || flashcard.user_id,
    topic_id: flashcard.topicId || flashcard.topic_id,
    front_content: flashcard.frontContent || flashcard.front_content || flashcard.front,
    back_content: flashcard.backContent || flashcard.back_content || flashcard.back,
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

