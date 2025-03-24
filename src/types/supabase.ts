
import { Session, User } from '@supabase/supabase-js';

export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Qualification = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Module = {
  id: string;
  qualification_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Topic = {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Content = {
  id: string;
  topic_id: string;
  title: string;
  content_type: 'text' | 'video' | 'pdf' | 'quiz' | 'flashcard';
  content_data: any;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type UserProgress = {
  id: string;
  user_id: string;
  content_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number;
  last_accessed_at: string;
  created_at: string;
  updated_at: string;
};

export type Flashcard = {
  id: string;
  user_id: string;
  topic_id: string | null;
  front_content: string;
  back_content: string;
  difficulty: number;
  next_review_date: string;
  repetition_count: number;
  created_at: string;
  updated_at: string;
};

export type UserNote = {
  id: string;
  user_id: string;
  content_id: string | null;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
};

export type Assessment = {
  id: string;
  title: string;
  description: string | null;
  module_id: string | null;
  time_limit_minutes: number | null;
  passing_score: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Question = {
  id: string;
  assessment_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'essay' | 'calculation';
  options: any | null;
  correct_answer: any | null;
  points: number;
  difficulty: number | null;
  created_at: string;
  updated_at: string;
};

export type UserAssessment = {
  id: string;
  user_id: string;
  assessment_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'graded';
  start_time: string | null;
  end_time: string | null;
  score: number | null;
  feedback: string | null;
  created_at: string;
  updated_at: string;
};

export type StudyPlan = {
  id: string;
  user_id: string;
  qualification_id: string | null;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  daily_goal_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AuthState = {
  session: Session | null;
  user: User | null;
};
