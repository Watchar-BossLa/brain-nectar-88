
// Define the Supabase database schema types

export interface Flashcard {
  id: string;
  user_id: string;
  topic_id: string | null;
  front_content: string;
  back_content: string;
  difficulty: number;
  next_review_date: string;
  repetition_count: number;
  mastery_level: number;
  created_at: string;
  updated_at: string;
  easiness_factor: number;
  last_retention: number;
  last_reviewed_at: string | null;
}

export interface FlashcardReview {
  id: string;
  flashcard_id: string;
  user_id: string;
  difficulty_rating: number;
  reviewed_at: string;
  retention_estimate: number | null;
  created_at: string;
}
