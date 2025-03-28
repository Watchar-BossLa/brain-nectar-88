
import { useCallback } from 'react';
import { prepareQuizQuestions } from '../quizUtils';
import { QuizStateWithSetters } from './types';
import { useTopicSelection } from './useTopicSelection';
import { useQuizProgress } from './useQuizProgress';

export function useQuizActions(quizState: QuizStateWithSetters) {
  const {
    setAvailableQuestions,
    setCurrentQuestion,
    setCurrentIndex,
    setIsAnswerSubmitted,
    setSelectedAnswer,
    setIsCorrect,
    setActiveQuiz,
    setAnsweredQuestions,
    setStartTime,
    setQuizResults,
    currentDifficulty,
    quizLength
  } = quizState;
  
  // Import sub-hooks
  const { getFilteredQuestions, toggleTopic, allTopics, allSubjects } = useTopicSelection(quizState);
  const { submitAnswer: submitQuestionAnswer, nextQuestion: goToNextQuestion, previousQuestion: goPreviousQuestion, skipQuestion: skipCurrentQuestion } = useQuizProgress(quizState);
  
  // Start a new quiz
  const startQuiz = useCallback(() => {
    const filteredQuestions = getFilteredQuestions();
    const selected = prepareQuizQuestions(
      filteredQuestions,
      quizState.selectedTopics,
      currentDifficulty,
      quizLength
    );
    
    setAvailableQuestions(selected);
    setCurrentQuestion(selected[0] || null);
    setCurrentIndex(0);
    setIsAnswerSubmitted(false);
    setSelectedAnswer('');
    setIsCorrect(null);
    setActiveQuiz(true);
    setAnsweredQuestions([]);
    setStartTime(Date.now());
    setQuizResults(null);
  }, [getFilteredQuestions, quizState.selectedTopics, currentDifficulty, quizLength, 
      setAvailableQuestions, setCurrentQuestion, setCurrentIndex, setIsAnswerSubmitted, 
      setSelectedAnswer, setIsCorrect, setActiveQuiz, setAnsweredQuestions, setStartTime, 
      setQuizResults]);
  
  // Submit answer wrapper
  const submitAnswer = useCallback(() => {
    submitQuestionAnswer();
  }, [submitQuestionAnswer]);
  
  // Next question wrapper
  const nextQuestion = useCallback(() => {
    goToNextQuestion();
  }, [goToNextQuestion]);
  
  // Previous question wrapper
  const previousQuestion = useCallback(() => {
    goPreviousQuestion();
  }, [goPreviousQuestion]);
  
  // Skip question wrapper
  const skipQuestion = useCallback(() => {
    skipCurrentQuestion();
  }, [skipCurrentQuestion]);
  
  // Restart quiz with same settings
  const restartQuiz = useCallback(() => {
    startQuiz();
  }, [startQuiz]);
  
  return {
    startQuiz,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    skipQuestion,
    restartQuiz,
    toggleTopic,
    getFilteredQuestions,
    allTopics,
    allSubjects
  };
}
