
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/supabaseAuth';

/**
 * Get all flashcards for the current user
 */
export async function getUserFlashcards() {
  try {
    // Get current user session
    const { data: sessionData } = await getSession();
    
    if (!sessionData?.session?.user?.id) {
      throw new Error('User not authenticated');
    }
    
    const userId = sessionData.session.user.id;
    
    // Get all flashcards
    const { data, error } = await supabase
      .from('flashcards')
      .select(`
        *,
        flashcard_learning_stats(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting user flashcards:', error);
    throw error;
  }
}

/**
 * Get flashcards due for review
 */
export async function getDueFlashcards(limit = 20) {
  try {
    // Get current user session
    const { data: sessionData } = await getSession();
    
    if (!sessionData?.session?.user?.id) {
      throw new Error('User not authenticated');
    }
    
    const userId = sessionData.session.user.id;
    const now = new Date().toISOString();
    
    // Get flashcards with their learning stats where review date is due
    const { data, error } = await supabase
      .from('flashcard_learning_stats')
      .select(`
        *,
        flashcard:flashcard_id(*)
      `)
      .eq('user_id', userId)
      .lte('next_review_date', now)
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    // Format the result to have flashcard as the root object with stats
    return data.map((item) => ({
      ...item.flashcard,
      learning_stats: {
        easiness_factor: item.easiness_factor,
        repetition_count: item.repetition_count,
        interval_days: item.interval_days,
        last_review_date: item.last_review_date,
        next_review_date: item.next_review_date
      }
    }));
  } catch (error) {
    console.error('Error getting due flashcards:', error);
    throw error;
  }
}

/**
 * Get flashcards by topic
 */
export async function getFlashcardsByTopic(topic: string, limit = 20) {
  try {
    // Get current user session
    const { data: sessionData } = await getSession();
    
    if (!sessionData?.session?.user?.id) {
      throw new Error('User not authenticated');
    }
    
    const userId = sessionData.session.user.id;
    
    // Get flashcards with the specified topic
    const { data, error } = await supabase
      .from('flashcards')
      .select(`
        *,
        flashcard_learning_stats(*)
      `)
      .eq('user_id', userId)
      .eq('topic', topic)
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting flashcards by topic:', error);
    throw error;
  }
}

/**
 * Get mastered flashcards
 */
export async function getMasteredFlashcards(limit = 20) {
  try {
    // Get current user session
    const { data: sessionData } = await getSession();
    
    if (!sessionData?.session?.user?.id) {
      throw new Error('User not authenticated');
    }
    
    const userId = sessionData.session.user.id;
    
    // Get flashcards that are considered mastered (high repetition count and easiness factor)
    const { data, error } = await supabase
      .from('flashcard_learning_stats')
      .select(`
        *,
        flashcard:flashcard_id(*)
      `)
      .eq('user_id', userId)
      .gte('easiness_factor', 2.5)
      .gte('repetition_count', 3)
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    // Format the result
    return data.map((item) => ({
      ...item.flashcard,
      learning_stats: {
        easiness_factor: item.easiness_factor,
        repetition_count: item.repetition_count,
        interval_days: item.interval_days,
        last_review_date: item.last_review_date,
        next_review_date: item.next_review_date
      }
    }));
  } catch (error) {
    console.error('Error getting mastered flashcards:', error);
    throw error;
  }
}

/**
 * Get struggling flashcards (low easiness factor)
 */
export async function getStrugglingFlashcards(limit = 20) {
  try {
    // Get current user session
    const { data: sessionData } = await getSession();
    
    if (!sessionData?.session?.user?.id) {
      throw new Error('User not authenticated');
    }
    
    const userId = sessionData.session.user.id;
    
    // Get flashcards that are considered difficult (low easiness factor)
    const { data, error } = await supabase
      .from('flashcard_learning_stats')
      .select(`
        *,
        flashcard:flashcard_id(*)
      `)
      .eq('user_id', userId)
      .lt('easiness_factor', 1.8) // Threshold for "struggling"
      .gt('repetition_count', 1) // Has been reviewed at least once
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    // Format the result
    return data.map((item) => ({
      ...item.flashcard,
      learning_stats: {
        easiness_factor: item.easiness_factor,
        repetition_count: item.repetition_count,
        interval_days: item.interval_days,
        last_review_date: item.last_review_date,
        next_review_date: item.next_review_date
      }
    }));
  } catch (error) {
    console.error('Error getting struggling flashcards:', error);
    throw error;
  }
}
