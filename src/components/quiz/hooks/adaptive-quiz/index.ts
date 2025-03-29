
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
    correctStreak: quizState.correctStreak,
    incorrectStreak: quizState.incorrectStreak,
    topicMastery: quizState.topicMastery,
    
    // Actions
    startQuiz: quizActions.startQuiz,
    submitAnswer: quizActions.submitAnswer,
    nextQuestion: quizActions.nextQuestion,
    previousQuestion: quizActions.previousQuestion,
    skipQuestion: quizActions.skipQuestion,
    restartQuiz: quizActions.restartQuiz,
    setConfidence: quizActions.setConfidence,
    getPerformanceMetrics: quizActions.getPerformanceMetrics,
    setSelectedAnswer: quizState.setSelectedAnswer,
  };
}

export * from './types';
export { useSessionHistory } from './useSessionHistory';
