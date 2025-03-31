
import { useState, useCallback } from 'react';
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
  const setSelectedAnswer = useCallback((answer: string) => {
    quizState.setSelectedAnswer(answer);
  }, [quizState]);
  
  // Combine state and actions to return a unified API
  return {
    // State from quizState
    activeQuiz: quizState.activeQuiz,
    currentQuestion: quizState.currentQuestion,
    currentIndex: quizState.currentIndex,
    selectedAnswer: quizState.selectedAnswer,
    isAnswerSubmitted: quizState.isAnswerSubmitted,
    isCorrect: quizState.isCorrect,
    answeredQuestions: quizState.answeredQuestions,
    quizResults: quizState.quizResults,
    currentDifficulty: quizState.currentDifficulty,
    userConfidence: quizState.userConfidence,
    correctStreak: quizState.correctStreak,
    incorrectStreak: quizState.incorrectStreak,
    topicMastery: quizState.topicMastery,
    questionPool: quizState.questionPool,
    
    // Actions from useQuizActions
    startQuiz: actions.startQuiz,
    submitAnswer: () => actions.submitAnswer(quizState.selectedAnswer, quizState.userConfidence) || false,
    skipQuestion: actions.skipQuestion,
    nextQuestion: actions.nextQuestion,
    previousQuestion: actions.previousQuestion,
    restartQuiz: actions.restartQuiz,
    setConfidence: actions.setConfidence,
    getPerformanceMetrics: actions.getPerformanceMetrics,
    
    // Additional methods
    setSelectedAnswer
  };
}
