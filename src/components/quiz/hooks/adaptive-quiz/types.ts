
import { QuizQuestion, QuizResults, AnsweredQuestion } from '../../types';

export interface QuizState {
  // Quiz status
  activeQuiz: boolean;
  
  // Current question state
  currentQuestion: QuizQuestion | null;
  currentIndex: number;
  selectedAnswer: string;
  isAnswerSubmitted: boolean;
  isCorrect: boolean | null;
  
  // Question and results tracking
  questionPool: QuizQuestion[];
  answeredQuestions: AnsweredQuestion[];
  quizResults: QuizResults | null;
  
  // Adaptive parameters
  currentDifficulty: 1 | 2 | 3;
  userConfidence: number;
  
  // Performance metrics
  correctStreak: number;
  incorrectStreak: number;
  topicMastery: Record<string, number>;
}

export interface QuizStateWithSetters extends QuizState {
  setActiveQuiz: (active: boolean) => void;
  setCurrentQuestion: (question: QuizQuestion | null) => void;
  setCurrentIndex: (index: number) => void;
  setSelectedAnswer: (answer: string) => void;
  setIsAnswerSubmitted: (submitted: boolean) => void;
  setIsCorrect: (correct: boolean | null) => void;
  setQuestionPool: (questions: QuizQuestion[]) => void;
  setAnsweredQuestions: (questions: AnsweredQuestion[]) => void;
  setQuizResults: (results: QuizResults | null) => void;
  setCurrentDifficulty: (difficulty: 1 | 2 | 3) => void;
  setUserConfidence: (confidence: number) => void;
  setCorrectStreak: (streak: number) => void;
  setIncorrectStreak: (streak: number) => void;
  setTopicMastery: (mastery: Record<string, number>) => void;
}

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
  correctStreak: number;
  incorrectStreak: number;
  topicMastery: Record<string, number>;
}

export interface AdaptiveQuizActions {
  startQuiz: () => void;
  submitAnswer: () => boolean;
  nextQuestion: () => boolean;
  previousQuestion: () => void;
  skipQuestion: () => boolean;
  restartQuiz: () => void;
  setSelectedAnswer: (answer: string) => void;
  setConfidence: (level: number) => void;
}

export interface SessionHistoryItem {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  difficulty: 1 | 2 | 3;
  correctStreak: number;
  topics: string[];
  answeredQuestions: AnsweredQuestion[];
}
