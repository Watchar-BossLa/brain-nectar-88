
import { supabase } from '@/integrations/supabase/client';

/**
 * Get flashcard statistics for a user
 * 
 * @param userId The user ID to get statistics for
 * @returns Object with flashcard statistics
 */
export const getFlashcardStats = async (userId: string): Promise<{
  totalCards: number;
  masteredCards: number;
  dueCards: number;
  averageDifficulty: number;
  reviewsToday: number;
}> => {
  try {
    // Get total cards count
    const { count: totalCards, error: countError } = await supabase
      .from('flashcards')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
      
    if (countError) {
      throw countError;
    }
    
    // Get due cards count
    const now = new Date().toISOString();
    const { count: dueCards, error: dueError } = await supabase
      .from('flashcards')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .lte('next_review_date', now);
      
    if (dueError) {
      throw dueError;
    }
    
    // Get mastered cards count (repetition count >= 5 and mastery level >= 0.7)
    const { count: masteredCards, error: masteredError } = await supabase
      .from('flashcards')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('repetition_count', 5)
      .gte('mastery_level', 0.7);
      
    if (masteredError) {
      throw masteredError;
    }
    
    // Get average difficulty for cards that have been reviewed
    const { data: difficultyData, error: difficultyError } = await supabase
      .from('flashcards')
      .select('difficulty')
      .eq('user_id', userId)
      .gt('repetition_count', 0); // Only include cards that have been reviewed
      
    if (difficultyError) {
      throw difficultyError;
    }
    
    // Calculate average difficulty
    const averageDifficulty = difficultyData && difficultyData.length > 0
      ? difficultyData.reduce((sum, card) => sum + (card.difficulty || 0), 0) / difficultyData.length
      : 0;
    
    // Get reviews today count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { count: reviewsToday, error: reviewsError } = await supabase
      .from('flashcards')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('last_reviewed_at', today.toISOString());
      
    if (reviewsError) {
      throw reviewsError;
    }
    
    return {
      totalCards: totalCards || 0,
      masteredCards: masteredCards || 0,
      dueCards: dueCards || 0,
      averageDifficulty,
      reviewsToday: reviewsToday || 0
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
