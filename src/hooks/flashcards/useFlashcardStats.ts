
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { getFlashcardStats } from '@/services/spacedRepetition/flashcardStats';

export const useFlashcardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCount: 0,
    reviewedCount: 0,
    masteredCount: 0,
    dueTodayCount: 0,
    averageRetention: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const flashcardStats = await getFlashcardStats(user?.id);
      setStats(flashcardStats);
    } catch (error) {
      console.error('Error loading flashcard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    refreshStats: loadStats
  };
};
