
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

export interface AdaptiveQuizStateWithSetters extends AdaptiveQuizState {
  setQuestions: React.Dispatch<React.SetStateAction<QuizQuestion[]>>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<QuizQuestion | null>>;
  setAnsweredQuestions: React.Dispatch<React.SetStateAction<AnsweredQuestion[]>>;
  setSelectedAnswer: React.Dispatch<React.SetStateAction<string>>;
  setIsAnswerSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCorrect: React.Dispatch<React.SetStateAction<boolean | null>>;
  setActiveQuiz: React.Dispatch<React.SetStateAction<boolean>>;
  setQuizResults: React.Dispatch<React.SetStateAction<QuizResults | null>>;
  setCurrentDifficulty: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
  setUserConfidence: React.Dispatch<React.SetStateAction<number>>;
}

export interface AdaptiveQuizActions {
  startQuiz: () => void;
  submitAnswer: () => boolean | undefined;
  nextQuestion: () => boolean;
  previousQuestion: () => void;
  skipQuestion: () => boolean;
  restartQuiz: () => void;
  setConfidence: (level: number) => void;
  setSelectedAnswer: (answer: string) => void;
  setCurrentDifficulty: (difficulty: 1 | 2 | 3) => void;
}

export interface AdaptiveQuizOptions {
  initialDifficulty?: 1 | 2 | 3;
  maxQuestions?: number;
}
