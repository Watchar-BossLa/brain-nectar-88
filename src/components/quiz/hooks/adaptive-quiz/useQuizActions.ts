
import { useCallback } from 'react';
import { QuizQuestion, QuizResults, AnsweredQuestion } from '../../types';
import { QuizStateWithSetters, QuestionSelectionState } from './types';
import { useQuestionSelection } from './useQuestionSelection';
import { usePerformanceHistory } from './usePerformanceHistory';
import { updateLearningPathFromQuizResults } from '@/services/learningPath/quizLearningPathService';
import { useAuth } from '@/context/auth';

export function useQuizActions(
  quizState: QuizStateWithSetters,
  availableQuestions: QuizQuestion[],
  maxQuestions: number = 10
) {
  const { user } = useAuth();
  const {
    currentQuestion,
    answeredQuestions,
    setCurrentQuestion,
    setActiveQuiz,
    setQuizResults,
    selectedAnswer,
    setSelectedAnswer,
    currentDifficulty,
    setCurrentDifficulty,
    userConfidence,
    setUserConfidence,
    startTime,
    setStartTime,
    currentIndex,
    setCurrentIndex
  } = quizState;
  
  const questionSelection = useQuestionSelection(quizState);
  const performanceHistory = usePerformanceHistory();
  
  const startQuiz = useCallback(() => {
    // Initialize the question pool
    questionSelection.initializeQuestionPool(availableQuestions);
    
    // Select the first question
    const firstQuestion = questionSelection.selectNextQuestion();
    setCurrentQuestion(firstQuestion);
    
    // Start the quiz
    setActiveQuiz(true);
    setStartTime && setStartTime(new Date().getTime());
    setQuizResults(null);
  }, [availableQuestions, questionSelection, setActiveQuiz, setCurrentQuestion, setQuizResults, setStartTime]);
  
  const submitAnswer = useCallback((answer: string, confidenceLevel?: number) => {
    if (!currentQuestion) return;
    
    const timeNow = new Date().getTime();
    const questionStartTime = startTime || timeNow;
    const timeTaken = timeNow - questionStartTime;
    
    // Check if the answer is correct
    let isCorrect = false;
    if (Array.isArray(currentQuestion.correctAnswer)) {
      isCorrect = currentQuestion.correctAnswer.includes(answer);
    } else {
      isCorrect = answer === currentQuestion.correctAnswer;
    }
    
    // Create the answered question object
    const answeredQuestion: AnsweredQuestion = {
      id: currentQuestion.id,
      isCorrect,
      userAnswer: answer,
      timeTaken,
      topic: currentQuestion.topic,
      difficulty: currentQuestion.difficulty,
    };
    
    // Add confidence level if available
    if (confidenceLevel !== undefined) {
      answeredQuestion.confidenceLevel = confidenceLevel;
    }
    
    // Record the performance in the history
    performanceHistory.recordPerformance(answeredQuestion);
    
    // Add to the list of answered questions
    const newAnsweredQuestions = [...answeredQuestions, answeredQuestion];
    
    // Check if we've reached the maximum number of questions
    if (newAnsweredQuestions.length >= maxQuestions) {
      finishQuiz(newAnsweredQuestions);
    } else {
      // Update the quiz state
      setSelectedAnswer(null);
      setStartTime && setStartTime(timeNow);
      
      // Adjust difficulty based on performance if needed
      const recommendedDifficulty = performanceHistory.getRecommendedDifficulty(currentDifficulty);
      if (recommendedDifficulty !== currentDifficulty) {
        setCurrentDifficulty(recommendedDifficulty);
      }
      
      // Select the next question
      const nextQuestion = questionSelection.selectNextQuestion();
      setCurrentQuestion(nextQuestion);
    }
  }, [currentQuestion, answeredQuestions, startTime, currentDifficulty, performanceHistory, questionSelection, setCurrentDifficulty, setCurrentQuestion, setSelectedAnswer, setStartTime]);
  
  const skipQuestion = useCallback(() => {
    if (!currentQuestion) return false;
    
    const timeNow = new Date().getTime();
    
    // Create the answered question object for a skipped question
    const skippedQuestion: AnsweredQuestion = {
      id: currentQuestion.id,
      isCorrect: false,
      userAnswer: 'skipped',
      timeTaken: timeNow - (startTime || timeNow),
      topic: currentQuestion.topic,
      difficulty: currentQuestion.difficulty,
    };
    
    // Record the performance in the history
    performanceHistory.recordPerformance(skippedQuestion);
    
    // Add to the list of answered questions
    const newAnsweredQuestions = [...answeredQuestions, skippedQuestion];
    
    // Check if we've reached the maximum number of questions
    if (newAnsweredQuestions.length >= maxQuestions) {
      finishQuiz(newAnsweredQuestions);
      return true;
    } else {
      // Update the quiz state
      setSelectedAnswer(null);
      setStartTime && setStartTime(timeNow);
      
      // Select the next question
      const nextQuestion = questionSelection.selectNextQuestion();
      setCurrentQuestion(nextQuestion);
      return true;
    }
  }, [currentQuestion, answeredQuestions, startTime, questionSelection, setCurrentQuestion, setSelectedAnswer, setStartTime, maxQuestions, performanceHistory]);
  
  const finishQuiz = useCallback((finalAnsweredQuestions: AnsweredQuestion[]) => {
    // Calculate quiz results
    const timeNow = new Date().getTime();
    const correctAnswers = finalAnsweredQuestions.filter(q => q.isCorrect).length;
    const totalTime = timeNow - (startTime || timeNow);
    
    // Calculate performance by topic
    const topicPerformance: Record<string, { correct: number; total: number }> = {};
    finalAnsweredQuestions.forEach(question => {
      const topic = question.topic || 'unknown';
      
      if (!topicPerformance[topic]) {
        topicPerformance[topic] = { correct: 0, total: 0 };
      }
      
      topicPerformance[topic].total += 1;
      if (question.isCorrect) {
        topicPerformance[topic].correct += 1;
      }
    });
    
    // Calculate performance by difficulty
    const difficultyPerformance: Record<string, { correct: number; total: number }> = {
      '1': { correct: 0, total: 0 },
      '2': { correct: 0, total: 0 },
      '3': { correct: 0, total: 0 }
    };
    
    finalAnsweredQuestions.forEach(question => {
      if (question.difficulty) {
        const diffKey = question.difficulty.toString();
        difficultyPerformance[diffKey].total += 1;
        if (question.isCorrect) {
          difficultyPerformance[diffKey].correct += 1;
        }
      }
    });
    
    // Calculate average confidence
    const confidenceLevels = finalAnsweredQuestions
      .filter(q => q.confidenceLevel !== undefined)
      .map(q => q.confidenceLevel || 0);
      
    const averageConfidence = confidenceLevels.length > 0 
      ? confidenceLevels.reduce((sum, val) => sum + (val || 0), 0) / confidenceLevels.length 
      : undefined;
    
    // Identify recommended topics for further study
    const recommendedTopics = Object.entries(topicPerformance)
      .filter(([_, data]) => (data.correct / data.total) < 0.7 && data.total >= 2)
      .map(([topic]) => topic);
    
    // Create the quiz results object
    const results: QuizResults = {
      questionsAttempted: finalAnsweredQuestions.length,
      correctAnswers,
      incorrectAnswers: finalAnsweredQuestions.length - correctAnswers,
      skippedQuestions: finalAnsweredQuestions.filter(q => q.userAnswer === 'skipped').length,
      performanceByTopic: topicPerformance,
      performanceByDifficulty: difficultyPerformance,
      timeSpent: totalTime,
      averageConfidence,
      recommendedTopics,
      score: Math.round((correctAnswers / finalAnsweredQuestions.length) * 100),
    };
    
    // Update the quiz state
    setQuizResults(results);
    setActiveQuiz(false);
    setCurrentQuestion(null);
    
    // Update the learning path based on quiz results
    if (user) {
      updateLearningPathFromQuizResults(user.id, results)
        .then(() => console.log('Learning path updated based on quiz results'))
        .catch(error => console.error('Error updating learning path:', error));
    }
  }, [startTime, user, setQuizResults, setActiveQuiz, setCurrentQuestion]);
  
  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 < answeredQuestions.length) {
      setCurrentIndex(currentIndex + 1);
      return true;
    }
    return false;
  }, [currentIndex, answeredQuestions.length, setCurrentIndex]);

  const previousQuestion = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, setCurrentIndex]);

  const getPerformanceMetrics = useCallback(() => {
    return {
      correctAnswers: answeredQuestions.filter(q => q.isCorrect).length,
      totalQuestions: answeredQuestions.length,
      averageTime: answeredQuestions.reduce((sum, q) => sum + q.timeTaken, 0) / answeredQuestions.length,
      topicPerformance: performanceHistory.getTopicPerformance(),
      difficultyPerformance: performanceHistory.getDifficultyPerformance()
    };
  }, [answeredQuestions, performanceHistory]);
  
  const restartQuiz = useCallback(() => {
    // Reset quiz state
    setCurrentQuestion(null);
    setActiveQuiz(false);
    setQuizResults(null);
    setSelectedAnswer(null);
    setCurrentDifficulty(2);
    setUserConfidence(0.5);
    
    // Start a new quiz
    startQuiz();
  }, [startQuiz, setCurrentQuestion, setActiveQuiz, setQuizResults, setSelectedAnswer, setCurrentDifficulty, setUserConfidence]);
  
  const setConfidence = useCallback((confidenceLevel: number) => {
    setUserConfidence(confidenceLevel);
  }, [setUserConfidence]);
  
  return {
    startQuiz,
    submitAnswer,
    skipQuestion,
    restartQuiz,
    setConfidence,
    nextQuestion,
    previousQuestion,
    getPerformanceMetrics,
    questionSelection,
    performanceHistory
  };
}
