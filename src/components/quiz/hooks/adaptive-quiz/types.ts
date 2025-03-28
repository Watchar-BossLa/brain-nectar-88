
import { QuizQuestion, QuizResults, AnsweredQuestion } from '../../types';

export interface QuizStateWithSetters {
  // State
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
  
  // Setters
  setActiveQuiz: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<QuizQuestion | null>>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setSelectedAnswer: React.Dispatch<React.SetStateAction<string>>;
  setIsAnswerSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCorrect: React.Dispatch<React.SetStateAction<boolean | null>>;
  setQuizResults: React.Dispatch<React.SetStateAction<QuizResults | null>>;
  setAnsweredQuestions: React.Dispatch<React.SetStateAction<AnsweredQuestion[]>>;
  setCurrentDifficulty: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
  setUserConfidence: React.Dispatch<React.SetStateAction<number>>;
}
