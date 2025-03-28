import { useCallback } from 'react';
import { QuizQuestion } from '../../types';
import { evaluateAnswer, calculateQuizResults } from '../quizUtils';
import { QuizStateWithSetters } from './types';

export function useQuizProgress(quizState: QuizStateWithSetters) {
  const {
    currentQuestion,
    setCurrentQuestion,
    currentIndex,
    setCurrentIndex,
    selectedAnswer,
    setIsAnswerSubmitted,
    setIsCorrect,
    answeredQuestions,
    setAnsweredQuestions,
    startTime,
    setStartTime,
    currentDifficulty,
    setCurrentDifficulty,
    availableQuestions,
    setQuizResults,
    setActiveQuiz
  } = quizState;
  
  // Submit answer for current question
  const submitAnswer = useCallback(() => {
    if (!currentQuestion) return;
    
    const questionStartTime = startTime || Date.now();
    const timeTaken = Date.now() - questionStartTime;
    setStartTime(Date.now()); // Reset for next question
    
    const correct = evaluateAnswer(currentQuestion, selectedAnswer);
    
    setIsCorrect(correct);
    setIsAnswerSubmitted(true);
    
    // Update answered questions
    setAnsweredQuestions([
      ...answeredQuestions,
      {
        id: currentQuestion.id,
        isCorrect: correct,
        userAnswer: selectedAnswer,
        timeTaken: timeTaken
      }
    ]);
    
    // Adapt difficulty
    adaptDifficulty(correct);
    
    return correct;
  }, [currentQuestion, selectedAnswer, startTime, answeredQuestions, setIsCorrect, 
      setIsAnswerSubmitted, setAnsweredQuestions, setStartTime, currentDifficulty, adaptDifficulty]);
  
  // Move to the next question
  const nextQuestion = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < availableQuestions.length) {
      setCurrentQuestion(availableQuestions[nextIndex]);
      setCurrentIndex(nextIndex);
      setIsAnswerSubmitted(false);
      return false; // Not finished
    }
    
    // Finish quiz and calculate results
    const results = calculateQuizResults(answeredQuestions, availableQuestions);    
    setQuizResults(results);
    setActiveQuiz(false);
    return true; // Quiz finished
  }, [currentIndex, availableQuestions, answeredQuestions, setCurrentQuestion, setCurrentIndex, 
      setIsAnswerSubmitted, setQuizResults, setActiveQuiz]);
  
  // Move to the previous question (review mode)
  const previousQuestion = useCallback(() => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentQuestion(availableQuestions[prevIndex]);
      setCurrentIndex(prevIndex);
      
      // Restore previous answer
      const prevAnswer = answeredQuestions.find(q => q.id === availableQuestions[prevIndex].id);
      if (prevAnswer) {
        setIsAnswerSubmitted(true);
        setIsCorrect(prevAnswer.isCorrect);
      }
    }
  }, [currentIndex, availableQuestions, answeredQuestions, setCurrentQuestion, setCurrentIndex, 
      setIsAnswerSubmitted, setIsCorrect]);
  
  // Skip current question
  const skipQuestion = useCallback(() => {
    if (!currentQuestion) return false;
    
    // Mark as skipped in answered questions
    setAnsweredQuestions([
      ...answeredQuestions,
      {
        id: currentQuestion.id,
        isCorrect: false,
        userAnswer: 'SKIPPED',
        timeTaken: 0
      }
    ]);
    
    return nextQuestion();
  }, [currentQuestion, answeredQuestions, nextQuestion, setAnsweredQuestions]);
  
  // Adapt difficulty based on performance
  const adaptDifficulty = useCallback((isCorrect: boolean) => {
    // Get performance on recent questions (last 3 or fewer if not enough)
    const recentQuestions = [...answeredQuestions, { 
      id: currentQuestion?.id || '', 
      isCorrect, 
      userAnswer: selectedAnswer, 
      timeTaken: 0 
    }];
    const recentPerformance = recentQuestions.slice(-3).filter(q => q.id !== '');
    
    // Calculate success rate
    const successRate = recentPerformance.length > 0
      ? recentPerformance.filter(q => q.isCorrect).length / recentPerformance.length
      : 0.5;
    
    // Adjust difficulty based on performance
    if (successRate > 0.7 && currentDifficulty < 3) {
      // Doing well, increase difficulty
      setCurrentDifficulty(Math.min(3, currentDifficulty + 1) as 1 | 2 | 3);
    } else if (successRate < 0.3 && currentDifficulty > 1) {
      // Struggling, decrease difficulty
      setCurrentDifficulty(Math.max(1, currentDifficulty - 1) as 1 | 2 | 3);
    }
    // Otherwise keep current difficulty
  }, [answeredQuestions, currentQuestion, selectedAnswer, currentDifficulty, setCurrentDifficulty]);
  
  return {
    submitAnswer,
    nextQuestion,
    previousQuestion,
    skipQuestion,
    adaptDifficulty
  };
}
