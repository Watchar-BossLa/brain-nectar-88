
import { useEffect } from 'react';
import { QuizQuestion } from '../../types';
import { useQuizState } from './useQuizState';
import { useQuizActions } from './useQuizActions';
import { AdaptiveQuizState, AdaptiveQuizActions } from './types';

export function useAdaptiveQuiz(
  availableQuestions: QuizQuestion[], 
  initialDifficulty: 1 | 2 | 3 = 2, 
  maxQuestions: number = 10
): AdaptiveQuizState & AdaptiveQuizActions {
  // Initialize state
  const quizState = useQuizState(initialDifficulty);
  
  // Get actions
  const quizActions = useQuizActions(quizState, availableQuestions, maxQuestions);
  
  // Return combined state and actions
  return {
    // State
    activeQuiz: quizState.activeQuiz,
    currentQuestion: quizState.currentQuestion,
    currentIndex: quizState.currentIndex,
    selectedAnswer: quizState.selectedAnswer,
    isAnswerSubmitted: quizState.isAnswerSubmitted,
    isCorrect: quizState.isCorrect,
    quizResults: quizState.quizResults,
    currentDifficulty: quizState.currentDifficulty,
    answeredQuestions: quizState.answeredQuestions,
    userConfidence: quizState.userConfidence,
    
    // Actions
    ...quizActions,
    setSelectedAnswer: quizState.setSelectedAnswer,
  };
}

export * from './types';
