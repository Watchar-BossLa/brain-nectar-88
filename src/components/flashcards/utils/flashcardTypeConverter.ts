
import { Flashcard } from '@/types/flashcard';
import { Flashcard as SupabaseFlashcard } from '@/types/supabase';

/**
 * Converts the internal Flashcard type to the Supabase Flashcard type
 */
export const convertToSupabaseFlashcard = (flashcard: Partial<Flashcard>): SupabaseFlashcard => {
  if (!flashcard) return null;

  return {
    id: flashcard.id || '',
    userId: flashcard.userId || flashcard.user_id || '',
    user_id: flashcard.userId || flashcard.user_id || '',
    topicId: flashcard.topicId || flashcard.topic_id || null,
    topic_id: flashcard.topicId || flashcard.topic_id || null,
    frontContent: flashcard.frontContent || flashcard.front_content || '',
    front_content: flashcard.frontContent || flashcard.front_content || '',
    backContent: flashcard.backContent || flashcard.back_content || '',
    back_content: flashcard.backContent || flashcard.back_content || '',
    difficulty: flashcard.difficulty || 0,
    nextReviewDate: flashcard.nextReviewDate || flashcard.next_review_date || new Date().toISOString(),
    next_review_date: flashcard.nextReviewDate || flashcard.next_review_date || new Date().toISOString(),
    repetitionCount: flashcard.repetitionCount || flashcard.repetition_count || 0,
    repetition_count: flashcard.repetitionCount || flashcard.repetition_count || 0,
    masteryLevel: flashcard.masteryLevel || flashcard.mastery_level || 0,
    mastery_level: flashcard.masteryLevel || flashcard.mastery_level || 0,
    createdAt: flashcard.createdAt || flashcard.created_at || new Date().toISOString(),
    created_at: flashcard.createdAt || flashcard.created_at || new Date().toISOString(),
    updatedAt: flashcard.updatedAt || flashcard.updated_at || new Date().toISOString(),
    updated_at: flashcard.updatedAt || flashcard.updated_at || new Date().toISOString(),
    easinessFactor: flashcard.easinessFactor || flashcard.easiness_factor || 2.5,
    easiness_factor: flashcard.easinessFactor || flashcard.easiness_factor || 2.5,
    lastRetention: flashcard.lastRetention || flashcard.last_retention || 0,
    last_retention: flashcard.lastRetention || flashcard.last_retention || 0,
    lastReviewedAt: flashcard.lastReviewedAt || flashcard.last_reviewed_at || null,
    last_reviewed_at: flashcard.lastReviewedAt || flashcard.last_reviewed_at || null
  } as SupabaseFlashcard;
};

/**
 * Converts the Supabase Flashcard type to the internal Flashcard type
 */
export const convertToHookFlashcard = (flashcard: SupabaseFlashcard): Flashcard => {
  if (!flashcard) return null;

  return {
    id: flashcard.id || '',
    userId: flashcard.userId || flashcard.user_id || '',
    user_id: flashcard.userId || flashcard.user_id || '',
    topicId: flashcard.topicId || flashcard.topic_id || null,
    topic_id: flashcard.topicId || flashcard.topic_id || null,
    frontContent: flashcard.frontContent || flashcard.front_content || '',
    front_content: flashcard.frontContent || flashcard.front_content || '',
    backContent: flashcard.backContent || flashcard.back_content || '',
    back_content: flashcard.backContent || flashcard.back_content || '',
    difficulty: flashcard.difficulty || 0,
    nextReviewDate: flashcard.nextReviewDate || flashcard.next_review_date || new Date().toISOString(),
    next_review_date: flashcard.nextReviewDate || flashcard.next_review_date || new Date().toISOString(),
    repetitionCount: flashcard.repetitionCount || flashcard.repetition_count || 0,
    repetition_count: flashcard.repetitionCount || flashcard.repetition_count || 0,
    masteryLevel: flashcard.masteryLevel || flashcard.mastery_level || 0,
    mastery_level: flashcard.masteryLevel || flashcard.mastery_level || 0,
    createdAt: flashcard.createdAt || flashcard.created_at || new Date().toISOString(),
    created_at: flashcard.createdAt || flashcard.created_at || new Date().toISOString(),
    updatedAt: flashcard.updatedAt || flashcard.updated_at || new Date().toISOString(),
    updated_at: flashcard.updatedAt || flashcard.updated_at || new Date().toISOString(),
    easinessFactor: flashcard.easinessFactor || flashcard.easiness_factor || 2.5,
    easiness_factor: flashcard.easinessFactor || flashcard.easiness_factor || 2.5,
    lastRetention: flashcard.lastRetention || flashcard.last_retention || 0,
    last_retention: flashcard.lastRetention || flashcard.last_retention || 0,
    lastReviewedAt: flashcard.lastReviewedAt || flashcard.last_reviewed_at || null,
    last_reviewed_at: flashcard.lastReviewedAt || flashcard.last_reviewed_at || null
  } as Flashcard;
};
