
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/components/ui/use-toast';
import { getFlashcardLearningStats } from '@/services/flashcards/flashcardLearningStatsStub';

interface FlashcardStats {
  totalCards: number;
  masteredCards: number;
  dueCards: number;
  averageDifficulty: number;
  reviewsToday: number;
}

export const useFlashcardsStats = () => {
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
      const { data, error } = await getFlashcardLearningStats(user.id);
      
      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        // Process data to calculate stats
        const totalCards = data.length;
        const masteredCards = data.filter(card => (card.mastery_level || 0) >= 0.8).length;
        const now = new Date();
        const dueCards = data.filter(card => {
          const nextReview = card.next_review_at ? new Date(card.next_review_at) : null;
          return nextReview && nextReview <= now;
        }).length;
        
        const totalDifficulty = data.reduce((sum, card) => sum + (card.easiness_factor || 2.5), 0);
        const averageDifficulty = totalCards > 0 ? totalDifficulty / totalCards : 0;
        
        const today = new Date().toISOString().split('T')[0];
        const reviewsToday = data.filter(card => {
          const lastReview = card.last_reviewed_at ? new Date(card.last_reviewed_at) : null;
          return lastReview && lastReview.toISOString().split('T')[0] === today;
        }).length;
        
        setStats({
          totalCards,
          masteredCards,
          dueCards,
          averageDifficulty,
          reviewsToday
        });
      }
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
    if (user) {
      fetchStats();
    }
  }, [user]);

  return { stats, loading, fetchStats };
};
