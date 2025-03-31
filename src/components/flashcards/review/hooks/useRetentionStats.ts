
import { useState, useEffect } from 'react';
import { Flashcard } from '@/hooks/flashcards/types';
import { calculateFlashcardRetention } from '@/services/spacedRepetition';

export const useRetentionStats = (userId: string, flashcards: Flashcard[]) => {
  const [overallRetention, setOverallRetention] = useState<number>(0);
  const [retentionByTopic, setRetentionByTopic] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId || !flashcards.length) {
      setLoading(false);
      return;
    }

    calculateRetentionStats();
  }, [userId, flashcards]);

  const calculateRetentionStats = async () => {
    setLoading(true);
    try {
      // Calculate overall retention
      let totalRetention = 0;
      const topicRetention: Record<string, { total: number; sum: number }> = {};
      
      // Process each flashcard
      flashcards.forEach((card) => {
        const cardRetention = calculateFlashcardRetention(card);
        totalRetention += cardRetention;
        
        // Group by topic if available
        const topicId = card.topic_id || 'unknown';
        if (!topicRetention[topicId]) {
          topicRetention[topicId] = { total: 0, sum: 0 };
        }
        
        topicRetention[topicId].total += 1;
        topicRetention[topicId].sum += cardRetention;
      });
      
      // Calculate average retention
      const avgRetention = flashcards.length > 0 
        ? Math.round(totalRetention / flashcards.length) 
        : 0;
      
      // Calculate retention by topic
      const retentionByTopicResult: Record<string, number> = {};
      Object.entries(topicRetention).forEach(([topicId, data]) => {
        retentionByTopicResult[topicId] = Math.round(data.sum / data.total);
      });
      
      setOverallRetention(avgRetention);
      setRetentionByTopic(retentionByTopicResult);
    } catch (error) {
      console.error('Error calculating retention stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    overallRetention,
    retentionByTopic,
    loading,
    refreshStats: calculateRetentionStats,
  };
};
