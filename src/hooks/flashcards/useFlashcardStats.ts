
import { useState } from 'react';
import { Flashcard, FlashcardLearningStats } from './useFlashcardTypes';

export function useFlashcardStats() {
  const [stats, setStats] = useState<FlashcardLearningStats>({
    totalCards: 0,
    masteredCards: 0,
    dueCards: 0,
    averageDifficulty: 0,
    reviewsToday: 0
  });

  const calculateStats = (flashcards: Flashcard[], dueFlashcards: Flashcard[]): FlashcardLearningStats => {
    // Calculate stats
    const masteredCount = flashcards.filter(card => card.masteryLevel && card.masteryLevel >= 0.9).length;
    const avgDifficulty = flashcards.reduce((sum, card) => sum + (card.difficulty || 0), 0) / 
                        (flashcards.length || 1);
    
    // Count reviews done today
    const today = new Date().toISOString().split('T')[0];
    const reviewsToday = flashcards.filter(card => 
      card.lastReviewedAt && card.lastReviewedAt.startsWith(today)
    ).length;
    
    const newStats: FlashcardLearningStats = {
      totalCards: flashcards.length,
      masteredCards: masteredCount,
      dueCards: dueFlashcards.length,
      averageDifficulty: Number(avgDifficulty.toFixed(2)),
      reviewsToday,
      // Set extended stats with default values
      learningCards: flashcards.filter(card => 
        card.masteryLevel && card.masteryLevel > 0 && card.masteryLevel < 0.9
      ).length,
      newCards: flashcards.filter(card => 
        !card.masteryLevel || card.masteryLevel === 0
      ).length,
      reviewedToday: reviewsToday,
      averageRetention: 0.85, // Default placeholder
      streakDays: 1, // Default placeholder
      totalReviews: flashcards.reduce((sum, card) => sum + (card.repetitionCount || 0), 0),
      averageEaseFactor: flashcards.reduce((sum, card) => sum + (card.easinessFactor || 2.5), 0) / 
                        (flashcards.length || 1),
      retentionRate: 0.85, // Default placeholder
      strugglingCardCount: flashcards.filter(card => 
        card.difficulty && card.difficulty >= 3
      ).length,
      learningEfficiency: 0.75, // Default placeholder
      recommendedDailyReviews: Math.min(20, Math.ceil(dueFlashcards.length * 1.2)) // Simple formula
    };
    
    return newStats;
  };

  const updateStats = (flashcards: Flashcard[], dueFlashcards: Flashcard[]) => {
    const newStats = calculateStats(flashcards, dueFlashcards);
    setStats(newStats);
    return newStats;
  };

  return {
    stats,
    updateStats
  };
}
