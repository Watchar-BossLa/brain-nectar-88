
import { supabase } from '@/integrations/supabase/client';
import { FlashcardRetentionResult } from './reviewTypes';
import { calculateRetention } from './algorithm';

/**
 * Calculate estimated flashcard retention for a user
 * This helps visualize how well the memory model is working
 * 
 * @param userId The user ID to calculate retention for
 * @returns Object with retention data
 */
export const calculateFlashcardRetention = async (
  userId: string
): Promise<FlashcardRetentionResult> => {
  try {
    // Get flashcards that have been reviewed at least once
    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .gt('repetition_count', 0);
      
    if (error) {
      throw error;
    }
    
    if (!flashcards || flashcards.length === 0) {
      return {
        overallRetention: 0,
        cardRetention: []
      };
    }
    
    // Calculate retention for each card
    const now = new Date();
    let totalRetention = 0;
    
    const cardRetention = flashcards.map(card => {
      // Calculate days since last review
      const nextReviewDate = new Date(card.next_review_date);
      const daysSinceReview = Math.max(0, (now.getTime() - nextReviewDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Estimate memory strength based on repetition count and difficulty
      const memoryStrength = card.repetition_count * 0.2 * (card.difficulty || 2.5);
      
      // Calculate current retention
      const retention = calculateRetention(daysSinceReview, memoryStrength);
      
      // Days until next review
      const daysUntilReview = Math.max(0, (nextReviewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      totalRetention += retention;
      
      return {
        id: card.id,
        retention,
        masteryLevel: card.mastery_level || 0,
        daysUntilReview: Math.round(daysUntilReview)
      };
    });
    
    // Calculate overall retention
    const overallRetention = cardRetention.length > 0 ? totalRetention / cardRetention.length : 0;
    
    return {
      overallRetention,
      cardRetention
    };
  } catch (error) {
    console.error('Error calculating flashcard retention:', error);
    return {
      overallRetention: 0,
      cardRetention: []
    };
  }
};
