
import { supabase } from '@/integrations/supabase/client';

/**
 * FlashcardScheduler
 * 
 * Handles the integration between the MCP and the spaced repetition system
 */
export class FlashcardScheduler {
  /**
   * Generate study recommendations for flashcards
   */
  public async generateStudyRecommendations(userId: string): Promise<{
    optimalStudyTime: string;
    recommendedTopics: string[];
    recommendedCardCount: number;
  }> {
    try {
      // Get user's cognitive profile
      // In a real implementation, we would use the cognitive profile 
      // to determine optimal study times and approaches
      
      // Get due flashcards
      const now = new Date().toISOString();
      const { data: dueCards, error: dueError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId)
        .lte('next_review_date', now);
        
      if (dueError) {
        console.error('Error fetching due cards:', dueError);
        throw dueError;
      }
      
      // Get topic distribution of due cards
      const topicCounts: Record<string, number> = {};
      dueCards?.forEach(card => {
        if (card.topic_id) {
          topicCounts[card.topic_id] = (topicCounts[card.topic_id] || 0) + 1;
        }
      });
      
      // Get topic names for the most frequent topics
      const topTopicIds = Object.entries(topicCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([topicId]) => topicId);
        
      const { data: topicData, error: topicError } = await supabase
        .from('topics')
        .select('id, title')
        .in('id', topTopicIds);
        
      if (topicError) {
        console.error('Error fetching topics:', topicError);
      }
      
      // Map topic IDs to names
      const topicNameMap = (topicData || []).reduce((map, topic) => {
        map[topic.id] = topic.title;
        return map;
      }, {} as Record<string, string>);
      
      const recommendedTopics = topTopicIds.map(id => topicNameMap[id] || 'Unnamed Topic');
      
      // Determine optimal study time based on time of day
      // In a real implementation, this would be personalized based on the user's study history
      const hour = new Date().getHours();
      let optimalStudyTime: string;
      
      if (hour >= 5 && hour < 9) {
        optimalStudyTime = "Morning";
      } else if (hour >= 9 && hour < 12) {
        optimalStudyTime = "Mid-morning";
      } else if (hour >= 12 && hour < 15) {
        optimalStudyTime = "Early afternoon";
      } else if (hour >= 15 && hour < 18) {
        optimalStudyTime = "Late afternoon";
      } else if (hour >= 18 && hour < 21) {
        optimalStudyTime = "Evening";
      } else {
        optimalStudyTime = "Night";
      }
      
      // Calculate recommended card count based on due cards
      // In a real implementation, this would consider the user's cognitive load
      // and previous performance
      const recommendedCardCount = Math.min(
        Math.max(10, Math.ceil(dueCards?.length || 0 * 0.7)),
        20
      );
      
      return {
        optimalStudyTime,
        recommendedTopics,
        recommendedCardCount
      };
    } catch (error) {
      console.error('Error generating study recommendations:', error);
      return {
        optimalStudyTime: 'Afternoon',
        recommendedTopics: [],
        recommendedCardCount: 10
      };
    }
  }
  
  /**
   * Get flashcard statistics for user
   */
  public async getFlashcardStatistics(userId: string): Promise<{
    totalCards: number;
    masteryRate: number;
    averageReviewInterval: number;
    topicDistribution: Record<string, number>;
  }> {
    try {
      // Get total cards
      const { count: totalCards, error: countError } = await supabase
        .from('flashcards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
        
      if (countError) {
        throw countError;
      }
      
      // Get mastered cards (repetition_count >= 5)
      const { count: masteredCards, error: masteredError } = await supabase
        .from('flashcards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('repetition_count', 5);
        
      if (masteredError) {
        throw masteredError;
      }
      
      // Calculate mastery rate
      const masteryRate = totalCards ? (masteredCards || 0) / totalCards : 0;
      
      // Get cards with topic IDs for topic distribution
      const { data: cardsWithTopics, error: topicsError } = await supabase
        .from('flashcards')
        .select('topic_id')
        .eq('user_id', userId)
        .not('topic_id', 'is', null);
        
      if (topicsError) {
        throw topicsError;
      }
      
      // Calculate topic distribution
      const topicDistribution: Record<string, number> = {};
      cardsWithTopics?.forEach(card => {
        if (card.topic_id) {
          topicDistribution[card.topic_id] = (topicDistribution[card.topic_id] || 0) + 1;
        }
      });
      
      // Calculate average review interval (simplified)
      // In a real implementation, we would look at actual review history
      const averageReviewInterval = 3.5; // Placeholder
      
      return {
        totalCards: totalCards || 0,
        masteryRate,
        averageReviewInterval,
        topicDistribution
      };
    } catch (error) {
      console.error('Error getting flashcard statistics:', error);
      return {
        totalCards: 0,
        masteryRate: 0,
        averageReviewInterval: 0,
        topicDistribution: {}
      };
    }
  }
}

export const flashcardScheduler = new FlashcardScheduler();
