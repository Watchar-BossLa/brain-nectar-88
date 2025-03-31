
import { Flashcard } from '@/types/supabase';
import { FlashcardLearningStats } from './reviewTypes';
import { supabase } from '@/integrations/supabase/client';

/**
 * Calculate flashcard retention based on card's learning history
 * @param flashcard Flashcard or learning stats
 * @returns Retention rate (0-100%)
 */
export const calculateFlashcardRetention = (flashcard: Flashcard | FlashcardLearningStats): number => {
  // Simple retention calculation based on easiness factor and repetitions
  const easinessFactor = flashcard.easiness_factor || 2.5;
  const repetitions = flashcard.repetition_count || 0;
  
  // Retention formula: base retention adjusted by easiness and repetitions
  // Range: 0-100%
  const baseRetention = 40; // Starting point for a new card
  const easinessBonus = Math.min((easinessFactor - 1.3) * 20, 40); // Max 40% bonus
  const repetitionBonus = Math.min(repetitions * 5, 20); // Max 20% bonus
  
  return Math.min(Math.round(baseRetention + easinessBonus + repetitionBonus), 100);
};

/**
 * Get flashcard learning statistics for a user
 * @param userId User ID
 * @returns Learning statistics
 */
export const getFlashcardLearningStats = async (userId: string) => {
  try {
    // Get all flashcards for user
    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    if (!flashcards || flashcards.length === 0) {
      return {
        totalCards: 0,
        masteredCards: 0,
        averageRetention: 0,
        dueCards: 0,
        retentionByCategory: {}
      };
    }

    // Calculate statistics
    const totalCards = flashcards.length;
    const masteredCards = flashcards.filter(card => (card.mastery_level || 0) >= 0.8).length;
    
    // Calculate cards due today
    const now = new Date();
    const dueCards = flashcards.filter(card => {
      if (!card.next_review_date) return false;
      const reviewDate = new Date(card.next_review_date);
      return reviewDate <= now;
    }).length;

    // Calculate average retention
    let totalRetention = 0;
    flashcards.forEach(card => {
      totalRetention += calculateFlashcardRetention(card);
    });
    const averageRetention = totalCards > 0 ? totalRetention / totalCards : 0;

    // Group by topics for category breakdown
    const retentionByCategory: Record<string, { count: number; retention: number }> = {};
    flashcards.forEach(card => {
      const topicId = card.topic_id || 'uncategorized';
      const retention = calculateFlashcardRetention(card);
      
      if (!retentionByCategory[topicId]) {
        retentionByCategory[topicId] = { count: 0, retention: 0 };
      }
      
      retentionByCategory[topicId].count++;
      retentionByCategory[topicId].retention += retention;
    });

    // Calculate averages for each category
    Object.keys(retentionByCategory).forEach(topicId => {
      const category = retentionByCategory[topicId];
      if (category.count > 0) {
        category.retention = category.retention / category.count;
      }
    });

    return {
      totalCards,
      masteredCards,
      averageRetention,
      dueCards,
      retentionByCategory
    };
  } catch (error) {
    console.error('Error getting flashcard learning stats:', error);
    return {
      totalCards: 0,
      masteredCards: 0,
      averageRetention: 0,
      dueCards: 0,
      retentionByCategory: {}
    };
  }
};
