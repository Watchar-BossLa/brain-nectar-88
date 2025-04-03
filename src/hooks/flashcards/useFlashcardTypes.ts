
import { Flashcard as SupabaseFlashcard } from '@/types/supabase';

export interface Flashcard {
  id: string;
  userId?: string;
  user_id?: string; // Support both camelCase and snake_case for backwards compatibility
  topicId?: string | null;
  topic_id?: string | null; // Support both formats
  front?: string;
  back?: string;
  frontContent?: string;
  front_content?: string; // Support both formats
  backContent?: string;
  back_content?: string; // Support both formats
  difficulty?: number;
  nextReviewDate?: string;
  next_review_date?: string; // Support both formats
  repetitionCount?: number;
  repetition_count?: number; // Support both formats
  masteryLevel?: number;
  mastery_level?: number; // Support both formats
  createdAt?: string;
  created_at?: string; // Support both formats
  updatedAt?: string;
  updated_at?: string; // Support both formats
  easinessFactor?: number;
  easiness_factor?: number; // Support both formats
  lastRetention?: number;
  last_retention?: number; // Support both formats
  lastReviewedAt?: string | null;
  last_reviewed_at?: string | null; // Support both formats
}

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

// Helper function to format snake_case database fields to camelCase
export const formatFlashcardToCamelCase = (flashcard: any): Flashcard => {
  return {
    id: flashcard.id,
    userId: flashcard.user_id,
    user_id: flashcard.user_id,
    topicId: flashcard.topic_id,
    topic_id: flashcard.topic_id,
    front: flashcard.front_content, // For backward compatibility
    frontContent: flashcard.front_content,
    front_content: flashcard.front_content,
    back: flashcard.back_content, // For backward compatibility
    backContent: flashcard.back_content,
    back_content: flashcard.back_content,
    difficulty: flashcard.difficulty,
    nextReviewDate: flashcard.next_review_date,
    next_review_date: flashcard.next_review_date,
    repetitionCount: flashcard.repetition_count,
    repetition_count: flashcard.repetition_count,
    masteryLevel: flashcard.mastery_level,
    mastery_level: flashcard.mastery_level,
    createdAt: flashcard.created_at,
    created_at: flashcard.created_at,
    updatedAt: flashcard.updated_at,
    updated_at: flashcard.updated_at,
    easinessFactor: flashcard.easiness_factor,
    easiness_factor: flashcard.easiness_factor,
    lastRetention: flashcard.last_retention,
    last_retention: flashcard.last_retention,
    lastReviewedAt: flashcard.last_reviewed_at,
    last_reviewed_at: flashcard.last_reviewed_at
  };
};

// Helper function to format camelCase to snake_case for database
export const formatFlashcardToSnakeCase = (flashcard: Partial<Flashcard>): any => {
  const result: any = {};
  
  if (flashcard.userId || flashcard.user_id) result.user_id = flashcard.userId || flashcard.user_id;
  if (flashcard.topicId !== undefined || flashcard.topic_id !== undefined) result.topic_id = flashcard.topicId || flashcard.topic_id;
  
  // Handle both front/frontContent for backward compatibility
  if (flashcard.frontContent || flashcard.front || flashcard.front_content) {
    result.front_content = flashcard.frontContent || flashcard.front || flashcard.front_content;
  }
  
  // Handle both back/backContent for backward compatibility
  if (flashcard.backContent || flashcard.back || flashcard.back_content) {
    result.back_content = flashcard.backContent || flashcard.back || flashcard.back_content;
  }
  
  if (flashcard.difficulty !== undefined) result.difficulty = flashcard.difficulty;
  
  if (flashcard.nextReviewDate || flashcard.next_review_date) {
    result.next_review_date = flashcard.nextReviewDate || flashcard.next_review_date;
  }
  
  if (flashcard.repetitionCount !== undefined || flashcard.repetition_count !== undefined) {
    result.repetition_count = flashcard.repetitionCount !== undefined ? flashcard.repetitionCount : flashcard.repetition_count;
  }
  
  if (flashcard.masteryLevel !== undefined || flashcard.mastery_level !== undefined) {
    result.mastery_level = flashcard.masteryLevel !== undefined ? flashcard.masteryLevel : flashcard.mastery_level;
  }
  
  if (flashcard.easinessFactor !== undefined || flashcard.easiness_factor !== undefined) {
    result.easiness_factor = flashcard.easinessFactor !== undefined ? flashcard.easinessFactor : flashcard.easiness_factor;
  }
  
  if (flashcard.lastRetention !== undefined || flashcard.last_retention !== undefined) {
    result.last_retention = flashcard.lastRetention !== undefined ? flashcard.lastRetention : flashcard.last_retention;
  }
  
  if (flashcard.lastReviewedAt || flashcard.last_reviewed_at) {
    result.last_reviewed_at = flashcard.lastReviewedAt || flashcard.last_reviewed_at;
  }
  
  return result;
};
