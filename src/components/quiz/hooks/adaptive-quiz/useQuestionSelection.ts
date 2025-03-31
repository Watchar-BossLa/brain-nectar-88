
import { useCallback, useState } from 'react';
import { QuizQuestion } from '../../types';
import { QuizStateWithSetters, QuestionSelectionState } from './types';

export function useQuestionSelection(quizState: QuizStateWithSetters): QuestionSelectionState {
  const {
    currentDifficulty,
    questionPool,
    setQuestionPool,
    answeredQuestions
  } = quizState;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const initializeQuestionPool = useCallback((questions: QuizQuestion[]) => {
    const filteredQuestions = [...questions];
    // Shuffle questions
    const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
    setQuestionPool && setQuestionPool(shuffled);
  }, [setQuestionPool]);
  
  const selectNextQuestion = useCallback((): QuizQuestion | null => {
    if (!questionPool || questionPool.length === 0) return null;
    
    // Get already answered question IDs
    const answeredIds = answeredQuestions.map(q => q.id);
    
    // Filter questions close to current difficulty level and not answered yet
    const availableQuestions = questionPool.filter(
      q => !answeredIds.includes(q.id)
    );
    
    if (availableQuestions.length === 0) return null;
    
    // Sort by how close they are to the current difficulty
    availableQuestions.sort((a, b) => {
      return Math.abs(a.difficulty - currentDifficulty) - 
             Math.abs(b.difficulty - currentDifficulty);
    });
    
    // Take one of the top 3 questions randomly to add variety
    const topN = Math.min(3, availableQuestions.length);
    const selectedIndex = Math.floor(Math.random() * topN);
    
    setCurrentIndex(questionPool.findIndex(q => q.id === availableQuestions[selectedIndex].id));
    
    return availableQuestions[selectedIndex];
  }, [questionPool, answeredQuestions, currentDifficulty]);
  
  const getCurrentQuestionIndex = useCallback(() => {
    return currentIndex;
  }, [currentIndex]);
  
  return {
    initializeQuestionPool,
    selectNextQuestion,
    getCurrentQuestionIndex
  };
}
