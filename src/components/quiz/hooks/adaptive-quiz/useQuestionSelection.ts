
import { useState, useCallback } from 'react';
import { QuizQuestion } from '../../types';
import { QuizStateWithSetters } from './types';

export function useQuestionSelection(quizState: QuizStateWithSetters) {
  const { 
    currentDifficulty, 
    answeredQuestions, 
    setCurrentQuestion
  } = quizState;
  
  const [questionPool, setQuestionPool] = useState<QuizQuestion[]>([]);
  
  // Set the initial question pool
  const initializeQuestionPool = useCallback((availableQuestions: QuizQuestion[]) => {
    setQuestionPool(availableQuestions);
  }, []);

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

  return {
    questionPool,
    initializeQuestionPool,
    selectNextQuestion
  };
}
