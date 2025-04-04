
import { QuizQuestion, QuizResults, AnsweredQuestion } from '../types';

export interface QuizState {
  activeQuiz: boolean;
  currentDifficulty: 1 | 2 | 3;
  availableQuestions: QuizQuestion[];
  currentQuestion: QuizQuestion | null;
  currentIndex: number;
  selectedAnswer: string;
  isAnswerSubmitted: boolean;
  isCorrect: boolean | null;
  quizResults: QuizResults | null;
  selectedTopics: string[];
  startTime: number | null;
  quizLength: number;
  answeredQuestions: AnsweredQuestion[];
}

export interface QuizOptions {
  initialDifficulty: 1 | 2 | 3;
  adaptiveMode: boolean;
  topicSelection: string[];
  questionCount: number;
  timeLimit?: number | null;
}

export interface DifficultyAdjustment {
  currentDifficulty: number;
  correctAnswersStreak: number;
  incorrectAnswersStreak: number;
  weightingFactor: number;
}

export interface QuizProgress {
  currentQuestion: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  remainingTime?: number;
  currentScore: number;
  maxPossibleScore: number;
  percentComplete: number;
}

export interface QuizContextValue {
  state: QuizState;
  actions: {
    startQuiz: (options: QuizOptions) => void;
    submitAnswer: (answer: string) => void;
    nextQuestion: () => void;
    previousQuestion: () => void;
    skipQuestion: () => void;
    finishQuiz: () => void;
    resetQuiz: () => void;
    setSelectedTopics: (topics: string[]) => void;
  };
}
