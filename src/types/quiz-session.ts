
import { QuizResults } from '@/types/quiz';
import { AnsweredQuestion } from '@/components/quiz/types';

export interface QuizSession {
  id: string;
  date: string;
  results: QuizResults;
  answeredQuestions: AnsweredQuestion[];
  selectedTopics: string[];
  initialDifficulty: 1 | 2 | 3;
  questionCount: number;
}

export interface QuizSessionSummary {
  id: string;
  date: string;
  scorePercentage: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number; // in milliseconds
  difficulty: string;
  topics: string[];
  synced?: boolean;
}

// Database types for Supabase
export interface DBQuizSession {
  id: string;
  user_id: string;
  date: string;
  score_percentage: number;
  correct_answers: number;
  total_questions: number;
  time_spent: number;
  difficulty: number;
  topics: Record<string, { correct: number; total: number }>;
  selected_topics: string[];
  initial_difficulty: number;
  created_at: string;
  updated_at: string;
}

export interface DBQuizAnsweredQuestion {
  id: string;
  session_id: string;
  question_id: string;
  is_correct: boolean;
  user_answer: string;
  time_taken: number;
  confidence_level?: number;
  topic?: string;
  difficulty?: number;
  created_at: string;
}

export interface DBQuizPerformanceMetric {
  id: string;
  user_id: string;
  topic: string;
  correct_count: number;
  total_count: number;
  average_confidence?: number;
  average_time?: number;
  last_attempt_at?: string;
  created_at: string;
  updated_at: string;
}
