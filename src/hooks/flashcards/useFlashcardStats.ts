
import { useState, useEffect } from 'react';
import { FlashcardLearningStats } from '@/types/flashcard';
import { getFlashcardStats } from '@/services/spacedRepetition';
import { useAuth } from '@/context/auth';

interface ExtendedFlashcardStats extends FlashcardLearningStats {
  averageDifficulty: number;
  newCards: number;
  learningCards: number;
}

export const useFlashcardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ExtendedFlashcardStats>({
    totalCards: 0,
    masteredCards: 0,
    dueCards: 0,
    learningCards: 0,
    newCards: 0,
    reviewsToday: 0,
    averageRetention: 0,
    streakDays: 0,
    averageDifficulty: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const fetchedStats = await getFlashcardStats(user.id);

      // Add averageDifficulty if it doesn't exist in the data
      setStats({
        totalCards: fetchedStats.totalCards || 0,
        masteredCards: fetchedStats.masteredCards || 0,
        dueCards: fetchedStats.dueCards || 0,
        learningCards: 0,
        newCards: 0,
        reviewsToday: fetchedStats.reviewsToday || 0,
        averageRetention: 0,
        streakDays: 0,
        averageDifficulty: fetchedStats.averageDifficulty || 0
      });
    } catch (err) {
      console.error('Error fetching flashcard stats:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  return {
    stats,
    isLoading,
    error,
    refreshStats: fetchStats
  };
};
