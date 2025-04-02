
/**
 * Main entry point for flashcard statistics services
 */
import { userStatsService, UserStatsService } from './user-stats-service';
import { reviewStatsService, ReviewStatsService } from './review-stats-service';
import { performanceStatsService, PerformanceStatsService } from './performance-stats-service';

// Re-export the individual services
export {
  userStatsService,
  reviewStatsService,
  performanceStatsService
};

/**
 * Combined stats service that integrates all statistics functionality
 */
export class StatsService {
  private readonly userStats: UserStatsService;
  private readonly reviewStats: ReviewStatsService;
  private readonly performanceStats: PerformanceStatsService;

  constructor(
    userStats: UserStatsService = userStatsService,
    reviewStats: ReviewStatsService = reviewStatsService,
    performanceStats: PerformanceStatsService = performanceStatsService
  ) {
    this.userStats = userStats;
    this.reviewStats = reviewStats;
    this.performanceStats = performanceStats;
  }

  /**
   * Get comprehensive statistics for a user's flashcards
   * @param userId The user ID
   * @returns Object with flashcard statistics
   */
  public async getFlashcardStats(userId: string) {
    try {
      // Get stats from all services
      const userStats = await this.userStats.getUserFlashcardStats(userId);
      const reviewStats = await this.reviewStats.getReviewStats(userId);
      const performanceStats = await this.performanceStats.getPerformanceStats(userId);
      
      // Combine all stats
      return {
        totalCards: userStats.totalCards,
        masteredCards: userStats.masteredCards,
        dueCards: reviewStats.dueCards,
        reviewsToday: reviewStats.reviewsToday,
        averageDifficulty: performanceStats.averageDifficulty || userStats.averageDifficulty,
      };
    } catch (error) {
      console.error('Error getting combined flashcard stats:', error);
      return {
        totalCards: 0,
        masteredCards: 0,
        dueCards: 0,
        averageDifficulty: 0,
        reviewsToday: 0
      };
    }
  }
}

// Export a singleton instance
export const statsService = new StatsService();
