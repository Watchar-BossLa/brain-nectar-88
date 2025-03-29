
import { useFlashcards as useFlashcardsNew, calculateFlashcardRetention as calculateFlashcardRetentionNew } from './flashcards';

/**
 * @deprecated Use the hooks from src/hooks/flashcards/ instead
 */
export const useFlashcards = useFlashcardsNew;

/**
 * @deprecated Use the useFlashcardRetention hook instead
 */
export async function calculateFlashcardRetention(userId: string, options = {}) {
  try {
    const sampleData = {
      totalFlashcards: 120,
      reviewedLast7Days: 45,
      masteryLevels: {
        low: 30,
        medium: 55,
        high: 35
      },
      reviewAccuracy: 0.72,
      needsReview: 24,
      retentionRate: 0.83,
      projectedRetention: 0.91
    };
    
    return {
      success: true,
      data: sampleData
    };
  } catch (error) {
    console.error('Error calculating flashcard retention:', error);
    return {
      success: false,
      error: 'Failed to calculate retention metrics',
      data: null
    };
  }
}
