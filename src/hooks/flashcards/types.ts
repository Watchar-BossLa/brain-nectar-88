
export interface Flashcard {
  id: string;
  user_id?: string;
  topicId?: string | null;
  topic_id?: string | null;
  front?: string;
  back?: string;
  front_content?: string;
  back_content?: string;
  difficulty?: number;
  next_review_date?: string;
  repetition_count?: number;
  mastery_level?: number;
  created_at?: string;
  updated_at?: string;
  easiness_factor?: number;
  last_retention?: number;
  last_reviewed_at?: string | null;
}

export interface FlashcardLearningStats {
  totalCards: number;
  masteredCards: number;
  dueCards: number;
  averageDifficulty: number;
  reviewsToday: number;
  learningCards?: number;
  newCards?: number;
  reviewedToday?: number;
  averageRetention?: number;
  streakDays?: number;
  totalReviews?: number;
  averageEaseFactor?: number;
  retentionRate?: number;
  strugglingCardCount?: number;
  learningEfficiency?: number;
  recommendedDailyReviews?: number;
}
