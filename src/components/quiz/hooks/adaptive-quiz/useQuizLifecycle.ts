
import { useCallback } from 'react';
import { QuizQuestion } from '../../types';
import { QuizStateWithSetters } from './types';
import { ToastAction } from '@/components/ui/toast';

export function useQuizLifecycle(
  quizState: QuizStateWithSetters,
  availableQuestions: QuizQuestion[],
  selectNextQuestion: () => number,
  toast: any,
  setStartTime: (time: number | null) => void
) {
  // Start a new quiz
  const startQuiz = useCallback(() => {
    if (availableQuestions.length === 0) {
      toast({
        title: "No questions available",
        description: "Please select different topics or add more questions.",
        variant: "destructive",
      });
      return;
    }

    // Reset all state
    quizState.setActiveQuiz(true);
    quizState.setCurrentIndex(0);
    quizState.setAnsweredQuestions([]);
    quizState.setQuizResults(null);
    quizState.setSelectedAnswer("");
    quizState.setIsAnswerSubmitted(false);
    quizState.setIsCorrect(null);
    quizState.setCorrectStreak(0);
    quizState.setIncorrectStreak(0);
    
    // Initialize with empty topic mastery object
    const initialTopicMastery: Record<string, number> = {};
    availableQuestions.forEach(q => {
      if (q.topic && !initialTopicMastery[q.topic]) {
        initialTopicMastery[q.topic] = 0.5; // Start at 50% mastery
      }
    });
    quizState.setTopicMastery(initialTopicMastery);

    // Set first question
    const firstQuestionIndex = selectNextQuestion();
    if (firstQuestionIndex >= 0) {
      quizState.setCurrentQuestion(availableQuestions[firstQuestionIndex]);
      quizState.setCurrentIndex(firstQuestionIndex);
      
      // Set timer for question start time
      setStartTime(Date.now());
      
      // Show quiz start toast
      toast({
        title: "Quiz started",
        description: `Difficulty: ${getDifficultyLabel(quizState.currentDifficulty)}`,
        action: <ToastAction altText="OK">OK</ToastAction>,
      });
    } else {
      toast({
        title: "Error starting quiz",
        description: "Could not select first question.",
        variant: "destructive",
      });
    }
  }, [availableQuestions, quizState, selectNextQuestion, toast, setStartTime]);
  
  // Helper function to get difficulty label
  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty === 1) return 'Easy';
    if (difficulty === 2) return 'Medium';
    return 'Hard';
  };

  // End the quiz and calculate results
  const endQuiz = useCallback(() => {
    const results = {
      questionsAttempted: quizState.answeredQuestions.length,
      correctAnswers: quizState.answeredQuestions.filter(q => q.isCorrect).length,
      incorrectAnswers: quizState.answeredQuestions.filter(q => !q.isCorrect).length,
      skippedQuestions: 0,
      performanceByTopic: {} as Record<string, { correct: number; total: number }>,
      performanceByDifficulty: {} as Record<string, { correct: number; total: number }>,
      timeSpent: 0,
      averageConfidence: 0,
      masteryLevel: 0
    };
    
    // Reset active quiz state
    quizState.setActiveQuiz(false);
    quizState.setQuizResults(results);
    quizState.setCurrentQuestion(null);
    quizState.setSelectedAnswer("");
    quizState.setIsAnswerSubmitted(false);
    quizState.setIsCorrect(null);
    
    // Clear timer
    setStartTime(null);
    
    // After quiz ends, update topic mastery in state
    const topicMastery = { ...quizState.topicMastery };
    
    // Update mastery for topics based on performance
    quizState.answeredQuestions.forEach(q => {
      const question = availableQuestions.find(aq => aq.id === q.id);
      if (question && question.topic) {
        const topic = question.topic;
        // Initialize topic if not present
        if (topicMastery[topic] === undefined) {
          topicMastery[topic] = 0.5; // Start at 50% mastery
        }
        
        // Adjust mastery based on answer correctness
        const adjustmentFactor = q.isCorrect ? 0.1 : -0.05;
        topicMastery[topic] = Math.min(Math.max(topicMastery[topic] + adjustmentFactor, 0), 1);
      }
    });
    
    // Update topic mastery
    quizState.setTopicMastery(topicMastery);
    
  }, [quizState, availableQuestions, setStartTime]);

  return { startQuiz, endQuiz };
}
