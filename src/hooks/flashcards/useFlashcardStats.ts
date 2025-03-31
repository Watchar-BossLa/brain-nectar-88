
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { getFlashcardStats } from '@/services/spacedRepetition';

interface FlashcardStats {
  totalCards: number;
  masteredCards: number;
  dueCards: number;
  averageDifficulty: number;
  reviewsToday: number;
}

export const useFlashcardStats = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<FlashcardStats>({
    totalCards: 0,
    masteredCards: 0,
    dueCards: 0,
    averageDifficulty: 0,
    reviewsToday: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await getFlashcardStats(user.id);
      setStats(data);
    } catch (error) {
      console.error('Error fetching flashcard stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to load flashcard statistics',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user, toast]);

  return { stats, loading, fetchStats };
};
