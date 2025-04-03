
/**
 * Primary Flashcard type definition - single source of truth
 */
export interface Flashcard {
  id: string;
  // User information
  userId: string;
  user_id?: string; // Support for legacy/DB format
  
  // Topic association
  topicId: string | null;
  topic_id?: string | null; // Support for legacy/DB format
  
  // Content
  frontContent: string;
  front_content?: string; // Support for legacy/DB format
  backContent: string;
  back_content?: string; // Support for legacy/DB format
  
  // Spaced repetition metadata
  difficulty: number;
  repetitionCount: number;
  repetition_count?: number; // Support for legacy/DB format
  masteryLevel: number;
  mastery_level?: number; // Support for legacy/DB format
  
  // Timing information
  nextReviewDate: string;
  next_review_date?: string; // Support for legacy/DB format
  lastReviewedAt: string | null;
  last_reviewed_at?: string | null; // Support for legacy/DB format
  createdAt: string;
  created_at?: string; // Support for legacy/DB format
  updatedAt: string;
  updated_at?: string; // Support for legacy/DB format
  
  // Extended spaced repetition data
  easinessFactor: number;
  easiness_factor?: number; // Support for legacy/DB format
  lastRetention: number;
  last_retention?: number; // Support for legacy/DB format
}

/**
 * Converts a database (snake_case) flashcard to the application (camelCase) format
 */
export const fromDatabaseFormat = (dbFlashcard: any): Flashcard => {
  if (!dbFlashcard) return null;
  
  return {
    id: dbFlashcard.id,
    userId: dbFlashcard.user_id || '',
    user_id: dbFlashcard.user_id || '',
    topicId: dbFlashcard.topic_id,
    topic_id: dbFlashcard.topic_id,
    frontContent: dbFlashcard.front_content || '',
    front_content: dbFlashcard.front_content || '',
    backContent: dbFlashcard.back_content || '',
    back_content: dbFlashcard.back_content || '',
    difficulty: dbFlashcard.difficulty || 0,
    repetitionCount: dbFlashcard.repetition_count || 0,
    repetition_count: dbFlashcard.repetition_count || 0,
    masteryLevel: dbFlashcard.mastery_level || 0,
    mastery_level: dbFlashcard.mastery_level || 0,
    nextReviewDate: dbFlashcard.next_review_date || new Date().toISOString(),
    next_review_date: dbFlashcard.next_review_date || new Date().toISOString(),
    lastReviewedAt: dbFlashcard.last_reviewed_at || null,
    last_reviewed_at: dbFlashcard.last_reviewed_at || null,
    createdAt: dbFlashcard.created_at || new Date().toISOString(),
    created_at: dbFlashcard.created_at || new Date().toISOString(),
    updatedAt: dbFlashcard.updated_at || new Date().toISOString(),
    updated_at: dbFlashcard.updated_at || new Date().toISOString(),
    easinessFactor: dbFlashcard.easiness_factor || 2.5,
    easiness_factor: dbFlashcard.easiness_factor || 2.5,
    lastRetention: dbFlashcard.last_retention || 0,
    last_retention: dbFlashcard.last_retention || 0,
  };
};

/**
 * Converts an application (camelCase) flashcard to the database (snake_case) format
 */
export const toDatabaseFormat = (flashcard: Partial<Flashcard>): Record<string, any> => {
  if (!flashcard) return {};
  
  const dbFlashcard: Record<string, any> = {};
  
  // Only include properties that are defined
  if (flashcard.id) dbFlashcard.id = flashcard.id;
  if (flashcard.userId || flashcard.user_id) dbFlashcard.user_id = flashcard.userId || flashcard.user_id;
  if (flashcard.topicId !== undefined || flashcard.topic_id !== undefined) {
    dbFlashcard.topic_id = flashcard.topicId !== undefined ? flashcard.topicId : flashcard.topic_id;
  }
  if (flashcard.frontContent || flashcard.front_content) {
    dbFlashcard.front_content = flashcard.frontContent || flashcard.front_content;
  }
  if (flashcard.backContent || flashcard.back_content) {
    dbFlashcard.back_content = flashcard.backContent || flashcard.back_content;
  }
  if (flashcard.difficulty !== undefined) dbFlashcard.difficulty = flashcard.difficulty;
  if (flashcard.repetitionCount !== undefined || flashcard.repetition_count !== undefined) {
    dbFlashcard.repetition_count = flashcard.repetitionCount !== undefined ? flashcard.repetitionCount : flashcard.repetition_count;
  }
  if (flashcard.masteryLevel !== undefined || flashcard.mastery_level !== undefined) {
    dbFlashcard.mastery_level = flashcard.masteryLevel !== undefined ? flashcard.masteryLevel : flashcard.mastery_level;
  }
  if (flashcard.nextReviewDate || flashcard.next_review_date) {
    dbFlashcard.next_review_date = flashcard.nextReviewDate || flashcard.next_review_date;
  }
  if (flashcard.lastReviewedAt || flashcard.last_reviewed_at) {
    dbFlashcard.last_reviewed_at = flashcard.lastReviewedAt || flashcard.last_reviewed_at;
  }
  if (flashcard.createdAt || flashcard.created_at) {
    dbFlashcard.created_at = flashcard.createdAt || flashcard.created_at;
  }
  if (flashcard.updatedAt || flashcard.updated_at) {
    dbFlashcard.updated_at = flashcard.updatedAt || flashcard.updated_at;
  }
  if (flashcard.easinessFactor !== undefined || flashcard.easiness_factor !== undefined) {
    dbFlashcard.easiness_factor = flashcard.easinessFactor !== undefined ? flashcard.easinessFactor : flashcard.easiness_factor;
  }
  if (flashcard.lastRetention !== undefined || flashcard.last_retention !== undefined) {
    dbFlashcard.last_retention = flashcard.lastRetention !== undefined ? flashcard.lastRetention : flashcard.last_retention;
  }
  
  return dbFlashcard;
};

/**
 * Learning statistics for flashcards
 */
export interface FlashcardLearningStats {
  totalCards: number;
  masteredCards: number;
  dueCards: number;
  averageDifficulty: number;
  reviewsToday: number;
  // Extended stats
  learningCards?: number;
  newCards?: number;
  reviewedToday?: number;
  averageRetention?: number;
  streakDays?: number;
  totalReviews?: number;
  averageEaseFactor?: number;
  retentionRate?: number;
  strugglingCardCount?: number;
  learningEfficiency?: number;
  recommendedDailyReviews?: number;
}

/**
 * Result of a flashcard review
 */
export interface FlashcardReviewResult {
  flashcardId: string;
  difficulty: number;
  reviewedAt: string;
  userId?: string;
  retention?: number;
}
