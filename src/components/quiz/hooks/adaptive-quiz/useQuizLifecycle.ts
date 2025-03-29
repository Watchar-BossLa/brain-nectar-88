
import { useCallback } from 'react';
import { QuizQuestion, QuizResults } from '../../types';
import { QuizStateWithSetters } from './types';
import { calculateQuizResults } from '../quizUtils';

export function useQuizLifecycle(
  quizState: QuizStateWithSetters,
  availableQuestions: QuizQuestion[],
  selectNextQuestion: () => QuizQuestion | null,
  toast: any,
  setStartTime: (time: number | null) => void
) {
  const { 
    setActiveQuiz,
    setCurrentQuestion,
    setCurrentIndex,
    setSelectedAnswer,
    setIsAnswerSubmitted,
    setIsCorrect,
    setQuizResults,
    setAnsweredQuestions,
    answeredQuestions,
    setTopicMastery
  } = quizState;

  const startQuiz = useCallback(() => {
    // Reset quiz state
    setActiveQuiz(true);
    setCurrentIndex(0);
    setSelectedAnswer('');
    setIsAnswerSubmitted(false);
    setIsCorrect(null);
    setQuizResults(null);
    setAnsweredQuestions([]);
    
    // Select first question and set the start time
    const firstQuestion = selectNextQuestion();
    setCurrentQuestion(firstQuestion);
    setStartTime(Date.now());
    
    // Initialize topic mastery from question pool
    const topicMap: Record<string, number> = {};
    availableQuestions.forEach(q => {
      if (q.topic && !topicMap[q.topic]) {
        topicMap[q.topic] = 0.5; // Start at 50% mastery
      }
    });
    setTopicMastery(topicMap);
    
    // Notify user
    toast({
      title: 'Quiz Started',
      description: 'Good luck! The questions will adapt to your skill level.',
      duration: 3000
    });
  }, [
    setActiveQuiz, 
    setCurrentQuestion,
    setCurrentIndex,
    setSelectedAnswer, 
    setIsAnswerSubmitted, 
    setIsCorrect,
    setQuizResults,
    setAnsweredQuestions,
    selectNextQuestion,
    setStartTime,
    availableQuestions,
    setTopicMastery,
    toast
  ]);
  
  const endQuiz = useCallback(() => {
    setActiveQuiz(false);
    
    // Calculate results
    if (answeredQuestions.length > 0) {
      const results = calculateQuizResults(answeredQuestions);
      setQuizResults(results);
      
      // Update topic mastery based on results
      if (results.performanceByTopic) {
        setTopicMastery(prev => {
          const newMastery = { ...prev };
          
          Object.entries(results.performanceByTopic).forEach(([topic, { correct, total }]) => {
            if (total > 0) {
              const performance = correct / total;
              // Update with weighted average (25% new results, 75% previous mastery)
              newMastery[topic] = prev[topic] 
                ? (prev[topic] * 0.75) + (performance * 0.25)
                : performance;
            }
          });
          
          return newMastery;
        });
      }
    }
  }, [answeredQuestions, setActiveQuiz, setQuizResults, setTopicMastery]);

  return {
    startQuiz,
    endQuiz
  };
}
