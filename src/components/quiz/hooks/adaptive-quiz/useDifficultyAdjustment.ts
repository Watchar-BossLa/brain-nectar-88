
import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { QuizStateWithSetters } from './types';

export function useDifficultyAdjustment(state: QuizStateWithSetters) {
  const { toast } = useToast();
  const { 
    currentDifficulty, 
    setCurrentDifficulty,
    userConfidence
  } = state;

  // Adjust difficulty based on user performance and confidence
  const updateDifficulty = useCallback((isCorrect: boolean) => {
    // If the answer is correct
    if (isCorrect) {
      // High confidence + correct answer = increase difficulty
      if (userConfidence > 0.7) {
        if (currentDifficulty < 3) {
          const newDifficulty = currentDifficulty + 1 as 1 | 2 | 3;
          setCurrentDifficulty(newDifficulty);
          
          toast({
            title: "Difficulty increased",
            description: "Great job! The questions will get more challenging.",
            duration: 3000,
          });
        }
      }
    } 
    // If the answer is incorrect
    else {
      // High confidence + incorrect answer = significant difficulty decrease
      if (userConfidence > 0.7) {
        if (currentDifficulty > 1) {
          const newDifficulty = Math.max(1, currentDifficulty - 1) as 1 | 2 | 3;
          setCurrentDifficulty(newDifficulty);
          
          toast({
            title: "Difficulty adjusted",
            description: "The questions will be more appropriate for your level.",
            duration: 3000,
          });
        }
      }
      // Low confidence + incorrect answer = slight difficulty decrease
      else if (userConfidence < 0.3 && currentDifficulty > 1) {
        const newDifficulty = Math.max(1, currentDifficulty - 1) as 1 | 2 | 3;
        setCurrentDifficulty(newDifficulty);
      }
    }
  }, [currentDifficulty, setCurrentDifficulty, userConfidence, toast]);

  return { updateDifficulty };
}
