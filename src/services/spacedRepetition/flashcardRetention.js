
/**
 * Calculate and analyze flashcard retention patterns
 */
import { supabase } from '@/integrations/supabase/client';
import { calculateRetention } from './algorithm';

/**
 * @typedef {Object} FlashcardRetentionItem
 * @property {string} id - Flashcard ID
 * @property {number} retention - Current estimated retention (0-1)
 * @property {number} daysSinceReview - Days since last review
 * @property {string} topic_id - Topic ID
 * @property {string} front_content - Front content
 */

/**
 * @typedef {Object} FlashcardRetentionResult
 * @property {FlashcardRetentionItem[]} items - Individual flashcard retention data
 * @property {number} averageRetention - Average retention across all cards
 * @property {Object.<string, number>} retentionByTopic - Average retention by topic
 * @property {number} lowestRetention - Lowest retention value
 */

/**
 * Calculate current retention estimates for a user's flashcards
 * 
 * @param {string} userId - User ID
 * @param {string} [topicId] - Optional topic ID filter
 * @returns {Promise<FlashcardRetentionResult>} Retention results
 */
export const calculateFlashcardRetention = async (userId, topicId = null) => {
  try {
    // Query to get all relevant flashcards
    let query = supabase
      .from('flashcards')
      .select(`
        id, 
        front_content, 
        back_content, 
        topic_id, 
        repetition_count,
        easiness_factor, 
        last_reviewed_at, 
        created_at
      `)
      .eq('user_id', userId);
      
    if (topicId) {
      query = query.eq('topic_id', topicId);
    }
    
    const { data: flashcards, error } = await query;
    
    if (error) {
      console.error('Error fetching flashcards for retention calculation:', error);
      return {
        items: [],
        averageRetention: 0,
        retentionByTopic: {},
        lowestRetention: 0
      };
    }
    
    const now = new Date();
    const retentionItems = [];
    const topicRetentions = {};
    let totalRetention = 0;
    let lowestRetention = 1;
    
    // Calculate retention for each flashcard
    for (const card of flashcards) {
      const lastReviewDate = card.last_reviewed_at ? 
        new Date(card.last_reviewed_at) : 
        new Date(card.created_at);
        
      const daysSinceReview = Math.max(1, 
        Math.floor((now - lastReviewDate) / (1000 * 60 * 60 * 24))
      );
      
      const memoryStrength = (card.repetition_count || 0) * (card.easiness_factor || 2.5);
      const retention = calculateRetention(daysSinceReview, memoryStrength);
      
      retentionItems.push({
        id: card.id,
        retention,
        daysSinceReview,
        topic_id: card.topic_id,
        front_content: card.front_content
      });
      
      // Track by topic
      if (card.topic_id) {
        if (!topicRetentions[card.topic_id]) {
          topicRetentions[card.topic_id] = {
            sum: 0,
            count: 0
          };
        }
        
        topicRetentions[card.topic_id].sum += retention;
        topicRetentions[card.topic_id].count += 1;
      }
      
      totalRetention += retention;
      if (retention < lowestRetention) {
        lowestRetention = retention;
      }
    }
    
    // Calculate averages by topic
    const retentionByTopic = {};
    for (const [topicId, data] of Object.entries(topicRetentions)) {
      retentionByTopic[topicId] = data.sum / data.count;
    }
    
    // Calculate overall average
    const averageRetention = flashcards.length > 0 ? 
      totalRetention / flashcards.length : 0;
    
    return {
      items: retentionItems,
      averageRetention,
      retentionByTopic,
      lowestRetention
    };
  } catch (error) {
    console.error('Error calculating flashcard retention:', error);
    return {
      items: [],
      averageRetention: 0,
      retentionByTopic: {},
      lowestRetention: 0
    };
  }
};
