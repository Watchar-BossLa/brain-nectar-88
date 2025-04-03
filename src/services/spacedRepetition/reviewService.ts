
import { supabase } from '@/integrations/supabase/client';
import { Flashcard } from '@/types/flashcard';

export const calculateFlashcardRetention = async (userId: string) => {
  try {
    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    // Calculate overall retention
    let totalRetention = 0;
    const cardRetention: Array<{id: string, retention: number}> = [];

    flashcards.forEach(card => {
      // Use easier calculation for demo purposes
      const retention = card.mastery_level / 5; // Assuming mastery level is from 0-5
      totalRetention += retention;
      
      cardRetention.push({
        id: card.id,
        retention
      });
    });

    const overallRetention = flashcards.length > 0 ? totalRetention / flashcards.length : 0;

    // Sort cards by retention - lowest first for review priority
    cardRetention.sort((a, b) => a.retention - b.retention);

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

export const updateFlashcardAfterReview = async (flashcardId: string, difficultyRating: number) => {
  try {
    // Fetch the flashcard
    const { data: flashcard, error: fetchError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('id', flashcardId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Record the review
    await recordFlashcardReview(flashcardId, difficultyRating);
    
    // Update flashcard based on review
    return updateFlashcardReviewData(flashcard, difficultyRating);
  } catch (error) {
    console.error('Error updating flashcard after review:', error);
    return false;
  }
};

export const updateFlashcardReviewData = async (flashcard: Flashcard, difficulty: number) => {
  try {
    // Calculate new values based on SM-2 algorithm
    const now = new Date();
    
    // Update the flashcard in Supabase
    const { error } = await supabase
      .from('flashcards')
      .update({
        easiness_factor: flashcard.easinessFactor,
        repetition_count: flashcard.repetitionCount + 1,
        last_reviewed_at: now.toISOString(),
        next_review_date: flashcard.nextReviewDate,
        mastery_level: flashcard.masteryLevel,
        last_retention: flashcard.lastRetention
      })
      .eq('id', flashcard.id);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating flashcard review data:', error);
    return false;
  }
};

export const recordFlashcardReview = async (flashcardId: string, difficultyRating: number) => {
  try {
    // Get user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return false;
    }
    
    // Insert a review record
    const { error } = await supabase
      .from('flashcard_reviews')
      .insert({
        flashcard_id: flashcardId,
        difficulty_rating: difficultyRating,
        reviewed_at: new Date().toISOString(),
        user_id: user.id
      });

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error recording flashcard review:', error);
    return false;
  }
};
