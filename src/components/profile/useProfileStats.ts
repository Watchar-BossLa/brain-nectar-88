
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
        setLearningStats(stats);
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
