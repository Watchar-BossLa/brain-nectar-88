
export type FlashcardRetentionResult = {
  overallRetention: number; // 0-1 value representing average retention across all cards
  cardRetention: {
    id: string;
    retention: number;
    masteryLevel: number;
    daysUntilReview: number;
  }[];
};

export type FlashcardLearningStats = {
  totalReviews: number;
  averageEaseFactor: number;
  retentionRate: number;
  masteredCardCount: number;
  strugglingCardCount: number;
  learningEfficiency: number; // 0-1 value indicating learning efficiency
  recommendedDailyReviews: number;
};
