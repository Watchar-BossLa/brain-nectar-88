
import { useState, useEffect } from 'react';
import { FlashcardLearningStats } from '@/services/spacedRepetition/reviewTypes';
import { getFlashcardStats } from '@/services/spacedRepetition';
import { useAuth } from '@/context/auth';

export const useFlashcardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<FlashcardLearningStats & { averageDifficulty: number }>({
    totalCards: 0,
    masteredCards: 0,
    dueCards: 0,
    reviewsToday: 0,
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
      const { data, error } = await getFlashcardStats(user.id);
      if (error) throw error;

      // Add averageDifficulty if it doesn't exist in the data
      setStats({
        totalCards: data.totalCards || 0,
        masteredCards: data.masteredCards || 0,
        dueCards: data.dueCards || 0,
        reviewsToday: data.reviewsToday || 0,
        averageDifficulty: data.averageDifficulty || 0
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
