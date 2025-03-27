
import { useState, useEffect, useCallback } from 'react';
import { QuizQuestion, AnsweredQuestion, QuizResults } from '../types';
import { calculateQuizResults, evaluateAnswer } from './quizUtils';
import { useToast } from '@/components/ui/use-toast';

export function useAdaptiveQuiz(availableQuestions: QuizQuestion[], initialDifficulty: 1 | 2 | 3 = 2, maxQuestions: number = 10) {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [activeQuiz, setActiveQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const [currentDifficulty, setCurrentDifficulty] = useState<1 | 2 | 3>(initialDifficulty);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [questionPool, setQuestionPool] = useState<QuizQuestion[]>([]);
  const [userConfidence, setUserConfidence] = useState<number>(0.5); // 0.0 to 1.0
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveIncorrect, setConsecutiveIncorrect] = useState(0);

  // Prepare questions when available questions change
  useEffect(() => {
    if (availableQuestions.length > 0) {
      setQuestionPool(availableQuestions);
    }
  }, [availableQuestions]);

  // The adaptive algorithm for selecting the next question
  const selectNextQuestion = useCallback(() => {
    // Filter questions by current difficulty
    const difficultyQuestions = questionPool.filter(q => 
      q.difficulty === currentDifficulty && 
      !answeredQuestions.some(aq => aq.id === q.id)
    );
    
    // If no questions at current difficulty, look at adjacent difficulties
    let candidateQuestions = difficultyQuestions.length > 0 
      ? difficultyQuestions 
      : questionPool.filter(q => 
          !answeredQuestions.some(aq => aq.id === q.id)
        );
    
    // If no questions left at all
    if (candidateQuestions.length === 0) {
      return null;
    }
    
    // Sort by proximity to current difficulty if needed
    if (difficultyQuestions.length === 0) {
      candidateQuestions.sort((a, b) => {
        const aDiff = Math.abs(a.difficulty - currentDifficulty);
        const bDiff = Math.abs(b.difficulty - currentDifficulty);
        return aDiff - bDiff;
      });
    }
    
    // Randomly select from top 3 candidates to add some variety
    const topCandidates = candidateQuestions.slice(0, Math.min(3, candidateQuestions.length));
    const selectedQuestion = topCandidates[Math.floor(Math.random() * topCandidates.length)];
    
    return selectedQuestion;
  }, [questionPool, currentDifficulty, answeredQuestions]);

  // Update difficulty based on performance
  const updateDifficulty = useCallback((correct: boolean) => {
    if (correct) {
      setConsecutiveCorrect(prev => prev + 1);
      setConsecutiveIncorrect(0);
      
      // Increase difficulty after 2 consecutive correct answers
      if (consecutiveCorrect >= 1 && currentDifficulty < 3) {
        setCurrentDifficulty(prev => Math.min(3, prev + 1) as 1 | 2 | 3);
        toast({
          title: "Difficulty Increased",
          description: "Great work! The questions will now be more challenging.",
          variant: "default",
        });
      }
    } else {
      setConsecutiveCorrect(0);
      setConsecutiveIncorrect(prev => prev + 1);
      
      // Decrease difficulty after 2 consecutive incorrect answers
      if (consecutiveIncorrect >= 1 && currentDifficulty > 1) {
        setCurrentDifficulty(prev => Math.max(1, prev - 1) as 1 | 2 | 3);
        toast({
          title: "Difficulty Adjusted",
          description: "Questions will now be more approachable.",
          variant: "default",
        });
      }
    }
    
    // Factor in user confidence
    if (correct && userConfidence > 0.8 && currentDifficulty < 3) {
      // User was very confident and correct, maybe increase difficulty faster
      setCurrentDifficulty(prev => Math.min(3, prev + 1) as 1 | 2 | 3);
    } else if (!correct && userConfidence > 0.8 && currentDifficulty > 1) {
      // User was very confident but wrong, adjust difficulty down
      setCurrentDifficulty(prev => Math.max(1, prev - 1) as 1 | 2 | 3);
    }
    
  }, [consecutiveCorrect, consecutiveIncorrect, currentDifficulty, userConfidence, toast]);

  // Start new quiz
  const startQuiz = useCallback(() => {
    if (questionPool.length === 0) {
      toast({
        title: "No questions available",
        description: "Please try again later or contact support",
        variant: "destructive",
      });
      return;
    }
    
    const firstQuestion = selectNextQuestion();
    if (firstQuestion) {
      setCurrentQuestion(firstQuestion);
      setCurrentIndex(0);
      setAnsweredQuestions([]);
      setIsAnswerSubmitted(false);
      setSelectedAnswer('');
      setIsCorrect(null);
      setActiveQuiz(true);
      setQuizResults(null);
      setStartTime(Date.now());
      setConsecutiveCorrect(0);
      setConsecutiveIncorrect(0);
    } else {
      toast({
        title: "Failed to start quiz",
        description: "Could not find appropriate questions",
        variant: "destructive",
      });
    }
  }, [questionPool, selectNextQuestion, toast]);

  // Submit answer
  const submitAnswer = useCallback(() => {
    if (!currentQuestion || isAnswerSubmitted) return;
    
    const timeTaken = startTime ? (Date.now() - startTime) : 0;
    
    const correct = evaluateAnswer(currentQuestion, selectedAnswer);
    setIsCorrect(correct);
    setIsAnswerSubmitted(true);
    
    const answeredQuestion: AnsweredQuestion = {
      id: currentQuestion.id,
      isCorrect: correct,
      userAnswer: selectedAnswer,
      timeTaken,
    };
    
    setAnsweredQuestions(prev => [...prev, answeredQuestion]);
    updateDifficulty(correct);
    setStartTime(Date.now());
    
    return correct;
  }, [currentQuestion, isAnswerSubmitted, selectedAnswer, startTime, updateDifficulty]);

  // Move to next question
  const nextQuestion = useCallback(() => {
    if (answeredQuestions.length >= maxQuestions) {
      // Quiz is complete
      const results = calculateQuizResults(answeredQuestions, questionPool);
      setQuizResults(results);
      setActiveQuiz(false);
      return true;
    }
    
    const nextQ = selectNextQuestion();
    if (nextQ) {
      setCurrentQuestion(nextQ);
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer('');
      setIsAnswerSubmitted(false);
      setIsCorrect(null);
      return false;
    } else {
      // No more questions available
      const results = calculateQuizResults(answeredQuestions, questionPool);
      setQuizResults(results);
      setActiveQuiz(false);
      return true;
    }
  }, [answeredQuestions, maxQuestions, questionPool, selectNextQuestion]);

  // Skip current question
  const skipQuestion = useCallback(() => {
    if (!currentQuestion) return false;
    
    const skippedQuestion: AnsweredQuestion = {
      id: currentQuestion.id,
      isCorrect: false,
      userAnswer: 'SKIPPED',
      timeTaken: 0,
    };
    
    setAnsweredQuestions(prev => [...prev, skippedQuestion]);
    return nextQuestion();
  }, [currentQuestion, nextQuestion]);

  // Restart quiz
  const restartQuiz = useCallback(() => {
    startQuiz();
  }, [startQuiz]);

  // Go back to previous question (for review)
  const previousQuestion = useCallback(() => {
    if (currentIndex <= 0) return;
    
    // Find the previous question from the answered questions
    const prevAnswered = answeredQuestions[currentIndex - 1];
    const prevQuestion = questionPool.find(q => q.id === prevAnswered?.id);
    
    if (prevQuestion) {
      setCurrentQuestion(prevQuestion);
      setCurrentIndex(prev => prev - 1);
      setSelectedAnswer(prevAnswered.userAnswer);
      setIsAnswerSubmitted(true);
      setIsCorrect(prevAnswered.isCorrect);
    }
  }, [currentIndex, answeredQuestions, questionPool]);

  // Set user confidence level
  const setConfidence = useCallback((level: number) => {
    setUserConfidence(level);
  }, []);

  return {
    // State
    activeQuiz,
    currentQuestion,
    currentIndex,
    selectedAnswer,
    setSelectedAnswer,
    isAnswerSubmitted,
    isCorrect,
    quizResults,
    currentDifficulty,
    setCurrentDifficulty,
    answeredQuestions,
    userConfidence,
    
    // Actions
    startQuiz,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    skipQuestion,
    restartQuiz,
    setConfidence,
  };
}
