
import { useState, useCallback, useEffect } from 'react';
import { QuizQuestion } from '../../types';
import { calculateQuizResults } from '../quizUtils';
import { useToast } from '@/components/ui/use-toast';
import { QuizStateWithSetters } from './types';
import { useDifficultyAdjustment } from './useDifficultyAdjustment';
import { useQuestionSelection } from './useQuestionSelection';
import { useQuizLifecycle } from './useQuizLifecycle';
import { useAnswerHandling } from './useAnswerHandling';
import { useQuizNavigation } from './useQuizNavigation';
import { usePerformanceHistory } from './usePerformanceHistory';

export function useQuizActions(
  quizState: QuizStateWithSetters,
  availableQuestions: QuizQuestion[],
  maxQuestions: number
) {
  const { toast } = useToast();
  const [startTime, setStartTime] = useState<number | null>(null);
  
  // Get specialized hooks
  const { updateDifficulty, correctStreak, incorrectStreak } = useDifficultyAdjustment(quizState);
  const { initializeQuestionPool, selectNextQuestion } = useQuestionSelection(quizState);
  const { startQuiz, endQuiz } = useQuizLifecycle(
    quizState, 
    availableQuestions, 
    selectNextQuestion, 
    toast, 
    setStartTime
  );
  const { submitAnswer } = useAnswerHandling(quizState, startTime, setStartTime, updateDifficulty);
  const { nextQuestion, previousQuestion, skipQuestion, restartQuiz } = useQuizNavigation(
    quizState, 
    availableQuestions, 
    maxQuestions, 
    selectNextQuestion,
    startQuiz
  );
  const { recordPerformance, calculateMetrics } = usePerformanceHistory();

  // Initialize with available questions
  useEffect(() => {
    if (availableQuestions.length > 0) {
      initializeQuestionPool(availableQuestions);
    }
  }, [availableQuestions, initializeQuestionPool]);

  // Update streak counters when they change in the difficulty adjustment hook
  useEffect(() => {
    quizState.setCorrectStreak(correctStreak);
    quizState.setIncorrectStreak(incorrectStreak);
  }, [correctStreak, incorrectStreak, quizState.setCorrectStreak, quizState.setIncorrectStreak]);
  
  // Enhanced submit answer function that also records performance
  const enhancedSubmitAnswer = useCallback(() => {
    const isCorrect = submitAnswer();
    
    if (quizState.currentQuestion) {
      // Record detailed performance data for analytics
      recordPerformance({
        id: quizState.currentQuestion.id,
        isCorrect: !!isCorrect,
        userAnswer: quizState.selectedAnswer,
        timeTaken: startTime ? Date.now() - startTime : 0,
        confidenceLevel: quizState.userConfidence,
        topic: quizState.currentQuestion.topic,
        difficulty: quizState.currentQuestion.difficulty
      });
    }
    
    return isCorrect;
  }, [submitAnswer, quizState.currentQuestion, quizState.selectedAnswer, quizState.userConfidence, startTime, recordPerformance]);
  
  // Set user confidence level
  const setConfidence = useCallback((level: number) => {
    quizState.setUserConfidence(level);
  }, [quizState]);

  return {
    startQuiz,
    submitAnswer: enhancedSubmitAnswer,
    nextQuestion,
    previousQuestion,
    skipQuestion,
    restartQuiz,
    setConfidence,
    getPerformanceMetrics: calculateMetrics
  };
}
