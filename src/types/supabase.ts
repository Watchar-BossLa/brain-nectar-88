
import type { User } from '@supabase/supabase-js';

export type { User }; // Re-export User type from supabase-js

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Re-export types from flashcards.ts to maintain compatibility
export type { 
  Flashcard,
  FlashcardDeck,
  ReviewSession,
  FlashcardStudyStats,
  FlashcardReviewRating,
  StudySchedule
} from '@/types/flashcards';

// Add missing types needed by learning path services
export interface Topic {
  id: string;
  title: string;
  description?: string;
  module_id: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  qualification_id: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Content {
  id: string;
  title: string;
  content_type: string;
  content_data: any;
  topic_id: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  content_id: string;
  progress_percentage: number;
  status: string;
  last_accessed_at: string;
  created_at: string;
  updated_at: string;
}
