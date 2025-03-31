
import { QuizQuestion, QuizResults, AnsweredQuestion } from '../../types';

export interface AdaptiveQuizState {
  activeQuiz: boolean;
  currentQuestion: QuizQuestion | null;
  currentIndex: number;
  selectedAnswer: string;
  isAnswerSubmitted: boolean;
  isCorrect: boolean | null;
  answeredQuestions: AnsweredQuestion[];
  quizResults: QuizResults | null;
  currentDifficulty: 1 | 2 | 3;
  userConfidence: number;
  correctStreak: number;
  incorrectStreak: number;
  topicMastery: Record<string, number>;
  questionPool?: QuizQuestion[];
  startTime?: number | null;
}

export interface AdaptiveQuizActions {
  startQuiz: () => void;
  submitAnswer: () => boolean;
  nextQuestion: () => boolean;
  previousQuestion: () => void;
  skipQuestion: () => boolean;
  restartQuiz: () => void;
  setConfidence: (level: number) => void;
  getPerformanceMetrics: () => any;
}

export interface QuizStateWithSetters extends AdaptiveQuizState {
  setActiveQuiz: (active: boolean) => void;
  setCurrentQuestion: (question: QuizQuestion | null) => void;
  setCurrentIndex: (index: number) => void;
  setSelectedAnswer: (answer: string) => void;
  setIsAnswerSubmitted: (submitted: boolean) => void;
  setIsCorrect: (isCorrect: boolean | null) => void;
  setAnsweredQuestions: (questions: AnsweredQuestion[]) => void;
  setQuizResults: (results: QuizResults | null) => void;
  setCurrentDifficulty: (difficulty: 1 | 2 | 3) => void;
  setUserConfidence: (confidence: number) => void;
  setCorrectStreak: (streak: number) => void;
  setIncorrectStreak: (streak: number) => void;
  setTopicMastery: (mastery: Record<string, number>) => void;
  questionPool?: QuizQuestion[];
  setQuestionPool?: (questions: QuizQuestion[]) => void;
  startTime?: number | null;
  setStartTime?: (time: number | null) => void;
}

export interface QuestionSelectionState {
  initializeQuestionPool: (questions: QuizQuestion[]) => void;
  selectNextQuestion: () => QuizQuestion | null;
  getCurrentQuestionIndex: () => number;
}
