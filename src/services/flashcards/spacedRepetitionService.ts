
import { supabase } from '@/integrations/supabase/client';
import { calculateNextReviewDate } from '@/services/spacedRepetition/algorithm';

// Get due flashcards for review
export const getDueFlashcards = async (userId: string) => {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review_date', now);

    if (error) {
      console.error('Error fetching due flashcards:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getDueFlashcards:', error);
    return [];
  }
};

// Record a flashcard review
export const recordFlashcardReview = async (
  flashcardId: string, 
  userId: string,
  difficulty: number
) => {
  try {
    // Get current flashcard data
    const { data: flashcard, error: fetchError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('id', flashcardId)
      .single();

    if (fetchError) {
      console.error('Error fetching flashcard:', fetchError);
      return { success: false, error: fetchError };
    }

    // Calculate new values based on the spaced repetition algorithm
    const repetitionCount = (flashcard.repetition_count || 0) + 1;
    const currentEasiness = flashcard.easiness_factor || 2.5;
    
    const { nextReviewDate, newEasinessFactor } = calculateNextReviewDate(
      difficulty,
      currentEasiness,
      repetitionCount
    );

    // Update the flashcard with new values
    const { error: updateError } = await supabase
      .from('flashcards')
      .update({
        last_reviewed_at: new Date().toISOString(),
        next_review_date: nextReviewDate.toISOString(),
        repetition_count: repetitionCount,
        easiness_factor: newEasinessFactor,
      })
      .eq('id', flashcardId);

    if (updateError) {
      console.error('Error updating flashcard:', updateError);
      return { success: false, error: updateError };
    }

    // Record the review
    const { error: reviewError } = await supabase
      .from('flashcard_reviews')
      .insert({
        flashcard_id: flashcardId,
        user_id: userId,
        difficulty_rating: difficulty,
        reviewed_at: new Date().toISOString(),
      });

    if (reviewError) {
      console.error('Error recording review:', reviewError);
      // Continue even if this fails
    }

    return { 
      success: true, 
      data: {
        next_review_date: nextReviewDate,
        easiness_factor: newEasinessFactor,
        repetition_count: repetitionCount
      } 
    };
  } catch (error) {
    console.error('Error in recordFlashcardReview:', error);
    return { success: false, error };
  }
};

// Get flashcard learning stats
export const getFlashcardLearningStats = async (userId: string, flashcardId?: string) => {
  try {
    let query = supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);
      
    if (flashcardId) {
      query = query.eq('id', flashcardId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in getFlashcardLearningStats:', error);
    return { data: null, error };
  }
};

// Export as a service object for compatibility
export const spacedRepetitionService = {
  getDueFlashcards,
  recordReview: (flashcardId: string, userId: string, difficulty: number) => 
    recordFlashcardReview(flashcardId, userId, difficulty),
  getFlashcardLearningStats
};
