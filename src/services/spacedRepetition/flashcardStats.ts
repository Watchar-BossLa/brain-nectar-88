
import { supabase } from '@/integrations/supabase/client';
import { calculateRetention } from './algorithm';

/**
 * Get learning statistics for a flashcard
 */
export const getFlashcardLearningStats = async (flashcardId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('repetition_count, easiness_factor, next_review_date, last_reviewed_at, mastery_level')
      .eq('id', flashcardId)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error getting flashcard learning stats:', error);
    return null;
  }
};

/**
 * Get flashcard stats for a user
 */
export const getFlashcardStats = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return {
        totalCount: 0,
        reviewedCount: 0,
        masteredCount: 0,
        dueTodayCount: 0,
        averageRetention: 0
      };
    }
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();
    
    // Calculate stats
    const totalCount = data.length;
    const reviewedCount = data.filter(card => card.last_reviewed_at).length;
    const masteredCount = data.filter(card => (card.mastery_level || 0) >= 0.9).length;
    const dueTodayCount = data.filter(card => 
      card.next_review_date && 
      card.next_review_date >= today && 
      card.next_review_date < tomorrow
    ).length;
    
    // Calculate average retention
    const cardsWithRetention = data.filter(card => card.last_reviewed_at);
    const totalRetention = cardsWithRetention.reduce((sum, card) => {
      return sum + calculateFlashcardRetention(card);
    }, 0);
    const averageRetention = cardsWithRetention.length > 0 ? 
      totalRetention / cardsWithRetention.length : 0;
    
    return {
      totalCount,
      reviewedCount,
      masteredCount,
      dueTodayCount,
      averageRetention
    };
  } catch (error) {
    console.error('Error getting flashcard stats:', error);
    return {
      totalCount: 0,
      reviewedCount: 0,
      masteredCount: 0,
      dueTodayCount: 0,
      averageRetention: 0
    };
  }
};

/**
 * Calculate flashcard retention rate
 */
export const calculateFlashcardRetention = (flashcard: any): number => {
  if (!flashcard?.last_reviewed_at) return 0;
  
  const lastReviewDate = new Date(flashcard.last_reviewed_at);
  const now = new Date();
  const daysElapsed = (now.getTime() - lastReviewDate.getTime()) / (1000 * 60 * 60 * 24);
  
  return calculateRetention(
    daysElapsed,
    flashcard.easiness_factor || 2.5
  );
};

/**
 * Get retention statistics for flashcards
 */
export const getFlashcardRetentionStats = async (userId: string) => {
  try {
    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    if (!flashcards || flashcards.length === 0) {
      return {
        averageRetention: 0,
        lowestRetentionCards: [],
        totalCards: 0,
        reviewedCards: 0
      };
    }
    
    // Calculate retention for each card
    const retentionData = flashcards.map(card => {
      const retention = calculateFlashcardRetention(card);
      return {
        id: card.id,
        front_content: card.front_content,
        back_content: card.back_content,
        retention,
        last_reviewed_at: card.last_reviewed_at,
        next_review_date: card.next_review_date
      };
    });
    
    // Calculate average retention
    const reviewedCards = retentionData.filter(card => card.last_reviewed_at);
    const totalRetention = reviewedCards.reduce((sum, card) => sum + card.retention, 0);
    const averageRetention = reviewedCards.length > 0 ? totalRetention / reviewedCards.length : 0;
    
    // Get cards with lowest retention
    const lowestRetentionCards = [...retentionData]
      .filter(card => card.retention > 0)
      .sort((a, b) => a.retention - b.retention)
      .slice(0, 5);
    
    return {
      averageRetention,
      lowestRetentionCards,
      totalCards: flashcards.length,
      reviewedCards: reviewedCards.length
    };
  } catch (error) {
    console.error('Error getting retention stats:', error);
    return {
      averageRetention: 0,
      lowestRetentionCards: [],
      totalCards: 0,
      reviewedCards: 0
    };
  }
};
