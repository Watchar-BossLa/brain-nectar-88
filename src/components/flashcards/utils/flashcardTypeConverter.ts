
import { Flashcard, fromDatabaseFormat } from '@/types/flashcard';

/**
 * Converts between different Flashcard formats
 * This utility helps with compatibility between different parts of the application
 */

/**
 * Ensures both camelCase and snake_case versions of each property exist
 */
export const convertToSupabaseFlashcard = (flashcard: Partial<Flashcard>): Flashcard => {
  if (!flashcard) return null;
  
  return fromDatabaseFormat({
    id: flashcard.id || '',
    user_id: flashcard.userId || flashcard.user_id || '',
    topic_id: flashcard.topicId || flashcard.topic_id || null,
    front_content: flashcard.frontContent || flashcard.front_content || '',
    back_content: flashcard.backContent || flashcard.back_content || '',
    difficulty: flashcard.difficulty || 0,
    next_review_date: flashcard.nextReviewDate || flashcard.next_review_date || new Date().toISOString(),
    repetition_count: flashcard.repetitionCount || flashcard.repetition_count || 0,
    mastery_level: flashcard.masteryLevel || flashcard.mastery_level || 0,
    created_at: flashcard.createdAt || flashcard.created_at || new Date().toISOString(),
    updated_at: flashcard.updatedAt || flashcard.updated_at || new Date().toISOString(),
    easiness_factor: flashcard.easinessFactor || flashcard.easiness_factor || 2.5,
    last_retention: flashcard.lastRetention || flashcard.last_retention || 0,
    last_reviewed_at: flashcard.lastReviewedAt || flashcard.last_reviewed_at || null
  });
};

/**
 * Converts from a Supabase Flashcard to a Hook Flashcard (with both formats)
 */
export const convertToHookFlashcard = (flashcard: any): Flashcard => {
  if (!flashcard) return null;
  
  return fromDatabaseFormat(flashcard);
};
