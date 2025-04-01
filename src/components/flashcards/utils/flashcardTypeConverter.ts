
import { Flashcard } from '@/types/flashcards';

/**
 * Convert internal flashcard type to Supabase flashcard type
 */
export const convertToSupabaseFlashcard = (flashcard: any): Flashcard => {
  return {
    id: flashcard.id,
    user_id: flashcard.userId || flashcard.user_id,
    topic_id: flashcard.topicId || flashcard.topic_id,
    front_content: flashcard.front || flashcard.front_content,
    back_content: flashcard.back || flashcard.back_content,
    difficulty: flashcard.difficulty || 0,
    next_review_date: flashcard.nextReviewDate || flashcard.next_review_date,
    repetition_count: flashcard.repetitionCount || flashcard.repetition_count || 0,
    mastery_level: flashcard.masteryLevel || flashcard.mastery_level || 0,
    easiness_factor: flashcard.easinessFactor || flashcard.easiness_factor || 2.5,
    last_retention: flashcard.lastRetention || flashcard.last_retention || 0.85,
    last_reviewed_at: flashcard.lastReviewedAt || flashcard.last_reviewed_at,
    created_at: flashcard.createdAt || flashcard.created_at || new Date().toISOString(),
    updated_at: flashcard.updatedAt || flashcard.updated_at || new Date().toISOString(),
  };
};

/**
 * Convert Supabase flashcard type to internal flashcard type
 */
export const convertFromSupabaseFlashcard = (flashcard: Flashcard): any => {
  return {
    id: flashcard.id,
    userId: flashcard.user_id,
    topicId: flashcard.topic_id,
    front: flashcard.front_content,
    back: flashcard.back_content,
    difficulty: flashcard.difficulty || 0,
    nextReviewDate: flashcard.next_review_date,
    repetitionCount: flashcard.repetition_count || 0,
    masteryLevel: flashcard.mastery_level || 0,
    easinessFactor: flashcard.easiness_factor || 2.5,
    lastRetention: flashcard.last_retention || 0.85,
    lastReviewedAt: flashcard.last_reviewed_at,
    createdAt: flashcard.created_at,
    updatedAt: flashcard.updated_at,
  };
};
