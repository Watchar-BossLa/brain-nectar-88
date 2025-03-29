
import { QuizResults, AnsweredQuestion } from '@/types/quiz';

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
}
