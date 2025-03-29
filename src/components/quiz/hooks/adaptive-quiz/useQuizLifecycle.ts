
import { useCallback } from 'react';
import { QuizQuestion } from '../../types';
import { Toast } from '@/components/ui/use-toast';
import { QuizStateWithSetters } from './types';

export function useQuizLifecycle(
  quizState: QuizStateWithSetters,
  availableQuestions: QuizQuestion[],
  selectNextQuestion: () => QuizQuestion | null,
  toast: { toast: Toast },
  setStartTime: React.Dispatch<React.SetStateAction<number | null>>
) {
  const {
    setActiveQuiz,
    setCurrentIndex,
    setCurrentQuestion,
    setAnsweredQuestions,
    setIsAnswerSubmitted,
    setSelectedAnswer,
    setIsCorrect,
    setQuizResults,
  } = quizState;

  // Start new quiz
  const startQuiz = useCallback(() => {
    if (availableQuestions.length === 0) {
      toast.toast({
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
    } else {
      toast.toast({
        title: "Failed to start quiz",
        description: "Could not find appropriate questions",
        variant: "destructive",
      });
    }
  }, [
    availableQuestions, 
    selectNextQuestion, 
    toast, 
    setCurrentQuestion, 
    setCurrentIndex, 
    setAnsweredQuestions, 
    setIsAnswerSubmitted, 
    setSelectedAnswer, 
    setIsCorrect, 
    setActiveQuiz, 
    setQuizResults,
    setStartTime
  ]);

  return { startQuiz };
}
