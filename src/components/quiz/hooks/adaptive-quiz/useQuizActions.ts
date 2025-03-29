
import { useState, useCallback, useEffect } from 'react';
import { QuizQuestion } from '../../types';
import { calculateQuizResults, evaluateAnswer } from '../quizUtils';
import { useToast } from '@/components/ui/use-toast';
import { QuizStateWithSetters } from './types';
import { useDifficultyAdjustment } from './useDifficultyAdjustment';
import { useQuestionSelection } from './useQuestionSelection';
import { useQuizLifecycle } from './useQuizLifecycle';
import { useAnswerHandling } from './useAnswerHandling';
import { useQuizNavigation } from './useQuizNavigation';

export function useQuizActions(
  quizState: QuizStateWithSetters,
  availableQuestions: QuizQuestion[],
  maxQuestions: number
) {
  const toast = useToast();
  const [startTime, setStartTime] = useState<number | null>(null);
  
  // Get specialized hooks
  const { updateDifficulty } = useDifficultyAdjustment(quizState);
  const { initializeQuestionPool, selectNextQuestion } = useQuestionSelection(quizState);
  const { startQuiz } = useQuizLifecycle(quizState, availableQuestions, selectNextQuestion, toast, setStartTime);
  const { submitAnswer } = useAnswerHandling(quizState, startTime, setStartTime, updateDifficulty);
  const { nextQuestion, previousQuestion, skipQuestion, restartQuiz } = useQuizNavigation(
    quizState, 
    availableQuestions, 
    maxQuestions, 
    selectNextQuestion,
    startQuiz
  );

  // Initialize with available questions
  useEffect(() => {
    if (availableQuestions.length > 0) {
      initializeQuestionPool(availableQuestions);
    }
  }, [availableQuestions, initializeQuestionPool]);

  // Set user confidence level
  const setConfidence = useCallback((level: number) => {
    quizState.setUserConfidence(level);
  }, [quizState]);

  return {
    startQuiz,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    skipQuestion,
    restartQuiz,
    setConfidence,
  };
}
