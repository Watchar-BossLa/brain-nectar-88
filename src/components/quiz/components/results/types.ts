
import { QuizResults as QuizResultsType } from "@/types/quiz";

export interface QuizResultsProps {
  results: QuizResultsType;
  onRestart: () => void;
  onReview?: () => void;
}

export interface ScoreDataItem {
  name: string;
  value: number;
  color: string;
}

export interface TopicPerformanceItem {
  topic: string;
  percentage: number;
  correct: number;
  total: number;
}

export interface DifficultyDataItem {
  name: string;
  value: number;
  correct: number;
  total: number;
  color: string;
}

export interface PerformanceByTopicProps {
  topics: Record<string, { correct: number; total: number }>;
}

export interface PerformanceByDifficultyProps {
  difficulties: Record<string, { correct: number; total: number }>;
}
