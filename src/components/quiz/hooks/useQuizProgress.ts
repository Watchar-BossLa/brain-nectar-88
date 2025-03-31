
import { useState, useEffect } from 'react';
import { QuizQuestion, AnsweredQuestion } from '../types';
import { evaluateAnswer } from './quizUtils';
import { useToast } from '@/components/ui/use-toast';

export function useQuizProgress() {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentDifficulty, setCurrentDifficulty] = useState<1 | 2 | 3>(2);
  const [userConfidence, setUserConfidence] = useState<number | null>(null);
  const [adaptivityMetrics, setAdaptivityMetrics] = useState({
    correctStreak: 0,
    incorrectStreak: 0,
    difficultyHistory: [2] // Start with default difficulty
  });
  
  const { toast } = useToast();
  
  // Reset timer when current question changes
  useEffect(() => {
    if (currentQuestion && !isAnswerSubmitted) {
      setStartTime(Date.now());
    }
  }, [currentQuestion, isAnswerSubmitted]);
  
  // Submit answer for current question
  const submitAnswer = (currentQuestion: QuizQuestion, confidence?: number) => {
    if (!currentQuestion) return false;
    
    const questionStartTime = startTime || Date.now();
    const timeTaken = Date.now() - questionStartTime;
    setStartTime(Date.now()); // Reset for next question
    
    // Store user's confidence if provided
    if (confidence !== undefined) {
      setUserConfidence(confidence);
    }
    
    const correct = evaluateAnswer(currentQuestion, selectedAnswer);
    
    setIsCorrect(correct);
    setIsAnswerSubmitted(true);
    
    // Update answered questions
    const newAnsweredQuestion: AnsweredQuestion = {
      id: currentQuestion.id,
      isCorrect: correct,
      userAnswer: selectedAnswer,
      timeTaken: timeTaken,
      confidenceLevel: confidence || null,
      topic: currentQuestion.topic,
      difficulty: currentQuestion.difficulty
    };
    
    setAnsweredQuestions(prev => [...prev, newAnsweredQuestion]);
    
    // Adjust difficulty based on performance
    adaptDifficulty(correct, confidence);
    
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
        timeTaken: 0,
        topic: currentQuestion.topic,
        difficulty: currentQuestion.difficulty
      }
    ]);
    
    return nextQuestion(availableQuestions);
  };
  
  // Enhanced adapt difficulty based on performance
  const adaptDifficulty = (isCorrect: boolean, confidence?: number) => {
    // Update streaks
    let correctStreak = isCorrect ? adaptivityMetrics.correctStreak + 1 : 0;
    let incorrectStreak = !isCorrect ? adaptivityMetrics.incorrectStreak + 1 : 0;
    
    // Get recent performance metrics
    const recentQuestions = answeredQuestions.slice(-4).concat({
      id: currentQuestion?.id || '',
      isCorrect,
      userAnswer: selectedAnswer,
      timeTaken: 0,
      topic: currentQuestion?.topic,
      difficulty: currentQuestion?.difficulty
    });
    
    const recentCorrect = recentQuestions.filter(q => q.isCorrect).length;
    const recentAccuracy = recentCorrect / recentQuestions.length;
    
    // Calculate new difficulty based on advanced criteria
    let newDifficulty = currentDifficulty;
    
    // Check for streak-based adjustments
    if (correctStreak >= 4 && currentDifficulty < 3) {
      newDifficulty = Math.min(3, currentDifficulty + 1) as 1 | 2 | 3;
      toast({
        title: "Difficulty increased",
        description: "You're on a streak! Questions will be more challenging.",
        duration: 3000,
      });
    } else if (incorrectStreak >= 3 && currentDifficulty > 1) {
      newDifficulty = Math.max(1, currentDifficulty - 1) as 1 | 2 | 3;
      toast({
        title: "Difficulty adjusted",
        description: "Questions will better match your current level.",
        duration: 3000,
      });
    }
    // Check for accuracy-based adjustments
    else if (recentAccuracy >= 0.8 && currentDifficulty < 3) {
      newDifficulty = Math.min(3, currentDifficulty + 1) as 1 | 2 | 3;
      toast({
        title: "Difficulty increased",
        description: "Great accuracy! Let's try more challenging questions.",
        duration: 3000,
      });
    } else if (recentAccuracy <= 0.3 && currentDifficulty > 1) {
      newDifficulty = Math.max(1, currentDifficulty - 1) as 1 | 2 | 3;
      toast({
        title: "Difficulty adjusted",
        description: "The questions will be more appropriate for your level.",
        duration: 3000,
      });
    }
    
    // Update adaptivity metrics
    setAdaptivityMetrics({
      correctStreak,
      incorrectStreak,
      difficultyHistory: [...adaptivityMetrics.difficultyHistory, newDifficulty]
    });
    
    // Update difficulty state if changed
    if (newDifficulty !== currentDifficulty) {
      setCurrentDifficulty(newDifficulty);
    }
    
    return {
      newDifficulty,
      recentAccuracy,
      correctStreak,
      incorrectStreak
    };
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
    userConfidence,
    setUserConfidence,
    adaptivityMetrics,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    skipQuestion,
    adaptDifficulty
  };
}
