import { Session, User } from '@supabase/supabase-js';

export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Qualification = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Module = {
  id: string;
  qualificationId: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Topic = {
  id: string;
  moduleId: string;
  title: string;
  description: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Content = {
  id: string;
  topicId: string;
  title: string;
  contentType: 'text' | 'video' | 'pdf' | 'quiz' | 'flashcard';
  contentData: any;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserProgress = {
  id: string;
  userId: string;
  contentId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progressPercentage: number;
  lastAccessedAt: string;
  createdAt: string;
  updatedAt: string;
  content?: Content;
};

// Legacy type definition - use types/flashcard.ts instead
export type Flashcard = {
  id: string;
  userId: string;
  user_id: string;
  topicId: string | null;
  topic_id: string | null;
  frontContent: string;
  front_content: string;
  backContent: string;
  back_content: string;
  difficulty: number;
  nextReviewDate: string;
  next_review_date: string;
  repetitionCount: number;
  repetition_count: number;
  masteryLevel: number;
  mastery_level: number;
  createdAt: string;
  created_at: string;
  updatedAt: string;
  updated_at: string;
  easinessFactor: number;
  easiness_factor: number;
  lastRetention: number;
  last_retention: number;
  lastReviewedAt: string | null;
  last_reviewed_at: string | null;
};

export type FlashcardReview = {
  id: string;
  userId: string;
  flashcardId: string;
  difficultyRating: number;
  reviewedAt: string;
  retentionEstimate: number;
  createdAt?: string;
};

export type UserNote = {
  id: string;
  userId: string;
  contentId: string | null;
  title: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Assessment = {
  id: string;
  title: string;
  description: string | null;
  moduleId: string | null;
  timeLimitMinutes: number | null;
  passingScore: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Question = {
  id: string;
  assessmentId: string;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'essay' | 'calculation';
  options: any | null;
  correctAnswer: any | null;
  points: number;
  difficulty: number | null;
  createdAt: string;
  updatedAt: string;
};

export type UserAssessment = {
  id: string;
  userId: string;
  assessmentId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'graded';
  startTime: string | null;
  endTime: string | null;
  score: number | null;
  feedback: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StudyPlan = {
  id: string;
  userId: string;
  qualificationId: string | null;
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  dailyGoalMinutes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthState = {
  session: Session | null;
  user: User | null;
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]
