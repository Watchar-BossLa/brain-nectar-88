
import { useState } from 'react';
import { QuizQuestion, QuizResults, AnsweredQuestion } from '../../types';
import { QuizStateWithSetters } from './types';

export function useQuizState(initialDifficulty: 1 | 2 | 3): QuizStateWithSetters {
  const [activeQuiz, setActiveQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  const [currentDifficulty, setCurrentDifficulty] = useState<1 | 2 | 3>(initialDifficulty);
  const [userConfidence, setUserConfidence] = useState<number>(0.5); // Default medium confidence

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
    
    // Setters
    setActiveQuiz,
    setCurrentQuestion,
    setCurrentIndex,
    setSelectedAnswer,
    setIsAnswerSubmitted,
    setIsCorrect,
    setQuizResults,
    setAnsweredQuestions,
    setCurrentDifficulty,
    setUserConfidence
  };
}

export type { QuizStateWithSetters };
