
/**
 * Spaced Repetition Service
 * 
 * This file re-exports functionality from the specialized modules
 * for easier imports elsewhere in the application
 */

// Re-export from the refactored spacedRepetitionService
export { spacedRepetitionService } from '@/services/flashcards/spacedRepetitionService';

// For backward compatibility, provide direct function exports
export const calculateFlashcardRetention = (userId: string) => {
  return { data: { overallRetention: 0.75 } }; // Simple compatibility function
};

export const updateFlashcardAfterReview = async (flashcardId: string, difficulty: number) => {
  const success = await spacedRepetitionService.recordReview(flashcardId, difficulty);
  return { data: success, error: success ? null : new Error('Failed to update flashcard') };
};

export const getDueFlashcards = async (userId: string) => {
  const data = await spacedRepetitionService.getDueFlashcards(userId);
  return { data, error: null };
};

export const getFlashcardStats = async (userId: string) => {
  const data = await spacedRepetitionService.getFlashcardStats(userId);
  return { data, error: null };
};

// Placeholder for other backward compatibility functions
export const deleteFlashcard = async (flashcardId: string) => {
  try {
    const { error } = await import('@/lib/supabase').then(module => 
      module.supabase
        .from('flashcards')
        .delete()
        .eq('id', flashcardId)
    );
    
    return { error };
  } catch (err) {
    return { error: err };
  }
};
