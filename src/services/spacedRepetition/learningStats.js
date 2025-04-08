
/**
 * Service for tracking and analyzing flashcard learning stats
 */
import { supabase } from '@/integrations/supabase/client';

/**
 * @typedef {Object} FlashcardLearningStats
 * @property {number} totalCards - Total number of flashcards
 * @property {number} masteredCards - Cards with mastery level > 0.8
 * @property {number} dueCards - Cards due for review
 * @property {number} averageDifficulty - Average difficulty across all cards
 * @property {number} reviewsToday - Number of reviews today
 * @property {number} averageRetention - Average retention rate
 * @property {Object.<string, number>} masteryByTopic - Mastery levels by topic
 */

/**
 * Get comprehensive flashcard learning statistics for a user
 * 
 * @param {string} userId - User ID
 * @returns {Promise<FlashcardLearningStats>} Learning statistics
 */
export const getFlashcardLearningStats = async (userId) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    
    // Get all flashcards
    const { data: flashcards, error: cardsError } = await supabase
      .from('flashcards')
      .select(`
        id,
        topic_id,
        difficulty,
        mastery_level,
        next_review_date
      `)
      .eq('user_id', userId);
      
    if (cardsError) {
      console.error('Error getting flashcards for stats:', cardsError);
      return {
        totalCards: 0,
        masteredCards: 0,
        dueCards: 0,
        averageDifficulty: 0,
        reviewsToday: 0,
        averageRetention: 0,
        masteryByTopic: {}
      };
    }
    
    // Get reviews from today
    const { count: reviewsToday, error: reviewsError } = await supabase
      .from('flashcard_reviews')
      .select('id', { count: true })
      .eq('user_id', userId)
      .gte('reviewed_at', todayStart);
      
    if (reviewsError) {
      console.error('Error getting review count:', reviewsError);
    }
    
    // Calculate statistics
    let totalDifficulty = 0;
    let masteredCount = 0;
    let dueCount = 0;
    let totalRetention = 0;
    const topicMastery = {};
    
    for (const card of flashcards || []) {
      // Difficulty
      totalDifficulty += card.difficulty || 0;
      
      // Mastery
      if ((card.mastery_level || 0) > 0.8) {
        masteredCount++;
      }
      
      // Due cards
      if (new Date(card.next_review_date) <= now) {
        dueCount++;
      }
      
      // Topic mastery
      if (card.topic_id) {
        if (!topicMastery[card.topic_id]) {
          topicMastery[card.topic_id] = {
            sum: 0,
            count: 0
          };
        }
        
        topicMastery[card.topic_id].sum += (card.mastery_level || 0);
        topicMastery[card.topic_id].count += 1;
      }
      
      // Retention calculation
      totalRetention += card.last_retention || 0.5;
    }
    
    // Average calculations
    const totalCards = flashcards?.length || 0;
    const averageDifficulty = totalCards > 0 ? 
      totalDifficulty / totalCards : 0;
    const averageRetention = totalCards > 0 ?
      totalRetention / totalCards : 0;
      
    // Topic mastery averages
    const masteryByTopic = {};
    for (const [topicId, data] of Object.entries(topicMastery)) {
      masteryByTopic[topicId] = data.sum / data.count;
    }
    
    return {
      totalCards,
      masteredCards: masteredCount,
      dueCards: dueCount,
      averageDifficulty,
      reviewsToday: reviewsToday || 0,
      averageRetention,
      masteryByTopic
    };
  } catch (error) {
    console.error('Error calculating flashcard learning stats:', error);
    return {
      totalCards: 0,
      masteredCards: 0,
      dueCards: 0,
      averageDifficulty: 0,
      reviewsToday: 0,
      averageRetention: 0,
      masteryByTopic: {}
    };
  }
};
