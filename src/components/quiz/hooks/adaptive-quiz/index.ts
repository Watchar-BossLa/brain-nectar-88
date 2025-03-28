
import { useEffect } from 'react';
import { QuizQuestion } from '../../types';
import { useQuizState } from './useQuizState';
import { useQuizActions } from './useQuizActions';

export function useAdaptiveQuiz(
  availableQuestions: QuizQuestion[], 
  initialDifficulty: 1 | 2 | 3 = 2, 
  maxQuestions: number = 10
) {
  // Initialize state
  const quizState = useQuizState(initialDifficulty);
  
  // Get actions
  const quizActions = useQuizActions(quizState, availableQuestions, maxQuestions);
  
  // Return combined state and actions
  return {
    // State
    ...quizState,
    
    // Actions
    ...quizActions,
  };
}

export * from './types';
