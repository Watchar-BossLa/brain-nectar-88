import { useState } from 'react';
import { QuizQuestion, AnsweredQuestion } from '../types';
import { evaluateAnswer } from './quizUtils';

export function useQuizProgress() {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentDifficulty, setCurrentDifficulty] = useState<1 | 2 | 3>(2);
  
  // Submit answer for current question
  const submitAnswer = (currentQuestion: QuizQuestion) => {
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
    
    return correct;
  };
  
  // Move to the next question
  const nextQuestion = (availableQuestions: QuizQuestion[]) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < availableQuestions.length) {
      setCurrentQuestion(availableQuestions[nextIndex]);
      setCurrentIndex(nextIndex);
      setSelectedAnswer('');
      setIsAnswerSubmitted(false);
      setIsCorrect(null);
      return false; // Not finished
    }
    return true; // Quiz finished
  };
  
  // Move to the previous question (review mode)
  const previousQuestion = (availableQuestions: QuizQuestion[]) => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentQuestion(availableQuestions[prevIndex]);
      setCurrentIndex(prevIndex);
      
      // Restore previous answer
      const prevAnswer = answeredQuestions.find(q => q.id === availableQuestions[prevIndex].id);
      setSelectedAnswer(prevAnswer?.userAnswer || '');
      setIsAnswerSubmitted(true);
      setIsCorrect(prevAnswer?.isCorrect || false);
    }
  };
  
  // Skip current question
  const skipQuestion = (currentQuestion: QuizQuestion | null, availableQuestions: QuizQuestion[]) => {
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
    
    return nextQuestion(availableQuestions);
  };
  
  // Adapt difficulty based on performance
  const adaptDifficulty = (isCorrect: boolean) => {
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
      setCurrentDifficulty((prev) => Math.min(3, prev + 1) as 1 | 2 | 3);
    } else if (successRate < 0.3 && currentDifficulty > 1) {
      // Struggling, decrease difficulty
      setCurrentDifficulty((prev) => Math.max(1, prev - 1) as 1 | 2 | 3);
    }
    // Otherwise keep current difficulty
  };
  
  return {
    currentQuestion,
    setCurrentQuestion,
    currentIndex,
    setCurrentIndex,
    selectedAnswer,
    setSelectedAnswer,
    isAnswerSubmitted,
    setIsAnswerSubmitted,
    isCorrect,
    setIsCorrect,
    answeredQuestions,
    setAnsweredQuestions,
    startTime,
    setStartTime,
    currentDifficulty,
    setCurrentDifficulty,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    skipQuestion,
    adaptDifficulty
  };
}
