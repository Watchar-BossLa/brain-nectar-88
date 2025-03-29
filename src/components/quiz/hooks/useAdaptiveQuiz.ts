
import { useState } from 'react';
import { QuizQuestion, QuizResults } from '../../types';
import { useQuizState } from './useQuizState';
import { useQuizActions } from './useQuizActions';
import { AdaptiveQuizState, AdaptiveQuizActions } from './types';

/**
 * Main hook for the adaptive quiz functionality
 */
export function useAdaptiveQuiz(
  availableQuestions: QuizQuestion[],
  initialDifficulty: 1 | 2 | 3 = 2,
  maxQuestions: number = 10
): AdaptiveQuizState & AdaptiveQuizActions & { setSelectedAnswer: (answer: string) => void } {
  // Get the base quiz state
  const quizState = useQuizState(initialDifficulty);
  
  // Get actions based on the quiz state
  const actions = useQuizActions(quizState, availableQuestions, maxQuestions);
  
  // Create setSelectedAnswer function
  const setSelectedAnswer = (answer: string) => {
    quizState.setSelectedAnswer(answer);
  };
  
  // Combine state and actions to return a unified API
  return {
    // State
    ...quizState,
    // Actions
    ...actions,
    // Additional required methods
    setSelectedAnswer
  };
}
