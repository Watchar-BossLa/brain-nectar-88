
import { AnsweredQuestion, QuizResults } from '@/types/quiz';

export interface QuizResultsProps {
  results: QuizResults;
  onRestart: () => void;
  onReview?: () => void;
  sessionId?: string;
}

export interface ScoreDataItem {
  name: string;
  value: number;
  color: string;
}

export interface PerformanceByTopicProps {
  topics: Record<string, { correct: number; total: number }>;
}

export interface PerformanceByDifficultyProps {
  difficulties: Record<string, { correct: number; total: number }>;
}

export interface QuestionFeedback {
  questionId: string;
  feedbackType: 'issue' | 'suggestion' | 'praise';
  feedbackText: string;
  userId?: string;
  createdAt: Date;
}
