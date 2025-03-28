
import { QuizQuestion, QuizResults, AnsweredQuestion } from '../../types';

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
  setSelectedAnswer: (answer: string) => void;
  setCurrentDifficulty: (difficulty: 1 | 2 | 3) => void;
  setConfidence: (level: number) => void;
}

export interface QuizStateWithSetters extends AdaptiveQuizState {
  setActiveQuiz: (active: boolean) => void;
  setCurrentQuestion: (question: QuizQuestion | null) => void;
  setCurrentIndex: (index: number) => void;
  setSelectedAnswer: (answer: string) => void;
  setIsAnswerSubmitted: (submitted: boolean) => void;
  setIsCorrect: (correct: boolean | null) => void;
  setQuizResults: (results: QuizResults | null) => void;
  setAnsweredQuestions: (questions: AnsweredQuestion[]) => void;
  setCurrentDifficulty: (difficulty: 1 | 2 | 3) => void;
  setUserConfidence: (level: number) => void;
}
