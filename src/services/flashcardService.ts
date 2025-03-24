
import { supabase } from '@/integrations/supabase/client';
import { Flashcard } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

// SM-2 Spaced Repetition Algorithm parameters
const INITIAL_EASINESS_FACTOR = 2.5;
const MIN_EASINESS_FACTOR = 1.3;

// Calculate the next review date based on the SM-2 algorithm
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

// Get all flashcards for the current user
export const getUserFlashcards = async () => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .order('next_review_date', { ascending: true });
      
    if (error) {
      console.error('Error fetching flashcards:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in getUserFlashcards:', error);
    return { data: null, error };
  }
};

// Get flashcards due for review
export const getDueFlashcards = async () => {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .lte('next_review_date', now)
      .order('next_review_date', { ascending: true });
      
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

// Create a new flashcard
export const createFlashcard = async (frontContent: string, backContent: string, topicId?: string) => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return { data: null, error: new Error('User not authenticated') };
    }
    
    // Default next review date is today (cards are due immediately after creation)
    const nextReviewDate = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('flashcards')
      .insert({
        front_content: frontContent,
        back_content: backContent,
        topic_id: topicId || null,
        difficulty: 3, // Default medium difficulty
        repetition_count: 0,
        next_review_date: nextReviewDate,
        user_id: user.id // Add the user_id field required by RLS
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

// Update flashcard after review
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

// Delete a flashcard
export const deleteFlashcard = async (flashcardId: string) => {
  try {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', flashcardId);
      
    if (error) {
      console.error('Error deleting flashcard:', error);
      return { error };
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error in deleteFlashcard:', error);
    return { error };
  }
};

// Get flashcards by topic ID
export const getFlashcardsByTopic = async (topicId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('topic_id', topicId)
      .order('next_review_date', { ascending: true });
      
    if (error) {
      console.error('Error fetching flashcards by topic:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in getFlashcardsByTopic:', error);
    return { data: null, error };
  }
};
