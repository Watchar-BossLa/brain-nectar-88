import { supabase } from '@/lib/supabase';
import { Flashcard } from '@/types/supabase';

// Constants for spaced repetition algorithm
export const INITIAL_EASINESS_FACTOR = 2.5;
export const MIN_EASINESS_FACTOR = 1.3;

export async function getUserFlashcards(userId: string) {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return [];
  }
}

export async function getDueFlashcards(userId: string) {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review_date', now)
      .order('next_review_date', { ascending: true });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching due flashcards:', error);
    return [];
  }
}

export async function createFlashcard(frontContent: string, backContent: string) {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .insert([
        { 
          front_content: frontContent, 
          back_content: backContent,
          difficulty: 0,
          repetition_count: 0,
          next_review_date: new Date().toISOString()
        }
      ])
      .select();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating flashcard:', error);
    return null;
  }
}

export async function deleteFlashcard(flashcardId: string) {
  try {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', flashcardId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    return false;
  }
}

export async function updateFlashcard(
  flashcardId: string,
  updates: Partial<Flashcard>
) {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .update(updates)
      .eq('id', flashcardId)
      .select();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error updating flashcard:', error);
    return null;
  }
}

export async function getFlashcardsByTopic(userId: string, topicId: string) {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId);

    if (error) {
      throw error;
    }

    return data as Flashcard[];
  } catch (error) {
    console.error('Error fetching flashcards by topic:', error);
    return [];
  }
}
