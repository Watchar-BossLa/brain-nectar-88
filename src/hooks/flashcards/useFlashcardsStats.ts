
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/auth';
import { getFlashcardStats } from '@/services/spacedRepetition';

export function useFlashcardsStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCards: 0,
    masteredCards: 0,
    dueCards: 0,
    averageDifficulty: 0,
    reviewsToday: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await getFlashcardStats(user.id);
      
      if (error) {
        console.error('Error fetching flashcard stats:', error);
        return;
      }
      
      if (data) {
        setStats({
          totalCards: data.totalCards || 0,
          masteredCards: data.masteredCards || 0,
          dueCards: data.dueCards || 0,
          averageDifficulty: data.averageDifficulty || 0,
          reviewsToday: data.reviewsToday || 0
        });
      }
    } catch (error) {
      console.error('Error in fetchStats:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    stats,
    fetchStats,
    loading
  };
}
