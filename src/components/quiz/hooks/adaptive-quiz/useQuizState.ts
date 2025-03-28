
import { useState } from 'react';
import { QuizQuestion, AnsweredQuestion, QuizResults } from '../../types';
import { AdaptiveQuizState } from './types';

export function useQuizState(initialDifficulty: 1 | 2 | 3 = 2): AdaptiveQuizState {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [activeQuiz, setActiveQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const [currentDifficulty, setCurrentDifficulty] = useState<1 | 2 | 3>(initialDifficulty);
  const [userConfidence, setUserConfidence] = useState<number>(0.5); // 0.0 to 1.0

  return {
    // State
    activeQuiz,
    currentQuestion,
    currentIndex,
    selectedAnswer,
    isAnswerSubmitted,
    isCorrect,
    quizResults,
    currentDifficulty,
    answeredQuestions,
    userConfidence,
    
    // Internal state setters
    setQuestions,
    setCurrentIndex,
    setCurrentQuestion,
    setAnsweredQuestions,
    setSelectedAnswer,
    setIsAnswerSubmitted,
    setIsCorrect,
    setActiveQuiz,
    setQuizResults,
    setCurrentDifficulty,
    setUserConfidence,
  };
}

export type QuizStateWithSetters = ReturnType<typeof useQuizState>;
