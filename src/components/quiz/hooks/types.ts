
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
