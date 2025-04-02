
/**
 * Service for retrieving flashcard statistics
 * This file now uses the modular stats services internally
 */
import { statsService as combinedStatsService } from './stats';

/**
 * Get statistics for a user's flashcards
 * @param userId The user ID
 * @returns Object with flashcard statistics
 */
export const getFlashcardStats = async (userId: string) => {
  return combinedStatsService.getFlashcardStats(userId);
};

// Create a class for StatsService to be consistent with other services
export class StatsService {
  public getFlashcardStats = getFlashcardStats;
}

// Export a singleton instance
export const statsService = new StatsService();
