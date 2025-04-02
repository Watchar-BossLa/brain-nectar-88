
import { Flashcard } from '@/types/supabase';

/**
 * Convert internal flashcard type to Supabase flashcard type
 */
export const convertToSupabaseFlashcard = (flashcard: any): Flashcard => {
  return {
    id: flashcard.id,
    user_id: flashcard.user_id || flashcard.userId || '',
    topic_id: flashcard.topic_id || flashcard.topicId || null,
    front_content: flashcard.front_content || flashcard.front || '',
    back_content: flashcard.back_content || flashcard.back || '',
    difficulty: flashcard.difficulty || 0,
    next_review_date: flashcard.next_review_date || flashcard.next_review_at || new Date().toISOString(),
    repetition_count: flashcard.repetition_count || flashcard.repetitions || 0,
    mastery_level: flashcard.mastery_level || 0,
    easiness_factor: flashcard.easiness_factor || 2.5,
    last_retention: flashcard.last_retention || 0.85,
    last_reviewed_at: flashcard.last_reviewed_at || null,
    created_at: flashcard.created_at || new Date().toISOString(),
    updated_at: flashcard.updated_at || new Date().toISOString(),
    // Add compatibility fields
    front: flashcard.front_content || flashcard.front || '',
    back: flashcard.back_content || flashcard.back || ''
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
    front_content: flashcard.front_content,
    back_content: flashcard.back_content,
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
