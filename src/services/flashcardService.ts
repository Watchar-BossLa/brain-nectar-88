import { supabase } from '@/integrations/supabase/client';

export interface Flashcard {
  id: string;
  front_content: string;
  back_content: string;
  user_id: string;
  topic_id?: string;
  difficulty: number;
  last_reviewed_at?: string;
  next_review_date?: string;
  repetition_count: number;
  mastery_level?: number;
  easiness_factor?: number;
  created_at: string;
  updated_at: string;
}

// Get all flashcards for a user
export async function getUserFlashcards(userId?: string): Promise<Flashcard[]> {
  try {
    if (!userId) {
      // Get current user if userId not provided
      const { data: userData } = await supabase.auth.getUser();
      userId = userData?.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
    }
    
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Flashcard[];
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    throw error;
  }
}

// Get flashcards due for review
export async function getDueFlashcards(userId?: string): Promise<Flashcard[]> {
  try {
    if (!userId) {
      // Get current user if userId not provided
      const { data: userData } = await supabase.auth.getUser();
      userId = userData?.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
    }
    
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lt('next_review_date', now)
      .order('next_review_date', { ascending: true });
    
    if (error) throw error;
    return data as Flashcard[];
  } catch (error) {
    console.error('Error fetching due flashcards:', error);
    throw error;
  }
}

// Create a new flashcard
export async function createFlashcard(flashcard: Omit<Flashcard, 'id' | 'created_at' | 'updated_at'>): Promise<Flashcard> {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .insert([flashcard])
      .select()
      .single();

    if (error) throw error;
    return data as Flashcard;
  } catch (error) {
    console.error('Error creating flashcard:', error);
    throw error;
  }
}

// Update an existing flashcard
export async function updateFlashcard(id: string, updates: Partial<Flashcard>): Promise<Flashcard> {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Flashcard;
  } catch (error) {
    console.error('Error updating flashcard:', error);
    throw error;
  }
}

// Delete a flashcard
export async function deleteFlashcard(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    throw error;
  }
}

// Get a single flashcard by ID
export async function getFlashcardById(id: string): Promise<Flashcard | null> {
    try {
        const { data, error } = await supabase
            .from('flashcards')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching flashcard by ID:', error);
            return null;
        }

        return data as Flashcard;
    } catch (error) {
        console.error('Error fetching flashcard by ID:', error);
        return null;
    }
}
