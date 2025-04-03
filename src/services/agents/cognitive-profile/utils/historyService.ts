
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
      
      // Convert to camelCase and combine all learning history data
      return [
        ...(progressData || []).map(formatToLearningHistoryItem),
        ...(flashcardData || []).map(formatToLearningHistoryItem)
      ];
    } catch (error) {
      console.error('Error fetching user learning history:', error);
      return [];
    }
  }
  
  /**
   * Convert database items to camelCase LearningHistoryItem
   */
  private static formatToLearningHistoryItem(dbItem: any): LearningHistoryItem {
    const item: LearningHistoryItem = {
      createdAt: dbItem.created_at,
      updatedAt: dbItem.updated_at
    };
    
    // Map content if it exists
    if (dbItem.content) {
      item.content = {
        contentType: dbItem.content.content_type,
        topicId: dbItem.content.topic_id,
        moduleId: dbItem.content.module_id
      };
    }
    
    // Map other fields
    if (dbItem.topic_id) item.topicId = dbItem.topic_id;
    if (dbItem.module_id) item.moduleId = dbItem.module_id;
    if (dbItem.status) item.status = dbItem.status;
    if (dbItem.progress_percentage) item.progressPercentage = dbItem.progress_percentage;
    
    // Add any other fields that may exist
    Object.keys(dbItem).forEach(key => {
      if (!['created_at', 'updated_at', 'content', 'topic_id', 'module_id', 'status', 'progress_percentage'].includes(key)) {
        // Convert snake_case to camelCase
        const camelKey = key.replace(/_([a-z])/g, (m, p1) => p1.toUpperCase());
        if (camelKey !== key) {
          item[camelKey] = dbItem[key];
        }
      }
    });
    
    return item;
  }
}
