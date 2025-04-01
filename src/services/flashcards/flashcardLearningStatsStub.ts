
import { queryFlashcardLearningStats, updateFlashcardLearningStats } from '@/lib/database-stub';

// This is just a stub service that redirects to the database-stub functions
export const getFlashcardLearningStats = async (userId: string, flashcardId?: string) => {
  return queryFlashcardLearningStats(userId, flashcardId);
};

export const updateLearningStats = async (
  flashcardId: string,
  userId: string,
  updates: Record<string, any>
) => {
  return updateFlashcardLearningStats(flashcardId, userId, updates);
};
