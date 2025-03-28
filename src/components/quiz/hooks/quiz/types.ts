
import { QuizQuestion, AnsweredQuestion, QuizResults } from '../../types';

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

export interface QuizActions {
  startQuiz: () => void;
  submitAnswer: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  skipQuestion: () => void;
  restartQuiz: () => void;
  toggleTopic: (topic: string) => void;
  setSelectedSubject: (subject: string) => void;
  setQuizLength: (length: number) => void;
  setCurrentDifficulty: (difficulty: 1 | 2 | 3) => void;
  setSelectedAnswer: (answer: string) => void;
  getFilteredQuestions: () => QuizQuestion[];
}

export interface QuizStateWithSetters extends QuizState {
  setActiveQuiz: React.Dispatch<React.SetStateAction<boolean>>;
  setAvailableQuestions: React.Dispatch<React.SetStateAction<QuizQuestion[]>>;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<QuizQuestion | null>>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setSelectedAnswer: React.Dispatch<React.SetStateAction<string>>;
  setIsAnswerSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCorrect: React.Dispatch<React.SetStateAction<boolean | null>>;
  setQuizResults: React.Dispatch<React.SetStateAction<QuizResults | null>>;
  setSelectedTopics: React.Dispatch<React.SetStateAction<string[]>>;
  setStartTime: React.Dispatch<React.SetStateAction<number | null>>;
  setAnsweredQuestions: React.Dispatch<React.SetStateAction<AnsweredQuestion[]>>;
}
