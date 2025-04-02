
/**
 * Spaced Repetition Service
 * 
 * This file re-exports functionality from the specialized modules
 * for easier imports elsewhere in the application
 */

// Re-export from the refactored spacedRepetitionService
import { spacedRepetitionService } from '@/services/flashcards/spacedRepetitionService';
export { spacedRepetitionService };

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

// Add compatibility function for getUserFlashcards
export const getUserFlashcards = async (userId: string) => {
  try {
    const { error } = await import('@/lib/supabase').then(module => 
      module.supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId)
    );
    
    return { data: [], error };
  } catch (err) {
    return { data: [], error: err };
  }
};

// Add compatibility function for createFlashcard
export const createFlashcard = async (flashcardData: any) => {
  try {
    const { error } = await import('@/lib/supabase').then(module => 
      module.supabase
        .from('flashcards')
        .insert([flashcardData])
    );
    
    return { data: {}, error };
  } catch (err) {
    return { data: {}, error: err };
  }
};

// Add compatibility function for calculateNextReviewDate
export const calculateNextReviewDate = (easinessFactor: number, repetition: number) => {
  const days = Math.ceil(easinessFactor * repetition);
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate.toISOString();
};

// Constants needed for backward compatibility
export const INITIAL_EASINESS_FACTOR = 2.5;
export const MIN_EASINESS_FACTOR = 1.3;

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
