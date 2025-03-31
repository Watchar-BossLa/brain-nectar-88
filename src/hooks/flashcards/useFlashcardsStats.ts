
import { useState } from 'react';
import { FlashcardLearningStats } from '@/hooks/useFlashcardsPage';

export const useFlashcardsStats = (flashcards: any[], dueFlashcards: any[]) => {
  const [stats, setStats] = useState<FlashcardLearningStats>({
    totalCards: 0,
    masteredCards: 0,
    dueCards: 0,
    averageDifficulty: 0,
    reviewsToday: 0
  });

  const calculateStats = () => {
    const masteredCount = flashcards.filter(card => card.mastery_level && card.mastery_level >= 0.9).length;
    const avgDifficulty = flashcards.reduce((sum, card) => sum + (card.difficulty || 0), 0) / 
                      (flashcards.length || 1);
    
    const today = new Date().toISOString().split('T')[0];
    const reviewsToday = flashcards.filter(card => 
      card.last_reviewed_at && card.last_reviewed_at.startsWith(today)
    ).length;
    
    const newStats: FlashcardLearningStats = {
      totalCards: flashcards.length,
      masteredCards: masteredCount,
      dueCards: dueFlashcards.length,
      averageDifficulty: Number(avgDifficulty.toFixed(2)),
      reviewsToday,
      learningCards: flashcards.filter(card => 
        card.mastery_level && card.mastery_level > 0 && card.mastery_level < 0.9
      ).length,
      newCards: flashcards.filter(card => 
        !card.mastery_level || card.mastery_level === 0
      ).length,
      reviewedToday: reviewsToday,
      averageRetention: 0.85,
      streakDays: 1,
      totalReviews: flashcards.reduce((sum, card) => sum + (card.repetition_count || 0), 0),
      averageEaseFactor: flashcards.reduce((sum, card) => sum + (card.easiness_factor || 2.5), 0) / 
                        (flashcards.length || 1),
      retentionRate: 0.85,
      strugglingCardCount: flashcards.filter(card => 
        card.difficulty && card.difficulty >= 3
      ).length,
      learningEfficiency: 0.75,
      recommendedDailyReviews: Math.min(20, Math.ceil(dueFlashcards.length * 1.2))
    };
    
    setStats(newStats);
    return newStats;
  };

  return {
    stats,
    calculateStats
  };
};
