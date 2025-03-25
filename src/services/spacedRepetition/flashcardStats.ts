
import { supabase } from '@/integrations/supabase/client';

/**
 * Get flashcard statistics for a user
 */
export const getFlashcardStats = async (userId: string) => {
  try {
    // Get total cards count
    const { count: totalCount, error: countError } = await supabase
      .from('flashcards')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
      
    if (countError) {
      throw countError;
    }
    
    // Get due cards
    const now = new Date().toISOString();
    const { data: dueCards, error: dueError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review_date', now);
      
    if (dueError) {
      throw dueError;
    }
    
    // Get mastered cards count
    const { data: masteredData, error: masteredError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .gte('mastery_level', 0.8);
      
    if (masteredError) {
      throw masteredError;
    }
    
    // Get average difficulty
    const { data: allCards, error: allCardsError } = await supabase
      .from('flashcards')
      .select('difficulty')
      .eq('user_id', userId);
      
    if (allCardsError) {
      throw allCardsError;
    }
    
    const averageDifficulty = allCards?.length 
      ? allCards.reduce((sum, card) => sum + (card.difficulty || 0), 0) / allCards.length
      : 0;
    
    // Get reviews today count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if the flashcard_reviews table exists before querying it
    let reviewsToday = 0;
    try {
      const { count: reviewsCount, error: reviewsError } = await supabase
        .from('flashcard_reviews')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('reviewed_at', today.toISOString());
        
      if (!reviewsError) {
        reviewsToday = reviewsCount || 0;
      }
    } catch (error) {
      console.warn('Could not get reviews count, table might not exist yet:', error);
      // If the table doesn't exist, we'll just continue with reviewsToday = 0
    }
    
    return {
      totalCards: totalCount || 0,
      dueCards: dueCards?.length || 0,
      masteredCards: masteredData?.length || 0,
      averageDifficulty: averageDifficulty || 0,
      reviewsToday: reviewsToday
    };
  } catch (error) {
    console.error('Error getting flashcard stats:', error);
    return {
      totalCards: 0,
      dueCards: 0,
      masteredCards: 0,
      averageDifficulty: 0,
      reviewsToday: 0
    };
  }
};
