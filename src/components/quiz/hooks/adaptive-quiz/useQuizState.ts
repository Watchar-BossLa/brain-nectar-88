
import { useState } from 'react';
import { QuizQuestion, QuizResults } from '../../types';
import { QuizStateWithSetters } from './types';

export function useQuizState(initialDifficulty: 1 | 2 | 3 = 2): QuizStateWithSetters {
  // Quiz status
  const [activeQuiz, setActiveQuiz] = useState<boolean>(false);
  
  // Current question state
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Question and results tracking
  const [questionPool, setQuestionPool] = useState<QuizQuestion[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<any[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  
  // Adaptive parameters
  const [currentDifficulty, setCurrentDifficulty] = useState<1 | 2 | 3>(initialDifficulty);
  const [userConfidence, setUserConfidence] = useState<number>(0.5); // 0 to 1
  
  // Performance tracking
  const [correctStreak, setCorrectStreak] = useState<number>(0);
  const [incorrectStreak, setIncorrectStreak] = useState<number>(0);
  const [topicMastery, setTopicMastery] = useState<Record<string, number>>({});

  return {
    // Quiz status
    activeQuiz,
    setActiveQuiz,
    
    // Current question state
    currentQuestion,
    setCurrentQuestion,
    currentIndex,
    setCurrentIndex,
    selectedAnswer,
    setSelectedAnswer,
    isAnswerSubmitted,
    setIsAnswerSubmitted,
    isCorrect,
    setIsCorrect,
    
    // Question and results tracking
    questionPool,
    setQuestionPool,
    answeredQuestions,
    setAnsweredQuestions,
    quizResults,
    setQuizResults,
    
    // Adaptive parameters
    currentDifficulty,
    setCurrentDifficulty,
    userConfidence,
    setUserConfidence,
    
    // Performance tracking
    correctStreak,
    setCorrectStreak,
    incorrectStreak,
    setIncorrectStreak,
    topicMastery,
    setTopicMastery
  };
}
