
import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { QuizStateWithSetters } from './types';

export function useDifficultyAdjustment(state: QuizStateWithSetters) {
  const { toast } = useToast();
  const { 
    currentDifficulty, 
    setCurrentDifficulty,
    userConfidence,
    answeredQuestions
  } = state;
  
  // Track streaks for more dynamic difficulty adjustment
  const [correctStreak, setCorrectStreak] = useState(0);
  const [incorrectStreak, setIncorrectStreak] = useState(0);
  
  // Calculate recent performance (last 5 questions)
  const getRecentPerformance = useCallback(() => {
    if (answeredQuestions.length === 0) return 0.5; // Default to medium
    
    const recentQuestions = answeredQuestions.slice(-5);
    const correctCount = recentQuestions.filter(q => q.isCorrect).length;
    return correctCount / recentQuestions.length;
  }, [answeredQuestions]);

  // Adjust difficulty based on user performance and confidence
  const updateDifficulty = useCallback((isCorrect: boolean) => {
    // Update streaks
    if (isCorrect) {
      setCorrectStreak(prev => prev + 1);
      setIncorrectStreak(0);
    } else {
      setIncorrectStreak(prev => prev + 1);
      setCorrectStreak(0);
    }
    
    // Calculate base adjustment amount
    // Higher confidence = larger adjustments
    const confidenceFactor = userConfidence || 0.5;
    let baseAdjustment = 0;
    
    // If correct answer
    if (isCorrect) {
      // Calculate adjustment based on confidence and streaks
      // Higher confidence + correct = larger increase in difficulty
      baseAdjustment = 0.5 + (confidenceFactor * 0.5);
      
      // Boost adjustment for streaks (max 3x for 5+ correct in a row)
      const streakMultiplier = Math.min(1 + (correctStreak * 0.2), 3);
      baseAdjustment *= streakMultiplier;
      
      // Check recent performance - only increase difficulty if generally doing well
      const recentPerformance = getRecentPerformance();
      if (recentPerformance >= 0.6) {
        // Calculate new difficulty - limit to valid levels
        const newDifficultyValue = Math.min(currentDifficulty + 1, 3);
        
        // Only notify and change if actually increasing
        if (newDifficultyValue > currentDifficulty) {
          setCurrentDifficulty(newDifficultyValue as 1 | 2 | 3);
          
          toast({
            title: "Difficulty increased",
            description: correctStreak >= 3 
              ? "Impressive streak! Questions will get more challenging."
              : "Great job! The questions will get more challenging.",
            duration: 3000,
          });
        }
      }
    } 
    // If incorrect answer
    else {
      // Calculate adjustment based on confidence and streaks
      // Higher confidence + incorrect = larger decrease in difficulty
      baseAdjustment = 0.5 + (confidenceFactor * 0.5);
      
      // Larger adjustment for streaks of incorrect answers
      const streakMultiplier = Math.min(1 + (incorrectStreak * 0.3), 3);
      baseAdjustment *= streakMultiplier;
      
      // Check if we need to decrease difficulty
      // High confidence but incorrect answer is a strong signal for decreasing difficulty
      // Also decrease if on an incorrect streak
      if (confidenceFactor > 0.7 || incorrectStreak >= 2) {
        const newDifficultyValue = Math.max(currentDifficulty - 1, 1);
        
        // Only notify and change if actually decreasing
        if (newDifficultyValue < currentDifficulty) {
          setCurrentDifficulty(newDifficultyValue as 1 | 2 | 3);
          
          toast({
            title: "Difficulty adjusted",
            description: incorrectStreak >= 3
              ? "Questions will be adjusted to better match your current knowledge level."
              : "The questions will be more appropriate for your level.",
            duration: 3000,
          });
        }
      }
    }
  }, [currentDifficulty, setCurrentDifficulty, userConfidence, correctStreak, incorrectStreak, toast, getRecentPerformance]);

  return { 
    updateDifficulty,
    correctStreak,
    incorrectStreak
  };
}
