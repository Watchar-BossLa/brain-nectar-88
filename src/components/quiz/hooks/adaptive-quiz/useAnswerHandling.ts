
import { useCallback } from 'react';
import { QuizStateWithSetters } from './types';
import { evaluateAnswer } from '../quizUtils';

export function useAnswerHandling(
  quizState: QuizStateWithSetters,
  startTime: number | null,
  setStartTime: (time: number | null) => void,
  updateDifficulty: (isCorrect: boolean) => void
) {
  const {
    currentQuestion,
    selectedAnswer,
    setIsAnswerSubmitted,
    setIsCorrect,
    userConfidence,
    answeredQuestions,
    setAnsweredQuestions
  } = quizState;

  const submitAnswer = useCallback(() => {
    if (!currentQuestion || !selectedAnswer) return false;
    
    // Calculate time taken to answer
    const endTime = Date.now();
    const questionStartTime = startTime || endTime;
    const timeTaken = endTime - questionStartTime;
    
    // Reset timer for next question
    setStartTime(null);
    
    // Determine if answer is correct
    const isCorrect = evaluateAnswer(currentQuestion, selectedAnswer);
    
    // Update state
    setIsCorrect(isCorrect);
    setIsAnswerSubmitted(true);
    
    // Record answered question with detailed metrics
    const answeredQuestion = {
      id: currentQuestion.id,
      isCorrect,
      userAnswer: selectedAnswer,
      timeTaken,
      confidenceLevel: userConfidence,
      topic: currentQuestion.topic,
      difficulty: currentQuestion.difficulty
    };
    
    setAnsweredQuestions([...answeredQuestions, answeredQuestion]);
    
    // Update difficulty based on performance
    updateDifficulty(isCorrect);
    
    return isCorrect;
  }, [
    currentQuestion,
    selectedAnswer,
    startTime,
    setStartTime,
    setIsCorrect,
    setIsAnswerSubmitted,
    userConfidence,
    answeredQuestions,
    setAnsweredQuestions,
    updateDifficulty
  ]);

  return {
    submitAnswer
  };
}
