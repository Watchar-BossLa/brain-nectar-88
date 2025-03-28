
import { QuizQuestion, AnsweredQuestion, QuizResults } from '../../types';

export interface AdaptiveQuizState {
  activeQuiz: boolean;
  currentQuestion: QuizQuestion | null;
  currentIndex: number;
  selectedAnswer: string;
  isAnswerSubmitted: boolean;
  isCorrect: boolean | null;
  quizResults: QuizResults | null;
  currentDifficulty: 1 | 2 | 3;
  answeredQuestions: AnsweredQuestion[];
  userConfidence: number;
}

export interface AdaptiveQuizActions {
  startQuiz: () => void;
  submitAnswer: () => boolean | undefined;
  nextQuestion: () => boolean;
  previousQuestion: () => void;
  skipQuestion: () => boolean;
  restartQuiz: () => void;
  setConfidence: (level: number) => void;
}

export interface AdaptiveQuizOptions {
  initialDifficulty?: 1 | 2 | 3;
  maxQuestions?: number;
}
