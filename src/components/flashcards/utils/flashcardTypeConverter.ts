
import { Flashcard as HookFlashcard } from '@/hooks/useFlashcardsPage';
import { Flashcard as SupabaseFlashcard } from '@/types/supabase';

/**
 * Converts the internal hook Flashcard type to the Supabase Flashcard type
 */
export const convertToSupabaseFlashcard = (flashcard: HookFlashcard): SupabaseFlashcard => {
  return {
    id: flashcard.id,
    user_id: flashcard.user_id || '',
    topic_id: flashcard.topicId || flashcard.topic_id || null,
    front_content: flashcard.front || flashcard.front_content || '',
    back_content: flashcard.back || flashcard.back_content || '',
    difficulty: flashcard.difficulty || 0,
    next_review_date: flashcard.next_review_date || new Date().toISOString(),
    repetition_count: flashcard.repetition_count || 0,
    mastery_level: flashcard.mastery_level || 0,
    created_at: flashcard.created_at || new Date().toISOString(),
    updated_at: flashcard.updated_at || new Date().toISOString(),
    easiness_factor: flashcard.easiness_factor || 2.5,
    last_retention: flashcard.last_retention || 0,
    last_reviewed_at: flashcard.last_reviewed_at || null
  };
};
