
import { Flashcard as SupabaseFlashcard } from '@/types/supabase';

export interface Flashcard {
  id: string;
  userId?: string;
  topicId?: string | null;
  front?: string;
  back?: string;
  frontContent?: string;
  backContent?: string;
  difficulty?: number;
  nextReviewDate?: string;
  repetitionCount?: number;
  masteryLevel?: number;
  createdAt?: string;
  updatedAt?: string;
  easinessFactor?: number;
  lastRetention?: number;
  lastReviewedAt?: string | null;
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
    topicId: flashcard.topic_id,
    frontContent: flashcard.front_content,
    backContent: flashcard.back_content,
    difficulty: flashcard.difficulty,
    nextReviewDate: flashcard.next_review_date,
    repetitionCount: flashcard.repetition_count,
    masteryLevel: flashcard.mastery_level,
    createdAt: flashcard.created_at,
    updatedAt: flashcard.updated_at,
    easinessFactor: flashcard.easiness_factor,
    lastRetention: flashcard.last_retention,
    lastReviewedAt: flashcard.last_reviewed_at
  };
};

// Helper function to format camelCase to snake_case for database
export const formatFlashcardToSnakeCase = (flashcard: Partial<Flashcard>): any => {
  const result: any = {};
  
  if (flashcard.userId) result.user_id = flashcard.userId;
  if (flashcard.topicId !== undefined) result.topic_id = flashcard.topicId;
  if (flashcard.frontContent || flashcard.front) result.front_content = flashcard.frontContent || flashcard.front;
  if (flashcard.backContent || flashcard.back) result.back_content = flashcard.backContent || flashcard.back;
  if (flashcard.difficulty !== undefined) result.difficulty = flashcard.difficulty;
  if (flashcard.nextReviewDate) result.next_review_date = flashcard.nextReviewDate;
  if (flashcard.repetitionCount !== undefined) result.repetition_count = flashcard.repetitionCount;
  if (flashcard.masteryLevel !== undefined) result.mastery_level = flashcard.masteryLevel;
  if (flashcard.easinessFactor !== undefined) result.easiness_factor = flashcard.easinessFactor;
  if (flashcard.lastRetention !== undefined) result.last_retention = flashcard.lastRetention;
  if (flashcard.lastReviewedAt) result.last_reviewed_at = flashcard.lastReviewedAt;
  
  return result;
};
