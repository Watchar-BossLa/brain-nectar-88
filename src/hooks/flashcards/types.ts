
export interface Flashcard {
  id: string;
  deck_id?: string;
  front?: string;
  back?: string;
  front_content?: string;  // Add these for compatibility
  back_content?: string;   // Add these for compatibility
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  // Learning stats fields
  easiness_factor?: number;
  interval?: number;
  repetitions?: number;
  last_reviewed_at?: string;
  next_review_at?: string;
  review_count?: number;
  // Additional fields for front-end compatibility
  topic_id?: string;
  topicId?: string;
  difficulty?: number;
  mastery_level?: number;
  repetition_count?: number;
  next_review_date?: string;
  last_retention?: number;
  topic?: string;
  tags?: string[];
  audioUrl?: string;
}

export interface FlashcardLearningStats {
  flashcard_id: string;
  user_id: string;
  easiness_factor: number;
  interval: number;
  repetitions: number;
  last_reviewed_at: string;
  next_review_at: string;
  review_count: number;
  totalCards?: number;
  // For backward compatibility with calculateFlashcardRetention
  id?: string;
  difficulty?: number;
  mastery_level?: number;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  description: string;
  user_id?: string;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
  card_count?: number;
  subject?: string;
  tags?: string[];
}

export interface FlashcardDifficulty {
  id?: number;
  name: string;
  value: number;
  color: string;
}

export interface FlashcardReviewSession {
  id?: string;
  user_id: string;
  started_at: string;
  completed_at?: string;
  cards_reviewed: number;
  performance_score?: number;
}

export interface FlashcardReviewResponse {
  flashcard_id: string;
  session_id: string;
  user_response: string;
  is_correct: boolean;
  difficulty_rating: number;
  time_taken: number;
  created_at?: string;
}

export type ReviewState = 'reviewing' | 'answering' | 'complete';

export interface ReviewStats {
  totalReviewed: number;
  easy: number;
  medium: number;
  hard: number;
  averageRating: number;
}
