
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
  // Add compatibility fields for different interfaces
  front?: string; // For compatibility with components expecting 'front'
  back?: string;  // For compatibility with components expecting 'back'
  deck_id?: string; // For compatibility with other flashcard systems
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

// Add missing types referenced in other files
export interface Topic {
  id: string;
  title: string;
  description: string | null;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  order?: number;
  module_id?: string;
  parent_topic_id?: string | null;
}

export interface UserProgress {
  id: string;
  user_id: string;
  topic_id: string;
  progress_percentage: number;
  last_activity_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string | null;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Content {
  id: string;
  title: string;
  content_type: string;
  content_data: any;
  topic_id: string;
  created_at?: string;
  updated_at?: string;
}
