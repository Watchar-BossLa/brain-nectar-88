
// Export specific functions
export { 
  getFlashcardLearningStats,
  getDueFlashcards,
  getAllFlashcards
} from './retrieval-service';

// Create a service object for compatibility
export const spacedRepetitionService = {
  getFlashcardLearningStats: async (userId: string, flashcardId?: string) => {
    const { getFlashcardLearningStats } = await import('./retrieval-service');
    return getFlashcardLearningStats(userId, flashcardId);
  },
  
  getDueFlashcards: async (userId: string) => {
    const { getDueFlashcards } = await import('./retrieval-service');
    return getDueFlashcards(userId);
  },
  
  getAllFlashcards: async (userId: string) => {
    const { getAllFlashcards } = await import('./retrieval-service');
    return getAllFlashcards(userId);
  },
  
  recordReview: async (flashcardId: string, difficulty: number) => {
    // This is a stub function to maintain compatibility
    console.log(`Recording review for flashcard ${flashcardId} with difficulty ${difficulty}`);
    return { success: true };
  }
};
