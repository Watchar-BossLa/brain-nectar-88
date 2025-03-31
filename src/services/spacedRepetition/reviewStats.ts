
import { Flashcard } from '@/hooks/flashcards/types';
import { FlashcardLearningStats } from './reviewTypes';

/**
 * Calculates the retention rate for a flashcard based on its learning history
 */
export const calculateFlashcardRetention = (flashcard: Flashcard | FlashcardLearningStats): number => {
  // Get the easiness factor, handling both object types
  const easinessFactor = 'easiness_factor' in flashcard 
    ? flashcard.easiness_factor 
    : (flashcard as any).easinessFactor || 2.5;
    
  // Get the repetition count, handling both object types
  const repetitions = 'repetitions' in flashcard 
    ? flashcard.repetitions 
    : (flashcard as any).repetition_count || 0;
  
  // Retention formula: base retention adjusted by easiness and repetitions
  // Range: 0-100%
  const baseRetention = 40; // Starting point for a new card
  const easinessBonus = Math.min((easinessFactor - 1.3) * 20, 40); // Max 40% bonus
  const repetitionBonus = Math.min(repetitions * 5, 20); // Max 20% bonus
  
  return Math.min(Math.round(baseRetention + easinessBonus + repetitionBonus), 100);
};

/**
 * Get learning statistics for a user's flashcards
 */
export const getFlashcardLearningStats = async (userId: string): Promise<FlashcardLearningStats> => {
  // Placeholder implementation - replace with actual implementation
  return {
    user_id: userId,
    flashcard_id: '',
    easiness_factor: 2.5,
    interval: 0,
    repetitions: 0,
    last_reviewed_at: new Date().toISOString(),
    next_review_at: new Date().toISOString(),
    review_count: 0,
    totalCards: 0
  };
};
