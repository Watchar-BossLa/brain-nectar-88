
export interface Flashcard {
  id: string;
  deck_id: string;
  front: string;
  back: string;
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
