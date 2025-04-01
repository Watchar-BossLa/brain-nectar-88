
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { getFlashcardLearningStats } from '@/services/spacedRepetition';
import { useToast } from '@/components/ui/use-toast';
import { LearningStats } from './types';

export const useProfileStats = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [learningStats, setLearningStats] = useState<LearningStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const stats = await getFlashcardLearningStats(user.id);
        
        // Convert the stats to match our LearningStats interface
        const convertedStats: LearningStats = {
          totalReviews: stats.data?.reviewsToday || 0,
          retentionRate: stats.data?.retentionRate || 0,
          masteredCardCount: stats.data?.masteredCards || 0,
          averageEaseFactor: stats.data?.averageDifficulty || 0,
          learningEfficiency: stats.data?.averageRetention ? stats.data.averageRetention / 100 : 0,
          recommendedDailyReviews: stats.data?.learningCards || 10
        };
        
        setLearningStats(convertedStats);
      } catch (err) {
        console.error('Error fetching learning stats:', err);
        toast({
          title: 'Error',
          description: 'Could not load your learning statistics',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [user, toast]);

  return { isLoading, learningStats };
};
