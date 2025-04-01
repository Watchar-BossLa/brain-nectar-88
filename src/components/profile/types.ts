
export interface LearningStats {
  totalReviews: number;
  retentionRate: number;
  masteredCardCount: number;
  averageEaseFactor: number;
  learningEfficiency: number;
  recommendedDailyReviews: number;
}

export interface ProfilePageProps {
  isLoading?: boolean;
  learningStats?: LearningStats | null;
}
