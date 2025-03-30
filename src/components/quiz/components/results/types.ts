
import { AnsweredQuestion, QuizResults } from '@/types/quiz';

export interface QuizResultsProps {
  results: QuizResults;
  onRestart: () => void;
  onReview?: () => void;
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
