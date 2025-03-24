import { useState } from 'react';
import { QuizQuestion, QuizResults, AnsweredQuestion } from '../types';
import { quizQuestions } from '../data/quizQuestions';

export function useQuiz() {
  // Quiz state
  const [activeQuiz, setActiveQuiz] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState<1 | 2 | 3>(2); // Start with medium difficulty
  const [availableQuestions, setAvailableQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [quizLength, setQuizLength] = useState(5);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  
  // Get unique topics for topic selection
  const allTopics = [...new Set(quizQuestions.map(q => q.topic))];
  
  // Start a new quiz
  const startQuiz = () => {
    // Filter questions based on selected topics (if any)
    let questionsPool = selectedTopics.length > 0
      ? quizQuestions.filter(q => selectedTopics.includes(q.topic))
      : quizQuestions;
    
    // If no questions match the criteria, use all questions
    if (questionsPool.length === 0) {
      questionsPool = quizQuestions;
    }
    
    // Start with questions at the current difficulty level
    let initialQuestions = questionsPool.filter(q => q.difficulty === currentDifficulty);
    
    // If not enough questions at current difficulty, add questions from other difficulties
    if (initialQuestions.length < quizLength) {
      const remainingQuestions = questionsPool.filter(q => q.difficulty !== currentDifficulty);
      initialQuestions = [...initialQuestions, ...remainingQuestions];
    }
    
    // Shuffle and limit to quiz length
    const shuffled = initialQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, quizLength);
    
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
  
  // Submit answer for current question
  const submitAnswer = () => {
    if (!currentQuestion) return;
    
    const questionStartTime = startTime || Date.now();
    const timeTaken = Date.now() - questionStartTime;
    setStartTime(Date.now()); // Reset for next question
    
    let correct = false;
    
    if (currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false') {
      correct = selectedAnswer === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'calculation') {
      // For calculation questions, allow a small tolerance for rounding errors
      const userAnswer = parseFloat(selectedAnswer);
      const correctAnswer = parseFloat(currentQuestion.correctAnswer as string);
      correct = !isNaN(userAnswer) && Math.abs(userAnswer - correctAnswer) < 0.01;
    } else if (currentQuestion.type === 'essay') {
      // Essay questions are marked as "review needed" - no automatic scoring
      correct = false; // Will be manually evaluated
    }
    
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
    
    // Adapt difficulty based on performance for the next question
    adaptDifficulty(correct);
  };
  
  // Move to the next question
  const nextQuestion = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < availableQuestions.length) {
      setCurrentQuestion(availableQuestions[nextIndex]);
      setCurrentIndex(nextIndex);
      setSelectedAnswer('');
      setIsAnswerSubmitted(false);
      setIsCorrect(null);
    } else {
      // End of quiz, show results
      finishQuiz();
    }
  };
  
  // Move to the previous question (review mode)
  const previousQuestion = () => {
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
  const skipQuestion = () => {
    // Mark as skipped in answered questions
    setAnsweredQuestions([
      ...answeredQuestions,
      {
        id: currentQuestion?.id || '',
        isCorrect: false,
        userAnswer: 'SKIPPED',
        timeTaken: 0
      }
    ]);
    
    nextQuestion();
  };
  
  // Adapt difficulty based on performance
  const adaptDifficulty = (isCorrect: boolean) => {
    // Get performance on recent questions (last 3 or fewer if not enough)
    const recentQuestions = [...answeredQuestions, { id: currentQuestion?.id || '', isCorrect, userAnswer: selectedAnswer, timeTaken: 0 }];
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
  
  // Finish quiz and calculate results
  const finishQuiz = () => {
    const results: QuizResults = {
      questionsAttempted: answeredQuestions.length,
      correctAnswers: answeredQuestions.filter(q => q.isCorrect).length,
      incorrectAnswers: answeredQuestions.filter(q => !q.isCorrect && q.userAnswer !== 'SKIPPED').length,
      skippedQuestions: answeredQuestions.filter(q => q.userAnswer === 'SKIPPED').length,
      performanceByTopic: {},
      performanceByDifficulty: {
        'Easy': { correct: 0, total: 0 },
        'Medium': { correct: 0, total: 0 },
        'Hard': { correct: 0, total: 0 }
      },
      timeSpent: answeredQuestions.reduce((total, q) => total + q.timeTaken, 0)
    };
    
    // Calculate performance by topic
    for (const answered of answeredQuestions) {
      const question = quizQuestions.find(q => q.id === answered.id);
      if (question) {
        const { topic, difficulty } = question;
        
        // Performance by topic
        if (!results.performanceByTopic[topic]) {
          results.performanceByTopic[topic] = { correct: 0, total: 0 };
        }
        results.performanceByTopic[topic].total += 1;
        if (answered.isCorrect) {
          results.performanceByTopic[topic].correct += 1;
        }
        
        // Performance by difficulty
        const difficultyLabel = difficulty === 1 ? 'Easy' : difficulty === 2 ? 'Medium' : 'Hard';
        results.performanceByDifficulty[difficultyLabel].total += 1;
        if (answered.isCorrect) {
          results.performanceByDifficulty[difficultyLabel].correct += 1;
        }
      }
    }
    
    setQuizResults(results);
    setActiveQuiz(false);
  };
  
  // Restart quiz with same settings
  const restartQuiz = () => {
    startQuiz();
  };
  
  // Toggle topic selection
  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
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
