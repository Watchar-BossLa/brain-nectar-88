
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from "@/components/ui/toast";
import { QuizQuestion, AnsweredQuestion, QuizResults } from '../../types';
import { AdaptiveQuizState, QuizStateWithSetters } from './types';

/**
 * Hook that manages the quiz lifecycle
 */
export const useQuizLifecycle = (
  state: QuizStateWithSetters,
  questions: QuizQuestion[]
): {
  submitAnswer: () => boolean;
  nextQuestion: () => boolean;
  previousQuestion: () => void;
  skipQuestion: () => boolean;
  endQuiz: () => void;
} => {
  const { toast } = useToast();
  const [visitedQuestions, setVisitedQuestions] = useState<number[]>([0]);

  const submitAnswer = (): boolean => {
    const { currentQuestion, selectedAnswer } = state;

    if (!currentQuestion) return false;
    if (!selectedAnswer) {
      toast({
        title: "Please select an answer",
        description: "You need to select an answer before submitting",
        variant: "destructive",
      });
      return false;
    }

    // Check if answer is correct
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    // Create answered question record
    const answeredQuestion: AnsweredQuestion = {
      question: currentQuestion,
      selectedAnswer,
      isCorrect,
      confidence: state.userConfidence,
      difficulty: state.currentDifficulty
    };

    // Update state
    state.setIsAnswerSubmitted(true);
    state.setIsCorrect(isCorrect);
    state.setAnsweredQuestions([...state.answeredQuestions, answeredQuestion]);

    // Show toast based on answer correctness
    if (isCorrect) {
      toast({
        title: "Correct!",
        description: "Great job! Your answer is correct.",
        action: (
          <ToastAction altText="Next question">Next</ToastAction>
        ),
      });
      state.setCorrectStreak(state.correctStreak + 1);
      state.setIncorrectStreak(0);
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was: ${currentQuestion.correctAnswer}`,
        variant: "destructive",
      });
      state.setIncorrectStreak(state.incorrectStreak + 1);
      state.setCorrectStreak(0);
    }

    return true;
  };

  const nextQuestion = (): boolean => {
    // Handle case where there are no questions
    if (questions.length === 0) return false;

    // Check if the quiz should end
    if (state.currentIndex >= questions.length - 1) {
      endQuiz();
      return false;
    }

    // Set up the next question
    const nextIndex = state.currentIndex + 1;
    state.setCurrentIndex(nextIndex);
    state.setCurrentQuestion(questions[nextIndex]);
    state.setSelectedAnswer('');
    state.setIsAnswerSubmitted(false);
    state.setIsCorrect(null);

    // Track that we've visited this question
    if (!visitedQuestions.includes(nextIndex)) {
      setVisitedQuestions([...visitedQuestions, nextIndex]);
    }

    return true;
  };

  const previousQuestion = (): void => {
    if (state.currentIndex > 0) {
      const prevIndex = state.currentIndex - 1;
      state.setCurrentIndex(prevIndex);
      state.setCurrentQuestion(questions[prevIndex]);
      
      // Find if the question was already answered
      const answered = state.answeredQuestions.find(
        aq => aq.question.id === questions[prevIndex].id
      );
      
      if (answered) {
        state.setSelectedAnswer(answered.selectedAnswer);
        state.setIsAnswerSubmitted(true);
        state.setIsCorrect(answered.isCorrect);
      } else {
        state.setSelectedAnswer('');
        state.setIsAnswerSubmitted(false);
        state.setIsCorrect(null);
      }
    }
  };

  const skipQuestion = (): boolean => {
    toast({
      title: "Question Skipped",
      description: "You can come back to this question later."
    });
    
    return nextQuestion();
  };

  const endQuiz = (): void => {
    const totalQuestions = state.answeredQuestions.length;
    const correctAnswers = state.answeredQuestions.filter(q => q.isCorrect).length;
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    // Create results summary
    const results: QuizResults = {
      totalQuestions,
      correctAnswers,
      score,
      timeTaken: 0, // Would be calculated from actual time tracking
      answers: state.answeredQuestions,
      difficulty: state.currentDifficulty
    };
    
    // Set results and end active quiz
    state.setQuizResults(results);
    state.setActiveQuiz(false);
    
    toast({
      title: "Quiz Completed!",
      description: `Your score: ${score}% (${correctAnswers}/${totalQuestions})`,
    });
  };

  return {
    submitAnswer,
    nextQuestion,
    previousQuestion,
    skipQuestion,
    endQuiz
  };
};
