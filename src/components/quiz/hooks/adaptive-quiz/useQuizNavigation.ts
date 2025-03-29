
import { useCallback } from 'react';
import { QuizQuestion } from '../../types';
import { calculateQuizResults } from '../quizUtils';
import { QuizStateWithSetters } from './types';

export function useQuizNavigation(
  quizState: QuizStateWithSetters,
  availableQuestions: QuizQuestion[],
  maxQuestions: number,
  selectNextQuestion: () => QuizQuestion | null,
  startQuiz: () => void
) {
  const {
    currentQuestion,
    currentIndex,
    answeredQuestions,
    setCurrentQuestion,
    setCurrentIndex,
    setSelectedAnswer,
    setIsAnswerSubmitted,
    setIsCorrect,
    setQuizResults,
    setActiveQuiz,
  } = quizState;

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
      setCurrentIndex(currentIndex + 1);
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
  }, [
    answeredQuestions, 
    maxQuestions, 
    availableQuestions, 
    selectNextQuestion, 
    setQuizResults, 
    setActiveQuiz, 
    setCurrentQuestion, 
    currentIndex, 
    setCurrentIndex, 
    setSelectedAnswer, 
    setIsAnswerSubmitted, 
    setIsCorrect
  ]);

  // Skip current question
  const skipQuestion = useCallback(() => {
    if (!currentQuestion) return false;
    
    const skippedQuestion = {
      id: currentQuestion.id,
      isCorrect: false,
      userAnswer: 'SKIPPED',
      timeTaken: 0,
    };
    
    setAnsweredQuestions([...answeredQuestions, skippedQuestion]);
    return nextQuestion();
  }, [currentQuestion, nextQuestion, answeredQuestions, setAnsweredQuestions]);

  // Go back to previous question (for review)
  const previousQuestion = useCallback(() => {
    if (currentIndex <= 0) return;
    
    // Find the previous question from the answered questions
    const prevAnswered = answeredQuestions[currentIndex - 1];
    const prevQuestion = availableQuestions.find(q => q.id === prevAnswered?.id);
    
    if (prevQuestion) {
      setCurrentQuestion(prevQuestion);
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(prevAnswered.userAnswer);
      setIsAnswerSubmitted(true);
      setIsCorrect(prevAnswered.isCorrect);
    }
  }, [
    currentIndex, 
    answeredQuestions, 
    availableQuestions, 
    setCurrentQuestion, 
    setCurrentIndex, 
    setSelectedAnswer, 
    setIsAnswerSubmitted, 
    setIsCorrect
  ]);

  // Restart quiz
  const restartQuiz = useCallback(() => {
    startQuiz();
  }, [startQuiz]);

  return {
    nextQuestion,
    previousQuestion,
    skipQuestion,
    restartQuiz,
  };
}
