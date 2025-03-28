
import { useQuizState } from './useQuizState';
import { useQuizActions } from './useQuizActions';
import { QuizState, QuizActions } from './types';

export function useQuiz(): QuizState & QuizActions {
  // Initialize state
  const quizState = useQuizState();
  
  // Get actions
  const quizActions = useQuizActions(quizState);
  
  // Return combined state and actions
  return {
    // State
    ...quizState,
    
    // Actions
    ...quizActions,
  };
}

export * from './types';
