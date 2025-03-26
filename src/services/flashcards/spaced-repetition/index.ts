
/**
 * Main entry point for the spaced repetition system
 * Re-exports all functionality from specialized modules
 */

// Import the algorithm
import { calculateNextReview } from './algorithm';

// Import services
import { ReviewService, reviewService } from './review-service';
import { RetrievalService, retrievalService } from './retrieval-service';
import { StatsService, statsService } from './stats-service';

// Import types
import { FlashcardReviewResult } from './types';

// Re-export the algorithm
export { calculateNextReview } from './algorithm';

// Re-export the services
export { reviewService } from './review-service';
export { retrievalService } from './retrieval-service';
export { statsService } from './stats-service';

// Re-export types
export type { FlashcardReviewResult } from './types';

// Create a single facade for convenience
export class SpacedRepetitionService {
  // Re-export methods from individual services as class methods
  public calculateNextReview = calculateNextReview;
  
  public async recordReview(reviewResult: FlashcardReviewResult): Promise<boolean> {
    return reviewService.recordReview(reviewResult);
  }
  
  public async getDueFlashcards(userId: string, limit: number = 20): Promise<any[]> {
    return retrievalService.getDueFlashcards(userId, limit);
  }
  
  public async getFlashcardStats(userId: string) {
    return statsService.getFlashcardStats(userId);
  }
}

// Export a singleton instance
export const spacedRepetitionService = new SpacedRepetitionService();
