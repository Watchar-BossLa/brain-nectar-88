
// Types for flashcard-related data

export interface Flashcard {
  id: string;
  front_content: string;
  back_content: string;
  topic_id?: string;
  difficulty: number;
  next_review_date: string;
  repetition_count: number;
  mastery_level: number;
  easiness_factor: number;
  last_retention?: number;
  last_reviewed_at?: string;
}

export interface FlashcardReview {
  id: string;
  flashcard_id: string;
  difficulty_rating: number;
  reviewed_at: string;
  retention_estimate: number;
}

export interface FlashcardStats {
  totalCards: number;
  masteredCards: number;
  dueCards: number;
  averageDifficulty: number;
  reviewsToday: number;
}

export interface LearningStats {
  totalReviews: number;
  retentionRate: number;
  masteredCardCount: number;
  averageEaseFactor: number;
  learningEfficiency: number;
  recommendedDailyReviews: number;
}
