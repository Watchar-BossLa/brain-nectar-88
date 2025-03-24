
import { supabase } from '@/integrations/supabase/client';
import { Flashcard } from '@/types/supabase';

// SM-2 Spaced Repetition Algorithm parameters
const INITIAL_EASINESS_FACTOR = 2.5;
const MIN_EASINESS_FACTOR = 1.3;

/**
 * Gets flashcards due for review today based on the spaced repetition algorithm
 */
export const getDueFlashcards = async (userId: string, topicId?: string) => {
  try {
    const now = new Date().toISOString();
    let query = supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review_date', now)
      .order('next_review_date', { ascending: true });
    
    if (topicId) {
      query = query.eq('topic_id', topicId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching due flashcards:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in getDueFlashcards:', error);
    return { data: null, error };
  }
};

/**
 * Calculates the next review date based on the SM-2 spaced repetition algorithm
 * @param repetitionCount Current repetition count
 * @param easinessFactor Current easiness factor
 * @param difficulty User-rated difficulty (1-5, 5 = most difficult)
 * @returns Next review date
 */
export const calculateNextReviewDate = (
  repetitionCount: number,
  easinessFactor: number,
  difficulty: number
): Date => {
  // Convert difficulty from 1-5 scale to 0-5 scale for algorithm
  const quality = 6 - difficulty;
  
  // Calculate new easiness factor
  let newEasinessFactor = easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEasinessFactor < MIN_EASINESS_FACTOR) {
    newEasinessFactor = MIN_EASINESS_FACTOR;
  }
  
  // Calculate new interval
  let interval: number;
  let newRepetitionCount = repetitionCount;
  
  if (quality < 3) {
    // If the quality is poor, reset the repetition count
    newRepetitionCount = 0;
    interval = 1; // Review again tomorrow
  } else {
    // If repetition is successful, increase the interval
    newRepetitionCount += 1;
    
    if (newRepetitionCount === 1) {
      interval = 1; // 1 day
    } else if (newRepetitionCount === 2) {
      interval = 6; // 6 days
    } else {
      // For subsequent repetitions, use the formula: interval = interval * easiness_factor
      interval = Math.round((repetitionCount > 0 ? repetitionCount : 1) * newEasinessFactor);
    }
  }
  
  // Calculate the next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  
  return nextReviewDate;
};

/**
 * Updates a flashcard after review based on user's difficulty rating
 */
export const updateFlashcardAfterReview = async (
  flashcardId: string,
  difficulty: number
) => {
  try {
    // Get the current flashcard data
    const { data: flashcardData, error: fetchError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('id', flashcardId)
      .single();
      
    if (fetchError || !flashcardData) {
      console.error('Error fetching flashcard for update:', fetchError);
      return { data: null, error: fetchError };
    }
    
    // Calculate new review date and repetition count
    const nextReviewDate = calculateNextReviewDate(
      flashcardData.repetition_count,
      flashcardData.difficulty || INITIAL_EASINESS_FACTOR,
      difficulty
    );
    
    let newRepetitionCount = flashcardData.repetition_count;
    if (difficulty <= 3) {
      // Reset for difficult cards
      newRepetitionCount = 0;
    } else {
      // Increment for easy cards
      newRepetitionCount += 1;
    }
    
    // Update the flashcard
    const { data, error } = await supabase
      .from('flashcards')
      .update({
        difficulty: difficulty,
        repetition_count: newRepetitionCount,
        next_review_date: nextReviewDate.toISOString(),
      })
      .eq('id', flashcardId)
      .select();
      
    if (error) {
      console.error('Error updating flashcard:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in updateFlashcardAfterReview:', error);
    return { data: null, error };
  }
};

/**
 * Creates a new flashcard with initial spaced repetition parameters
 */
export const createFlashcard = async (
  userId: string,
  frontContent: string,
  backContent: string,
  topicId?: string
) => {
  try {
    // Default next review date is today (cards are due immediately after creation)
    const nextReviewDate = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('flashcards')
      .insert({
        user_id: userId,
        front_content: frontContent,
        back_content: backContent,
        topic_id: topicId || null,
        difficulty: INITIAL_EASINESS_FACTOR,
        repetition_count: 0,
        next_review_date: nextReviewDate,
      })
      .select();
      
    if (error) {
      console.error('Error creating flashcard:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in createFlashcard:', error);
    return { data: null, error };
  }
};
