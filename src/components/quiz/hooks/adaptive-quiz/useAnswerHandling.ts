
import { useCallback } from 'react';
import { evaluateAnswer } from '../quizUtils';
import { QuizStateWithSetters } from './types';

export function useAnswerHandling(
  quizState: QuizStateWithSetters,
  startTime: number | null,
  setStartTime: React.Dispatch<React.SetStateAction<number | null>>,
  updateDifficulty: (isCorrect: boolean) => void
) {
  const {
    currentQuestion,
    isAnswerSubmitted,
    selectedAnswer,
    setIsCorrect,
    setIsAnswerSubmitted,
    answeredQuestions,
    setAnsweredQuestions,
  } = quizState;

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
    
    setAnsweredQuestions([...answeredQuestions, answeredQuestion]);
    updateDifficulty(correct);
    setStartTime(Date.now());
    
    return correct;
  }, [
    currentQuestion, 
    isAnswerSubmitted, 
    selectedAnswer, 
    startTime, 
    updateDifficulty, 
    setIsCorrect, 
    setIsAnswerSubmitted, 
    answeredQuestions, 
    setAnsweredQuestions,
    setStartTime
  ]);

  return { submitAnswer };
}
