
import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { calculateFlashcardRetention } from '@/services/spacedRepetition';

/**
 * Hook for calculating retention statistics
 */
export const useRetentionStats = (
  reviewComplete: boolean,
  setRetentionStats: (stats: { overall: number; improved: number }) => void
) => {
  const { user } = useAuth();

  // Get retention stats when review is complete
  useEffect(() => {
    const getRetentionStats = async () => {
      if (!user || !reviewComplete) return;
      
      try {
        const { overallRetention } = await calculateFlashcardRetention(user.id);
        setRetentionStats({
          overall: Math.round(overallRetention * 100),
          improved: Math.round(Math.random() * 15) + 5 // Placeholder - would calculate actual improvement
        });
      } catch (err) {
        console.error('Error getting retention stats:', err);
      }
    };
    
    getRetentionStats();
  }, [user, reviewComplete, setRetentionStats]);
};
