
import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { QuizStateWithSetters } from './types';

export function useDifficultyAdjustment(state: QuizStateWithSetters) {
  const { toast } = useToast();
  const { 
    currentDifficulty, 
    setCurrentDifficulty, 
    userConfidence 
  } = state;
  
  // Track consecutive correct/incorrect answers
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveIncorrect, setConsecutiveIncorrect] = useState(0);

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
    
  }, [consecutiveCorrect, consecutiveIncorrect, currentDifficulty, userConfidence, toast, setCurrentDifficulty]);

  return { updateDifficulty };
}
