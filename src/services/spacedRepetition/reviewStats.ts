
import { supabase } from '@/integrations/supabase/client';
import { FlashcardRetentionResult, FlashcardLearningStats } from './reviewTypes';

/**
 * Calculate the estimated retention rate for a collection of flashcards
 * based on their review history and spaced repetition parameters
 */
export const calculateFlashcardRetention = async (userId: string): Promise<FlashcardRetentionResult> => {
  try {
    // Get all user's flashcards with repetition data
    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .gt('repetition_count', 0);
      
    if (error) {
      console.error('Error fetching flashcards for retention calculation:', error);
      return { overallRetention: 0, cardRetention: [] };
    }
    
    const now = new Date();
    let totalRetention = 0;
    const cardRetention: Array<{id: string, retention: number, mastery: number}> = [];
    
    // Calculate retention for each card
    flashcards?.forEach(flashcard => {
      if (!flashcard.next_review_date) return;
      
      // Use last review date (updated_at) and next review date to determine memory strength
      const lastReviewDate = new Date(flashcard.updated_at);
      const nextReviewDate = new Date(flashcard.next_review_date);
      const reviewInterval = Math.round((nextReviewDate.getTime() - lastReviewDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Elapsed time since last review in days
      const daysSinceReview = Math.max(0, (now.getTime() - lastReviewDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Calculate estimated memory strength
      const memoryStrength = Math.max(1, (flashcard.repetition_count * 0.2 * (flashcard.difficulty || 2.5)));
      
      // Calculate retention using forgetting curve: R = e^(-t/S)
      const retention = Math.exp(-daysSinceReview / (memoryStrength * 10));
      
      totalRetention += retention;
      cardRetention.push({
        id: flashcard.id,
        retention,
        mastery: flashcard.mastery_level || 0
      });
    });
    
    const overallRetention = flashcards && flashcards.length > 0 
      ? totalRetention / flashcards.length 
      : 0;
    
    return { 
      overallRetention, 
      cardRetention: cardRetention.sort((a, b) => a.retention - b.retention) 
    };
  } catch (error) {
    console.error('Error calculating flashcard retention:', error);
    return { overallRetention: 0, cardRetention: [] };
  }
};

/**
 * Get flashcard learning statistics for a user
 */
export const getFlashcardLearningStats = async (userId: string): Promise<FlashcardLearningStats> => {
  try {
    // Get retention data
    const { overallRetention, cardRetention } = await calculateFlashcardRetention(userId);
    
    // Get cards by mastery level
    const { data: allCards, error: cardsError } = await supabase
      .from('flashcards')
      .select('mastery_level, repetition_count')
      .eq('user_id', userId);
      
    if (cardsError) {
      throw cardsError;
    }
    
    // Calculate mastery distribution
    const masteryLevels = {
      beginner: 0,    // 0-0.3
      developing: 0,  // 0.3-0.6
      proficient: 0,  // 0.6-0.8
      mastered: 0     // 0.8-1.0
    };
    
    allCards?.forEach(card => {
      const mastery = card.mastery_level || 0;
      if (mastery < 0.3) masteryLevels.beginner++;
      else if (mastery < 0.6) masteryLevels.developing++;
      else if (mastery < 0.8) masteryLevels.proficient++;
      else masteryLevels.mastered++;
    });
    
    // Calculate review efficiency (how many cards reach mastery per review)
    const totalCards = allCards?.length || 0;
    const totalReviews = allCards?.reduce((sum, card) => sum + (card.repetition_count || 0), 0) || 0;
    const reviewEfficiency = totalReviews > 0 
      ? masteryLevels.mastered / totalReviews
      : 0;
    
    return {
      overallRetention,
      masteryDistribution: masteryLevels,
      reviewEfficiency,
      lowestRetentionCards: cardRetention.slice(0, 5) // 5 cards with lowest retention
    };
  } catch (error) {
    console.error('Error calculating learning stats:', error);
    return {
      overallRetention: 0,
      masteryDistribution: { beginner: 0, developing: 0, proficient: 0, mastered: 0 },
      reviewEfficiency: 0,
      lowestRetentionCards: []
    };
  }
};
