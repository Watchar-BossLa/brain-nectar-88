
import { useState, useCallback, useEffect } from 'react';
import { QuizQuestion } from '../../types';
import { calculateQuizResults, evaluateAnswer } from '../quizUtils';
import { useToast } from '@/components/ui/use-toast';
import { QuizStateWithSetters } from './types';
import { useDifficultyAdjustment } from './useDifficultyAdjustment';
import { useQuestionSelection } from './useQuestionSelection';

export function useQuizActions(
  quizState: QuizStateWithSetters,
  availableQuestions: QuizQuestion[],
  maxQuestions: number
) {
  const { toast } = useToast();
  const {
    setActiveQuiz,
    setCurrentIndex,
    setCurrentQuestion,
    setAnsweredQuestions,
    setIsAnswerSubmitted,
    setSelectedAnswer,
    setIsCorrect,
    setQuizResults,
    currentQuestion,
    currentIndex,
    selectedAnswer,
    isAnswerSubmitted,
    answeredQuestions,
    setUserConfidence
  } = quizState;
  
  const [startTime, setStartTime] = useState<number | null>(null);
  const { updateDifficulty } = useDifficultyAdjustment(quizState);
  const { initializeQuestionPool, selectNextQuestion } = useQuestionSelection(quizState);

  // Initialize with available questions
  useEffect(() => {
    if (availableQuestions.length > 0) {
      initializeQuestionPool(availableQuestions);
    }
  }, [availableQuestions, initializeQuestionPool]);

  // Start new quiz
  const startQuiz = useCallback(() => {
    if (availableQuestions.length === 0) {
      toast({
        title: "No questions available",
        description: "Please try again later or contact support",
        variant: "destructive",
      });
      return;
    }
    
    const firstQuestion = selectNextQuestion();
    if (firstQuestion) {
      setCurrentQuestion(firstQuestion);
      setCurrentIndex(0);
      setAnsweredQuestions([]);
      setIsAnswerSubmitted(false);
      setSelectedAnswer('');
      setIsCorrect(null);
      setActiveQuiz(true);
      setQuizResults(null);
      setStartTime(Date.now());
    } else {
      toast({
        title: "Failed to start quiz",
        description: "Could not find appropriate questions",
        variant: "destructive",
      });
    }
  }, [availableQuestions, selectNextQuestion, toast, setCurrentQuestion, setCurrentIndex, 
       setAnsweredQuestions, setIsAnswerSubmitted, setSelectedAnswer, setIsCorrect, 
       setActiveQuiz, setQuizResults]);

  // Submit answer
  const submitAnswer = useCallback(() => {
    if (!currentQuestion || isAnswerSubmitted) return;
    
    const timeTaken = startTime ? (Date.now() - startTime) : 0;
    
    const correct = evaluateAnswer(currentQuestion, selectedAnswer);
    setIsCorrect(correct);
    setIsAnswerSubmitted(true);
    
    const answeredQuestion = {
      id: currentQuestion.id,
      isCorrect: correct,
      userAnswer: selectedAnswer,
      timeTaken,
    };
    
    setAnsweredQuestions(prev => [...prev, answeredQuestion]);
    updateDifficulty(correct);
    setStartTime(Date.now());
    
    return correct;
  }, [currentQuestion, isAnswerSubmitted, selectedAnswer, startTime, updateDifficulty, 
       setIsCorrect, setIsAnswerSubmitted, setAnsweredQuestions]);

  // Move to next question
  const nextQuestion = useCallback(() => {
    if (answeredQuestions.length >= maxQuestions) {
      // Quiz is complete
      const results = calculateQuizResults(answeredQuestions, availableQuestions);
      setQuizResults(results);
      setActiveQuiz(false);
      return true;
    }
    
    const nextQ = selectNextQuestion();
    if (nextQ) {
      setCurrentQuestion(nextQ);
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer('');
      setIsAnswerSubmitted(false);
      setIsCorrect(null);
      return false;
    } else {
      // No more questions available
      const results = calculateQuizResults(answeredQuestions, availableQuestions);
      setQuizResults(results);
      setActiveQuiz(false);
      return true;
    }
  }, [answeredQuestions, maxQuestions, availableQuestions, selectNextQuestion, 
       setQuizResults, setActiveQuiz, setCurrentQuestion, setCurrentIndex, 
       setSelectedAnswer, setIsAnswerSubmitted, setIsCorrect]);

  // Skip current question
  const skipQuestion = useCallback(() => {
    if (!currentQuestion) return false;
    
    const skippedQuestion = {
      id: currentQuestion.id,
      isCorrect: false,
      userAnswer: 'SKIPPED',
      timeTaken: 0,
    };
    
    setAnsweredQuestions(prev => [...prev, skippedQuestion]);
    return nextQuestion();
  }, [currentQuestion, nextQuestion, setAnsweredQuestions]);

  // Go back to previous question (for review)
  const previousQuestion = useCallback(() => {
    if (currentIndex <= 0) return;
    
    // Find the previous question from the answered questions
    const prevAnswered = answeredQuestions[currentIndex - 1];
    const prevQuestion = availableQuestions.find(q => q.id === prevAnswered?.id);
    
    if (prevQuestion) {
      setCurrentQuestion(prevQuestion);
      setCurrentIndex(prev => prev - 1);
      setSelectedAnswer(prevAnswered.userAnswer);
      setIsAnswerSubmitted(true);
      setIsCorrect(prevAnswered.isCorrect);
    }
  }, [currentIndex, answeredQuestions, availableQuestions, setCurrentQuestion, 
       setCurrentIndex, setSelectedAnswer, setIsAnswerSubmitted, setIsCorrect]);

  // Restart quiz
  const restartQuiz = useCallback(() => {
    startQuiz();
  }, [startQuiz]);

  // Set user confidence level
  const setConfidence = useCallback((level: number) => {
    setUserConfidence(level);
  }, [setUserConfidence]);

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
