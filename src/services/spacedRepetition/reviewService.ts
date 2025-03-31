
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { getSession } from '@/lib/supabaseAuth';
import { calculateSpacedRepetition } from './spacedRepAlgorithm';

/**
 * Update flashcard learning stats after a review
 */
export async function updateFlashcardAfterReview(
  flashcardId: string, 
  difficulty: number // 0-5 scale where 0 is hardest, 5 is easiest
) {
  try {
    // Get current user session
    const { data: sessionData } = await getSession();
    
    if (!sessionData?.session?.user?.id) {
      throw new Error('User not authenticated');
    }
    
    const userId = sessionData.session.user.id;
    
    // Get current learning stats
    const { data: currentStats, error: statsError } = await supabase
      .from('flashcard_learning_stats')
      .select('*')
      .eq('flashcard_id', flashcardId)
      .eq('user_id', userId)
      .single();
    
    if (statsError) {
      throw statsError;
    }
    
    // Calculate new spaced repetition parameters
    const {
      easinessFactor,
      intervalDays,
      repetitionCount
    } = calculateSpacedRepetition(
      currentStats.easiness_factor,
      currentStats.interval_days,
      currentStats.repetition_count,
      difficulty
    );
    
    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);
    
    // Update learning stats
    const { error: updateError } = await supabase
      .from('flashcard_learning_stats')
      .update({
        easiness_factor: easinessFactor,
        interval_days: intervalDays,
        repetition_count: repetitionCount,
        last_review_date: new Date().toISOString(),
        next_review_date: nextReviewDate.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('flashcard_id', flashcardId)
      .eq('user_id', userId);
    
    if (updateError) {
      throw updateError;
    }
    
    // Record the review
    const { error: reviewError } = await supabase
      .from('flashcard_reviews')
      .insert({
        id: uuidv4(),
        flashcard_id: flashcardId,
        user_id: userId,
        difficulty_rating: difficulty,
        reviewed_at: new Date().toISOString()
      });
    
    if (reviewError) {
      console.error('Error recording review:', reviewError);
    }
    
    return {
      easinessFactor,
      intervalDays,
      repetitionCount,
      nextReviewDate: nextReviewDate.toISOString()
    };
  } catch (error) {
    console.error('Error updating flashcard after review:', error);
    throw error;
  }
}

/**
 * Get flashcard learning stats
 */
export async function getFlashcardLearningStats(userId?: string) {
  try {
    // Get current user session if userId is not provided
    if (!userId) {
      const { data: sessionData } = await getSession();
      
      if (!sessionData?.session?.user?.id) {
        throw new Error('User not authenticated');
      }
      
      userId = sessionData.session.user.id;
    }
    
    // Get all flashcard stats
    const { data, error } = await supabase
      .from('flashcard_learning_stats')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      throw error;
    }
    
    // Get review data
    const { data: reviewData, error: reviewError } = await supabase
      .from('flashcard_reviews')
      .select('*')
      .eq('user_id', userId);
    
    if (reviewError) {
      console.error('Error getting review data:', reviewError);
    }
    
    // Calculate stats
    const totalCards = data.length;
    const masteredCards = data.filter(card => 
      card.easiness_factor >= 2.5 && card.repetition_count >= 3
    ).length;
    
    const now = new Date();
    const dueCards = data.filter(card => 
      new Date(card.next_review_date) <= now
    ).length;
    
    // Calculate average difficulty from reviews
    const reviewsToday = reviewData ? reviewData.filter(review => 
      new Date(review.reviewed_at).toDateString() === now.toDateString()
    ).length : 0;
    
    return {
      totalCards,
      masteredCards,
      dueCards,
      averageDifficulty: 0, // Would require more calculation
      reviewsToday
    };
  } catch (error) {
    console.error('Error getting flashcard learning stats:', error);
    throw error;
  }
}
