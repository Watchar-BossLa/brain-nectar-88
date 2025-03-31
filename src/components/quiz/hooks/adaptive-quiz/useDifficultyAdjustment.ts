
import { useCallback, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { QuizStateWithSetters } from './types';

export function useDifficultyAdjustment(state: QuizStateWithSetters) {
  const { toast } = useToast();
  const { 
    currentDifficulty, 
    setCurrentDifficulty,
    userConfidence,
    answeredQuestions,
    questionPool
  } = state;
  
  // Track streaks for more dynamic difficulty adjustment
  const [correctStreak, setCorrectStreak] = useState(0);
  const [incorrectStreak, setIncorrectStreak] = useState(0);
  
  // Add adaptive thresholds that adjust based on user's overall performance
  const [adaptiveThresholds, setAdaptiveThresholds] = useState({
    increaseDifficulty: 0.7, // Default: Increase difficulty when accuracy is above 70%
    decreaseDifficulty: 0.4, // Default: Decrease difficulty when accuracy is below 40%
  });
  
  // Calculate recent performance (last 5 questions)
  const getRecentPerformance = useCallback(() => {
    if (answeredQuestions.length === 0) return 0.5; // Default to medium
    
    const recentQuestions = answeredQuestions.slice(-5);
    const correctCount = recentQuestions.filter(q => q.isCorrect).length;
    return correctCount / recentQuestions.length;
  }, [answeredQuestions]);
  
  // Calculate overall performance (all questions)
  const getOverallPerformance = useCallback(() => {
    if (answeredQuestions.length === 0) return 0.5; // Default to medium
    
    const correctCount = answeredQuestions.filter(q => q.isCorrect).length;
    return correctCount / answeredQuestions.length;
  }, [answeredQuestions]);
  
  // Track performance by difficulty level
  const getPerformanceByDifficulty = useCallback(() => {
    const performance = {
      1: { correct: 0, total: 0 },
      2: { correct: 0, total: 0 },
      3: { correct: 0, total: 0 }
    };
    
    answeredQuestions.forEach(q => {
      if (q.difficulty) {
        const diff = q.difficulty as 1 | 2 | 3;
        performance[diff].total += 1;
        if (q.isCorrect) {
          performance[diff].correct += 1;
        }
      }
    });
    
    return performance;
  }, [answeredQuestions]);

  // Adjust thresholds based on overall performance
  useEffect(() => {
    if (answeredQuestions.length >= 10) {
      const overallAccuracy = getOverallPerformance();
      
      // For high performers, make it harder to increase difficulty
      if (overallAccuracy > 0.8) {
        setAdaptiveThresholds({
          increaseDifficulty: 0.8, // Need 80% accuracy to increase difficulty
          decreaseDifficulty: 0.3, // More lenient on decreasing
        });
      } 
      // For struggling users, make it easier to decrease difficulty
      else if (overallAccuracy < 0.5) {
        setAdaptiveThresholds({
          increaseDifficulty: 0.65, // Easier to increase difficulty
          decreaseDifficulty: 0.45, // Higher threshold to decrease (avoid oscillation)
        });
      }
      // Reset to defaults for average performers
      else {
        setAdaptiveThresholds({
          increaseDifficulty: 0.7,
          decreaseDifficulty: 0.4,
        });
      }
    }
  }, [answeredQuestions.length, getOverallPerformance]);

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
    
    // Calculate base adjustment factors
    // Higher confidence = larger adjustments
    const confidenceFactor = userConfidence || 0.5;
    
    // Get recent performance metrics
    const recentPerformance = getRecentPerformance();
    const performanceByDifficulty = getPerformanceByDifficulty();
    
    // Calculate performance at current difficulty level
    const currentLevelPerformance = performanceByDifficulty[currentDifficulty];
    const currentLevelAccuracy = currentLevelPerformance.total > 0 
      ? currentLevelPerformance.correct / currentLevelPerformance.total 
      : 0.5;
      
    // DECISION: INCREASE DIFFICULTY
    if (isCorrect) {
      // Check if we should increase difficulty based on multiple factors:
      // 1. Recent performance is good
      // 2. Currently on a correct streak
      // 3. Current difficulty level performance is good
      const shouldIncreaseDifficulty = 
        (recentPerformance >= adaptiveThresholds.increaseDifficulty && correctStreak >= 3) || 
        (correctStreak >= 5) || 
        (currentLevelAccuracy >= 0.85 && currentLevelPerformance.total >= 5);
      
      // Only increase if not already at max difficulty
      if (shouldIncreaseDifficulty && currentDifficulty < 3) {
        // Calculate new difficulty
        const newDifficultyValue = currentDifficulty + 1 as 1 | 2 | 3;
        setCurrentDifficulty(newDifficultyValue);
        
        // Notify user with relevant message
        toast({
          title: "Difficulty increased",
          description: correctStreak >= 5 
            ? "Outstanding streak! Questions will now be more challenging."
            : "Great progress! The difficulty has been increased to match your skills.",
          duration: 3000,
        });
      }
    } 
    // DECISION: DECREASE DIFFICULTY
    else {
      // Check if we should decrease difficulty based on:
      // 1. Recent performance is poor
      // 2. Currently on an incorrect streak
      // 3. Current difficulty level performance is poor
      const shouldDecreaseDifficulty = 
        (recentPerformance <= adaptiveThresholds.decreaseDifficulty && incorrectStreak >= 2) || 
        (incorrectStreak >= 4) || 
        (currentLevelAccuracy <= 0.3 && currentLevelPerformance.total >= 4);
      
      // Only decrease if not already at min difficulty
      if (shouldDecreaseDifficulty && currentDifficulty > 1) {
        // Calculate new difficulty
        const newDifficultyValue = currentDifficulty - 1 as 1 | 2 | 3;
        setCurrentDifficulty(newDifficultyValue);
        
        // Notify user with supportive message
        toast({
          title: "Difficulty adjusted",
          description: incorrectStreak >= 4
            ? "Don't worry! We've adjusted the questions to better match your current level."
            : "Questions will now be more appropriate for building your knowledge.",
          duration: 3000,
        });
      }
    }
    
    // Return useful data for any components that need it
    return {
      recentPerformance,
      correctStreak,
      incorrectStreak,
      newDifficulty: currentDifficulty
    };
  }, [
    currentDifficulty, 
    setCurrentDifficulty, 
    userConfidence, 
    correctStreak, 
    incorrectStreak, 
    toast, 
    getRecentPerformance,
    getPerformanceByDifficulty,
    adaptiveThresholds
  ]);

  return { 
    updateDifficulty,
    correctStreak,
    incorrectStreak,
    getOverallPerformance,
    getRecentPerformance,
    getPerformanceByDifficulty
  };
}
