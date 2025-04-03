
import { Flashcard as HookFlashcard } from '@/hooks/useFlashcardsPage';
import { Flashcard as SupabaseFlashcard } from '@/types/supabase';

/**
 * Converts the internal hook Flashcard type to the Supabase Flashcard type
 */
export const convertToSupabaseFlashcard = (flashcard: HookFlashcard): SupabaseFlashcard => {
  return {
    id: flashcard.id,
    userId: flashcard.userId || '',
    user_id: flashcard.userId || flashcard.user_id || '',
    topicId: flashcard.topicId || null,
    topic_id: flashcard.topicId || flashcard.topic_id || null,
    frontContent: flashcard.front || flashcard.frontContent || '',
    front_content: flashcard.front || flashcard.frontContent || '',
    backContent: flashcard.back || flashcard.backContent || '',
    back_content: flashcard.back || flashcard.backContent || '',
    difficulty: flashcard.difficulty || 0,
    nextReviewDate: flashcard.nextReviewDate || new Date().toISOString(),
    next_review_date: flashcard.nextReviewDate || flashcard.next_review_date || new Date().toISOString(),
    repetitionCount: flashcard.repetitionCount || 0,
    repetition_count: flashcard.repetitionCount || flashcard.repetition_count || 0,
    masteryLevel: flashcard.masteryLevel || 0,
    mastery_level: flashcard.masteryLevel || flashcard.mastery_level || 0,
    createdAt: flashcard.createdAt || new Date().toISOString(),
    created_at: flashcard.createdAt || flashcard.created_at || new Date().toISOString(),
    updatedAt: flashcard.updatedAt || new Date().toISOString(),
    updated_at: flashcard.updatedAt || flashcard.updated_at || new Date().toISOString(),
    easinessFactor: flashcard.easinessFactor || 2.5,
    easiness_factor: flashcard.easinessFactor || flashcard.easiness_factor || 2.5,
    lastRetention: flashcard.lastRetention || 0,
    last_retention: flashcard.lastRetention || flashcard.last_retention || 0,
    lastReviewedAt: flashcard.lastReviewedAt || null,
    last_reviewed_at: flashcard.lastReviewedAt || flashcard.last_reviewed_at || null
  };
};

/**
 * Converts the Supabase Flashcard type to the internal hook Flashcard type
 */
export const convertToHookFlashcard = (flashcard: SupabaseFlashcard): HookFlashcard => {
  return {
    id: flashcard.id,
    userId: flashcard.userId || flashcard.user_id || '',
    topicId: flashcard.topicId || flashcard.topic_id || null,
    front: flashcard.frontContent || flashcard.front_content || '',
    frontContent: flashcard.frontContent || flashcard.front_content || '',
    back: flashcard.backContent || flashcard.back_content || '',
    backContent: flashcard.backContent || flashcard.back_content || '',
    difficulty: flashcard.difficulty || 0,
    nextReviewDate: flashcard.nextReviewDate || flashcard.next_review_date || new Date().toISOString(),
    repetitionCount: flashcard.repetitionCount || flashcard.repetition_count || 0,
    masteryLevel: flashcard.masteryLevel || flashcard.mastery_level || 0,
    createdAt: flashcard.createdAt || flashcard.created_at || new Date().toISOString(),
    updatedAt: flashcard.updatedAt || flashcard.updated_at || new Date().toISOString(),
    easinessFactor: flashcard.easinessFactor || flashcard.easiness_factor || 2.5,
    lastRetention: flashcard.lastRetention || flashcard.last_retention || 0,
    lastReviewedAt: flashcard.lastReviewedAt || flashcard.last_reviewed_at || null
  };
};
