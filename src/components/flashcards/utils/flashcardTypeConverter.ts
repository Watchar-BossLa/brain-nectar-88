
import { Flashcard as HookFlashcard } from '@/hooks/useFlashcardsPage';
import { Flashcard as SupabaseFlashcard } from '@/types/supabase';

/**
 * Converts the internal hook Flashcard type to the Supabase Flashcard type
 */
export const convertToSupabaseFlashcard = (flashcard: HookFlashcard): SupabaseFlashcard => {
  return {
    id: flashcard.id,
    userId: flashcard.userId || '',
    topicId: flashcard.topicId || null,
    frontContent: flashcard.front || flashcard.frontContent || '',
    backContent: flashcard.back || flashcard.backContent || '',
    difficulty: flashcard.difficulty || 0,
    nextReviewDate: flashcard.nextReviewDate || new Date().toISOString(),
    repetitionCount: flashcard.repetitionCount || 0,
    masteryLevel: flashcard.masteryLevel || 0,
    createdAt: flashcard.createdAt || new Date().toISOString(),
    updatedAt: flashcard.updatedAt || new Date().toISOString(),
    easinessFactor: flashcard.easinessFactor || 2.5,
    lastRetention: flashcard.lastRetention || 0,
    lastReviewedAt: flashcard.lastReviewedAt || null
  };
};
