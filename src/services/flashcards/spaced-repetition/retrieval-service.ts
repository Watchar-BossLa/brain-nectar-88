
import { supabase } from '@/integrations/supabase/client';
import { queryFlashcardLearningStats } from '@/lib/database-stub';
import { Flashcard } from '@/types/supabase';

export const getFlashcardLearningStats = async (userId: string, flashcardId?: string) => {
  try {
    return await queryFlashcardLearningStats(userId, flashcardId);
  } catch (error) {
    console.error('Error fetching flashcard learning stats:', error);
    return { data: null, error };
  }
};

export const getDueFlashcards = async (userId: string) => {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review_date', now)
      .order('next_review_date', { ascending: true });

    if (error) {
      throw error;
    }

    return data as Flashcard[];
  } catch (error) {
    console.error('Error fetching due flashcards:', error);
    return [];
  }
};

export const getAllFlashcards = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as Flashcard[];
  } catch (error) {
    console.error('Error fetching all flashcards:', error);
    return [];
  }
};
