
import { useState } from 'react';
import { QuizResults, QuizQuestion } from '../types';
import { quizQuestions } from '../data/quizQuestions';
import { useQuizSetup } from './useQuizSetup';
import { useQuizProgress } from './useQuizProgress';
import { prepareQuizQuestions, calculateQuizResults } from './quizUtils';

export function useQuiz() {
  // Quiz state
  const [activeQuiz, setActiveQuiz] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState<QuizQuestion[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  
  // Import sub-hooks
  const {
    selectedTopics,
    currentDifficulty,
    setCurrentDifficulty,
    quizLength,
    setQuizLength,
    allTopics,
    toggleTopic
  } = useQuizSetup();
  
  const {
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
    adaptDifficulty,
    submitAnswer: submitQuestionAnswer,
    nextQuestion: goToNextQuestion,
    previousQuestion,
    skipQuestion: skipCurrentQuestion
  } = useQuizProgress();
  
  // Start a new quiz
  const startQuiz = () => {
    const selected = prepareQuizQuestions(
      quizQuestions,
      selectedTopics,
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
  };
  
  // Submit answer wrapper
  const submitAnswer = () => {
    if (!currentQuestion) return;
    const correct = submitQuestionAnswer(currentQuestion);
    adaptDifficulty(correct || false);
  };
  
  // Next question wrapper
  const nextQuestion = () => {
    const isFinished = goToNextQuestion(availableQuestions);
    if (isFinished) {
      finishQuiz();
    }
  };
  
  // Skip question wrapper
  const skipQuestion = () => {
    const isFinished = skipCurrentQuestion(currentQuestion, availableQuestions);
    if (isFinished) {
      finishQuiz();
    }
  };
  
  // Finish quiz and calculate results
  const finishQuiz = () => {
    const results = calculateQuizResults(answeredQuestions, quizQuestions);    
    setQuizResults(results);
    setActiveQuiz(false);
  };
  
  // Restart quiz with same settings
  const restartQuiz = () => {
    startQuiz();
  };

  return {
    activeQuiz,
    currentDifficulty,
    setCurrentDifficulty,
    currentQuestion,
    currentIndex,
    selectedAnswer,
    setSelectedAnswer,
    isAnswerSubmitted,
    isCorrect,
    quizResults,
    selectedTopics,
    quizLength,
    setQuizLength,
    availableQuestions,
    answeredQuestions,
    allTopics,
    startQuiz,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    skipQuestion,
    restartQuiz,
    toggleTopic,
  };
}
