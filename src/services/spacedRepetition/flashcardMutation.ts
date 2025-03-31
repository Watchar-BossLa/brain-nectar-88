
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { getSession } from '@/lib/supabaseAuth';

// Types
export interface CreateFlashcardInput {
  question: string;
  answer: string;
  topic: string;
  category?: string;
  difficulty?: number;
  content_type?: string;
  user_id?: string;
}

/**
 * Create a new flashcard
 */
export async function createFlashcard(data: CreateFlashcardInput) {
  try {
    // Get current user session
    const { data: sessionData } = await getSession();
    
    if (!sessionData?.session?.user?.id && !data.user_id) {
      throw new Error('User not authenticated');
    }
    
    const userId = data.user_id || sessionData?.session?.user?.id;
    
    // Insert flashcard
    const { data: flashcard, error } = await supabase
      .from('flashcards')
      .insert({
        id: uuidv4(),
        user_id: userId,
        question: data.question,
        answer: data.answer,
        topic: data.topic,
        category: data.category || 'General',
        difficulty: data.difficulty || 0.5,
        content_type: data.content_type || 'text',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Create initial learning stats
    const { error: statsError } = await supabase
      .from('flashcard_learning_stats')
      .insert({
        flashcard_id: flashcard.id,
        user_id: userId,
        easiness_factor: 2.5, // Initial easiness factor (SM-2 algorithm)
        repetition_count: 0,
        interval_days: 0,
        last_review_date: new Date().toISOString(),
        next_review_date: new Date().toISOString(), // Due immediately for first review
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (statsError) {
      console.error('Error creating flashcard learning stats:', statsError);
    }
    
    return flashcard;
  } catch (error) {
    console.error('Error creating flashcard:', error);
    throw error;
  }
}

/**
 * Delete a flashcard
 */
export async function deleteFlashcard(id: string) {
  try {
    // First delete related learning stats (to avoid foreign key constraint errors)
    const { error: statsError } = await supabase
      .from('flashcard_learning_stats')
      .delete()
      .match({ flashcard_id: id });
    
    if (statsError) {
      console.error('Error deleting flashcard learning stats:', statsError);
    }
    
    // Delete related reviews
    const { error: reviewsError } = await supabase
      .from('flashcard_reviews')
      .delete()
      .match({ flashcard_id: id });
    
    if (reviewsError) {
      console.error('Error deleting flashcard reviews:', reviewsError);
    }
    
    // Delete the flashcard itself
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .match({ id });
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    throw error;
  }
}

/**
 * Update a flashcard
 */
export async function updateFlashcard(id: string, data: Partial<CreateFlashcardInput>) {
  try {
    const { error } = await supabase
      .from('flashcards')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .match({ id });
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating flashcard:', error);
    throw error;
  }
}
