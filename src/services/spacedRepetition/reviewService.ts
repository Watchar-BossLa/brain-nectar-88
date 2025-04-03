
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

export const recordReviewAttempt = async (
  flashcardId: string,
  difficulty: number,
  isCorrect: boolean
) => {
  try {
    const { error } = await supabase
      .from('flashcard_reviews')
      .insert({
        flashcard_id: flashcardId,
        difficulty,
        is_correct: isCorrect,
        reviewed_at: new Date().toISOString()
      });

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error recording review attempt:', error);
    return false;
  }
};
