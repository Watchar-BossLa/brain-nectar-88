
/**
 * Main entry point for the spaced repetition system
 * Re-exports all functionality from specialized modules
 */

// Import the algorithm
import { 
  calculateEasinessFactor, 
  calculateReviewInterval, 
  calculateNextReview 
} from './algorithm';

// Import services
import { ReviewService, reviewService } from './review-service';
import { RetrievalService, retrievalService } from './retrieval-service';
import { StatsService, statsService } from './stats-service';

// Import types
import { FlashcardReviewResult } from './types';

// Re-export the algorithm
export { 
  calculateEasinessFactor, 
  calculateReviewInterval, 
  calculateNextReview 
};

// Re-export the services
export { reviewService } from './review-service';
export { retrievalService } from './retrieval-service';
export { statsService } from './stats-service';

// Re-export types
export type { FlashcardReviewResult } from './types';

// Create a unified service facade for backward compatibility
export class SpacedRepetitionService {
  /**
   * Records a review for a flashcard
   * @param flashcardId The ID of the flashcard being reviewed
   * @param difficulty The difficulty rating (1-5)
   * @returns True if successful, false otherwise
   */
  public async recordReview(flashcardId: string, difficulty: number): Promise<boolean> {
    return reviewService.recordReview(flashcardId, difficulty);
  }
  
  /**
   * Get flashcards due for review for a user
   * @param userId The user ID
   * @returns Array of flashcards due for review
   */
  public async getDueFlashcards(userId: string): Promise<any[]> {
    return retrievalService.getDueFlashcards(userId);
  }
  
  /**
   * Get statistics for a user's flashcards
   * @param userId The user ID
   * @returns Object with flashcard statistics
   */
  public async getFlashcardStats(userId: string) {
    return statsService.getFlashcardStats(userId);
  }
  
  /**
   * Calculate the review interval in days based on easiness factor and mastery level
   * @param easinessFactor The easiness factor
   * @param masteryLevel The mastery level
   * @param repetitionCount The number of times the card has been reviewed
   * @returns The number of days until the next review
   */
  public calculateReviewInterval(easinessFactor: number, masteryLevel: number, repetitionCount: number): number {
    return calculateReviewInterval(easinessFactor, masteryLevel, repetitionCount);
  }
}

// Export a singleton instance for backward compatibility
export const spacedRepetitionService = new SpacedRepetitionService();
