
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { spacedRepetitionService } from '@/services/flashcards/spacedRepetitionService';

/**
 * Hook for retrieving flashcard statistics
 */
export const useFlashcardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCards: 0,
    masteredCards: 0,
    dueCards: 0,
    averageDifficulty: 0,
    reviewsToday: 0
  });

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);
  
  const fetchStats = async () => {
    if (!user) return;
    
    try {
      const flashcardStats = await spacedRepetitionService.getFlashcardStats(user.id);
      setStats(flashcardStats);
    } catch (error) {
      console.error('Error fetching flashcard stats:', error);
    }
  };

  return {
    stats,
    fetchStats
  };
};
