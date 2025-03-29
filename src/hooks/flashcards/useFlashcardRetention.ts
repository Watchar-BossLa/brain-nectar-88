
import { useState } from 'react';
import { calculateFlashcardRetention } from '@/hooks/useFlashcards';

/**
 * Hook for calculating flashcard retention metrics
 */
export const useFlashcardRetention = () => {
  const [retentionData, setRetentionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateRetention = async (userId: string, options = {}) => {
    try {
      setIsLoading(true);
      const result = await calculateFlashcardRetention(userId, options);
      setRetentionData(result.data);
      return result;
    } catch (error) {
      console.error('Error calculating retention:', error);
      return {
        success: false,
        error: 'Failed to calculate retention metrics',
        data: null
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    retentionData,
    calculateRetention,
    isLoading
  };
};
