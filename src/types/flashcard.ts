
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

export function fromDatabaseFormat(dbFlashcard: any): Flashcard {
  return {
    // Primary fields
    id: dbFlashcard.id || '',
    userId: dbFlashcard.user_id || '',
    topicId: dbFlashcard.topic_id || '',
    frontContent: dbFlashcard.front_content || '',
    backContent: dbFlashcard.back_content || '',
    difficulty: dbFlashcard.difficulty || 2.5,
    nextReviewDate: dbFlashcard.next_review_date || new Date().toISOString(),
    repetitionCount: dbFlashcard.repetition_count || 0,
    masteryLevel: dbFlashcard.mastery_level || 0,
    createdAt: dbFlashcard.created_at || new Date().toISOString(),
    updatedAt: dbFlashcard.updated_at || new Date().toISOString(),
    easinessFactor: dbFlashcard.easiness_factor || 2.5,
    lastRetention: dbFlashcard.last_retention || 0,
    lastReviewedAt: dbFlashcard.last_reviewed_at || new Date().toISOString(),
    
    // Alias fields for compatibility
    user_id: dbFlashcard.user_id || '',
    topic_id: dbFlashcard.topic_id || '',
    front: dbFlashcard.front_content || '',
    back: dbFlashcard.back_content || '',
    front_content: dbFlashcard.front_content || '',
    back_content: dbFlashcard.back_content || '',
    next_review_date: dbFlashcard.next_review_date || new Date().toISOString(),
    repetition_count: dbFlashcard.repetition_count || 0,
    mastery_level: dbFlashcard.mastery_level || 0,
    created_at: dbFlashcard.created_at || new Date().toISOString(),
    updated_at: dbFlashcard.updated_at || new Date().toISOString(),
    easiness_factor: dbFlashcard.easiness_factor || 2.5,
    last_retention: dbFlashcard.last_retention || 0,
    last_reviewed_at: dbFlashcard.last_reviewed_at || new Date().toISOString()
  };
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
