
import { supabase } from '@/integrations/supabase/client';

/**
 * Get statistics for a user's flashcards
 * 
 * @param userId The user ID to get statistics for
 * @returns Object with statistics
 */
export const getFlashcardStats = async (userId: string) => {
  try {
    // Get all flashcards for the user
    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      throw error;
    }
    
    // Get flashcards due today
    const today = new Date();
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    
    const { data: dueCards, error: dueError } = await supabase
      .from('flashcards')
      .select('id')
      .eq('user_id', userId)
      .lte('next_review_date', endOfDay.toISOString());
      
    if (dueError) {
      throw dueError;
    }
    
    // Get reviews done today
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    
    const { data: reviewsToday, error: reviewError } = await supabase
      .from('flashcard_reviews')
      .select('id')
      .eq('user_id', userId)
      .gte('reviewed_at', startOfDay.toISOString());
      
    if (reviewError) {
      throw reviewError;
    }
    
    // Calculate statistics
    const totalCards = flashcards?.length || 0;
    const masteredCards = flashcards?.filter(card => (card.mastery_level || 0) >= 0.8).length || 0;
    const dueCount = dueCards?.length || 0;
    const reviewCount = reviewsToday?.length || 0;
    
    // Calculate average difficulty
    let totalDifficulty = 0;
    flashcards?.forEach(card => {
      totalDifficulty += card.difficulty || 2.5;
    });
    const averageDifficulty = totalCards > 0 ? totalDifficulty / totalCards : 0;
    
    return {
      totalCards,
      masteredCards,
      dueCards: dueCount,
      averageDifficulty,
      reviewsToday: reviewCount
    };
  } catch (error) {
    console.error('Error getting flashcard stats:', error);
    return {
      totalCards: 0,
      masteredCards: 0,
      dueCards: 0,
      averageDifficulty: 0,
      reviewsToday: 0
    };
  }
};
