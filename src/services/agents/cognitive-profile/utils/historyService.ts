
import { supabase } from '@/integrations/supabase/client';
import { LearningHistoryItem } from '../types';

/**
 * Service for fetching user learning history 
 */
export class LearningHistoryService {
  /**
   * Fetch a user's learning history to inform their cognitive profile
   */
  public static async fetchUserLearningHistory(userId: string): Promise<LearningHistoryItem[]> {
    try {
      // Get user progress data
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select(`
          *,
          content:content_id(*)
        `)
        .eq('user_id', userId);
      
      if (progressError) {
        console.error('Error fetching user progress:', progressError);
        return [];
      }
      
      // Get flashcard data
      const { data: flashcardData, error: flashcardError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId);
      
      if (flashcardError) {
        console.error('Error fetching flashcards:', flashcardError);
        return [];
      }
      
      // Combine all learning history data
      return [
        ...(progressData || []),
        ...(flashcardData || [])
      ];
    } catch (error) {
      console.error('Error fetching user learning history:', error);
      return [];
    }
  }
}
